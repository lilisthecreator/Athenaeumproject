import { useState } from 'react';
import { Link } from 'react-router-dom';
import { searchBooks } from '../api/client';

export default function Books() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    const data = await searchBooks(q);
    setResults(data || []);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Books</h1>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Cari judul/penulis/ISBN" className="flex-1 border rounded-md px-3 py-2" />
        <button className="px-3 py-2 bg-gray-900 text-white rounded-md">Cari</button>
      </form>
      <ul className="divide-y bg-white rounded-md border">
        {loading && <li className="p-3 text-sm text-gray-600">Memuat...</li>}
        {!loading && results.map((b) => (
          <li key={b.isbn} className="p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{b.title}</div>
              <div className="text-sm text-gray-600">{b.author} • {b.genre} • {b.location}</div>
            </div>
            <Link to={`/books/${b.isbn}`} className="text-sm text-blue-600">Detail</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


