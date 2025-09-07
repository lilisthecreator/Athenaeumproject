import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authState } from '../state/auth';

export default function Login() {
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
    // Mock login: accept any credentials, create client-side session
    setTimeout(() => {
      setAuth({ token: 'mock-token', user: { id: 'mock-user', email, name: email.split('@')[0] || 'User' } });
      navigate('/dashboard');
    }, 400);
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm card p-6">
        <h1 className="text-xl font-semibold mb-4">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Masuk untuk melanjutkan peminjaman buku.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="w-full border border-white/60 rounded-md px-3 py-2 bg-white" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="w-full border border-white/60 rounded-md px-3 py-2 bg-white" placeholder="••••••••" />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button type="submit" disabled={loading} className="w-full rounded-md py-2 bg-rose-500 text-white disabled:opacity-50">{loading ? 'Memproses...' : 'Masuk'}</button>
        </form>
        <div className="mt-4 text-sm">
          Belum punya akun? <Link to="/signup" className="text-rose-600">Daftar</Link>
        </div>
      </div>
    </div>
  );
}


