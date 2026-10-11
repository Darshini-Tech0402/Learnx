import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { ui, paletteVars } from '../styles/theme';

import ProfileView from '../components/student/ProfileView';
import AssignmentsView from '../components/student/AssignmentsView';
import QuizzesView from '../components/student/QuizzesView';
import NotesView from '../components/student/NotesView';
import FlashcardsView from '../components/student/FlashcardsView';
import AttendanceView from '../components/student/AttendanceView';
import UpcomingTestsView from '../components/student/UpcomingTestsView';

import FacultyProfileView from '../components/faculty/FacultyProfileView';
import SectionJView from '../components/faculty/SectionJView';
import UploadCenter from '../components/faculty/UploadCenter';
import QuizManager from '../components/faculty/QuizManager';
import SubmissionsTracker from '../components/faculty/SubmissionsTracker';
import StudentSearch from '../components/faculty/StudentSearch';

const DEFAULT_TAB = { student: 'profile', faculty: 'profile' };

// Tab ids must match the ids in Sidebar.jsx
const VIEWS = {
  profile: ProfileView,
  assignments: AssignmentsView,
  quizzes: QuizzesView,
  notes: NotesView,
  flashcards: FlashcardsView,
  attendance: AttendanceView,
  upcoming: UpcomingTestsView,
  'section-j': SectionJView,
  upload: UploadCenter,
  'quiz-manager': QuizManager,
  submissions: SubmissionsTracker,
  search: StudentSearch,
};

const Dashboard = ({ session, onSignOut }) => {
  const role = session.role;
  const user = { name: session.name, role, id: session.rollNo ?? session.facultyId };
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB[role] ?? 'profile');
  const [menuOpen, setMenuOpen] = useState(false);

  // Faculty and students have different profile pages
  let ActiveView = VIEWS[activeTab] ?? ProfileView;
  if (role === 'faculty' && activeTab === 'profile') ActiveView = FacultyProfileView;

  return (
    <div style={{ ...ui.page, ...paletteVars(role) }}>
      <Navbar user={user} onMenuClick={() => setMenuOpen(true)} notificationCount={0} onSignOut={onSignOut} />
      <Sidebar
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main style={{ maxWidth: '1100px', margin: '0 auto', minHeight: 'calc(100vh - 60px)' }}>
        <ActiveView />
      </main>
    </div>
  );
};

export default Dashboard;