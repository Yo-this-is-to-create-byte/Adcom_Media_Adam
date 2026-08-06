// Central API helper for Adcom Media
const API_BASE = process.env.REACT_APP_BACKEND_URL;

export const API_URL = `${API_BASE}/api`;

export async function apiGet(path, opts = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'GET',
    credentials: 'include',
    ...opts,
  });
  if (!res.ok) throw new Error((await res.text()) || `GET ${path} failed`);
  return res.json();
}

export async function apiPost(path, body, opts = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    ...opts,
  });
  if (!res.ok) {
    let msg = `POST ${path} failed`;
    try { const j = await res.json(); msg = j.detail || msg; } catch (_) { /* ignore */ }
    throw new Error(msg);
  }
  return res.json();
}

export async function apiPatch(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.text()) || `PATCH ${path} failed`);
  return res.json();
}

export async function apiDelete(path) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error((await res.text()) || `DELETE ${path} failed`);
  return res.json();
}

// Stream Server-Sent Events from POST /adam/chat
export async function* streamChat(body, signal) {
  const res = await fetch(`${API_URL}/adam/chat`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok || !res.body) {
    const t = await res.text().catch(() => '');
    throw new Error(t || 'chat stream failed');
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    // SSE frames end with a blank line
    const frames = buffer.split(/\n\n/);
    buffer = frames.pop(); // last partial frame stays in buffer
    for (const frame of frames) {
      const lines = frame.split('\n');
      let event = 'message';
      const dataLines = [];
      for (const line of lines) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) dataLines.push(line.slice(5).replace(/^ /, ''));
      }
      const data = dataLines.join('\n');
      if (event === 'done') return;
      if (event === 'error') throw new Error(data || 'stream error');
      if (data) yield data;
    }
  }
}
