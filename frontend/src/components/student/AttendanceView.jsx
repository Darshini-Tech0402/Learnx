import { CalendarCheck, Clock, AlertTriangle } from 'lucide-react';
import { SUBJECTS, TARGET } from '../../services/lxstore';
import { c, ui, grid } from '../../styles/theme';

// Timetable is placeholder data. Replace with real data when you have it.
const TIMETABLE = [
  { day: 'Mon', slots: [['09:00', 'AIML'], ['11:00', 'Advanced Computer Algorithms']] },
  { day: 'Tue', slots: [['10:00', 'OS'], ['14:00', 'Labs for AIML']] },
  { day: 'Wed', slots: [['09:00', 'AIML'], ['13:00', 'Labs for OS']] },
  { day: 'Thu', slots: [['11:00', 'OS'], ['15:00', 'Advanced Computer Algorithms']] },
  { day: 'Fri', slots: [['10:00', 'AIML'], ['12:00', 'Labs for AIML']] },
];

// Classes you must attend in a row to reach TARGET percent
const classesToTarget = (attended, total) => {
  if ((attended / total) * 100 >= TARGET) return 0;
  return Math.ceil((TARGET * total - 100 * attended) / (100 - TARGET));
};

const pct = (a, t) => Math.round((a / t) * 100);

const AttendanceView = () => {
  const totalAttended = SUBJECTS.reduce((s, x) => s + x.attended, 0);
  const totalClasses = SUBJECTS.reduce((s, x) => s + x.total, 0);
  const overall = pct(totalAttended, totalClasses);
  const atRisk = SUBJECTS.filter((s) => pct(s.attended, s.total) < TARGET);

  return (
    <div style={ui.wrap}>
      <header>
        <h2 style={ui.title}>Attendance</h2>
        <p style={ui.sub}>Minimum required: {TARGET}%</p>
      </header>

      <div style={grid('170px')}>
        <div style={ui.card}>
          <div style={{ fontSize: '12px', color: c.muted }}>Overall</div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginTop: '8px' }}>{overall}%</div>
        </div>
        <div style={ui.card}>
          <div style={{ fontSize: '12px', color: c.muted }}>Classes attended</div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginTop: '8px' }}>
            {totalAttended}/{totalClasses}
          </div>
        </div>
        <div style={ui.card}>
          <div style={{ fontSize: '12px', color: c.muted }}>Subjects below {TARGET}%</div>
          <div style={{ fontSize: '24px', fontWeight: 600, marginTop: '8px', color: atRisk.length ? c.red : c.text }}>
            {atRisk.length}
          </div>
        </div>
      </div>

      <section style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
          <CalendarCheck size={15} color={c.blue} /> By subject
        </div>
        {SUBJECTS.map((s) => {
          const p = pct(s.attended, s.total);
          const low = p < TARGET;
          const need = classesToTarget(s.attended, s.total);
          return (
            <div key={s.name} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>{s.name}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: low ? c.red : c.blueLight }}>{p}%</span>
              </div>
              <div style={ui.track}>
                <div style={{ ...ui.fill, width: `${p}%`, background: low ? c.red : c.blue }} />
              </div>
              <div style={{ fontSize: '12px', color: c.dim, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                {s.attended}/{s.total} classes · {s.room}
                {low && (
                  <span style={{ color: c.redLight, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <AlertTriangle size={11} /> Attend next {need} to reach {TARGET}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <section style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600 }}>
          <Clock size={15} color={c.blue} /> Weekly timetable
        </div>
        <div style={grid('150px')}>
          {TIMETABLE.map((d) => (
            <div key={d.day} style={{ ...ui.row, flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600 }}>{d.day}</div>
              {d.slots.map(([time, subject]) => (
                <div key={time + subject} style={{ fontSize: '12px', color: c.muted }}>
                  <span style={{ color: c.blueLight, marginRight: '6px' }}>{time}</span>
                  {subject}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AttendanceView;