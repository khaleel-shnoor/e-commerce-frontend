import {
  clearAuth,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from './auth-storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE = `${API_URL}/api/v1`;

let refreshPromise = null;

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('No refresh token');

  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  });

  if (!res.ok) {
    clearAuth();
    throw new Error('Session expired');
  }

  const data = await res.json();
  setTokens(data);
  return data.access_token;
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.detail || data.message || 'Request failed';
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
  return data;
}

export async function apiRequest(path, options = {}) {
  const { auth = true, retry = true, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers || {});

  if (!headers.has('Content-Type') && fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });

  if (response.status === 401 && auth && retry) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    try {
      await refreshPromise;
      const newToken = getAccessToken();
      if (newToken) headers.set('Authorization', `Bearer ${newToken}`);
      response = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });
    } catch {
      throw new Error('Unauthorized');
    }
  }

  return parseResponse(response);
}

/** Multipart upload (e.g. profile avatar) — do not set Content-Type manually. */
export async function apiUpload(path, formData) {
  const headers = new Headers();
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    body: formData,
    headers,
  });

  if (response.status === 401) {
    await refreshAccessToken();
    const newToken = getAccessToken();
    if (newToken) headers.set('Authorization', `Bearer ${newToken}`);
    response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      body: formData,
      headers,
    });
  }

  return parseResponse(response);
}

export const authApi = {
  register: (body) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(body), auth: false }),
  login: (body) =>
    apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(body), auth: false }),
  me: () => apiRequest('/auth/me'),
  logout: (refresh_token) =>
    apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token }),
    }),
  forgotPassword: (email) =>
    apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: String(email).trim().toLowerCase() }),
      auth: false,
    }),
  resetPassword: (body) =>
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
      auth: false,
    }),
  verifyEmail: (token) =>
    apiRequest('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
      auth: false,
    }),
};

export const profileApi = {
  get: () => apiRequest('/users/me'),
  update: (body) =>
    apiRequest('/users/me', { method: 'PATCH', body: JSON.stringify(body) }),
  uploadAvatar: (file) => {
    const form = new FormData();
    form.append('file', file);
    return apiUpload('/users/me/avatar', form);
  },
};

export function getGoogleLoginUrl() {
  return `${API_BASE}/auth/google/login`;
}

export const adminApi = {
  listUsers: (params = {}) => {
    const q = new URLSearchParams();
    if (params.search) q.set('search', params.search);
    if (params.role) q.set('role', params.role);
    const query = q.toString();
    return apiRequest(`/admin/users${query ? `?${query}` : ''}`);
  },
  listSellers: (params = {}) => {
    const q = new URLSearchParams();
    if (params.search) q.set('search', params.search);
    if (params.status) q.set('status', params.status);
    const query = q.toString();
    return apiRequest(`/admin/sellers${query ? `?${query}` : ''}`);
  },
};

export { API_BASE, API_URL };
