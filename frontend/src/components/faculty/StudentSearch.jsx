import { useMemo, useState } from 'react';
import * as studentModule from '../../data/studentsSectionJ';
import { c, ui } from '../../styles/theme';

const STUDENTS = studentModule.studentsSectionJ ?? studentModule.default ?? [];

const FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'top', label: 'Top performers (CGPA 8.5+)', test: (s) => Number(s.cgpa) >= 8.5 },
  { id: 'risk', label: 'At risk', test: (s) => s.attendance < 75 || Number(s.cgpa) < 6 },
];

const StudentSearch = () => {
  const [query, setQuery] = useState('');
  const [filterId, setFilterId] = useState('all');
  const [selectedRoll, setSelectedRoll] = useState(null);

  const rows = useMemo(() => {
    const test = FILTERS.find((f) => f.id === filterId)?.test ?? (() => true);
    const q = query.trim().toLowerCase();
    return STUDENTS
      .filter(test)
      .filter((s) => !q || String(s.roll).toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      .sort((a, b) => String(a.roll).localeCompare(String(b.roll)));
  }, [query, filterId]);

  const selected = STUDENTS.find((s) => String(s.roll) === String(selectedRoll)) ?? null;

  return (
    <div style={ui.wrap}>
      <header>
        <h2 style={ui.title}>Student Search</h2>
        <p style={ui.sub}>Find a student by roll number or name</p>
      </header>

      <input
        style={ui.input}
        placeholder="Search by roll number or name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {FILTERS.map((f) => (
          <button key={f.id} type="button" style={filterId === f.id ? ui.pillOn : ui.pill} onClick={() => setFilterId(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ ...ui.card, padding: 0, overflowX: 'auto' }}>
        <table style={ui.table}>
          <thead>
            <tr>
              {['Roll No.', 'Name', 'CGPA', 'Attendance'].map((h) => (
                <th key={h} style={ui.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr
                key={s.roll}
                onClick={() => setSelectedRoll(s.roll)}
                style={{ cursor: 'pointer', background: selectedRoll === s.roll ? 'rgba(37,99,235,0.12)' : 'transparent' }}
              >
                <td style={ui.td}>{s.roll}</td>
                <td style={ui.td}>{s.name}</td>
                <td style={ui.td}>{Number(s.cgpa).toFixed(2)}</td>
                <td style={{ ...ui.td, color: s.attendance < 75 ? c.red : c.text }}>{s.attendance}%</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} style={{ ...ui.td, textAlign: 'center', color: c.dim }}>No students match.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <section style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600 }}>{selected.name}</div>
            <div style={{ fontSize: '12px', color: c.muted }}>Roll {selected.roll} · Section J</div>
          </div>
          {[
            ['CGPA', Number(selected.cgpa).toFixed(2)],
            ['Quiz average', `${selected.quizAvg}%`],
            ['Assignments submitted', selected.assignmentsSubmitted],
            ['Attendance', `${selected.attendance}%`],
          ].map(([label, value]) => (
            <div key={label} style={ui.row}>
              <span style={{ fontSize: '13px', color: c.muted }}>{label}</span>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{value}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default StudentSearch;