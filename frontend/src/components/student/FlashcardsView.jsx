import { useState } from 'react';
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, Trophy } from 'lucide-react';
import { useLxStore, toggleMastered } from '../../services/lxstore';
import { SUBJECT_UNITS } from '../../data/quizUnits';
import LxAgent from '../common/LxAgent';
import { c, ui, grid } from '../../styles/theme';

// Each unit question becomes one flashcard: question on the front, answer and reason on the back
const cardsFromUnit = (unit) =>
  unit.questions.map((q, i) => ({
    id: `${unit.id}-card-${i}`,
    front: q.q,
    back: `${q.options[q.correct]}. ${q.why}`,
  }));

const FlashcardsView = () => {
  const { mastered } = useLxStore();
  const [subjectKey, setSubjectKey] = useState(null);
  const [unit, setUnit] = useState(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [finished, setFinished] = useState(false);

  const subject = subjectKey ? SUBJECT_UNITS[subjectKey] : null;
  const cards = unit ? cardsFromUnit(unit) : [];
  const card = cards[index];
  const isMastered = card ? mastered.includes(card.id) : false;
  const masteredIn = (u) => cardsFromUnit(u).filter((c2) => mastered.includes(c2.id)).length;
  const unitMasteredCount = unit ? masteredIn(unit) : 0;
  const allMastered = unit && unitMasteredCount === cards.length;

  const openUnit = (u) => {
    setUnit(u);
    setIndex(0);
    setFlipped(false);
    setFinished(false);
  };

  const closeUnit = () => {
    setUnit(null);
    setFlipped(false);
    setFinished(false);
  };

  const go = (delta) => {
    if (!cards.length) return;
    setFlipped(false);
    setIndex((i) => (i + delta + cards.length) % cards.length);
  };

  const restart = () => {
    setIndex(0);
    setFlipped(false);
    setFinished(false);
  };

  const context = unit
    ? `${unit.summary} ${cards.map((x) => `${x.front} ${x.back}`).join(' ')}`
    : 'Choose a subject, then a unit, to study its flashcards. Click a card to flip it.';

  return (
    <div style={ui.wrap}>
      <header style={ui.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {subject && (
            <button
              type="button"
              style={ui.btnIcon}
              onClick={() => (unit ? closeUnit() : setSubjectKey(null))}
              aria-label="Go back"
            >
              <ArrowLeft size={15} />
            </button>
          )}
          <div>
            <h2 style={ui.title}>{unit ? unit.title : subject ? subject.name : 'Flashcards'}</h2>
            <p style={ui.sub}>
              {unit
                ? `${subject.name} · ${cards.length} cards`
                : subject
                ? `${subject.units.length} units · pick one to study`
                : 'Choose a subject'}
            </p>
          </div>
        </div>
        <span style={ui.badge()}>Mastered: {mastered.length}</span>
      </header>

      {/* Step 1: subjects */}
      {!subject && (
        <div style={grid('240px')}>
          {Object.entries(SUBJECT_UNITS).map(([key, s]) => {
            const total = s.units.reduce((t, u) => t + u.questions.length, 0);
            const done = s.units.reduce((t, u) => t + masteredIn(u), 0);
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSubjectKey(key)}
                style={{ ...ui.card, textAlign: 'left', cursor: 'pointer', color: c.text, display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <BookOpen size={17} color={c.blue} />
                  <ChevronRight size={16} color={c.dim} />
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: '12px', color: c.muted }}>
                  {s.units.length} units · {done}/{total} cards mastered
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Step 2: units */}
      {subject && !unit && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {subject.units.map((u, i) => {
            const total = u.questions.length;
            const done = masteredIn(u);
            const pct = Math.round((done / total) * 100);
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => openUnit(u)}
                style={{ ...ui.card, display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', textAlign: 'left', cursor: 'pointer', color: c.text }}
              >
                <span style={{ fontSize: '13px', color: c.muted, width: '24px' }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>{u.title}</span>
                  <span style={ui.track} >
                    <span style={{ ...ui.fill, display: 'block', width: `${pct}%` }} />
                  </span>
                </span>
                <span style={{ fontSize: '12px', color: done === total ? c.blueLight : c.dim, whiteSpace: 'nowrap' }}>
                  {done}/{total} mastered
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Step 3: study the unit's cards */}
      {unit && !finished && card && (
        <section style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: '18px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: c.muted }}>
            <span>Card {index + 1} of {cards.length}</span>
            <span>{unitMasteredCount} mastered</span>
          </div>
          <div style={ui.track}>
            <div style={{ ...ui.fill, width: `${(unitMasteredCount / cards.length) * 100}%` }} />
          </div>

          <div
            onClick={() => setFlipped((f) => !f)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setFlipped((f) => !f)}
            style={{
              minHeight: '220px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              padding: '28px',
              borderRadius: '8px',
              border: `1px solid ${flipped ? c.blue : c.border}`,
              background: '#000',
              textAlign: 'center',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: flipped ? c.blueLight : c.dim }}>
              {flipped ? 'Answer' : 'Question'}
            </span>
            <p style={{ margin: 0, fontSize: flipped ? '14px' : '17px', fontWeight: flipped ? 400 : 600, lineHeight: 1.6, color: c.text }}>
              {flipped ? card.back : card.front}
            </p>
            {!flipped && <span style={{ fontSize: '11px', color: c.dim }}>Click to see the answer</span>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button type="button" style={ui.btnIcon} onClick={() => go(-1)} aria-label="Previous card">
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '13px', minWidth: '60px', textAlign: 'center' }}>
              {index + 1} / {cards.length}
            </span>
            <button type="button" style={ui.btnIcon} onClick={() => go(1)} aria-label="Next card">
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              style={isMastered ? ui.btnGhost : ui.btn}
              onClick={() => toggleMastered(card.id)}
            >
              <CheckCircle2 size={14} />
              {isMastered ? 'Mastered' : 'Mark as mastered'}
            </button>
            <button type="button" style={ui.btnGhost} onClick={restart}>
              <RotateCcw size={13} /> Restart
            </button>
            <button
              type="button"
              style={ui.btn}
              onClick={() => setFinished(true)}
              disabled={unitMasteredCount === 0}
            >
              Submit unit
            </button>
          </div>
        </section>
      )}

      {/* Step 4: summary */}
      {unit && finished && (
        <section style={{ ...ui.card, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '36px 24px', textAlign: 'center' }}>
          <Trophy size={26} color={c.blue} />
          <div style={{ fontSize: '24px', fontWeight: 600 }}>
            {unitMasteredCount} / {cards.length}
          </div>
          <div style={{ fontSize: '13px', color: c.muted }}>
            {allMastered
              ? 'Every card in this unit is mastered.'
              : 'Some cards are still open. Go back through the ones you missed.'}
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" style={ui.btnGhost} onClick={() => setFinished(false)}>
              Keep studying
            </button>
            <button type="button" style={ui.btn} onClick={closeUnit}>
              Back to units
            </button>
          </div>
        </section>
      )}

      <LxAgent title="Flashcard Agent" context={context} />
    </div>
  );
};

export default FlashcardsView;