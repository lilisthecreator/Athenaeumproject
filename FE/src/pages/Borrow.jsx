import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Scanner from '../components/Scanner';

export default function Borrow() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [manual, setManual] = useState('');
  const onDetected = useCallback((text) => {
    const raw = String(text || '');
    const digits = raw.replace(/\D/g, '');
    if (/^97[89]\d{10}$/.test(digits)) {
      navigate(`/books/${digits}`);
    } else {
      setError('Kode yang dipindai bukan ISBN-13 (978/979). Coba lagi atau masukkan manual.');
    }
  }, [navigate]);

  return (
    <div className="space-y-6 pt-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Scanner onDetected={onDetected} onError={(e)=>setError(e.message)} />
      <p className="text-sm text-gray-600">Arahkan kamera ke barcode ISBN.</p>
      <div className="card p-4 space-y-2">
        <div className="text-sm font-medium">Masukkan ISBN Manual</div>
        <form onSubmit={(e)=>{e.preventDefault(); const n = (manual||'').replace(/\D/g,''); if(/^97[89]\d{10}$/.test(n)){ navigate(`/books/${n}`);} else { setError('Masukkan ISBN-13 yang diawali 978/979'); } }} className="flex gap-2">
          <input onChange={(e)=>setManual(e.target.value)} className="flex-1 border border-white/60 rounded-md px-3 py-2 bg-white" placeholder="Contoh: 9781234567890" />
          <button className="px-3 py-2 rounded-md bg-rose-500 text-white">Go</button>
        </form>
      </div>
    </div>
  );
}


