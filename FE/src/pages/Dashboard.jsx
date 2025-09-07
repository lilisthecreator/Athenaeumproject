import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecentBooks } from '../api/client';
import Header from '../components/Header';

export default function Dashboard() {
  const [recent, setRecent] = useState([]);
  useEffect(() => { (async () => setRecent(await getRecentBooks()))(); }, []);
  return (
    <div className="space-y-8 pt-2">
      <Header />
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
        {['All','eBooks','New','Fiction','Manga','Fantasy'].map((c, i)=> (
          <button key={c} className={`px-3 py-1 rounded-full bg-white text-[var(--text)] border border-white/60 whitespace-nowrap ${i===0 ? 'text-rose-500 border-rose-100' : ''}`}>{c}</button>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Popular</h2>
        <button className="pill text-sm">View All</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {recent.slice(0,2).map((b) => (
          <div key={b.isbn} className="card p-3">
            <Link to={`/books/${b.isbn}`} className="block">
              <div className="aspect-[3/4] w-full rounded-xl bg-sand-100 mb-3" />
            </Link>
            <div className="font-medium leading-snug line-clamp-2">{b.title}</div>
            <div className="text-xs text-gray-500">{b.author}</div>
          </div>
        ))}
        {recent.length === 0 && (
          <>
            <div className="card p-3"><div className="aspect-[3/4] w-full rounded-xl bg-sand-100 mb-3" /><div className="h-4 bg-sand-200 rounded w-3/4" /></div>
            <div className="card p-3"><div className="aspect-[3/4] w-full rounded-xl bg-sand-100 mb-3" /><div className="h-4 bg-sand-200 rounded w-2/3" /></div>
          </>
        )}
      </div>
      <Link to="/borrow" className="fixed right-4 bottom-24 w-14 h-14 rounded-full bg-rose-500 text-white shadow-soft flex items-center justify-center">Scan</Link>
    </div>
  );
}


