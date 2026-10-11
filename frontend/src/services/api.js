// Backend base URL. Set VITE_API_URL in a .env file to change it.
export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';

// Turns a non-2xx response into an Error using the backend's "message" field
const parse = async (res) => {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.message || message;
    } catch {
      // Body was not JSON; keep the default message
    }
    throw new Error(message);
  }
  return res.status === 204 ? null : res.json();
};

export const api = {
  get: (path) => fetch(`${BASE_URL}${path}`).then(parse),

  post: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(parse),

  put: (path, body) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(parse),

  // For multipart uploads. Do not set Content-Type; the browser adds the boundary.
  form: (path, formData) =>
    fetch(`${BASE_URL}${path}`, { method: 'POST', body: formData }).then(parse),

  del: (path) => fetch(`${BASE_URL}${path}`, { method: 'DELETE' }).then(parse),
};

export const fileUrl = (path) => `${BASE_URL}${path}`;

export default api;