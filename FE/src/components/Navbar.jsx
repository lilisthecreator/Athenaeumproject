import { Link, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authState } from '../state/auth';

export default function Navbar() {
  const [auth, setAuth] = useRecoilState(authState);
  const { pathname } = useLocation();
  // Hide navbar on auth pages
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) return null;
  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/dashboard" className="font-semibold">Athenaeum</Link>
        {auth?.user ? (
          <div className="flex items-center gap-4 text-sm">
            <Link className="hover:underline" to="/dashboard">Dashboard</Link>
            <Link className="hover:underline" to="/books">Books</Link>
            <Link className="hover:underline" to="/profile">Profile</Link>
            <button className="text-red-600" onClick={() => setAuth(null)}>Logout</button>
          </div>
        ) : (
          <div className="flex items-center gap-4 text-sm">
            <Link className="hover:underline" to="/login">Login</Link>
            <Link className="hover:underline" to="/signup">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}


