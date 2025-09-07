import { Link, Route, Routes } from 'react-router-dom';
import ScanPage from './pages/ScanPage';
import BookDetailsPage from './pages/BookDetailsPage';
import BorrowPage from './pages/BorrowPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">Athenaeum</Link>
          <div className="space-x-4 text-sm">
            <Link className="hover:underline" to="/">Scan</Link>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<ScanPage />} />
          <Route path="/book/:isbn" element={<BookDetailsPage />} />
          <Route path="/borrow/:isbn" element={<BorrowPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
