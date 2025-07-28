import axios from 'axios';

/**
 * Axios instance configured with credentials.  The proxy in package.json
 * ensures that relative API calls in development are forwarded to the
 * backend server running on port 4000.
 */
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export async function getSkills() {
  const res = await apiClient.get('/skills');
  return res.data;
}

export async function getUserProgress(userId) {
  const res = await apiClient.get(`/users/${userId}/progress`);
  return res.data;
}

export async function updateUserProgress(userId, updates) {
  const res = await apiClient.post(`/users/${userId}/progress`, updates);
  return res.data;
}

export async function getCurrentUser() {
  const res = await apiClient.get('/auth/me');
  return res.data;
}

export async function loginWithProvider(provider) {
  // Redirect the browser to the OAuth provider’s login page.  The backend
  // will handle the callback and set a session cookie.
  window.location.href = `/api/auth/${provider}`;
}

export async function logout() {
  await apiClient.post('/auth/logout');
}