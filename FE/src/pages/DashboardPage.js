import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRecentBooks, searchBooks } from '../api/client';

export default function DashboardPage() {
  const [recent, setRecent] = useState([]);
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function fetchRecent() {
      try {
        const data = await getRecentBooks();
        if (mounted) setRecent(data || []);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e.message);
      }
    }
    fetchRecent();
    return () => { mounted = false; };
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await searchBooks(q);
      setResults(data || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Pencarian gagal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button onClick={() => navigate('/')} className="text-sm bg-blue-600 text-white px-3 py-2 rounded-md">Scan untuk Pinjam</button>
      </div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Cari judul/penulis/ISBN" className="flex-1 border rounded-md px-3 py-2" />
        <button className="px-3 py-2 bg-gray-900 text-white rounded-md">Cari</button>
      </form>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div>
        <h2 className="font-semibold mb-2">Hasil Pencarian</h2>
        <ul className="divide-y bg-white rounded-md border">
          {loading && <li className="p-3 text-sm text-gray-600">Memuat...</li>}
          {!loading && results.map((b) => (
            <li key={b.isbn} className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{b.title}</div>
                <div className="text-sm text-gray-600">{b.author} • {b.genre} • {b.location}</div>
              </div>
              <Link to={`/book/${b.isbn}`} className="text-sm text-blue-600">Detail</Link>
            </li>
          ))}
          {!loading && results.length === 0 && q && <li className="p-3 text-sm text-gray-600">Tidak ada hasil</li>}
        </ul>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Baru Ditambahkan</h2>
        <ul className="divide-y bg-white rounded-md border">
          {recent.map((b) => (
            <li key={b.isbn} className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{b.title}</div>
                <div className="text-sm text-gray-600">{b.author} • {b.genre} • {b.location}</div>
              </div>
              <Link to={`/book/${b.isbn}`} className="text-sm text-blue-600">Detail</Link>
            </li>
          ))}
          {recent.length === 0 && <li className="p-3 text-sm text-gray-600">Belum ada</li>}
        </ul>
      </div>
    </div>
  );
}


