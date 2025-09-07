import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';
import Borrow from './pages/Borrow';
import ProtectedRoute from './components/ProtectedRoute';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 safe-top">
      <main className="max-w-5xl mx-auto px-4 py-6 pb-24">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
          <Route path="/books/:isbn" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/borrow" element={<ProtectedRoute><Borrow /></ProtectedRoute>} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  );
}

export default App;
