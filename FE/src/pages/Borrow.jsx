import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanner from '../components/Scanner';

export default function Borrow() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const onDetected = useCallback((text) => {
    const isbn = text.replace(/[^0-9Xx]/g, '');
    if (!isbn) return;
    navigate(`/books/${isbn}`);
  }, [navigate]);

  return (
    <div className="space-y-6 pt-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Scanner onDetected={onDetected} onError={(e)=>setError(e.message)} />
      <p className="text-sm text-gray-600">Arahkan kamera ke barcode ISBN.</p>
    </div>
  );
}


