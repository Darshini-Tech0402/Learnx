import { useEffect, useState } from 'react';
import { GraduationCap, Users, X, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { api } from '../services/api';

const BLUE = '#a8d8f0';
const BLUE_DEEP = '#5b9bd5';
const PINK = '#f8c8dc';
const PINK_DEEP = '#e07ba6';
const INK = '#334155';
const MUTED = '#64748b';

const QUOTES = [
  'Discipline is the bridge between goals and accomplishment.',
  'The beautiful thing about learning is that nobody can take it away from you.',
  'Education is the most powerful weapon which you can use to change the world.',
  'Push yourself, because no one else is going to do it for you.',
];

const TITLES = {
  student: { title: 'Student Login', idLabel: 'Roll Number', accent: BLUE_DEEP },
  faculty: { title: 'Faculty Login', idLabel: 'Faculty ID', accent: PINK_DEEP },
};

// Only the student is pre-filled for quick testing. Faculty must type their own ID and password.
const PREFILL = {
  student: { id: 'J65', password: 'student123' },
  faculty: { id: '', password: '' },
};

const BRAND = 'LearnX';

const LoginPage = ({ onLogin }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [modalRole, setModalRole] = useState(null);
  const [form, setForm] = useState({ id: '', password: '' });
  const [showPw, setShowPw] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Change the quote every 4.5 seconds
  useEffect(() => {
    const t = setInterval(() => setQuoteIndex((i) => (i + 1) % QUOTES.length), 4500);
    return () => clearInterval(t);
  }, []);

  // Close the login box with Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setModalRole(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const openModal = (role) => {
    setModalRole(role);
    setForm({ id: PREFILL[role].id, password: PREFILL[role].password });
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api.post('/auth/login', { username: form.id, password: form.password });
      if (res.role !== modalRole) {
        setError(`Use the ${modalRole} login for this ID.`);
        return;
      }
      onLogin(res);
    } catch (err) {
      setError(err.message || 'Could not sign in. Check that the backend is running.');
    } finally {
      setBusy(false);
    }
  };

  const active = modalRole ? TITLES[modalRole] : null;

  return (
    <div style={S.page}>
      <style>{`
        @keyframes lxPop { 0% { opacity: 0; transform: translateY(-30px) scale(.4); } 70% { opacity: 1; transform: translateY(4px) scale(1.08); } 100% { opacity: 1; transform: none; } }
        @keyframes lxRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes lxModalIn { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: none; } }
        .lx-letter { display: inline-block; animation: lxPop .6s cubic-bezier(.34,1.56,.64,1) both; }
        .lx-rise { animation: lxRise .7s ease both; }
        .lx-modal { animation: lxModalIn .3s ease both; }
        .lx-btn { transition: transform .2s ease, box-shadow .2s ease; }
        .lx-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(91,155,213,.25); }
        .lx-btn:active:not(:disabled) { transform: scale(.98); }
        .lx-input { transition: border-color .2s ease, box-shadow .2s ease; }
        .lx-input:focus { outline: none; border-color: ${BLUE_DEEP} !important; box-shadow: 0 0 0 4px rgba(168,216,240,.5); }
      `}</style>

      <header style={S.header}>
        <div style={S.brand} aria-label={BRAND}>
          {BRAND.split('').map((ch, i) => (
            <span key={i} className="lx-letter" style={{ color: i < 5 ? BLUE_DEEP : PINK_DEEP, animationDelay: `${i * 90}ms` }}>
              {ch}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button type="button" className="lx-btn" style={S.headerBtn(BLUE_DEEP)} onClick={() => openModal('student')}>
            <GraduationCap size={16} /> Student Login
          </button>
          <button type="button" className="lx-btn" style={S.headerBtn(PINK_DEEP)} onClick={() => openModal('faculty')}>
            <Users size={16} /> Faculty Login
          </button>
        </div>
      </header>

      <main style={S.hero}>
        <h1 className="lx-rise" style={S.heading}>
          Welcome to <span style={{ color: BLUE_DEEP }}>Learn</span>
          <span style={{ color: PINK_DEEP }}>X</span>
        </h1>
        <p className="lx-rise" style={{ ...S.sub, animationDelay: '150ms' }}>
          The university portal for students and faculty.
        </p>
        <div key={quoteIndex} className="lx-rise" style={{ ...S.quote, animationDelay: '300ms' }}>
          “{QUOTES[quoteIndex]}”
        </div>
      </main>

      {active && (
        <div style={S.overlay} onClick={() => setModalRole(null)}>
          <form className="lx-modal" style={S.modal(active.accent)} onClick={(e) => e.stopPropagation()} onSubmit={submit}>
            <div style={S.modalHead}>
              <span style={{ fontSize: '20px', fontWeight: 800, color: INK }}>{active.title}</span>
              <button type="button" className="lx-btn" style={S.closeBtn} onClick={() => setModalRole(null)} aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <label style={S.label}>{active.idLabel}</label>
            <input
              className="lx-input"
              style={S.input}
              value={form.id}
              autoComplete="username"
              onChange={(e) => setForm({ ...form, id: e.target.value })}
            />

            <label style={{ ...S.label, marginTop: '10px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="lx-input"
                style={{ ...S.input, paddingRight: '44px' }}
                type={showPw ? 'text' : 'password'}
                value={form.password}
                autoComplete="current-password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                style={S.eyeBtn}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div style={S.error}>
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <button type="submit" className="lx-btn" style={S.submit} disabled={busy}>
              {busy ? 'Signing in...' : 'Sign in'}
            </button>
            <div style={{ fontSize: '12px', color: MUTED, textAlign: 'center', marginTop: '6px' }}>
              {modalRole === 'student' ? 'Test credentials are pre-filled.' : 'Enter your faculty ID and password.'}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

const S = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #eef8ff 0%, #fff4f8 100%)', color: INK, fontFamily: "'Nunito', system-ui, sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', padding: '18px 28px', background: 'rgba(255,255,255,0.7)', borderBottom: `2px solid ${BLUE}` },
  brand: { display: 'flex', fontSize: '28px', fontWeight: 800, letterSpacing: '1px' },
  headerBtn: (accent) => ({ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '999px', border: `2px solid ${accent}`, background: '#fff', color: INK, fontFamily: 'inherit', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }),
  hero: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '50px 20px', textAlign: 'center' },
  heading: { margin: 0, fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 800 },
  sub: { margin: 0, fontSize: '17px', color: MUTED },
  quote: { maxWidth: '600px', minHeight: '52px', padding: '16px 22px', borderRadius: '18px', border: `2px solid ${PINK}`, background: '#fff', fontSize: '15px', fontStyle: 'italic', boxShadow: '0 6px 18px rgba(248,200,220,.35)' },
  overlay: { position: 'fixed', inset: 0, zIndex: 1500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'rgba(51,65,85,0.25)' },
  modal: (accent) => ({ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '6px', padding: '26px', borderRadius: '22px', border: `3px solid ${accent}`, background: '#fff', boxShadow: '0 20px 40px rgba(51,65,85,.15)' }),
  modalHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  closeBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', borderRadius: '50%', border: `2px solid ${PINK}`, background: '#fff', color: INK, cursor: 'pointer' },
  label: { fontSize: '13px', fontWeight: 700, color: MUTED },
  input: { width: '100%', padding: '11px 14px', borderRadius: '12px', border: `2px solid ${BLUE}`, background: '#f8fcff', color: INK, fontSize: '15px', fontFamily: 'inherit', boxSizing: 'border-box' },
  eyeBtn: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, display: 'flex' },
  error: { display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', padding: '10px 12px', borderRadius: '12px', background: '#fff0f6', border: `2px solid ${PINK}`, color: '#b4487a', fontSize: '13px', fontWeight: 700 },
  submit: { marginTop: '12px', padding: '13px', borderRadius: '14px', border: 'none', background: `linear-gradient(90deg, ${BLUE}, ${PINK})`, color: INK, fontFamily: 'inherit', fontSize: '16px', fontWeight: 800, cursor: 'pointer' },
};

export default LoginPage;