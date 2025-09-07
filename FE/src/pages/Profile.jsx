import { useRecoilState } from 'recoil';
import { authState } from '../state/auth';

export default function Profile() {
  const [auth, setAuth] = useRecoilState(authState);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      {auth?.user ? (
        <div className="bg-white border rounded-md p-4 space-y-2">
          <div className="text-sm text-gray-600">Nama</div>
          <div className="font-medium">{auth.user.name || '-'}</div>
          <div className="text-sm text-gray-600">Email</div>
          <div className="font-medium">{auth.user.email}</div>
          <button onClick={() => setAuth(null)} className="mt-2 inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-md text-sm">Logout</button>
        </div>
      ) : (
        <div>Belum login.</div>
      )}
    </div>
  );
}


