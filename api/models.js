/**
 * GET /api/models —— 返回可选模型清单与是否已开通（不含任何密钥）
 * 画面 4「AI 模型」卡片用它渲染选项。
 */
import { publicList, DEFAULT_LIVE, DEFAULT_SUMMARY } from './_models.js';

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: '只支持 GET' });
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*'); // 只是公开的清单，不含密钥
  return res.status(200).json({ models: publicList(), defaults: { live: DEFAULT_LIVE, summary: DEFAULT_SUMMARY } });
}
