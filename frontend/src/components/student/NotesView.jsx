import { useEffect, useMemo, useState } from 'react';
import { Download, ExternalLink, FileText, Sparkles } from 'lucide-react';
import { api, fileUrl } from '../../services/api';
import { c, ui } from '../../styles/theme';

const COURSES = ['All', 'AIML', 'OS', 'ACA', 'LAB-AIML', 'LAB-OS'];
const STOP = new Set(['this','that','with','from','have','will','they','their','there','which','about','into','also','been','were','what','when','your','than','then','these','those','such','each','more','most','some','only','over','used','using','uses']);

// Local extractive summarizer: no AI model is called
const summarizeText = (text, n = 3) => {
  const sentences = text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.length > 30);
  const freq = {};
  (text.toLowerCase().match(/[a-z]{4,}/g) ?? []).forEach((w) => {
    if (!STOP.has(w)) freq[w] = (freq[w] ?? 0) + 1;
  });
  const keywords = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([w]) => w);
  const scored = sentences.map((s, i) => {
    const toks = s.toLowerCase().match(/[a-z]{4,}/g) ?? [];
    const score = toks.reduce((sum, w) => sum + (freq[w] ?? 0), 0) / Math.sqrt(toks.length || 1);
    return { s, i, score };
  });
  const summary = [...scored].sort((a, b) => b.score - a.score).slice(0, n).sort((a, b) => a.i - b.i).map((x) => x.s);
  return { summary, keywords };
};

const MiniAgent = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const run = () => {
    if (text.trim().length < 80) {
      setResult({ empty: true });
      return;
    }
    setResult(summarizeText(text));
  };

  return (
    <aside style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
        <Sparkles size={15} color={c.blue} /> Notes summary
      </div>
      <p style={{ margin: 0, fontSize: '12px', color: c.dim }}>
        Paste text from a note. The summary runs on this device.
      </p>
      <textarea
        style={{ ...ui.input, resize: 'vertical' }}
        rows={7}
        placeholder="Paste lecture text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="button" style={{ ...ui.btn, alignSelf: 'flex-start' }} onClick={run}>
        Summarize
      </button>

      {result?.empty && <div style={{ fontSize: '12px', color: c.redLight }}>Paste at least a few sentences first.</div>}
      {result && !result.empty && (
        <>
          <div style={{ fontSize: '11px', color: c.blueLight, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key points</div>
          {result.summary.map((s, i) => (
            <div key={i} style={{ ...ui.row, lineHeight: 1.5, fontSize: '13px' }}>{s}</div>
          ))}
          <div style={{ fontSize: '11px', color: c.blueLight, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key terms</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {result.keywords.map((k) => (
              <span key={k} style={ui.badge(c.muted)}>{k}</span>
            ))}
          </div>
        </>
      )}
    </aside>
  );
};

const NotesView = () => {
  const [materials, setMaterials] = useState([]);
  const [course, setCourse] = useState('All');
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    api
      .get('/materials')
      .then(setMaterials)
      .catch(() => setNotice('Could not load faculty notes. Check that the backend is running on port 8080.'));
  }, []);

  const list = useMemo(
    () => materials.filter((m) => course === 'All' || m.courseCode === course),
    [materials, course]
  );

  return (
    <div style={ui.wrap}>
      <header>
        <h2 style={ui.title}>Faculty Notes</h2>
        <p style={ui.sub}>Download or open material uploaded by your faculty</p>
      </header>

      <nav style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {COURSES.map((cName) => (
          <button key={cName} type="button" onClick={() => setCourse(cName)} style={course === cName ? ui.pillOn : ui.pill}>
            {cName}
          </button>
        ))}
      </nav>

      {notice && <div style={ui.noticeErr}>{notice}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {list.length === 0 && <div style={ui.empty}>No notes yet. Faculty publish from the Upload Center.</div>}
          {list.map((m) => (
            <div key={m.id} style={{ ...ui.card, display: 'flex', alignItems: 'center', gap: '12px', padding: '14px' }}>
              <FileText size={18} color={c.blue} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.title}
                </div>
                <div style={{ fontSize: '11px', color: c.dim, marginTop: '3px' }}>
                  {m.courseCode} · {m.category} · {m.fileName} ·{' '}
                  {new Date(m.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                {/\.pdf$/i.test(m.fileName) && (
                  <a href={fileUrl(`/materials/${m.id}/file?inline=true`)} target="_blank" rel="noreferrer" style={ui.btnIcon} aria-label="Open">
                    <ExternalLink size={14} />
                  </a>
                )}
                <a href={fileUrl(`/materials/${m.id}/file`)} style={ui.btnIcon} aria-label="Download">
                  <Download size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>

        <MiniAgent />
      </div>
    </div>
  );
};

export default NotesView;