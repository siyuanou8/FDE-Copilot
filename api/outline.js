/**
 * POST /api/outline —— 生成这家企业专属的访谈提纲（画面 4）
 *
 * 输入：访谈部门与受访者、行业与业务模式、企业概况要点、
 *       ① 知识库模板的待验证假设、② 顾问选择带进提纲的材料新线索
 * 输出：8 道题。骨架固定为 PRD §5 的 3 组 8 问（后端写死，AI 不能增删换题），
 *       AI 只负责把措辞改写成贴合这家企业的问法，并标出每题验证哪条假设、追问哪条线索
 *
 * 规则：
 * - 不编造材料里没有的事实或数字；线索只能用给定的
 * - 每题引用的假设 / 线索必须是请求里给出的 id，其余一律丢弃
 * - 结果都是「AI 改写 · 待确认」，由顾问编辑确认
 */
import { resolve } from './_models.js';

const ALLOWED_ORIGINS = [
  'https://fde-copilot-xi.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:8765',
  'http://localhost:3000',
];

// PRD §5 默认提纲（原文）
const SKELETON = [
  { n: 'Q1', g: 1, text: '请介绍部门组织构成、主要职责和业务范围。' },
  { n: 'Q2', g: 1, text: '当前部门最核心的 KPI 或管理目标是什么？' },
  { n: 'Q3', g: 2, text: '请以一个典型业务场景为例，介绍当前主要业务流程如何运转。' },
  { n: 'Q4', g: 2, text: '流程中最耗时、最容易出错或最依赖经验的环节是什么？' },
  { n: 'Q5', g: 2, text: '这些痛点背后，需要提升的核心业务能力是什么？' },
  { n: 'Q6', g: 2, text: '当前有哪些系统、数据或数字化工具在支撑这个流程？数据质量如何？' },
  { n: 'Q7', g: 2, text: '过去是否尝试过 AI、自动化或数字化改造？哪些有效，哪些失败，原因是什么？' },
  { n: 'Q8', g: 3, text: '对本次 AI 场景共创或咨询服务，最希望我们帮助解决什么问题，或形成什么结果？' },
];

const MODEL_ID = 'ds-pro'; // 提纲生成不赶时间，用判断更稳的模型，不开深度思考

const SYSTEM_PROMPT = `你是企业 AI 咨询项目的访谈提纲设计助手。
任务：在固定的 8 问骨架上，为某家企业的一位受访者改写访谈提纲。

必须遵守：
1. 恰好 8 题，顺序与骨架一致，每题保持骨架原本要问的意图；不得增删、合并或调换。
2. 措辞贴合这家企业：结合访谈部门、受访者角色、行业、业务模式和企业概况。高层偏目标、考核与方向；部门负责人和一线偏流程与细节。
3. 「带进提纲的材料线索」每一条都必须用上，且只用在一题里，一题最多用一条。按线索类型放进对应的题：
   - 北极星 / 目标类 → Q2
   - 系统、数字化、远程或数据类 → Q6 或 Q7
   - 流程、组织、部门分工类 → Q1、Q3 或 Q4
   - 痛点类 → Q4
   题目里必须明确说出线索内容，例如「年报提到服务收入占比要提到 30%，这个目标怎么拆到各大区？」
4. 只能使用给定的信息，不得编造材料里没有的事实、数字或名称。
5. 每题标出它主要验证的模板假设 id（0–2 个）和用到的线索 id（0–1 个），只能用给定的 id。
6. 每题不超过 60 个汉字，口语化，可以直接问出口。
7. 用开放式问法，不要诱导式提问：假设是要验证的，不能写进题目让客户确认（不要问「是不是很依赖资深工程师」，要问「哪个环节最依赖经验」）。材料线索可以作为背景说出来。
8. 只输出 JSON，不要任何解释。

输出格式：
{"questions":[{"n":"Q1","text":"改写后的问题","verifies":["假设id"],"clues":["线索id"]}]}`;

function clip(s, n) { return String(s == null ? '' : s).slice(0, n); }
function list(arr, n, map) { return Array.isArray(arr) ? arr.slice(0, n).map(map) : []; }

