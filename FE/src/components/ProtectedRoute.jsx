import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAuthedSelector } from '../state/auth';

export default function ProtectedRoute({ children }) {
  const isAuthed = useRecoilValue(isAuthedSelector);
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}


