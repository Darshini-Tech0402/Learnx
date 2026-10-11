import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy, X, ChevronRight } from 'lucide-react';
import LxAgent from '../common/LxAgent';
import { c, ui, grid } from '../../styles/theme';
import { getCourses, getUnitsForCourse, getUnit, submitQuiz, getMyQuizAttempts } from '../../services/quizbackend';

const LETTERS = ['A', 'B', 'C', 'D'];

const QuizzesView = () => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState([]);
  const [unit, setUnit] = useState(null); // full unit with questions
  const [attempts, setAttempts] = useState([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [mistake, setMistake] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const loadAttempts = () =>
    getMyQuizAttempts().then(setAttempts).catch(() => setError('Could not load your quiz history.'));

  useEffect(() => {
    getCourses()
      .then((all) => setCourses(all.filter((x) => x.code.startsWith('AIML') || x.code === 'OS' || x.code === 'ACA')))
      .catch(() => setError('Could not reach the backend. Check that it is running on port 8080.'));
    loadAttempts();
  }, []);

  const openCourse = (co) => {
    setCourse(co);
    getUnitsForCourse(co.code).then(setUnits).catch(() => setError('Could not load units.'));
  };

  const openUnit = async (u) => {
    try {
      const full = await getUnit(u.slug);
      setUnit(full);
      setStep(0);
      setAnswers(Array(full.questions.length).fill(null));
      setFinished(false);
      setResult(null);
      setMistake(null);
    } catch {
      setError('Could not load this unit.');
    }
  };

  const closeUnit = () => {
    setUnit(null);
    setMistake(null);
  };

  const q = unit?.questions[step];

  const pick = (i) => {
    if (finished || answers[step] !== null) return;
    setAnswers((prev) => prev.map((v, idx) => (idx === step ? i : v)));
    if (i !== q.correctIndex) {
      setMistake({
        id: `${unit.slug}-${step}-${Date.now()}`,
        question: q.text,
        chosen: q.options[i],
        correct: q.options[q.correctIndex],
        why: q.explanation,
      });
    }
  };

  const finish = async () => {
    setBusy(true);
    try {
      const payload = unit.questions.map((x, i) => ({ questionId: x.id, chosenIndex: answers[i] }));
      const res = await submitQuiz(unit.slug, payload);
      setResult(res);
      setFinished(true);
      loadAttempts();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const retake = () => {
    setAnswers(Array(unit.questions.length).fill(null));
    setStep(0);
    setFinished(false);
    setResult(null);
    setMistake(null);
  };

  // Score and per-question detail come from the server result
  const resultFor = (i) => result?.results?.[i];

    const optionStyle = (i) => {
    const base = {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '11px 14px',
      borderRadius: '8px',
      border: '1px solid #f3c6d9',
      background: '#ffffff',
      color: '#334155',
      fontSize: '14px',
      textAlign: 'left',
      cursor: answers[step] === null ? 'pointer' : 'default',
    };
    if (answers[step] === null) return base;
    if (i === q.correctIndex)
      return { ...base, border: '1px solid #e07ba6', background: '#fdf0f6', color: '#b84d80' };
    if (i === answers[step])
      return { ...base, border: '1px solid #d9546b', background: '#fff5f5', color: '#a8364f' };
    return { ...base, opacity: 0.5 };
  };

  const agentContext = unit
    ? `${unit.summary} ${unit.questions.map((x) => x.explanation).join(' ')}`
    : 'Choose a subject and unit. Each unit has a short quiz. Explanations appear after each answer.';

  return (
    <div style={ui.wrap}>
      <header style={ui.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {(course || unit) && (
            <button
              type="button"
              style={ui.btnIcon}
              onClick={() => (unit ? closeUnit() : setCourse(null))}
              aria-label="Go back"
            >
              <ArrowLeft size={15} />
            </button>
          )}
          <div>
            <h2 style={ui.title}>{course ? course.name : 'Quizzes'}</h2>
            <p style={ui.sub}>{course ? `${units.length} units · pick one to start` : 'Choose a subject'}</p>
          </div>
        </div>
        <span style={ui.badge()}>Quizzes taken: {attempts.length}</span>
      </header>

      {error && <div style={ui.noticeErr}>{error}</div>}

      {!course && (
        <div style={grid('240px')}>
          {courses.map((co) => (
            <button
              key={co.id}
              type="button"
              onClick={() => openCourse(co)}
              style={{ ...ui.card, textAlign: 'left', cursor: 'pointer', color: c.text, display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 600 }}>{co.name}</span>
                <ChevronRight size={16} color={c.dim} />
              </div>
            </button>
          ))}
        </div>
      )}

      {course && !unit && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {units.map((u, i) => {
            const tried = attempts.filter((a) => a.unitSlug === u.slug);
            const best = tried.length ? Math.max(...tried.map((a) => Math.round((a.score / a.total) * 100))) : null;
            return (
              <button
                key={u.slug}
                type="button"
                onClick={() => openUnit(u)}
                style={{ ...ui.card, display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', textAlign: 'left', cursor: 'pointer', color: c.text }}
              >
                <span style={{ fontSize: '13px', color: c.muted, width: '24px' }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: 500 }}>{u.title}</span>
                  <span style={{ display: 'block', fontSize: '12px', color: c.dim, marginTop: '3px' }}>
                    {u.questionCount} questions
                  </span>
                </span>
                <span style={{ fontSize: '12px', color: best === null ? c.dim : c.blueLight, whiteSpace: 'nowrap' }}>
                  {best === null ? 'Not attempted' : `Best ${best}%`}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {unit && (
        <div style={S.overlay} onClick={closeUnit}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: c.blueLight }}>{course?.name}</div>
                <div style={{ fontSize: '17px', fontWeight: 600, marginTop: '3px' }}>{unit.title}</div>
              </div>
              <button type="button" style={ui.btnIcon} onClick={closeUnit} aria-label="Close quiz">
                <X size={15} />
              </button>
            </div>

            {!finished ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: c.muted }}>
                  <span>Question {step + 1} of {unit.questions.length}</span>
                  <span>{answers.filter((a) => a !== null).length} answered</span>
                </div>
                <div style={ui.track}>
                  <div style={{ ...ui.fill, width: `${((step + 1) / unit.questions.length) * 100}%` }} />
                </div>

                <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, lineHeight: 1.5 }}>{q.text}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {q.options.map((opt, i) => (
                    <button key={i} type="button" style={optionStyle(i)} onClick={() => pick(i)}>
                      <span style={{ fontSize: '12px', color: c.muted, width: '18px' }}>{LETTERS[i]}</span>
                      {opt}
                    </button>
                  ))}
                </div>

                {answers[step] !== null && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'flex-start',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: `1px solid ${answers[step] === q.correctIndex ? c.blue : c.red}`,
                      fontSize: '13px',
                      lineHeight: 1.5,
                      color: answers[step] === q.correctIndex ? c.blueLight : c.redLight,
                    }}
                  >
                    {answers[step] === q.correctIndex ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                    <div>
                      <strong>{answers[step] === q.correctIndex ? 'Correct.' : 'Not quite.'}</strong> {q.explanation}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <button type="button" style={ui.btnGhost} onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                    Previous
                  </button>
                  {step < unit.questions.length - 1 ? (
                    <button type="button" style={ui.btn} onClick={() => setStep((s) => s + 1)} disabled={answers[step] === null}>
                      Next
                    </button>
                  ) : (
                    <button type="button" style={ui.btn} onClick={finish} disabled={busy || answers.some((a) => a === null)}>
                      {busy ? 'Submitting...' : 'Submit quiz'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Trophy size={24} color={c.blue} />
                  <div>
                    <div style={{ fontSize: '24px', fontWeight: 600 }}>
                      {result?.score} / {result?.total}
                    </div>
                    <div style={{ fontSize: '12px', color: c.muted }}>
                      {Math.round(((result?.score ?? 0) / (result?.total || 1)) * 100)}% · saved to the server
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {unit.questions.map((x, i) => {
                    const r = resultFor(i);
                    const ok = r?.correct;
                    return (
                      <div key={x.id} style={{ ...ui.row, flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', fontWeight: 500 }}>
                          {ok ? <CheckCircle2 size={13} color={c.blue} /> : <XCircle size={13} color={c.red} />}
                          {i + 1}. {x.text}
                        </div>
                        <div style={{ fontSize: '12px', color: c.blueLight }}>Answer: {x.options[x.correctIndex]}</div>
                        <div style={{ fontSize: '12px', color: c.muted }}>{x.explanation}</div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <button type="button" style={ui.btnGhost} onClick={closeUnit}>Back to units</button>
                  <button type="button" style={ui.btn} onClick={retake}>
                    <RotateCcw size={13} /> Retake
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <LxAgent title="Quiz Agent" context={agentContext} mistake={mistake} />
    </div>
  );
};

const S = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'rgba(0,0,0,0.25)',
  },
  modal: {
    width: '100%',
    maxWidth: '620px',
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '22px',
    borderRadius: '10px',
    border: `1px solid ${c.border}`,
    background: c.panel,
    color: c.text,
  },
};

export default QuizzesView;