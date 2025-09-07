import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete api.defaults.headers.common['Authorization'];
}

export async function getBookByIsbn(isbn) {
  // Placeholder: expects BE to expose /books/:isbn returning { isbn, title, author, location, genre }
  const { data } = await api.get(`/books/${encodeURIComponent(isbn)}`);
  return data;
}

export async function borrowBook(isbn) {
  const { data } = await api.post(`/borrow/${encodeURIComponent(isbn)}`);
  return data;
}

export async function registerUser({ email, password }) {
  const { data } = await api.post('/auth/register', { email, password });
  return data; // { token, user }
}

export async function loginUser({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password });
  return data; // { token, user }
}

export async function getRecentBooks() {
  const { data } = await api.get('/books/recent');
  return data; // Array<{ isbn, title, author, genre, location }>
}

export async function searchBooks(q) {
  const { data } = await api.get('/books/search', { params: { q } });
  return data; // Array<...>
}


