import { BookOpen } from 'lucide-react';
import ProfileCard from '../common/ProfileCard';
import { getSession } from '../../services/session';
import { c, ui } from '../../styles/theme';

const COURSE_NAMES = {
  AIML: 'AIML',
  OS: 'OS',
  ACA: 'Advanced Computer Algorithms',
  'LAB-AIML': 'Labs for AIML',
  'LAB-OS': 'Labs for OS',
};

const FacultyProfileView = () => {
  const me = getSession() ?? {};
  const courses = me.courses ?? [];

  return (
    <div style={ui.wrap}>
      <h2 style={ui.title}>My Profile</h2>

      <ProfileCard
        id={me.facultyId}
        name={me.name}
        rows={[
          ['Faculty ID', me.facultyId],
          ['Designation', me.designation],
          ['Department', me.department],
          ['Sections', (me.sections ?? []).join(', ')],
        ]}
      />

      <section style={{ ...ui.card, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>Subjects I teach</h3>
        {courses.length === 0 && <div style={ui.empty}>No subjects assigned to this login yet.</div>}
        {courses.map((code) => (
          <div key={code} style={ui.row}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <BookOpen size={14} color={c.blue} /> {COURSE_NAMES[code] ?? code}
            </span>
            <span style={ui.badge()}>{code}</span>
          </div>
        ))}
      </section>
    </div>
  );
};

export default FacultyProfileView;