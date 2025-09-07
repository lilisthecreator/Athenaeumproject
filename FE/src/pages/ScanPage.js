import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import Scanner from '../components/Scanner';
import { scannedIsbnState } from '../state/books';

export default function ScanPage() {
  const navigate = useNavigate();
  const setIsbn = useSetRecoilState(scannedIsbnState);
  const [error, setError] = useState('');

  const handleDetected = useCallback((text) => {
    const normalized = text.replace(/[^0-9Xx]/g, '');
    if (!normalized) return;
    setIsbn(normalized);
    navigate(`/book/${normalized}`);
  }, [navigate, setIsbn]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Scan Buku (ISBN / EAN-13)</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Scanner onDetected={handleDetected} onError={(e) => setError(e.message)} />
      <p className="text-sm text-gray-600">Arahkan kamera ke barcode di belakang buku.</p>
    </div>
  );
}


