import { useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import * as studentModule from '../../data/studentsSectionJ';
import { getAssignments } from '../../services/backend';
import { api, fileUrl } from '../../services/api';
import { allowedCodes } from '../../services/session';
import { c, ui } from '../../styles/theme';

const STUDENTS = studentModule.studentsSectionJ ?? studentModule.default ?? [];
const FILTERS = ['All', 'On time', 'Late', 'Missing', 'Pending'];

const fmt = (iso) =>
  new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const STATUS_COLOR = { 'On time': c.blue, Late: c.red, Missing: c.red, Pending: c.muted };

const SubmissionsTracker = () => {
  const [tab, setTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [assignmentId, setAssignmentId] = useState(null);
  const [subs, setSubs] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState(null);

  // Load only the assignments for this faculty's subjects
  useEffect(() => {
    getAssignments()
      .then((all) => {
        const mine = all.filter((x) => allowedCodes().includes(x.courseCode));
        setAssignments(mine);
        if (mine.length) setAssignmentId(mine[0].id);
      })
      .catch(() => setError('Could not reach the backend. Check that it is running on port 8080.'));
    api.get('/quiz-attempts').then(setQuizzes).catch(() => {});
  }, []);

  useEffect(() => {
    if (assignmentId == null) return;
    api
      .get(`/submissions?assignmentId=${assignmentId}`)
      .then(setSubs)
      .catch(() => setError('Could not load submissions.'));
  }, [assignmentId]);

  const assignment = assignments.find((a) => a.id === assignmentId);

  // One row per student, using their latest submission for this assignment
  const rows = useMemo(() => {
    const now = new Date();
    const due = assignment ? new Date(assignment.dueAt) : null;
    const byRoll = {};
    subs.forEach((s) => {
      if (!byRoll[s.rollNo] || s.version > byRoll[s.rollNo].version) byRoll[s.rollNo] = s;
    });
    return STUDENTS.map((s) => {
      const sub = byRoll[s.roll] ?? null;
      let status = 'Pending';
      if (sub) status = sub.late ? 'Late' : 'On time';
      else if (due && now > due) status = 'Missing';
      return { ...s, sub, status };
    }).sort((a, b) => String(a.roll).localeCompare(String(b.roll)));
  }, [subs, assignment]);

  const counts = useMemo(() => {
    const k = { 'On time': 0, Late: 0, Missing: 0, Pending: 0 };
    rows.forEach((r) => (k[r.status] += 1));
    return k;
  }, [rows]);

  const visible = filter === 'All' ? rows : rows.filter((r) => r.status === filter);

  // Quiz summary per student, from all attempts on the server
  const quizRows = useMemo(
    () =>
      STUDENTS.map((s) => {
        const att = quizzes.filter((a) => a.rollNo === s.roll);
        const avg = att.length
          ? Math.round(att.reduce((t, a) => t + (a.score / a.total) * 100, 0) / att.length)
          : null;
        const last = att.reduce((l, a) => (!l || a.takenAt > l.takenAt ? a : l), null);
        return { roll: s.roll, name: s.name, count: att.length, avg, last };
      }),
    [quizzes]
  );

  return (
    <div style={ui.wrap}>
      <header>
        <h2 style={ui.title}>Submissions</h2>
        <p style={ui.sub}>Assignment uploads and quiz activity for your subjects</p>
      </header>

      <div style={{ display: 'flex', gap: '6px' }}>
        <button type="button" style={tab === 'assignments' ? ui.pillOn : ui.pill} onClick={() => setTab('assignments')}>
          Assignments
        </button>
        <button type="button" style={tab === 'quizzes' ? ui.pillOn : ui.pill} onClick={() => setTab('quizzes')}>
          Quizzes
        </button>
      </div>

      {error && <div style={ui.noticeErr}>{error}</div>}

      {tab === 'assignments' ? (
        assignments.length === 0 ? (
          <div style={ui.empty}>No assignments are linked to your subjects yet.</div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {assignments.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  style={a.id === assignmentId ? ui.pillOn : ui.pill}
                  onClick={() => {
                    setAssignmentId(a.id);
                    setFilter('All');
                  }}
                >
                  {a.courseCode}
                </button>
              ))}
            </div>

            {assignment && (
              <div style={{ fontSize: '13px', color: c.muted }}>
                {assignment.title} · Due {fmt(assignment.dueAt)}
              </div>
            )}

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {FILTERS.map((f) => (
                <button key={f} type="button" style={filter === f ? ui.pillOn : ui.pill} onClick={() => setFilter(f)}>
                  {f === 'All' ? `All (${rows.length})` : `${f} (${counts[f] ?? 0})`}
                </button>
              ))}
            </div>

            <div style={{ ...ui.card, padding: 0, overflowX: 'auto' }}>
              <table style={ui.table}>
                <thead>
                  <tr>
                    {['Roll No.', 'Name', 'Status', 'Uploaded', 'File', 'Version'].map((h) => (
                      <th key={h} style={ui.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r) => (
                    <tr key={r.roll}>
                      <td style={ui.td}>{r.roll}</td>
                      <td style={ui.td}>{r.name}</td>
                      <td style={ui.td}>
                        <span style={ui.badge(STATUS_COLOR[r.status])}>{r.status}</span>
                      </td>
                      <td style={ui.td}>{r.sub ? fmt(r.sub.submittedAt) : '—'}</td>
                      <td style={ui.td}>
                        {r.sub ? (
                          <a
                            href={fileUrl(`/submissions/${r.sub.id}/file`)}
                            style={{ ...ui.btnGhost, padding: '4px 8px', textDecoration: 'none' }}
                          >
                            <Download size={12} /> {r.sub.fileName}
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td style={ui.td}>{r.sub ? `v${r.sub.version}` : '—'}</td>
                    </tr>
                  ))}
                  {visible.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ ...ui.td, textAlign: 'center', color: c.dim }}>
                        No students in this category.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )
      ) : (
        <div style={{ ...ui.card, padding: 0, overflowX: 'auto' }}>
          <table style={ui.table}>
            <thead>
              <tr>
                {['Roll No.', 'Name', 'Quizzes taken', 'Average', 'Last attempt', 'Last score'].map((h) => (
                  <th key={h} style={ui.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {quizRows.map((r) => (
                <tr key={r.roll}>
                  <td style={ui.td}>{r.roll}</td>
                  <td style={ui.td}>{r.name}</td>
                  <td style={ui.td}>{r.count}</td>
                  <td style={ui.td}>{r.avg === null ? '—' : `${r.avg}%`}</td>
                  <td style={ui.td}>{r.last ? fmt(r.last.takenAt) : '—'}</td>
                  <td style={ui.td}>{r.last ? `${r.last.score}/${r.last.total}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmissionsTracker;