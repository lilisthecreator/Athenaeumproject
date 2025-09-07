import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecentBooks } from '../api/client';

export default function Dashboard() {
  const [recent, setRecent] = useState([]);
  useEffect(() => { (async () => setRecent(await getRecentBooks()))(); }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <Link to="/borrow" className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm">Scan to Borrow</Link>
      <div>
        <h2 className="font-semibold mb-2">Recently Added</h2>
        <ul className="divide-y bg-white rounded-md border">
          {recent.map((b) => (
            <li key={b.isbn} className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{b.title}</div>
                <div className="text-sm text-gray-600">{b.author} • {b.genre} • {b.location}</div>
              </div>
              <Link to={`/books/${b.isbn}`} className="text-sm text-blue-600">Detail</Link>
            </li>
          ))}
          {recent.length === 0 && <li className="p-3 text-sm text-gray-600">Belum ada</li>}
        </ul>
      </div>
    </div>
  );
}


