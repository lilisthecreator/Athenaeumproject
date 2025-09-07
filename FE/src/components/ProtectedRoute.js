import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isAuthenticatedSelector } from '../state/auth';

export default function ProtectedRoute({ children }) {
  const isAuthed = useRecoilValue(isAuthenticatedSelector);
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}


