import { CURRENT_STUDENT } from './lxstore';

// Holds the logged-in user's details
let session = null;

export const setSession = (s) => {
  session = s;
  // Make the student views (assignments, quizzes) use this student's roll number
  if (s?.role === 'student') {
    CURRENT_STUDENT.roll = s.rollNo;
    CURRENT_STUDENT.name = s.name;
  }
};

export const getSession = () => session;

export const allowedCodes = () => session?.courses ?? [];

const KEY_TO_CODES = { AIML: ['AIML', 'LAB-AIML'], OS: ['OS', 'LAB-OS'], ACA: ['ACA'] };

// True if the logged-in user may see this subject key (AIML, OS or ACA)
export const canSeeSubject = (key) =>
  (KEY_TO_CODES[key] ?? []).some((code) => allowedCodes().includes(code));