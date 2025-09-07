import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, User } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { isAuthedSelector } from '../state/auth';

export default function BottomNav() {
  const isAuthed = useRecoilValue(isAuthedSelector);
  const { pathname } = useLocation();
  if (!isAuthed) return null;
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) return null;

  const active = (p) => pathname === p;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="max-w-5xl mx-auto grid grid-cols-3 text-xs">
        <Link to="/dashboard" className={`flex flex-col items-center p-2 ${active('/dashboard') ? 'text-blue-600' : 'text-gray-700'}`}>
          <Home size={22} />
          <span>Dashboard</span>
        </Link>
        <Link to="/books" className={`flex flex-col items-center p-2 ${active('/books') ? 'text-blue-600' : 'text-gray-700'}`}>
          <BookOpen size={22} />
          <span>Books</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center p-2 ${active('/profile') ? 'text-blue-600' : 'text-gray-700'}`}>
          <User size={22} />
          <span>Profile</span>
        </Link>
      </div>
    </div>
  );
}


