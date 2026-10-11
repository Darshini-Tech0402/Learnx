import { api, fileUrl } from './api';
import { CURRENT_STUDENT } from './lxStore';

export const getAssignments = () => api.get('/assignments');

// Newest first, all versions. The first match for an assignment is the current one.
export const getMySubmissions = () => api.get(`/students/${CURRENT_STUDENT.roll}/submissions`);

export const uploadSubmission = (assignmentId, file) => {
  const form = new FormData();
  form.append('rollNo', CURRENT_STUDENT.roll);
  form.append('file', file);
  return api.form(`/assignments/${assignmentId}/submissions`, form);
};

export const deleteSubmission = (id) => api.del(`/submissions/${id}`);

export const submissionFileUrl = (id) => fileUrl(`/submissions/${id}/file`);