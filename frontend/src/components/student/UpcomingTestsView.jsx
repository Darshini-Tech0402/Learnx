import { useMemo } from 'react';
import { Clock, CalendarDays, MapPin, CheckCircle2 } from 'lucide-react';
import { ASSIGNMENTS, CURRENT_STUDENT, uselxstore } from '../../services/lxstore';
import LxAgent from '../common/LxAgent';
import { c, ui, grid } from '../../styles/theme';

// Demo data: replace with the real exam timetable from your backend
const TESTS = [
  { id: 't1', subject: 'AIML', title: 'Mid-Semester Test 2', date: '2026-10-20T10:00:00', room: 'LH-2', syllabus: 'Backpropagation, CNNs, Regularization' },
  { id: 't2', subject: 'OS', title: 'Unit Test 3', date: '2026-10-24T14:00:00', room: 'LH-4', syllabus: 'Scheduling, Deadlocks, Memory Management' },
  { id: 't3', subject: 'Advanced Computer Algorithms', title: 'Quiz 4', date: '2026-10-28T11:00:00', room: 'LH-1', syllabus: 'Divide and Conquer, Greedy, Dynamic Programming' },
];

// Whole days from now until the given time. Negative means it has passed.
const daysLeft = (iso, now) => Math.ceil((new Date(iso) - now) / 86400000);

const countdownLabel = (days) => {
  if (days < 0) return 'Completed';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
};

// Red only for tests within 3 days, otherwise blue
const urgencyColor = (days) => (days < 0 ? c.dim : days <= 3 ? c.red : c.blue);

const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const UpcomingTestsView = () => {
  const { submissions } = uselxstore();
  const now = new Date();

  const tests = useMemo(
    () =>
      [...TESTS]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((t) => ({ ...t, days: daysLeft(t.date, now) })),
    // Re-run when the view mounts; countdowns are recalculated each time it is shown
    []
  );

  const deadlines = useMemo(() => {
    const mine = submissions.filter((s) => s.roll === CURRENT_STUDENT.roll);
    return ASSIGNMENTS.map((a) => ({
      ...a,
      sub: mine.find((s) => s.assignmentId === a.id) ?? null,
      days: daysLeft(a.due, new Date()),
    }))
      .filter((a) => !a.sub)
      .sort((a, b) => new Date(a.due) - new Date(b.due));
  }, [submissions]);

  const nextTest = tests.find((t) => t.days >= 0);

  return (
    <div style={ui.wrap}>
      <header>
        <h2 style={ui.title}>Upcoming tests</h2>
        <p style={ui.sub}>Exam dates, rooms and syllabus</p>
      </header>

      {nextTest && (
        <section style={{ ...ui.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '12px', color: c.muted }}>Next test</div>
            <div style={{ fontSize: '17px', fontWeight: 600, marginTop: '4px' }}>{nextTest.subject}</div>
            <div style={{ fontSize: '12px', color: c.muted, marginTop: '4px' }}>
              {nextTest.title} · {fmtDateTime(nextTest.date)}
            </div>
          </div>
          <span style={ui.badge(urgencyColor(nextTest.days))}>{countdownLabel(nextTest.days)}</span>
        </section>
      )}

      <div style={grid('260px')}>
        {tests.map((t) => {
          const color = urgencyColor(t.days);
          return (
            <div key={t.id} style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: c.blueLight, fontWeight: 500 }}>{t.subject}</span>
                <span style={ui.badge(color)}>{countdownLabel(t.days)}</span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>{t.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: c.muted }}>
                <CalendarDays size={13} /> {fmtDateTime(t.date)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: c.muted }}>
                <MapPin size={13} /> {t.room}
              </div>
              <div style={{ ...ui.row, flexDirection: 'column', alignItems: 'flex-start', gap: '4px', fontSize: '12px' }}>
                <span style={{ fontSize: '10px', color: c.dim, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Syllabus
                </span>
                {t.syllabus}
              </div>
            </div>
          );
        })}
      </div>

      <section style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
          <Clock size={15} color={c.blue} /> Assignments you still need to submit
        </div>
        {deadlines.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: c.blueLight, padding: '8px 0' }}>
            <CheckCircle2 size={16} /> All assignments submitted.
          </div>
        )}
        {deadlines.map((a) => {
          const color = a.days < 0 ? c.red : urgencyColor(a.days);
          return (
            <div key={a.id} style={ui.row}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{a.title}</div>
                <div style={{ fontSize: '12px', color: c.dim, marginTop: '2px' }}>
                  {a.course} · {fmtDateTime(a.due)}
                </div>
              </div>
              <span style={ui.badge(color)}>{a.days < 0 ? 'Overdue' : countdownLabel(a.days)}</span>
            </div>
          );
        })}
      </section>

      <LxAgent
        title="Test Agent"
        context={TESTS.map((t) => `${t.subject} ${t.title}: ${t.syllabus}.`).join(' ')}
      />
    </div>
  );
};

export default UpcomingTestsView;