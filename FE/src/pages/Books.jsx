import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../state/auth';
import { getBorrows } from '../api/client';

export default function Books() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const auth = useRecoilValue(authState);
  const [list, setList] = useState([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await getBorrows(auth?.user?.email);
      if (mounted) setList(data || []);
    })();
    return () => { mounted = false; };
  }, [auth?.user?.email]);

  const [tab, setTab] = useState('all'); // all | waiting | waitlisted | ready

  const filtered = useMemo(() => {
    if (tab === 'all') return list;
    return list.filter((b) => b.status === tab);
  }, [tab, list]);

  const statusMeta = {
    waiting: { label: 'Waiting for approval', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    waitlisted: { label: 'Waitlisted', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    ready: { label: 'Ready for pick up', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  };

  return (
    <div className="space-y-6 pt-4">
      <h2 className="font-semibold">Borrow Status</h2>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: 'All' },
          { key: 'waiting', label: 'Waiting' },
          { key: 'waitlisted', label: 'Waitlisted' },
          { key: 'ready', label: 'Ready' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1 rounded-full whitespace-nowrap border ${
              tab === t.key ? 'bg-white text-rose-500 border-rose-200 shadow-soft' : 'bg-white/80 border-white/60'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <ul className="space-y-3">
        {filtered.map((b) => (
          <li key={b.isbn} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-16 rounded-lg bg-sand-100" />
              <div>
                <div className="font-medium leading-snug">{b.title || b.isbn}</div>
                <div className="text-xs text-gray-500">{b.author || '-'}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-block px-2 py-1 rounded-full text-[11px] border ${statusMeta[b.status].color}`}>
                {statusMeta[b.status].label}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="text-xs text-gray-500">This list is mocked for UI.</div>
    </div>
  );
}


