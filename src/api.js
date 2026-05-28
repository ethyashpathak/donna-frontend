const BASE = import.meta.env.VITE_BACKEND_API;

const getToken = () => localStorage.getItem('donna_token');

const authHeaders = () => ({
  'Authorization': `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

export const getGmailMessages = () =>
  fetch(`${BASE}/gmail/messages`, { headers: authHeaders() }).then((r) => {
    if (!r.ok) throw new Error(`Gmail check failed: ${r.status}`);
    return r.json();
  });

export const analyzeGmail = () =>
  fetch(`${BASE}/gmail/analyze`, {
    method: 'POST',
    headers: authHeaders(),
  }).then((r) => {
    if (!r.ok) throw new Error(`Analysis failed: ${r.status}`);
    return r.json();
  });

export const analyzeMessages = (messages) =>
  fetch(`${BASE}/analyze`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ messages }),
  }).then((r) => {
    if (!r.ok) throw new Error(`Analysis failed: ${r.status}`);
    return r.json();
  });

export const checkSession = () =>
  fetch(`${BASE}/auth/me`, { headers: authHeaders() }).then((r) => {
    if (!r.ok) throw new Error(`Session check failed: ${r.status}`);
    return r.json();
  });

export const logout = () =>
  fetch(`${BASE}/auth/logout`, {
    method: 'POST',
    headers: authHeaders(),
  }).then((r) => {
    if (!r.ok) throw new Error(`Logout failed: ${r.status}`);
    return r.json();
  });

export const saveToken = (token) => localStorage.setItem('donna_token', token);
export const clearToken = () => localStorage.removeItem('donna_token');
export const hasToken = () => !!localStorage.getItem('donna_token');

export const AUTH_URL = `${BASE}/auth/google`;