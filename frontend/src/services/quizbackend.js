import { api } from './api';
import { CURRENT_STUDENT } from './lxStore';

export const getCourses = () => api.get('/courses');
export const getUnitsForCourse = (code) => api.get(`/courses/${code}/units`);
export const getUnit = (slug) => api.get(`/units/${slug}`);

// answers: [{ questionId, chosenIndex }]
export const submitQuiz = (unitSlug, answers) =>
  api.post('/quiz-attempts', { rollNo: CURRENT_STUDENT.roll, unitSlug, answers });

export const getMyQuizAttempts = () => api.get(`/students/${CURRENT_STUDENT.roll}/quiz-attempts`);

export const getMastery = () => api.get(`/students/${CURRENT_STUDENT.roll}/mastery`);
export const setMastery = (questionId, mastered) =>
  api.put(`/students/${CURRENT_STUDENT.roll}/mastery/${questionId}`, { mastered });