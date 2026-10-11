import { useMemo } from 'react';
import { SUBJECT_UNITS } from '../../data/quizUnits';
import { useLxStore } from '../../services/lxStore';
import { canSeeSubject } from '../../services/session';
import { ui } from '../../styles/theme';

const QuizManager = () => {
  const { quizAttempts } = useLxStore();

  // Scores per unit, from attempts recorded in this browser
  const stats = useMemo(() => {
    const map = {};
    quizAttempts.forEach((a) => {
      if (!map[a.quizId]) map[a.quizId] = [];
      map[a.quizId].push(Math.round((a.score / a.total) * 100));
    });
    return map;
  }, [quizAttempts]);

  // Only subjects this faculty teaches (AIML, OS or ACA)
  const visible = Object.entries(SUBJECT_UNITS).filter(([key]) => canSeeSubject(key));

  if (visible.length === 0) {
    return (
      <div style={ui.wrap}>
        <h2 style={ui.title}>Quiz Manager</h2>
        <div style={ui.empty}>No subjects are assigned to this login.</div>
      </div>
    );
  }

  return (
    <div style={ui.wrap}>
      <header>
        <h2 style={ui.title}>Quiz Manager</h2>
        <p style={ui.sub}>Units and questions for your subjects. Attempts shown are recorded in this browser.</p>
      </header>

      {visible.map(([key, subject]) => (
        <section key={key} style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{subject.name}</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={ui.table}>
              <thead>
                <tr>
                  {['Unit', 'Questions', 'Attempts', 'Average'].map((h) => (
                    <th key={h} style={ui.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subject.units.map((u) => {
                  const list = stats[u.id] ?? [];
                  const avg = list.length
                    ? Math.round(list.reduce((t, x) => t + x, 0) / list.length)
                    : null;
                  return (
                    <tr key={u.id}>
                      <td style={ui.td}>{u.title}</td>
                      <td style={ui.td}>{u.questions.length}</td>
                      <td style={ui.td}>{list.length}</td>
                      <td style={ui.td}>{avg === null ? '—' : `${avg}%`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
};

export default QuizManager;