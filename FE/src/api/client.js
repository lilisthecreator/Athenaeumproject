import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
});

export async function getBookByIsbn(isbn) {
  // Placeholder: expects BE to expose /books/:isbn returning { isbn, title, author, location, genre }
  const { data } = await api.get(`/books/${encodeURIComponent(isbn)}`);
  return data;
}

export async function borrowBook(isbn) {
  const { data } = await api.post(`/borrow/${encodeURIComponent(isbn)}`);
  return data;
}


