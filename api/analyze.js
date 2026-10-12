/**
 * POST /api/analyze —— 访谈现场的逐句分析（「想」那一段）
 *
 * 前端发来：客户刚说的一句话 + 当前问题 + 本题槽位 + 待验证假设 + 当前北极星
 * 后端调大模型，返回结构化标注：填了哪个槽位、印证 / 否定了哪条假设、
 * 是否值得深挖、是否出现新的北极星候选，以及下一步追问建议（Next Best Move）。
 *
 * 规则（与产品一致）：
 * - 顾问的话不作为证据，不调用大模型
 * - AI 只给提议，所有结论都是「待确认」，由顾问决定
 * - 密钥只在后端（Vercel 环境变量，名字见 _models.js），不进网页
 *
 * 模型：由顾问在画面 4 选择（body.model，取值见 _models.js 清单），默认 DeepSeek Flash。
 * 只能选清单里已开通、且标明可用于现场标注（live）的模型；前端传别的一律拒绝。
 */
import { resolve, DEFAULT_LIVE } from './_models.js';

// 只接受来自本站的请求，避免公开接口被别人拿去消耗余额
const ALLOWED_ORIGINS = [
  'https://fde-copilot-xi.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:8765',
  'http://localhost:3000',
];

const MAX_SENTENCE = 600;   // 一句话的长度上限（字符）
const MAX_ITEMS = 20;       // 槽位、假设各自的条数上限
const MAX_OUTPUT_TOKENS = 700;

const TAG_TYPES = ['slot', 'confirm', 'refute', 'dig', 'new_northstar'];

const SYSTEM_PROMPT = `你是企业 AI 咨询访谈的现场助手，服务于正在访谈客户的顾问。
你只分析「客户」刚说的一句话，判断它对访谈有什么意义。

你必须遵守：
1. 只根据这句话本身和给定的上下文判断，不编造客户没说的事实、数字或人名。
2. 你给出的都是「提议」，由顾问决定是否采纳，所以措辞要克制。
3. 标注类型只能是：
   - slot：这句话填补了本题的哪个槽位（ref 填槽位 key）
   - confirm：这句话印证了哪条待验证假设（ref 填假设 id）
   - refute：这句话否定了哪条待验证假设（ref 填假设 id）
   - dig：值得深挖，比如提到了问题但没有量化、没有举例
   - new_northstar：客户明确说出比当前北极星更看重的目标
4. 没有就不标，宁缺毋滥。每条 label 不超过 20 个字。
5. next_best_move 只在确实有该追问的缺口时给出，问题要具体、可以直接问出口；否则为 null。
6. 只输出 JSON，不要任何解释文字。

输出格式：
{
  "tags": [{"type": "slot|confirm|refute|dig|new_northstar", "label": "简短说明", "ref": "槽位key或假设id或空字符串"}],
  "next_best_move": {"question": "建议追问的问题", "why": "为什么问（一句话）", "gap": "补哪个缺口"} 或 null,
  "northstar_candidate": "客户明确说出的新北极星，没有则为空字符串"
}`;

function clip(s, n) {
  return String(s == null ? '' : s).slice(0, n);
}

function sanitizeInput(body) {
  const b = body && typeof body === 'object' ? body : {};
  const slots = Array.isArray(b.slots) ? b.slots.slice(0, MAX_ITEMS).map((x) => ({
    key: clip(x && x.key, 40), label: clip(x && x.label, 40), filled: Boolean(x && x.filled),
  })) : [];
  const hypotheses = Array.isArray(b.hypotheses) ? b.hypotheses.slice(0, MAX_ITEMS).map((x) => ({
    id: clip(x && x.id, 40), text: clip(x && x.text, 80), field: clip(x && x.field, 20),
  })) : [];
  return {
    sentence: clip(b.sentence, MAX_SENTENCE).trim(),
    speaker: b.speaker === 'consultant' ? 'consultant' : 'client',
    question: clip(b.question, 200),
    northStar: clip(b.northStar, 60),
    slots,
    hypotheses,
  };
}

