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

  fastify.get('/books/recent', async () => {
    const list = (books && typeof books.values === 'function') ? Array.from(books.values()) : [];
    return list.slice(0, 10);
  });

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
    const base = (books && typeof books.get === 'function') ? books.get(isbn) : undefined;
    let enriched = base ? { ...base } : { isbn };
    try {
      const { fetch } = await import('undici');
      const url = new URL('https://www.googleapis.com/books/v1/volumes');
      url.searchParams.set('q', `isbn:${isbn}`);
      if (process.env.GOOGLE_BOOKS_API_KEY) url.searchParams.set('key', process.env.GOOGLE_BOOKS_API_KEY);
      const res = await fetch(url);
      const json = await res.json();
      const item = json?.items?.[0];
      const info = item?.volumeInfo || {};
      enriched.title = enriched.title || info.title;
      enriched.author = enriched.author || (Array.isArray(info.authors) ? info.authors.join(', ') : undefined);
      enriched.description = enriched.description || info.description || '';
      const thumb = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail;
      enriched.cover = enriched.cover || (thumb ? String(thumb).replace('http://', 'https://') : undefined);
      enriched.genre = enriched.genre || (Array.isArray(info.categories) ? info.categories[0] : undefined);
    } catch (e) {
      // ignore network errors, just return base
    }
    // If still missing, and ISBN-13 has 978/979 prefix, try ISBN-10
    if (!enriched.title && /^97[89]\d{10}$/.test(isbn)) {
      try {
        const isbn10core = isbn.slice(3, 12);
        const digits = isbn10core.split('').map(Number);
        const sum = digits.reduce((acc, d, i) => acc + d * (10 - i), 0);
        const check = (11 - (sum % 11)) % 11;
        const checkChar = check === 10 ? 'X' : String(check);
        const isbn10 = isbn10core + checkChar;
        const { fetch } = await import('undici');
        const url2 = new URL('https://www.googleapis.com/books/v1/volumes');
        url2.searchParams.set('q', `isbn:${isbn10}`);
        if (process.env.GOOGLE_BOOKS_API_KEY) url2.searchParams.set('key', process.env.GOOGLE_BOOKS_API_KEY);
        const res2 = await fetch(url2);
        const json2 = await res2.json();
        const item2 = json2?.items?.[0];
        const info2 = item2?.volumeInfo || {};
        enriched.title = info2.title || enriched.title;
        enriched.author = enriched.author || (Array.isArray(info2.authors) ? info2.authors.join(', ') : undefined);
        enriched.description = enriched.description || info2.description || '';
        const thumb2 = info2.imageLinks?.thumbnail || info2.imageLinks?.smallThumbnail;
        enriched.cover = enriched.cover || (thumb2 ? String(thumb2).replace('http://', 'https://') : undefined);
        enriched.genre = enriched.genre || (Array.isArray(info2.categories) ? info2.categories[0] : undefined);
      } catch (_) {}
    }
    // Final fallback: try a generic Google Books search with the scanned code (not guaranteed ISBN)
    if (!enriched.title) {
      try {
        const { fetch } = await import('undici');
        const url3 = new URL('https://www.googleapis.com/books/v1/volumes');
        url3.searchParams.set('q', isbn);
        if (process.env.GOOGLE_BOOKS_API_KEY) url3.searchParams.set('key', process.env.GOOGLE_BOOKS_API_KEY);
        const res3 = await fetch(url3);
        const json3 = await res3.json();
        const item3 = json3?.items?.[0];
        const info3 = item3?.volumeInfo || {};
        enriched.title = info3.title || enriched.title;
        enriched.author = enriched.author || (Array.isArray(info3.authors) ? info3.authors.join(', ') : undefined);
        enriched.description = enriched.description || info3.description || '';
        const thumb3 = info3.imageLinks?.thumbnail || info3.imageLinks?.smallThumbnail;
        enriched.cover = enriched.cover || (thumb3 ? String(thumb3).replace('http://', 'https://') : undefined);
        enriched.genre = enriched.genre || (Array.isArray(info3.categories) ? info3.categories[0] : undefined);
      } catch (_) {}
    }
    // Fallback: try OpenLibrary if Google Books didn't return data
    if (!enriched.title) {
      try {
        const { fetch } = await import('undici');
        const res = await fetch(`https://openlibrary.org/isbn/${isbn}.json`);
        if (res.ok) {
          const data = await res.json();
          enriched.title = data.title || enriched.title;
          if (!enriched.description) {
            const desc = typeof data.description === 'string' ? data.description : data.description?.value;
            enriched.description = desc;
          }
          if (!enriched.cover && Array.isArray(data.covers) && data.covers.length) {
            enriched.cover = `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg`;
          }
        }
      } catch (_) {}
    }
    // Normalize response fields
    const payload = {
      isbn,
      title: enriched.title || '',
      author: enriched.author || '',
      description: enriched.description || '',
      cover: enriched.cover || '',
      genre: enriched.genre || '',
      location: enriched.location || '',
    };
    // If we still have nothing useful, return 404 to let FE show message
    if (!payload.title && !payload.cover && !payload.description) {
      return reply.code(404).send({ message: 'Book not found for provided code' });
    }
    return payload;
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


