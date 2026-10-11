import { useRef, useState } from 'react';
import { X, Clock, UploadCloud, FileText, Download } from 'lucide-react';
import {
  ASSIGNMENTS,
  CURRENT_STUDENT,
  useLxStore,
  submitAssignment,
  downloadFile,
} from '../../services/lxstore';
import { ASSIGNMENT_BRIEFS } from '../../data/assignmentBriefs';
import { c, ui } from '../../styles/theme';

const ALLOWED = ['pdf', 'doc', 'docx', 'pptx', 'zip'];
const MAX_BYTES = 50 * 1024 * 1024;

const fmtDue = (iso) =>
  `${new Date(iso).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}, 23:59`;

const AssignmentBrief = ({ assignmentId, onClose }) => {
  const { submissions } = useLxStore();
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const assignment = ASSIGNMENTS.find((a) => a.id === assignmentId);
  const brief = ASSIGNMENT_BRIEFS[assignmentId];
  const mine = submissions.find(
    (s) => s.roll === CURRENT_STUDENT.roll && s.assignmentId === assignmentId
  );

  if (!assignment || !brief) return null;

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED.includes(ext)) {
      setNotice({ type: 'err', text: 'Only PDF, DOC, DOCX, PPTX or ZIP files are accepted.' });
      return;
    }
    if (file.size > MAX_BYTES) {
      setNotice({ type: 'err', text: 'File is larger than 50 MB.' });
      return;
    }

    setBusy(true);
    try {
      await submitAssignment(assignmentId, file);
      setNotice({ type: 'ok', text: `"${file.name}" submitted.` });
    } catch {
      setNotice({ type: 'err', text: 'Could not save the file on this device.' });
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadFile(mine.fileId, mine.fileName);
    } catch {
      setNotice({ type: 'err', text: 'That file is no longer on this device.' });
    }
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', color: c.blueLight }}>{assignment.course}</div>
            <div style={{ fontSize: '18px', fontWeight: 600, marginTop: '3px' }}>{assignment.title}</div>
          </div>
          <button type="button" style={ui.btnIcon} onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <span style={ui.badge()}>{brief.type}</span>
          <span style={ui.badge(c.muted)}>{brief.length}</span>
          <span style={{ ...ui.badge(c.muted), display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={11} /> Due {fmtDue(assignment.due)}
          </span>
        </div>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={S.heading}>What to submit</div>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: c.text }}>{brief.prompt}</p>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={S.heading}>Your submission must include</div>
          {brief.requirements.map((r, i) => (
            <div key={i} style={{ ...ui.row, background: '#000', fontSize: '13px' }}>
              <span style={{ color: c.blueLight, fontWeight: 600, width: '20px' }}>{i + 1}</span>
              <span>{r}</span>
            </div>
          ))}
          <div style={{ fontSize: '12px', color: c.dim, marginTop: '4px' }}>File format: {brief.format}</div>
        </section>

        <section style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={S.heading}>Your submission</div>
          {mine ? (
            <div style={ui.row}>
              <FileText size={15} color={c.blue} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {mine.fileName}
                </div>
                <div style={{ fontSize: '11px', color: c.dim }}>Version {mine.version}</div>
              </div>
              <button type="button" style={ui.btnIcon} onClick={handleDownload} aria-label="Download my submission">
                <Download size={14} />
              </button>
            </div>
          ) : (
            <div style={ui.empty}>No file submitted yet</div>
          )}

          <button
            type="button"
            style={{ ...ui.btn, justifyContent: 'center', opacity: busy ? 0.6 : 1 }}
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            <UploadCloud size={14} />
            {busy ? 'Saving...' : mine ? 'Replace file' : 'Upload file'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,.pptx,.zip"
            style={{ display: 'none' }}
            onChange={handleFile}
          />

          {notice && <div style={notice.type === 'ok' ? ui.notice : ui.noticeErr}>{notice.text}</div>}
        </section>
      </div>
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
    background: 'rgba(0,0,0,0.7)',
  },
  modal: {
    width: '100%',
    maxWidth: '640px',
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    padding: '24px',
    borderRadius: '8px',
    border: `1px solid ${c.border}`,
    background: c.panel,
    color: c.text,
  },
  heading: { fontSize: '13px', fontWeight: 600, color: c.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
};

export default AssignmentBrief;