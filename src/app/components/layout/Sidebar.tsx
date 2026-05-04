'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ScanLine, Zap, Star, Briefcase, TrendingUp,
  BarChart3, Bell, FlaskConical, BookOpen, Settings, ChevronLeft,
  ChevronRight, Activity, Bot,
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', group: 'main' },
  { path: '/scanner', icon: ScanLine, label: 'AI Scanner', group: 'main' },
  { path: '/scanner?signals=true', icon: Zap, label: 'AI Signals', group: 'main', matchPath: '/signals' },
  { path: '/watchlist', icon: Star, label: 'Watchlist', group: 'main', matchPath: '/watchlist' },
  { path: '/portfolio', icon: Briefcase, label: 'Portfolio', group: 'analysis' },
  { path: '/swing', icon: TrendingUp, label: 'Swing Opps', group: 'analysis' },
  { path: '/sector', icon: BarChart3, label: 'Sector Strength', group: 'analysis' },
  { path: '/alerts', icon: Bell, label: 'Alerts', group: 'tools', badge: 4 },
  { path: '/backtesting', icon: FlaskConical, label: 'Backtesting', group: 'tools' },
  { path: '/journal', icon: BookOpen, label: 'Trade Journal', group: 'tools' },
  { path: '/settings', icon: Settings, label: 'Settings', group: 'account' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-56'}
        bg-[#0a0c14] border-r border-[#1a1d2e]`}
    >
      {/* Logo */}
      <div className={`flex items-center h-14 border-b border-[#1a1d2e] px-3 gap-2 ${collapsed ? 'justify-center' : ''}`}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex-shrink-0">
          <Activity className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="text-slate-100 tracking-tight" style={{ fontSize: '0.95rem', fontWeight: 700 }}>
              Swing<span className="text-violet-400">AI</span>
            </span>
            <div className="text-slate-500" style={{ fontSize: '0.6rem', marginTop: '-2px' }}>Trading Intelligence</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-hide">
        {/* Main */}
        {!collapsed && (
          <div className="text-slate-600 px-2 mb-1" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            Core
          </div>
        )}
        {navItems.filter(i => i.group === 'main').map(item => (
          <SidebarItem key={item.path} item={item} collapsed={collapsed} active={pathname === (item.matchPath || item.path)} />
        ))}

        {!collapsed && (
          <div className="text-slate-600 px-2 mt-3 mb-1" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            Analysis
          </div>
        )}
        {collapsed && <div className="h-2" />}
        {navItems.filter(i => i.group === 'analysis').map(item => (
          <SidebarItem key={item.path} item={item} collapsed={collapsed} active={pathname === item.path} />
        ))}

        {!collapsed && (
          <div className="text-slate-600 px-2 mt-3 mb-1" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
            Tools
          </div>
        )}
        {collapsed && <div className="h-2" />}
        {navItems.filter(i => i.group === 'tools').map(item => (
          <SidebarItem key={item.path} item={item} collapsed={collapsed} active={pathname === item.path} />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[#1a1d2e] p-2 space-y-0.5">
        {navItems.filter(i => i.group === 'account').map(item => (
          <SidebarItem key={item.path} item={item} collapsed={collapsed} active={pathname === item.path} />
        ))}

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span style={{ fontSize: '0.8rem' }}>Collapse</span></>}
        </button>
      </div>

      {/* FYERS Connection Status */}
      {!collapsed && (
        <div className="p-2 mx-2 mb-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400" style={{ fontSize: '0.7rem', fontWeight: 600 }}>FYERS Connected</span>
          </div>
          <div className="text-slate-500 mt-0.5" style={{ fontSize: '0.65rem' }}>Live data streaming</div>
        </div>
      )}
    </aside>
  );
}

function SidebarItem({
  item,
  collapsed,
  active,
}: {
  item: typeof navItems[0];
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.path}
      title={collapsed ? item.label : undefined}
      className={`flex items-center gap-2.5 px-2 py-2 rounded-lg transition-all duration-150 relative group
        ${active
          ? 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
          : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/60'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      <Icon className={`flex-shrink-0 ${active ? 'text-violet-400' : ''}`} style={{ width: '15px', height: '15px' }} />
      {!collapsed && (
        <span style={{ fontSize: '0.8rem', fontWeight: active ? 500 : 400 }}>{item.label}</span>
      )}
      {item.badge && !collapsed && (
        <span className="ml-auto bg-red-500 text-white rounded-full px-1.5" style={{ fontSize: '0.6rem', fontWeight: 700 }}>
          {item.badge}
        </span>
      )}
      {item.badge && collapsed && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
      {/* Tooltip for collapsed */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-slate-200 rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-slate-700"
          style={{ fontSize: '0.75rem' }}>
          {item.label}
        </div>
      )}
    </Link>
  );
}
