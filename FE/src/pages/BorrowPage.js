import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { bookByIsbnState } from '../state/books';
import { borrowBook } from '../api/client';

export default function BorrowPage() {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const bookMap = useRecoilValue(bookByIsbnState);
  const book = bookMap[isbn];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleBorrow() {
    setLoading(true);
    setError('');
    try {
      await borrowBook(isbn);
      setSuccess(true);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Gagal meminjam buku');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pinjam Buku</h1>
        <button onClick={() => navigate(-1)} className="text-sm text-gray-600 hover:underline">Kembali</button>
      </div>
      {book && (
        <div className="bg-white rounded-lg border p-4 space-y-2">
          <div className="text-sm text-gray-500">ISBN: {book.isbn}</div>
          <div className="text-lg font-medium">{book.title}</div>
        </div>
      )}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success ? (
        <div className="text-green-700 text-sm">Berhasil meminjam buku.</div>
      ) : (
        <button onClick={handleBorrow} disabled={loading} className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm disabled:opacity-50">
          {loading ? 'Memproses...' : 'Konfirmasi Pinjam'}
        </button>
      )}
    </div>
  );
}


