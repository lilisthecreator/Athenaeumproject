import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

// Demo fallbacks
const DEMO_USER = { id: 'demo-user', email: 'fellyciaalavira@gmail.com', name: 'Fellycia Alavira' };

export async function loginUser({ email, password }) {
  if (email === DEMO_USER.email && password === 'AKTIBET2025') {
    return { token: 'demo-token', user: DEMO_USER };
  }
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function registerUser({ email, password }) {
  const { data } = await api.post('/auth/register', { email, password });
  return data;
}

export async function getRecentBooks() {
  try {
    const { data } = await api.get('/books/recent');
    return data;
  } catch (_) {
    return [];
  }
}

export async function searchBooks(q) {
  try {
    const { data } = await api.get('/books/search', { params: { q } });
    return data;
  } catch (_) {
    return [];
  }
}

export async function getBookByIsbn(isbn) {
  try {
    const { data } = await api.get(`/books/${encodeURIComponent(isbn)}`);
    return data;
  } catch (_) {
    return { isbn, title: 'Unknown', author: '-', genre: '-', location: '-' };
  }
}

export async function borrowBook(isbn) {
  try {
    const { data } = await api.post(`/borrow/${encodeURIComponent(isbn)}`);
    return data;
  } catch (_) {
    return { ok: true };
  }
}

export async function getBorrows(email) {
  try {
    const { data } = await api.get('/borrows', { params: { email } });
    return data;
  } catch (_) {
    return [];
  }
}


