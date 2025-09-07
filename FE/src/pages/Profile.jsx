import { useRecoilState } from 'recoil';
import { authState } from '../state/auth';

export default function Profile() {
  const [auth, setAuth] = useRecoilState(authState);
  return (
    <div className="space-y-6 pt-4 px-4">
      {auth?.user ? (
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-600 font-semibold">
              {auth.user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="font-medium text-lg">{auth.user.name || '-'}</div>
              <div className="text-xs text-gray-500">{auth.user.email}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="pill text-sm">Borrowed</button>
            <button className="pill text-sm">History</button>
          </div>
          <button onClick={() => setAuth(null)} className="w-full rounded-md py-2 bg-rose-500 text-white text-sm">Logout</button>
        </div>
      ) : (
        <div className="text-sm text-gray-600">Belum login.</div>
      )}
    </div>
  );
}


