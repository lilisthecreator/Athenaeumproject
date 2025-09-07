import { Link, Route, Routes } from 'react-router-dom';
import ScanPage from './pages/ScanPage';
import BookDetailsPage from './pages/BookDetailsPage';
import BorrowPage from './pages/BorrowPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useRecoilState } from 'recoil';
import { authState } from './state/auth';

function App() {
  const [auth, setAuth] = useRecoilState(authState);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard" className="font-semibold">Athenaeum</Link>
          <div className="flex items-center gap-3 text-sm">
            <Link className="hover:underline" to="/">Scan</Link>
            <Link className="hover:underline" to="/dashboard">Dashboard</Link>
            {auth?.user ? (
              <button className="text-red-600" onClick={() => setAuth(null)}>Logout</button>
            ) : (
              <Link className="hover:underline" to="/login">Login</Link>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<ScanPage />} />
          <Route path="/book/:isbn" element={<BookDetailsPage />} />
          <Route path="/borrow/:isbn" element={<ProtectedRoute><BorrowPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