function sanitizeInput(b) {
  b = b && typeof b === 'object' ? b : {};
  return {
    dept: clip(b.dept, 40), role: clip(b.role, 40), industry: clip(b.industry, 30), biz: clip(b.biz, 30),
    facts: list(b.facts, 8, (x) => clip(x, 120)),
    hypotheses: list(b.hypotheses, 30, (x) => ({ id: clip(x && x.id, 40), field: clip(x && x.field, 20), text: clip(x && x.text, 80) })),
    clues: list(b.clues, 6, (x) => ({ id: clip(x && x.id, 20), field: clip(x && x.field, 20), text: clip(x && x.text, 60), detail: clip(x && x.detail, 160) })),
  };
}

function buildUserPrompt(i) {
  return `访谈部门：${i.dept || '（未提供）'}；受访者：${i.role || '（未提供）'}
行业：${i.industry || '（未提供）'}；业务模式：${i.biz || '（未选）'}

企业概况要点：
${i.facts.map((f) => '- ' + f).join('\n') || '（无）'}

① 知识库模板的待验证假设：
${i.hypotheses.map((h) => `- ${h.id}：[${h.field}] ${h.text}`).join('\n') || '（无）'}

② 带进提纲的材料线索：
${i.clues.map((c) => `- ${c.id}：[${c.field || '线索'}] ${c.text}（${c.detail}）`).join('\n') || '（无）'}

固定的 8 问骨架：
${SKELETON.map((q) => `${q.n}：${q.text}`).join('\n')}`;
}

function sanitizeOutput(raw, input) {
  const hyp = new Set(input.hypotheses.map((h) => h.id));
  const clu = new Set(input.clues.map((c) => c.id));
  const got = Array.isArray(raw && raw.questions) ? raw.questions : [];
  const out = SKELETON.map((sk) => {
    const q = got.find((x) => x && x.n === sk.n);
    if (!q || !q.text) return null;
    return {
      n: sk.n, g: sk.g, original: sk.text, text: clip(q.text, 120),
      verifies: (Array.isArray(q.verifies) ? q.verifies : []).filter((id) => hyp.has(id)).slice(0, 2),
      clues: (Array.isArray(q.clues) ? q.clues : []).filter((id) => clu.has(id)).slice(0, 1),
    };
  });
  return out.every(Boolean) ? out : null;
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
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return res.status(403).json({ error: '来源不被允许' });

  const cfg = resolve(MODEL_ID, 'summary');
  if (!cfg) return res.status(500).json({ error: '生成提纲用的模型未开通' });
  const input = sanitizeInput(req.body);
  if (!input.dept) return res.status(400).json({ error: '请先选择访谈部门' });

  const started = Date.now();
  const callOnce = async () => {
    const r = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cfg.apiKey}` },
      body: JSON.stringify({
        model: cfg.model,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: buildUserPrompt(input) }],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 1800,
        ...(cfg.thinkingParam ? { thinking: { type: 'disabled' } } : {}),
      }),
      signal: AbortSignal.timeout(40000),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return { error: clip(data && data.error && data.error.message, 200) };
    let parsed = {};
    try { parsed = JSON.parse(data.choices[0].message.content); } catch { parsed = {}; }
    return { questions: sanitizeOutput(parsed, input), usage: data.usage };
  };
  // 顾问选了带进提纲的线索，必须每条都用上；没用全就重试一次
  const allCluesUsed = (qs) => input.clues.every((c) => qs.some((q) => q.clues.includes(c.id)));
  try {
    let out = await callOnce(), tries = 1;
    if (!out.error && (!out.questions || !allCluesUsed(out.questions))) { out = await callOnce(); tries = 2; }
    if (out.error) return res.status(502).json({ error: '大模型服务返回错误', detail: out.error });
    if (!out.questions) return res.status(502).json({ error: '生成结果不完整，请重试' });
    return res.status(200).json({
      questions: out.questions,
      clues_missing: input.clues.filter((c) => !out.questions.some((q) => q.clues.includes(c.id))).map((c) => c.id),
      model_label: cfg.label,
      tries,
      usage: out.usage ? { prompt_tokens: out.usage.prompt_tokens, completion_tokens: out.usage.completion_tokens } : null,
      latency_ms: Date.now() - started,
    });
  } catch (e) {
    return res.status(504).json({ error: e && e.name === 'TimeoutError' ? '大模型响应超时' : '调用大模型失败' });
  }
}
