import { useSyncExternalStore } from 'react';

// Demo identity: the student logged in on this browser
export const CURRENT_STUDENT = { roll: 'J65', name: 'T Darshini Deetya' };

export const ASSIGNMENTS = [
  { id: 'aiml', course: 'AIML', topic: 'Neural Networks and Backpropagation', title: 'Neural Networks and Backpropagation', due: '2026-10-15T23:59:00' },
  { id: 'os', course: 'OS', topic: 'Process Scheduling Algorithms', title: 'Process Scheduling Algorithms', due: '2026-10-17T23:59:00' },
  { id: 'aca', course: 'Advanced Computer Algorithms', topic: 'Dynamic Programming Problem Set', title: 'Dynamic Programming Problem Set', due: '2026-10-19T23:59:00' },
  { id: 'lab-aiml', course: 'Labs for AIML', topic: 'Lab 3: CNN Model Implementation', title: 'Lab 3: CNN Model Implementation', due: '2026-10-22T23:59:00' },
  { id: 'lab-os', course: 'Labs for OS', topic: 'Lab 2: Memory Management Simulation', title: 'Lab 2: Memory Management Simulation', due: '2026-10-24T23:59:00' },
];
// Metadata lives in localStorage; the actual file bytes live in IndexedDB
const KEY = 'learnx:v1';
const EMPTY = { submissions: [], quizAttempts: [], materials: [], mastered: [] };
let cache = null;

const load = () => {
  if (cache) return cache;
  try {
    cache = { ...EMPTY, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
  } catch {
    cache = { ...EMPTY };
  }
  return cache;
};

const emit = () => window.dispatchEvent(new Event('learnx:change'));

const save = (patch) => {
  cache = { ...load(), ...patch };
  localStorage.setItem(KEY, JSON.stringify(cache));
  emit();
};

if (typeof window !== 'undefined') {
  // Another tab changed the data: drop the cache and re-read
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      cache = null;
      emit();
    }
  });
}

const subscribe = (cb) => {
  window.addEventListener('learnx:change', cb);
  return () => window.removeEventListener('learnx:change', cb);
};

export const uselxstore = () => useSyncExternalStore(subscribe, load, load);

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

// ---------- IndexedDB for file bytes ----------
const DB_NAME = 'learnx-files';

const openDb = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore('files');
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const runTx = async (mode, action) => {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('files', mode);
    const req = action(tx.objectStore('files'));
    tx.oncomplete = () => {
      db.close();
      resolve(req?.result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
};

const putFile = (id, blob) => runTx('readwrite', (s) => s.put(blob, id));
const getFile = (id) => runTx('readonly', (s) => s.get(id));
const removeFile = (id) => runTx('readwrite', (s) => s.delete(id));

export const downloadFile = async (fileId, fileName) => {
  const blob = await getFile(fileId);
  if (!blob) throw new Error('File not found on this device');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
};

export const openFile = async (fileId) => {
  const blob = await getFile(fileId);
  if (!blob) throw new Error('File not found on this device');
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener');
  setTimeout(() => URL.revokeObjectURL(url), 60000);
};

// ---------- Actions ----------
export const submitAssignment = async (assignmentId, file) => {
  const fileId = uid();
  await putFile(fileId, file);

  // Read state after the await so concurrent writes are not lost
  const { submissions } = load();
  const prev = submissions.find(
    (s) => s.roll === CURRENT_STUDENT.roll && s.assignmentId === assignmentId
  );
  if (prev) await removeFile(prev.fileId);

  const record = {
    id: uid(),
    roll: CURRENT_STUDENT.roll,
    name: CURRENT_STUDENT.name,
    assignmentId,
    fileId,
    fileName: file.name,
    size: file.size,
    submittedAt: new Date().toISOString(),
    version: (prev?.version ?? 0) + 1,
  };
  save({ submissions: [...load().submissions.filter((s) => s !== prev), record] });
};

export const deleteSubmission = async (id) => {
  const { submissions } = load();
  const target = submissions.find((s) => s.id === id);
  if (target) await removeFile(target.fileId);
  save({ submissions: load().submissions.filter((s) => s.id !== id) });
};

export const recordQuizAttempt = (attempt) => {
  save({
    quizAttempts: [
      ...load().quizAttempts,
      {
        id: uid(),
        roll: CURRENT_STUDENT.roll,
        name: CURRENT_STUDENT.name,
        takenAt: new Date().toISOString(),
        ...attempt,
      },
    ],
  });
};

// Called by faculty Upload Center
export const addMaterial = async (file, meta) => {
  const fileId = uid();
  await putFile(fileId, file);
  const record = { id: uid(), fileId, fileName: file.name, size: file.size, ...meta };
  save({ materials: [record, ...load().materials] });
  return record;
};

export const toggleMastered = (cardId) => {
  const { mastered } = load();
  save({
    mastered: mastered.includes(cardId)
      ? mastered.filter((id) => id !== cardId)
      : [...mastered, cardId],
  });
};
// Attendance: minimum percentage required and per-subject counts
export const TARGET = 75;

export const SUBJECTS = [
  { name: 'AIML', attended: 34, total: 40, room: 'LH-2' },
  { name: 'OS', attended: 29, total: 38, room: 'LH-4' },
  { name: 'Advanced Computer Algorithms', attended: 27, total: 36, room: 'LH-1' },
  { name: 'Labs for AIML', attended: 21, total: 30, room: 'Lab-3' },
  { name: 'Labs for OS', attended: 18, total: 26, room: 'Lab-2' },
];