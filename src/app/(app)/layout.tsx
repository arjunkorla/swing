'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '../components/layout/Sidebar';
import { TopNav } from '../components/layout/TopNav';
import { AIAssistant } from '../components/AIAssistant';

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (!localStorage.getItem('auth_token')) {
      router.replace('/login');
      setMounted(true);
      return;
    }
    setAuthorized(true);
    const savedTheme = (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    document.documentElement.classList.toggle('light', savedTheme === 'light');
    document.body.style.backgroundColor = savedTheme === 'dark' ? '#0b0d18' : '#f1f5f9';
    setMounted(true);
  }, [router]);

  if (!mounted || !authorized) return null;

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
        className="transition-all duration-300 pt-14 min-h-screen"
        style={{ marginLeft: sidebarCollapsed ? '64px' : '224px' }}
      >
        <div className="p-5">
          {children}
        </div>
      </main>

      {/* AI Assistant Panel */}
      <AIAssistant isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
