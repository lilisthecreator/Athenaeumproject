import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authState } from '../state/auth';
import { loginUser } from '../api/client';

export default function LoginPage() {
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginUser({ email, password });
      setAuth(data);
      navigate('/');
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6">Masuk</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full border rounded-md px-3 py-2" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full border rounded-md px-3 py-2" placeholder="••••••••" />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-md py-2 disabled:opacity-50">{loading ? 'Memproses...' : 'Masuk'}</button>
        </form>
        <div className="mt-4 text-sm">
          Belum punya akun? <Link to="/register" className="text-blue-600">Daftar</Link>
        </div>
      </div>
    </div>
  );
}


