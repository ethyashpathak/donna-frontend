const BASE = process.env.VITE_BACKEND_API || "http://localhost:3000";

export const getGmailMessages = () =>
  fetch(`${BASE}/gmail/messages`).then((r) => {
    if (!r.ok) throw new Error(`Gmail check failed: ${r.status}`);
    return r.json();
  });

export const analyzeGmail = () =>
  fetch(`${BASE}/gmail/analyze`, { method: 'POST' }).then((r) => {
    if (!r.ok) throw new Error(`Analysis failed: ${r.status}`);
    return r.json();
  });

export const analyzeMessages = (messages) =>
  fetch(`${BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  }).then((r) => {
    if (!r.ok) throw new Error(`Analysis failed: ${r.status}`);
    return r.json();
  });

export const AUTH_URL = `${BASE}/auth/google`;
