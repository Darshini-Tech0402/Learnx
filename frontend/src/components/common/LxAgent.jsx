import { useEffect, useRef, useState } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { askAgent } from '../../services/agentService';
import { ui } from '../../styles/theme';

// Light colours written out directly, so the text is always readable
const INK = '#334155';
const MUTED = '#64748b';
const AGENT_BG = '#fff5f9';
const AGENT_BORDER = '#f3c6d9';
const USER_BG = '#fde2ee';
const USER_BORDER = '#e07ba6';

const LxAgent = ({ title = 'Study Agent', context = '', mistake = null }) => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'agent', text: 'Hi, I can summarize this page, give unit points, or explain any answer you get wrong.' },
  ]);
  const endRef = useRef(null);

  const push = (msg) => setMessages((m) => [...m, msg]);

  const run = async (mode, extra = {}) => {
    setBusy(true);
    try {
      const text = await askAgent({ mode, context, ...extra });
      push({ role: 'agent', text });
    } catch {
      push({ role: 'agent', text: 'Something went wrong. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (!mistake) return;
    setOpen(true);
    push({ role: 'agent', text: `Let's look at why "${mistake.chosen}" was not right.` });
    run('explain', { mistake });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mistake?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const summarize = () => {
    push({ role: 'user', text: 'Summarize this page' });
    run('summarize');
  };

  const points = () => {
    push({ role: 'user', text: 'Unit summary in points' });
    run('points');
  };

  const ask = (e) => {
    e.preventDefault();
    const q = input.trim();
    if (!q || busy) return;
    setInput('');
    push({ role: 'user', text: q });
    run('ask', { question: q });
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} style={S.fab}>
        <Bot size={16} /> Study Agent
      </button>
    );
  }

  return (
    <aside style={S.panel}>
      <div style={S.head}>
        <span style={{ fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: INK }}>
          <Bot size={15} color="#e07ba6" /> {title}
        </span>
        <button type="button" style={ui.btnIcon} onClick={() => setOpen(false)} aria-label="Close agent">
          <X size={14} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button type="button" style={S.pill} onClick={summarize} disabled={busy}>Summarize</button>
        <button type="button" style={S.pill} onClick={points} disabled={busy}>Unit summary (points)</button>
        <button
          type="button"
          style={S.pill}
          onClick={() => mistake && run('explain', { mistake })}
          disabled={busy || !mistake}
        >
          Explain last mistake
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === 'agent' ? 'flex-start' : 'flex-end',
              maxWidth: '90%',
              padding: '8px 11px',
              borderRadius: '8px',
              border: `1px solid ${m.role === 'agent' ? AGENT_BORDER : USER_BORDER}`,
              background: m.role === 'agent' ? AGENT_BG : USER_BG,
              color: INK,
              fontSize: '13px',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
            }}
          >
            {m.text}
          </div>
        ))}
        {busy && <div style={{ fontSize: '12px', color: MUTED }}>Thinking...</div>}
        <div ref={endRef} />
      </div>

      <form style={{ display: 'flex', gap: '8px' }} onSubmit={ask}>
        <input
          style={{ ...ui.input, padding: '8px 10px', fontSize: '13px', color: INK, background: '#ffffff' }}
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" style={{ ...ui.btn, padding: '8px 10px' }} disabled={busy} aria-label="Send">
          <Send size={14} />
        </button>
      </form>
    </aside>
  );
};

const S = {
  fab: {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    zIndex: 1600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #e07ba6',
    background: '#e07ba6',
    color: '#ffffff',
    fontSize: '13px',
    cursor: 'pointer',
  },
  panel: {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    zIndex: 1700,
    width: 'min(360px, calc(100vw - 40px))',
    height: '460px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #f3c6d9',
    background: '#ffffff',
    color: INK,
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
  },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  pill: {
    padding: '6px 10px',
    borderRadius: '8px',
    border: '1px solid #f3c6d9',
    background: '#ffffff',
    color: INK,
    fontSize: '12px',
    cursor: 'pointer',
  },
};

export default LxAgent;