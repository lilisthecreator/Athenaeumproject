const users = new Map(); // email -> { id, email, passwordHash, name }
const books = new Map(); // isbn -> { isbn, title, author, genre, location }
const borrows = []; // { id, isbn, email, status: 'waiting'|'waitlisted'|'ready' }

// seed demo books
[
  { isbn: '9780001', title: 'Her Radiant Curse', author: 'Elizabeth Lim', genre: 'Fantasy', location: 'Rack A-01' },
  { isbn: '9780002', title: 'Principessa', author: 'Garth Nix', genre: 'Fantasy', location: 'Rack A-02' },
  { isbn: '9780003', title: 'The Night Library', author: 'A. Writer', genre: 'Mystery', location: 'Rack B-10' },
].forEach((b) => books.set(b.isbn, b));

module.exports = {
  users,
  books,
  borrows,
};

module.exports={}