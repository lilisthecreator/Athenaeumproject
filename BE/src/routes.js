const { nanoid } = require('nanoid');
const { users, books, borrows } = require('./db');

async function routes(fastify) {
  fastify.post('/auth/register', async (req, reply) => {
    const { email, password } = req.body || {};
    if (!email || !password) return reply.code(400).send({ message: 'Email and password required' });
    if (users.has(email)) return reply.code(409).send({ message: 'Email already registered' });
    const user = { id: nanoid(), email, passwordHash: password, name: email.split('@')[0] };
    users.set(email, user);
    const token = fastify.jwt.sign({ sub: user.id, email });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  });

  fastify.post('/auth/login', async (req, reply) => {
    const { email, password } = req.body || {};
    const user = users.get(email);
    if (!user || user.passwordHash !== password) return reply.code(401).send({ message: 'Invalid credentials' });
    const token = fastify.jwt.sign({ sub: user.id, email });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  });

  fastify.get('/books/recent', async () => Array.from(books.values()).slice(0, 10));

  fastify.get('/books/search', async (req) => {
    const q = String(req.query?.q || '').toLowerCase();
    if (!q) return Array.from(books.values());
    return Array.from(books.values()).filter((b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.includes(q)
    );
  });

  fastify.get('/books/:isbn', async (req, reply) => {
    const isbn = req.params.isbn;
    const base = books.get(isbn);
    let enriched = base ? { ...base } : { isbn };
    try {
      const { fetch } = await import('undici');
      const url = new URL('https://www.googleapis.com/books/v1/volumes');
      url.searchParams.set('q', `isbn:${isbn}`);
      const res = await fetch(url);
      const json = await res.json();
      const item = json?.items?.[0];
      const info = item?.volumeInfo || {};
      enriched.title = enriched.title || info.title;
      enriched.author = enriched.author || (Array.isArray(info.authors) ? info.authors.join(', ') : undefined);
      enriched.description = info.description;
      enriched.cover = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail;
      enriched.genre = enriched.genre || (Array.isArray(info.categories) ? info.categories[0] : undefined);
    } catch (e) {
      // ignore network errors, just return base
    }
    if (!enriched.title) return reply.code(404).send({ message: 'Not found' });
    return enriched;
  });

  fastify.get('/borrows', async (req) => {
    const email = req.query?.email;
    const list = email ? borrows.filter((x) => x.email === email) : borrows;
    return list;
  });

  fastify.post('/borrow/:isbn', async (req, reply) => {
    const b = books.get(req.params.isbn);
    if (!b) return reply.code(404).send({ message: 'Not found' });
    const email = req.body?.email || req.query?.email || 'unknown@example.com';
    const status = borrows.some((x) => x.status === 'ready') ? 'waitlisted' : 'waiting';
    const record = { id: nanoid(), isbn: b.isbn, email, status };
    borrows.push(record);
    return record;
  });
}

module.exports = routes;


