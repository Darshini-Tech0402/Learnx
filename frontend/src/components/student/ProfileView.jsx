import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, BrainCircuit, CalendarCheck, Award, Lightbulb } from 'lucide-react';
import { CURRENT_STUDENT, SUBJECTS, TARGET, uselxstore } from '../../services/lxstore';
import { getAssignments, getMySubmissions } from '../../services/backend';
import { getSession } from '../../services/session';
import AssignmentBrief from '../common/AssignmentBrief';
import ProfileCard from '../common/ProfileCard';
import { c, ui, grid } from '../../styles/theme';

// Backend course code -> key used by AssignmentBrief
const BRIEF_KEY = { AIML: 'aiml', OS: 'os', ACA: 'aca', 'LAB-AIML': 'lab-aiml', 'LAB-OS': 'lab-os' };

const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

// Rule-based tip, not an AI call. Picks the most urgent issue first.
const buildTip = ({ attendancePct, avgQuiz, overdue, pending }) => {
  if (attendancePct < TARGET)
    return `Your overall attendance is ${attendancePct}%, below the ${TARGET}% requirement. Attend every class this week.`;
  if (overdue > 0)
    return `You have ${overdue} overdue assignment${overdue > 1 ? 's' : ''}. Submit ${overdue > 1 ? 'them' : 'it'} first, even if late.`;
  if (avgQuiz !== null && avgQuiz < 60)
    return `Your quiz average is ${avgQuiz}%. Retake the quizzes and review the explanations you got wrong.`;
  if (pending > 0)
    return `${pending} assignment${pending > 1 ? 's are' : ' is'} still open. Start with the nearest deadline.`;
  return 'You are on track. Keep your quiz average up and review your notes before the next test.';
};

const ProfileView = () => {
  const me = getSession() ?? {};
  const { quizAttempts } = uselxstore();
  const [assignments, setAssignments] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [openKey, setOpenKey] = useState(null);

  useEffect(() => {
    Promise.all([getAssignments(), getMySubmissions()])
      .then(([a, s]) => {
        setAssignments(a);
        setSubs(s);
        setLoadError(null);
      })
      .catch(() => setLoadError('Could not reach the backend. Check that it is running on port 8080.'));
  }, []);

  const myQuizzes = useMemo(
    () =>
      quizAttempts
        .filter((a) => a.roll === CURRENT_STUDENT.roll)
        .sort((a, b) => b.takenAt.localeCompare(a.takenAt)),
    [quizAttempts]
  );

  const avgQuiz = myQuizzes.length
    ? Math.round(myQuizzes.reduce((t, a) => t + (a.score / a.total) * 100, 0) / myQuizzes.length)
    : null;

  const attendedTotal = SUBJECTS.reduce((s, x) => s + x.attended, 0);
  const classesTotal = SUBJECTS.reduce((s, x) => s + x.total, 0);
  const attendancePct = Math.round((attendedTotal / classesTotal) * 100);

  const now = new Date();
  const rows = assignments.map((a) => {
    const sub = subs.find((s) => s.assignmentId === a.id) ?? null;
    let status = 'pending';
    if (sub) status = sub.late ? 'late' : 'submitted';
    else if (now > new Date(a.dueAt)) status = 'overdue';
    return { ...a, sub, status };
  });

  const submittedCount = rows.filter((r) => r.sub).length;
  const overdue = rows.filter((r) => r.status === 'overdue').length;
  const pending = rows.filter((r) => r.status === 'pending').length;
  const tip = buildTip({ attendancePct, avgQuiz, overdue, pending });

  const statusLabel = { submitted: 'Submitted', late: 'Late', pending: 'Open', overdue: 'Overdue' };
  const statusColor = { submitted: c.blue, late: c.muted, pending: c.muted, overdue: c.red };

  const metrics = [
    { label: 'CGPA', value: me.cgpa != null ? Number(me.cgpa).toFixed(2) : '—', icon: Award },
    { label: 'Quizzes taken', value: myQuizzes.length, icon: BrainCircuit },
    { label: 'Assignments uploaded', value: `${submittedCount}/${assignments.length}`, icon: ClipboardList },
    { label: 'Attendance', value: `${attendancePct}%`, icon: CalendarCheck },
  ];

  return (
    <div style={ui.wrap}>
      <h2 style={ui.title}>My Profile</h2>

      <ProfileCard
        id={me.rollNo}
        name={me.name}
        rows={[
          ['Roll No', me.rollNo],
          ['Department', me.department],
          ['Year', me.batch],
          ['Section', me.section],
          ['CGPA', me.cgpa != null ? Number(me.cgpa).toFixed(2) : null],
        ]}
      />

      {loadError && <div style={ui.noticeErr}>{loadError}</div>}

      <section style={grid('180px')}>
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} style={ui.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: c.muted, fontSize: '12px' }}>
                <Icon size={14} color={c.blue} /> {m.label}
              </div>
              <div style={{ fontSize: '24px', fontWeight: 600, marginTop: '10px' }}>{m.value}</div>
            </div>
          );
        })}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <section style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Assignments</h3>
          {rows.length === 0 && !loadError && <div style={ui.empty}>Loading assignments...</div>}
          {rows.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setOpenKey(BRIEF_KEY[r.courseCode])}
              style={{ ...ui.row, width: '100%', textAlign: 'left', cursor: 'pointer', color: c.text, fontFamily: 'inherit' }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{r.title}</div>
                <div style={{ fontSize: '12px', color: c.dim, marginTop: '2px' }}>
                  {r.courseCode} · Due {fmtDate(r.dueAt)}
                </div>
              </div>
              <span style={ui.badge(statusColor[r.status])}>{statusLabel[r.status]}</span>
            </button>
          ))}
        </section>

        <section style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Recent quiz scores</h3>
          {myQuizzes.length === 0 && <div style={ui.empty}>No quizzes taken yet. Open the Quizzes tab to start.</div>}
          {myQuizzes.slice(0, 5).map((a) => {
            const pct = Math.round((a.score / a.total) * 100);
            return (
              <div key={a.id} style={ui.row}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 500 }}>{a.title}</div>
                  <div style={{ fontSize: '12px', color: c.dim, marginTop: '2px' }}>{fmtDate(a.takenAt)}</div>
                  <div style={{ ...ui.track, marginTop: '8px' }}>
                    <div style={{ ...ui.fill, width: `${pct}%` }} />
                  </div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{a.score}/{a.total}</span>
              </div>
            );
          })}
        </section>
      </div>

      <aside style={{ ...ui.card, display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <Lightbulb size={18} color={c.blue} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontSize: '12px', color: c.muted, marginBottom: '4px' }}>Tip</div>
          <div style={{ fontSize: '14px', lineHeight: 1.6 }}>{tip}</div>
        </div>
      </aside>

      {openKey && <AssignmentBrief assignmentId={openKey} onClose={() => setOpenKey(null)} />}
    </div>
  );
};

export default ProfileView;