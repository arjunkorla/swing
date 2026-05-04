import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { AIAssistant } from '../AIAssistant';

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const isAuthenticated = !!localStorage.getItem('auth_token');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    document.documentElement.classList.toggle('light', savedTheme === 'light');
    if (savedTheme === 'dark') {
      document.body.style.backgroundColor = '#0b0d18';
    } else {
      document.body.style.backgroundColor = '#f1f5f9';
    }
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    document.documentElement.classList.toggle('light', newTheme === 'light');
    document.body.style.backgroundColor = newTheme === 'dark' ? '#0b0d18' : '#f1f5f9';
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0b0d18] text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <TopNav onAIToggle={() => setAiOpen(!aiOpen)} theme={theme} onThemeToggle={handleThemeToggle} />

      {/* Main Content */}
      <main
        className={`transition-all duration-300 pt-14 min-h-screen`}
        style={{ marginLeft: sidebarCollapsed ? '64px' : '224px' }}
      >
        <div className="p-5">
          <Outlet />
        </div>
      </main>

      {/* AI Assistant Panel */}
      <AIAssistant isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