/* 大模型的输出不可全信：只保留合法字段，ref 必须指向真实存在的槽位或假设 */
function sanitizeOutput(raw, input) {
  const slotKeys = new Set(input.slots.map((s) => s.key));
  const hypIds = new Set(input.hypotheses.map((h) => h.id));
  const tags = (Array.isArray(raw && raw.tags) ? raw.tags : [])
    .filter((t) => t && TAG_TYPES.includes(t.type))
    .map((t) => ({ type: t.type, label: clip(t.label, 40), ref: clip(t.ref, 40) }))
    .filter((t) => {
      if (t.type === 'slot') return slotKeys.has(t.ref);
      if (t.type === 'confirm' || t.type === 'refute') return hypIds.has(t.ref);
      return true;
    })
    .slice(0, 6);
  const m = raw && raw.next_best_move;
  const nbm = m && typeof m === 'object' && m.question
    ? { question: clip(m.question, 120), why: clip(m.why, 120), gap: clip(m.gap, 40) }
    : null;
  return { tags, next_best_move: nbm, northstar_candidate: clip(raw && raw.northstar_candidate, 40) };
}

function buildUserPrompt(input) {
  const slots = input.slots.map((s) => `- ${s.key}：${s.label}（${s.filled ? '已有内容' : '还是缺口'}）`).join('\n') || '（无）';
  const hyps = input.hypotheses.map((h) => `- ${h.id}：[${h.field}] ${h.text}`).join('\n') || '（无）';
  return `当前问题：${input.question || '（未提供）'}
当前北极星（待确认）：${input.northStar || '（未提供）'}

本题槽位：
${slots}

待验证假设：
${hyps}

客户刚说的话：「${input.sentence}」`;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: '只支持 POST' });
  // 浏览器跨站请求一定带 Origin；带了但不在白名单里就拒绝
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return res.status(403).json({ error: '来源不被允许' });

  const input = sanitizeInput(req.body);
  if (!input.sentence) return res.status(400).json({ error: '缺少要分析的句子' });

  // 顾问发言不作为证据，不调用大模型
  if (input.speaker === 'consultant') {
    return res.status(200).json({ tags: [], next_best_move: null, northstar_candidate: '', note: '顾问发言不作为证据', model: null, usage: null });
  }

  const cfg = resolve(clip(req.body && req.body.model, 40) || DEFAULT_LIVE, 'live');
  if (!cfg) return res.status(400).json({ error: '所选模型未开通，或不适合现场逐句标注' });

  const started = Date.now();
  try {
    const r = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}` },
      body: JSON.stringify({
        model: cfg.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(input) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: MAX_OUTPUT_TOKENS,
        // DeepSeek 默认先「思考」，思考内容计入输出 token，现场标注要快，按清单关闭
        ...(cfg.thinkingParam ? { thinking: { type: cfg.thinking ? 'enabled' : 'disabled' } } : {}),
      }),
      signal: AbortSignal.timeout(25000),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      return res.status(502).json({ error: '大模型服务返回错误', detail: clip(data && data.error && data.error.message, 200) });
    }
    let parsed = {};
    try { parsed = JSON.parse(data.choices[0].message.content); } catch { parsed = {}; }
    const out = sanitizeOutput(parsed, input);
    return res.status(200).json({
      ...out,
      model: data.model || cfg.model,
      model_id: cfg.id,
      model_label: cfg.label,
      usage: data.usage ? { prompt_tokens: data.usage.prompt_tokens, completion_tokens: data.usage.completion_tokens } : null,
      latency_ms: Date.now() - started,
    });
  } catch (e) {
    const timeout = e && e.name === 'TimeoutError';
    return res.status(504).json({ error: timeout ? '大模型响应超时' : '调用大模型失败' });
  }
}
