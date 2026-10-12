/**
 * 可选模型清单（管理员维护）。文件名以 _ 开头，Vercel 不会把它当成接口。
 *
 * - 供应商的密钥放在 Vercel 环境变量里，名字见 keyEnv；配了密钥，该供应商的模型才「可用」
 * - 接口都是通用格式（/chat/completions），新增供应商只需加一项
 * - model 为 null 的条目是「待开通」：管理员配好密钥后，按官方模型列表填入型号
 * - uses：live = 现场逐句标注（要求几秒内返回），summary = 访谈后汇总
 * - speed 是 2026-10-13 用访谈现场的句子实测的耗时；深度思考也开放给现场，由顾问自己权衡快慢
 */

export const PROVIDERS = {
  deepseek: { label: 'DeepSeek', baseUrl: 'https://api.deepseek.com', keyEnv: 'DEEPSEEK_API_KEY', thinkingParam: true, region: '国内' },
  moonshot: { label: 'Kimi（月之暗面）', baseUrl: 'https://api.moonshot.cn/v1', keyEnv: 'MOONSHOT_API_KEY', region: '国内' },
  qwen: { label: '通义千问（阿里云百炼）', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', keyEnv: 'DASHSCOPE_API_KEY', region: '国内' },
  openai: { label: 'OpenAI GPT', baseUrl: 'https://api.openai.com/v1', keyEnv: 'OPENAI_API_KEY', region: '海外' },
  anthropic: { label: 'Anthropic Claude', baseUrl: 'https://api.anthropic.com/v1', keyEnv: 'ANTHROPIC_API_KEY', region: '海外' },
};

export const MODELS = [
  { id: 'ds-flash', provider: 'deepseek', model: 'deepseek-flash', thinking: false, uses: ['live', 'summary'], tier: 1,
    label: 'DeepSeek Flash', note: '最快；直白的话判断够用，容易下结论过头', speed: '约 1.5 秒 / 句' },
  { id: 'ds-pro', provider: 'deepseek', model: 'deepseek-v4-pro', thinking: false, uses: ['live', 'summary'], tier: 2,
    label: 'DeepSeek V4 Pro', note: '能力更强，判断更稳，不轻易下结论', speed: '约 2.5 秒 / 句' },
  { id: 'ds-flash-think', provider: 'deepseek', model: 'deepseek-flash', thinking: true, uses: ['live', 'summary'], tier: 2,
    label: 'DeepSeek Flash · 深度思考', note: '能听出话里的转折', speed: '约 4–5 秒 / 句' },
  { id: 'ds-pro-think', provider: 'deepseek', model: 'deepseek-v4-pro', thinking: true, uses: ['live', 'summary'], tier: 3,
    label: 'DeepSeek V4 Pro · 深度思考', note: '判断最准，但很慢', speed: '约 17–25 秒 / 句' },
  { id: 'claude-haiku', provider: 'anthropic', model: 'claude-haiku-5-5', thinking: false, uses: ['live', 'summary'], tier: 1,
    label: 'Claude Haiku 5.5', note: '需海外账户与预付费', speed: '待开通后实测' },
  { id: 'claude-sonnet', provider: 'anthropic', model: 'claude-sonnet-5-5', thinking: false, uses: ['summary'], tier: 2,
    label: 'Claude Sonnet 5.5', note: '需海外账户与预付费', speed: '待开通后实测' },
  { id: 'claude-opus', provider: 'anthropic', model: 'claude-opus-5-5', thinking: false, uses: ['summary'], tier: 3,
    label: 'Claude Opus 5.5', note: '需海外账户与预付费', speed: '待开通后实测' },
  { id: 'gpt', provider: 'openai', model: null, thinking: false, uses: ['live', 'summary'], tier: 2,
    label: 'OpenAI GPT', note: '需海外账户；开通后按官方列表选型', speed: '待开通后实测' },
  { id: 'kimi', provider: 'moonshot', model: null, thinking: false, uses: ['live', 'summary'], tier: 1,
    label: 'Kimi', note: '国内可用；开通后按官方列表选型', speed: '待开通后实测' },
  { id: 'qwen', provider: 'qwen', model: null, thinking: false, uses: ['live', 'summary'], tier: 1,
    label: '通义千问', note: '国内可用；开通后按官方列表选型', speed: '待开通后实测' },
];

export const DEFAULT_LIVE = 'ds-flash';
export const DEFAULT_SUMMARY = 'ds-pro-think';

export function isAvailable(m) {
  const p = PROVIDERS[m.provider];
  return Boolean(p && m.model && process.env[p.keyEnv]);
}

/* 供前端展示：不含任何密钥，只告诉前端哪些能用 */
export function publicList() {
  return MODELS.map((m) => ({
    id: m.id, label: m.label, provider: PROVIDERS[m.provider].label, region: PROVIDERS[m.provider].region,
    uses: m.uses, tier: m.tier, note: m.note, speed: m.speed, thinking: m.thinking, available: isAvailable(m),
  }));
}

/* 后端调用用：按 id 取配置；不存在、未开通或用途不符都返回 null */
export function resolve(id, use) {
  const m = MODELS.find((x) => x.id === id);
  if (!m || !m.uses.includes(use) || !isAvailable(m)) return null;
  const p = PROVIDERS[m.provider];
  return { ...m, baseUrl: p.baseUrl, apiKey: process.env[p.keyEnv], thinkingParam: Boolean(p.thinkingParam) };
}
