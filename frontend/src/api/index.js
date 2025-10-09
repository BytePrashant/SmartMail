// Thin API client that centralizes base URL and headers (X-User-ID)
const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(path, { method = 'GET', body, userId, headers = {}, signal } = {}) {
  const opts = {
    method,
    headers: { ...headers },
    body,
    signal,
  };

  if (userId) {
    opts.headers['X-User-ID'] = userId;
  }

  const res = await fetch(`${API_URL}${path}`, opts);

  // Try to parse JSON where possible
  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore JSON parse errors for non-JSON responses
  }

  if (!res.ok) {
    const message = (data && (data.detail || data.message)) || res.statusText || 'Request failed';
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export default apiFetch;
