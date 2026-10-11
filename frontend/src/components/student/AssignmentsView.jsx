import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Trash2, Clock, FileText, UploadCloud } from 'lucide-react';
import LxAgent from '../common/LxAgent';
import { c, ui } from '../../styles/theme';
import {
  getAssignments,
  getMySubmissions,
  uploadSubmission,
  deleteSubmission,
  submissionFileUrl,
} from '../../services/backend';

const ALLOWED = ['pdf', 'doc', 'docx', 'pptx', 'zip'];
const MAX_BYTES = 50 * 1024 * 1024;

const fmtDue = (iso) =>
  `${new Date(iso).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}, 23:59`;

const fmtTime = (iso) =>
  new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const fmtBytes = (n) => (n < 1024 ** 2 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 ** 2).toFixed(2)} MB`);

const STATUS_LABEL = { submitted: 'Submitted', late: 'Late', pending: 'Open', overdue: 'Overdue' };
const STATUS_COLOR = { submitted: c.blue, late: c.muted, pending: c.muted, overdue: c.red };

const AssignmentsView = () => {
  const [assignments, setAssignments] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [notice, setNotice] = useState(null);
  const inputRef = useRef(null);
  const targetRef = useRef(null);

  const reload = useCallback(async () => {
    try {
      const [a, s] = await Promise.all([getAssignments(), getMySubmissions()]);
      setAssignments(a);
      setSubs(s);
      setLoadError(null);
    } catch {
      setLoadError('Could not reach the backend. Check that it is running on port 8080.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const now = new Date();
  const rows = assignments.map((a) => {
    const sub = subs.find((s) => s.assignmentId === a.id) ?? null;
    let status = 'pending';
    if (sub) status = sub.late ? 'late' : 'submitted';
    else if (now > new Date(a.dueAt)) status = 'overdue';
    return { ...a, sub, status };
  });

  const visible = filter === 'all' ? rows : rows.filter((r) => r.id === Number(filter));
  const submittedCount = rows.filter((r) => r.sub).length;
  const lateCount = rows.filter((r) => r.status === 'late').length;
  const openCount = rows.filter((r) => r.status === 'pending' || r.status === 'overdue').length;

  const uploadFor = async (assignmentId, file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED.includes(ext)) {
      setNotice({ type: 'err', text: 'Only PDF, DOC, DOCX, PPTX or ZIP files are accepted.' });
      return;
    }
    if (file.size > MAX_BYTES) {
      setNotice({ type: 'err', text: 'File is larger than 50 MB.' });
      return;
    }
    setBusyId(assignmentId);
    setNotice(null);
    try {
      const saved = await uploadSubmission(assignmentId, file);
      const late = saved.late ? ' Marked late.' : '';
      setNotice({ type: 'ok', text: `"${saved.fileName}" uploaded as version ${saved.version}.${late}` });
      await reload();
    } catch (e) {
      setNotice({ type: 'err', text: e.message });
    } finally {
      setBusyId(null);
    }
  };

  const pickFile = (assignmentId) => {
    targetRef.current = assignmentId;
    inputRef.current?.click();
  };

  const handleInput = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file && targetRef.current) uploadFor(targetRef.current, file);
  };

  const handleDrop = (e, assignmentId) => {
    e.preventDefault();
    setDragId(null);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFor(assignmentId, file);
  };

  const handleDelete = async (sub) => {
    if (!window.confirm(`Delete "${sub.fileName}"?`)) return;
    try {
      await deleteSubmission(sub.id);
      setNotice({ type: 'ok', text: 'Submission deleted.' });
      await reload();
    } catch (e) {
      setNotice({ type: 'err', text: e.message });
    }
  };

  return (
    <div style={ui.wrap}>
      <header style={ui.header}>
        <div>
          <h2 style={ui.title}>Assignments</h2>
          <p style={ui.sub}>Upload PDF, DOCX, PPTX or ZIP files for faculty review</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={ui.badge()}>{submittedCount}/{assignments.length} submitted</span>
          <span style={ui.badge(c.muted)}>{lateCount} late</span>
          <span style={ui.badge(c.muted)}>{openCount} open</span>
        </div>
      </header>

      {loadError && <div style={ui.noticeErr}>{loadError}</div>}
      {notice && <div style={notice.type === 'ok' ? ui.notice : ui.noticeErr}>{notice.text}</div>}
      {loading && <div style={ui.empty}>Loading assignments...</div>}

      <nav style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => setFilter('all')} style={filter === 'all' ? ui.pillOn : ui.pill}>
          All
        </button>
        {assignments.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => setFilter(String(a.id))}
            style={filter === String(a.id) ? ui.pillOn : ui.pill}
          >
            {a.courseCode}
          </button>
        ))}
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
        {visible.map((r) => {
          const busy = busyId === r.id;
          const dragging = dragId === r.id;
          return (
            <article key={r.id} style={{ ...ui.card, display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => !busy && pickFile(r.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pickFile(r.id)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragId(r.id);
                }}
                onDragLeave={() => setDragId(null)}
                onDrop={(e) => handleDrop(e, r.id)}
                style={{
                  width: '130px',
                  minHeight: '130px',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px',
                  borderRadius: '6px',
                  border: `1px dashed ${dragging ? c.blue : c.border}`,
                  background: '#000',
                  cursor: busy ? 'default' : 'pointer',
                  textAlign: 'center',
                }}
              >
                <UploadCloud size={22} color={c.blue} />
                <span style={{ fontSize: '12px', fontWeight: 500 }}>
                  {busy ? 'Uploading...' : r.sub ? 'Replace file' : 'Upload file'}
                </span>
                <span style={{ fontSize: '11px', color: c.dim }}>PDF · DOCX · ZIP</span>
              </div>

              <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: c.blueLight, fontWeight: 500 }}>{r.courseCode}</span>
                  <span style={ui.badge(STATUS_COLOR[r.status])}>{STATUS_LABEL[r.status]}</span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 600 }}>{r.topic}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: c.muted }}>
                  <Clock size={13} /> Due {fmtDue(r.dueAt)}
                </div>

                {r.sub ? (
                  <div style={{ ...ui.row, marginTop: '4px' }}>
                    <FileText size={15} color={c.blue} style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '12px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.sub.fileName}
                      </div>
                      <div style={{ fontSize: '11px', color: c.dim, marginTop: '2px' }}>
                        {fmtTime(r.sub.submittedAt)} · {fmtBytes(r.sub.sizeBytes)} · v{r.sub.version}
                      </div>
                    </div>
                    <a href={submissionFileUrl(r.sub.id)} style={ui.btnIcon} aria-label="Download my submission">
                      <Download size={14} />
                    </a>
                    <button type="button" style={ui.btnIcon} onClick={() => handleDelete(r.sub)} aria-label="Delete my submission">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div style={ui.empty}>No file submitted yet</div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.pptx,.zip" style={{ display: 'none' }} onChange={handleInput} />

      <LxAgent
        title="Assignment Agent"
        context={assignments.map((a) => `${a.courseCode}: ${a.topic}. Due 23:59.`).join(' ')}
      />
    </div>
  );
};

export default AssignmentsView;