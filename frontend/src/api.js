// Thin API client wrapping fetch. The base URL is injected at build time
// via REACT_APP_API_URL so the same code works locally and on EC2.
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

async function handle(res) {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.error) message = body.error;
    } catch (_) {
      // response had no JSON body
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  list: () => fetch(`${BASE_URL}/tasks`).then(handle),

  create: (task) =>
    fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    }).then(handle),

  update: (id, task) =>
    fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    }).then(handle),

  remove: (id) =>
    fetch(`${BASE_URL}/tasks/${id}`, { method: 'DELETE' }).then(handle),
};
