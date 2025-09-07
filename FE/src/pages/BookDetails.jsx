import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookByIsbn } from '../api/client';

export default function BookDetails() {
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getBookByIsbn(isbn);
        if (mounted) setBook(data);
      } catch (e) {
        if (mounted) setError(e?.response?.data?.message || e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isbn]);

  if (loading) return <div className="p-4 text-sm text-gray-600">Memuat...</div>;
  if (error) return <div className="p-4 text-sm text-red-600">{error}</div>;
  if (!book) return <div className="p-4 text-sm">Tidak ditemukan.</div>;

  return (
    <div className="space-y-6 pt-4">
      <div className="card p-4 flex gap-4">
        {book.cover ? (
          <img src={book.cover} alt={book.title} className="w-28 h-40 rounded-md object-cover" />
        ) : (
          <div className="w-28 h-40 rounded-md bg-sand-100" />
        )}
        <div className="flex-1">
          <div className="text-lg font-semibold leading-snug">{book.title}</div>
          <div className="text-sm text-gray-600">{book.author}</div>
          <div className="text-xs text-gray-500 mt-1">ISBN: {book.isbn}</div>
          {book.location && <div className="text-xs text-gray-500 mt-1">Lokasi: {book.location}</div>}
        </div>
      </div>
      {book.description && (
        <div className="card p-4">
          <div className="font-semibold mb-2">Deskripsi</div>
          <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: book.description }} />
        </div>
      )}
    </div>
  );
}


