import { Search } from 'lucide-react';
import { useState } from 'react';

export default function Header({ name = 'Friend', onSearch }) {
  const initial = encodeURI(process.env.PUBLIC_URL + '/logo/AthenaeumProject (Presentation).png');
  const [logoSrc, setLogoSrc] = useState(initial);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-start px-4">
        <img
          src={logoSrc}
          alt="Athenaeum Logo"
          className="h-24 sm:h-28 md:h-32 max-w-[85%] w-auto object-contain"
          onError={() => setLogoSrc(encodeURI(process.env.PUBLIC_URL + '/logo/logo.png'))}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-rose-500/15 flex items-center justify-center">
            <span className="text-rose-500">😊</span>
          </div>
          <div className="font-semibold">Hi, {name}!</div>
        </div>
        <div className="w-9 h-9" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-white rounded-xl2 shadow-soft border border-white/60 px-4 py-3 text-sm text-gray-500">Search for books</div>
        <button className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center">
          <Search size={18} />
        </button>
      </div>
    </div>
  );
}


