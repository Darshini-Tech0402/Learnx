import { useEffect, useRef, useState } from 'react';
import { UploadCloud, Download } from 'lucide-react';
import { allowedCodes } from '../../services/session';
import { api, fileUrl } from '../../services/api';
import { c, ui } from '../../styles/theme';

// Every subject the faculty may upload to: display name + backend code
const SUBJECTS = [
  { name: 'AIML', code: 'AIML' },
  { name: 'OS', code: 'OS' },
  { name: 'Advanced Computer Algorithms', code: 'ACA' },
  { name: 'Labs for AIML', code: 'LAB-AIML' },
  { name: 'Labs for OS', code: 'LAB-OS' },
];

const CATEGORIES = ['Lecture Notes', 'Slides', 'Reference', 'Assignment Brief'];
const ALLOWED = ['pdf', 'doc', 'docx'];
const MAX_BYTES = 25 * 1024 * 1024;

const UploadCenter = () => {
  const inputRef = useRef(null);

  // Only the subjects this faculty teaches, compared by backend code
  const mySubjects = SUBJECTS.filter((s) => allowedCodes().includes(s.code));

  const [subjectCode, setSubjectCode] = useState(mySubjects[0]?.code ?? '');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [materials, setMaterials] = useState([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const loadMaterials = () =>
    api
      .get('/materials')
      .then((all) => setMaterials(all.filter((m) => mySubjects.some((s) => s.code === m.courseCode))))
      .catch(() => setNotice({ type: 'err', text: 'Could not load the list. Is the backend running on port 8080?' }));

  useEffect(() => {
    loadMaterials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED.includes(ext)) {
      setNotice({ type: 'err', text: 'Only PDF, DOC or DOCX files can be uploaded.' });
      return;
    }
    if (file.size > MAX_BYTES) {
      setNotice({ type: 'err', text: 'File is larger than 25 MB.' });
      return;
    }
    if (!subjectCode) {
      setNotice({ type: 'err', text: 'Choose a subject first.' });
      return;
    }

    setBusy(true);
    setNotice(null);
    try {
      const form = new FormData();
      form.append('courseCode', subjectCode);
      form.append('title', title.trim() || file.name.replace(/\.[^.]+$/, ''));
      form.append('category', category);
      form.append('uploadedBy', allowedCodes().join(',') || 'faculty');
      form.append('file', file);

      await api.form('/materials', form);

      setTitle('');
      setNotice({ type: 'ok', text: `Published "${file.name}". Students can see it in Faculty Notes now.` });
      await loadMaterials();
    } catch (err) {
      setNotice({ type: 'err', text: `Upload failed: ${err.message}` });
    } finally {
      setBusy(false);
    }
  };

  if (mySubjects.length === 0) {
    return (
      <div style={ui.wrap}>
        <h2 style={ui.title}>Upload Center</h2>
        <div style={ui.empty}>No subjects are assigned to this login.</div>
      </div>
    );
  }

  const nameOf = (code) => SUBJECTS.find((s) => s.code === code)?.name ?? code;

  return (
    <div style={ui.wrap}>
      <header>
        <h2 style={ui.title}>Upload Center</h2>
        <p style={ui.sub}>Publish PDF, DOC or DOCX notes. Students see them in Faculty Notes.</p>
      </header>

      <section style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div>
            <label style={ui.label}>Subject</label>
            <select style={ui.input} value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)}>
              {mySubjects.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={ui.label}>Category</label>
            <select style={ui.input} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={ui.label}>Title</label>
            <input
              style={ui.input}
              value={title}
              placeholder="Leave blank to use the file name"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        <button
          type="button"
          style={{ ...ui.btn, alignSelf: 'flex-start', opacity: busy ? 0.6 : 1 }}
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          <UploadCloud size={14} /> {busy ? 'Publishing...' : 'Choose file and publish'}
        </button>
        <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFile} />

        {notice && <div style={notice.type === 'ok' ? ui.notice : ui.noticeErr}>{notice.text}</div>}
      </section>

      <section style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Published ({materials.length})</h3>
        {materials.length === 0 && <div style={ui.empty}>Nothing published yet.</div>}
        {materials.map((m) => (
          <div key={m.id} style={ui.row}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>{m.title}</div>
              <div style={{ fontSize: '12px', color: c.dim, marginTop: '2px' }}>
                {nameOf(m.courseCode)} · {m.category} · {new Date(m.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </div>
            </div>
            <a href={fileUrl(`/materials/${m.id}/file`)} style={ui.btnIcon} aria-label="Download">
              <Download size={14} />
            </a>
          </div>
        ))}
      </section>
    </div>
  );
};

export default UploadCenter;