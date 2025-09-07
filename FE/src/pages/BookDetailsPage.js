import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { bookByIsbnState } from '../state/books';
import { getBookByIsbn } from '../api/client';

export default function BookDetailsPage() {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const [bookMap, setBookMap] = useRecoilState(bookByIsbnState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      if (!isbn) return;
      if (bookMap[isbn]) return;
      setLoading(true);
      setError('');
      try {
        const data = await getBookByIsbn(isbn);
        if (!mounted) return;
        setBookMap((prev) => ({ ...prev, [isbn]: data }));
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e.message || 'Gagal mengambil data buku');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, [isbn, bookMap, setBookMap]);

  const book = bookMap[isbn];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Detail Buku</h1>
        <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:underline">Kembali</button>
      </div>
      {loading && <div>Memuat...</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {book && (
        <div className="bg-white rounded-lg border p-4 space-y-2">
          <div className="text-sm text-gray-500">ISBN: {book.isbn}</div>
          <div className="text-lg font-medium">{book.title}</div>
          <div className="text-sm">Penulis: {book.author || '-'}</div>
          <div className="text-sm">Genre: {book.genre || '-'}</div>
          <div className="text-sm">Lokasi: {book.location || '-'}</div>
          <div>
            <Link to={`/borrow/${isbn}`} className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">Pinjam</Link>
          </div>
        </div>
      )}
      {!loading && !book && !error && (
        <div className="text-sm text-gray-700">Buku tidak ditemukan.</div>
      )}
    </div>
  );
}


