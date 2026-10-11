import {
  X,
  User,
  ClipboardList,
  BrainCircuit,
  BookOpen,
  Layers,
  CalendarCheck,
  Clock,
  Users,
  UploadCloud,
  Search,
  FileCheck,
} from 'lucide-react';
import { c, ui } from '../../styles/theme';

export const STUDENT_TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList },
  { id: 'quizzes', label: 'Quizzes', icon: BrainCircuit },
  { id: 'notes', label: 'Faculty Notes', icon: BookOpen },
  { id: 'flashcards', label: 'Flashcards', icon: Layers },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
  { id: 'upcoming', label: 'Upcoming Tests', icon: Clock },
];

export const FACULTY_TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'section-j', label: 'My Sections', icon: Users },
  { id: 'upload', label: 'Upload Center', icon: UploadCloud },
  { id: 'quiz-manager', label: 'Quiz Manager', icon: BrainCircuit },
  { id: 'submissions', label: 'Submissions', icon: FileCheck },
  { id: 'search', label: 'Student Search', icon: Search },
];

const Sidebar = ({ isOpen, onClose, user, activeTab, onTabChange }) => {
  const tabs = user.role === 'faculty' ? FACULTY_TABS : STUDENT_TABS;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 900,
          background: 'rgba(0,0,0,0.25)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity .2s ease',
        }}
      />

      <aside
        aria-hidden={!isOpen}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: 'min(260px, 85%)',
          zIndex: 950,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '18px 14px',
          background: c.panel,
          borderRight: `1px solid ${c.border}`,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform .2s ease',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: c.muted, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {user.role === 'faculty' ? 'Faculty Portal' : 'Student Portal'}
          </span>
          <button type="button" style={ui.btnIcon} onClick={onClose} aria-label="Close menu">
            <X size={16} />
          </button>
        </div>

        <div style={{ ...ui.row, background: 'transparent' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: '12px', color: c.muted }}>
              {user.role === 'faculty' ? user.id : `Roll ${user.id}`}
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  onTabChange(tab.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: active ? c.soft : 'transparent',
                  color: active ? c.blueLight : c.text,
                  fontSize: '14px',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;