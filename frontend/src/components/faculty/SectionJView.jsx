import { useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import { getSession } from '../../services/session';
import { c, ui, grid } from '../../styles/theme';

const SectionJView = () => {
  const sections = getSession()?.sections ?? [];
  const [active, setActive] = useState(sections[0] ?? null);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!active) return;
    setError(null);
    api
      .get(`/students?section=${active}`)
      .then(setRows)
      .catch(() => setError('Could not load this section. Check that the backend is running.'));
  }, [active]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => !q || r.roll.toLowerCase().includes(q) || r.name.toLowerCase().includes(q));
  }, [rows, query]);

  const avgCgpa = rows.length
    ? (rows.reduce((t, r) => t + Number(r.cgpa ?? 0), 0) / rows.length).toFixed(2)
    : '—';

  if (sections.length === 0) {
    return (
      <div style={ui.wrap}>
        <h2 style={ui.title}>My Sections</h2>
        <div style={ui.empty}>No sections are assigned to this login.</div>
      </div>
    );
  }

  return (
    <div style={ui.wrap}>
      <header>
        <h2 style={ui.title}>Section {active}</h2>
        <p style={ui.sub}>Students in this section</p>
      </header>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {sections.map((s) => (
          <button key={s} type="button" onClick={() => setActive(s)} style={active === s ? ui.pillOn : ui.pill}>
            Section {s}
          </button>
        ))}
      </div>

      {error && <div style={ui.noticeErr}>{error}</div>}

      <div style={grid('170px')}>
        <div style={ui.card}>
          <div style={{ fontSize: '12px', color: c.muted }}>Students</div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginTop: '8px' }}>{rows.length}</div>
        </div>
        <div style={ui.card}>
          <div style={{ fontSize: '12px', color: c.muted }}>Average CGPA</div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginTop: '8px' }}>{avgCgpa}</div>
        </div>
      </div>

      <input
        style={{ ...ui.input, maxWidth: '360px' }}
        placeholder="Search by roll number or name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={{ ...ui.card, padding: 0, overflowX: 'auto' }}>
        <table style={ui.table}>
          <thead>
            <tr>
              {['Roll No.', 'Name', 'CGPA', 'Department', 'Year'].map((h) => (
                <th key={h} style={ui.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.roll}>
                <td style={ui.td}>{r.roll}</td>
                <td style={ui.td}>{r.name}</td>
                <td style={ui.td}>{r.cgpa != null ? Number(r.cgpa).toFixed(2) : '—'}</td>
                <td style={ui.td}>{r.department}</td>
                <td style={ui.td}>{r.batch}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...ui.td, textAlign: 'center', color: c.dim }}>No students match.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionJView;