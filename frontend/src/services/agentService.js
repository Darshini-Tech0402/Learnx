import { api } from './api';

const STOP = new Set(['about', 'which', 'their', 'there', 'these', 'those', 'where', 'while', 'would', 'should', 'could', 'using', 'uses', 'used', 'with', 'from', 'that', 'this', 'when', 'what', 'have', 'been', 'will', 'each', 'into', 'than', 'then', 'also']);

// Offline fallback: pick key sentences
const localSummary = (text) => {
  const sentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 20);
  return sentences.slice(0, 3).join(' ') || 'There is not enough text to summarize yet.';
};

// Offline fallback: bullet points plus frequent words as important topics
const localPoints = (text) => {
  const sentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 20);
  const points = sentences.slice(0, 6).map((s) => `- ${s}`).join('\n');
  const freq = {};
  (text.toLowerCase().match(/[a-z]{5,}/g) ?? []).forEach((w) => {
    if (!STOP.has(w)) freq[w] = (freq[w] ?? 0) + 1;
  });
  const topics = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([w]) => `- ${w}`).join('\n');
  return `${points || '- Not enough text yet.'}\n\nImportant topics:\n${topics || '- None found.'}`;
};

const localExplain = (m) =>
  `Your answer "${m.chosen}" was not correct. The right answer is "${m.correct}". ${m.why}`;

// Calls POST /api/agent on the backend. Uses offline logic if the backend is unavailable.
export const askAgent = async (payload) => {
  try {
    const res = await api.post('/agent', payload);
    if (res?.reply) return res.reply;
  } catch {
    // Backend not running or key not set: use the fallback below
  }
  if (payload.mode === 'summarize') return localSummary(payload.context || '');
  if (payload.mode === 'points') return localPoints(payload.context || '');
  if (payload.mode === 'explain' && payload.mistake) return localExplain(payload.mistake);
  return 'The AI backend is not connected, so I can only summarize, list points and explain quiz mistakes offline.';
};