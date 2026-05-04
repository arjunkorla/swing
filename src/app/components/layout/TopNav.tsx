import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Search, Bell, Bot, User, ChevronDown, Sun, Moon, Wifi, WifiOff, X, TrendingUp, TrendingDown } from 'lucide-react';
import { searchStocks } from '../../services/fyersApi';

interface TopNavProps {
  onAIToggle: () => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

export function TopNav({ onAIToggle, theme, onThemeToggle }: TopNavProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [notifications, setNotifications] = useState(4);
  const [showProfile, setShowProfile] = useState(false);
  const [connected, setConnected] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);

  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Rahul Sharma","email":"rahul@example.com"}');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchStocks(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Live market ticker
  const [ticker, setTicker] = useState([
    { symbol: 'NIFTY', value: 23847.65, change: 0.60 },
    { symbol: 'SENSEX', value: 78943.20, change: 0.61 },
    { symbol: 'BANKNIFTY', value: 51234.80, change: 0.90 },
    { symbol: 'NIFTYIT', value: 36789.40, change: -0.63 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(prev => prev.map(t => ({
        ...t,
        value: Math.round((t.value + (Math.random() - 0.49) * 5) * 100) / 100,
        change: Math.round((t.change + (Math.random() - 0.5) * 0.1) * 100) / 100,
      })));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 h-14 z-30 flex items-center border-b border-[#1a1d2e] bg-[#0a0c14]/95 backdrop-blur-sm px-4 gap-3">
      {/* Left spacer for sidebar */}
      <div className="w-56 flex-shrink-0" />

      {/* Live Ticker */}
      <div className="hidden lg:flex items-center gap-4 overflow-hidden flex-1">
        {ticker.map(t => (
          <div key={t.symbol} className="flex items-center gap-1.5 flex-shrink-0">
            <span className="text-slate-500" style={{ fontSize: '0.7rem', fontWeight: 600 }}>{t.symbol}</span>
            <span className="text-slate-200" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
              {t.value.toLocaleString('en-IN')}
            </span>
            <span className={`flex items-center gap-0.5 ${t.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
              style={{ fontSize: '0.7rem' }}>
              {t.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {t.change >= 0 ? '+' : ''}{t.change}%
            </span>
          </div>
        ))}
      </div>

      {/* Right Controls */}
      <div className="ml-auto flex items-center gap-2">
        {/* Search */}
        <div ref={searchRef} className="relative">
          <button
            onClick={() => setShowSearch(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
            style={{ fontSize: '0.75rem' }}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:block">Search stocks...</span>
            <kbd className="hidden sm:block px-1 rounded border border-slate-600 text-slate-500" style={{ fontSize: '0.6rem' }}>⌘K</kbd>
          </button>
          {showSearch && (
            <div className="absolute top-full mt-2 right-0 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search NSE/BSE stocks..."
                  className="flex-1 bg-transparent text-slate-200 outline-none placeholder-slate-500"
                  style={{ fontSize: '0.85rem' }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}><X className="w-4 h-4 text-slate-500" /></button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {isSearching && <div className="p-4 text-center text-slate-500" style={{ fontSize: '0.8rem' }}>Searching...</div>}
                {!isSearching && searchResults.length === 0 && searchQuery && (
                  <div className="p-4 text-center text-slate-500" style={{ fontSize: '0.8rem' }}>No results for "{searchQuery}"</div>
                )}
                {!isSearching && searchResults.length === 0 && !searchQuery && (
                  <div className="p-3">
                    <div className="text-slate-500 mb-2" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Popular</div>
                    {['RELIANCE', 'TCS', 'HDFCBANK', 'TATAMOTORS', 'INFY'].map(s => (
                      <button key={s} onClick={() => { navigate(`/stock/${s}`); setShowSearch(false); }}
                        className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300" style={{ fontSize: '0.8rem' }}>
                        NSE:{s}
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.map(r => (
                  <button key={r.symbol} onClick={() => { navigate(`/stock/${r.symbol.split(':')[1]?.split('-')[0] || r.symbol}`); setShowSearch(false); setSearchQuery(''); }}
                    className="w-full text-left px-3 py-2.5 hover:bg-slate-800 border-b border-slate-800/50 flex items-center justify-between">
                    <div>
                      <div className="text-slate-200" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{r.name}</div>
                      <div className="text-slate-500" style={{ fontSize: '0.7rem' }}>{r.symbol}</div>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-slate-400 bg-slate-800" style={{ fontSize: '0.65rem' }}>{r.exchange}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Connection Status */}
        <button onClick={() => setConnected(!connected)} title={connected ? 'Live Data' : 'Disconnected'}
          className={`p-1.5 rounded-lg transition-colors ${connected ? 'text-emerald-400' : 'text-red-400'}`}>
          {connected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
        </button>

        {/* Theme Toggle */}
        <button onClick={onThemeToggle} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors">
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* AI Assistant */}
        <button onClick={onAIToggle}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 hover:bg-violet-500/25 transition-all"
          style={{ fontSize: '0.75rem' }}>
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden sm:block">AI</span>
        </button>

        {/* Notifications */}
        <button onClick={() => { setNotifications(0); navigate('/alerts'); }}
          className="relative p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors">
          <Bell className="w-4 h-4" />
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white" style={{ fontSize: '0.55rem', fontWeight: 700 }}>
              {notifications}
            </span>
          )}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800/60 transition-colors">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white"
              style={{ fontSize: '0.7rem', fontWeight: 700 }}>
              {user.name?.charAt(0) || 'R'}
            </div>
            <span className="hidden sm:block text-slate-300" style={{ fontSize: '0.8rem' }}>{user.name?.split(' ')[0]}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
              <div className="p-3 border-b border-slate-800">
                <div className="text-slate-200" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user.name}</div>
                <div className="text-slate-500" style={{ fontSize: '0.72rem' }}>{user.email}</div>
              </div>
              <div className="p-1">
                <button onClick={() => { navigate('/settings'); setShowProfile(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors" style={{ fontSize: '0.82rem' }}>
                  Settings
                </button>
                <button onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors" style={{ fontSize: '0.82rem' }}>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
