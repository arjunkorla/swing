'use client';

import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, User, Shield, Bell, Sliders, Link2, Moon, Sun, Save, Check } from 'lucide-react';
import { FYERS_APP_ID } from '../services/fyersApi';
import { motion } from 'motion/react';

type TabKey = 'profile' | 'risk' | 'scanner' | 'broker' | 'alerts' | 'theme';

const tabs: { key: TabKey; label: string; icon: any }[] = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'risk', label: 'Risk Profile', icon: Shield },
  { key: 'scanner', label: 'Scanner', icon: Sliders },
  { key: 'broker', label: 'Broker', icon: Link2 },
  { key: 'alerts', label: 'Alert Prefs', icon: Bell },
  { key: 'theme', label: 'Theme', icon: Moon },
];

const DEFAULT_USER = { name: 'Rahul Sharma', email: 'rahul@example.com' };

export function Settings() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState(DEFAULT_USER);

  const [profile, setProfile] = useState({ name: DEFAULT_USER.name, email: DEFAULT_USER.email, phone: '+91 98765 43210', plan: 'Pro' });
  const [risk, setRisk] = useState({ profile: 'Moderate', maxRiskPerTrade: 2, maxDailyLoss: 5, maxPortfolioRisk: 15, mtfAllowed: true, maxLeverage: 4 });
  const [scanner, setScanner] = useState({ minScore: 65, minConfidence: 70, minVolumeBreakout: 1.2, maxRisk: 'Medium', preferredSectors: ['Banking', 'Auto', 'Pharma'], refreshInterval: 5 });
  const [broker, setBroker] = useState({ connected: true, appId: FYERS_APP_ID, name: 'FYERS', lastSync: '2 min ago' });
  const [alertPrefs, setAlertPrefs] = useState({ app: true, telegram: true, email: true, whatsapp: false, telegramId: '@swingai_alerts', volumeAlert: true, priceAlert: true, aiAlert: true });
  const [theme, setTheme] = useState({ mode: 'dark', accent: 'violet', fontSize: 'default', compactMode: false });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || JSON.stringify(DEFAULT_USER));
    setUser(storedUser);
    setProfile(p => ({ ...p, name: storedUser.name, email: storedUser.email }));
    setTheme(t => ({ ...t, mode: localStorage.getItem('theme') || 'dark' }));
  }, []);

  const handleSave = () => {
    localStorage.setItem('user', JSON.stringify({ ...user, name: profile.name, email: profile.email }));
    localStorage.setItem('theme', theme.mode);
    document.documentElement.classList.toggle('dark', theme.mode === 'dark');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sectors = ['Banking', 'IT', 'Pharma', 'FMCG', 'Auto', 'Realty', 'Energy', 'PSU', 'Metal', 'Infra'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-700/50 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h1 className="text-slate-100" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Settings</h1>
            <p className="text-slate-500" style={{ fontSize: '0.72rem' }}>Personalize your trading experience</p>
          </div>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${saved ? 'bg-emerald-600 text-white' : 'bg-violet-600 text-white hover:bg-violet-700'}`}
          style={{ fontSize: '0.82rem', fontWeight: 600 }}>
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </div>

      <div className="flex gap-4">
        {/* Sidebar Tabs */}
        <div className="w-40 flex-shrink-0 space-y-1">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all text-left ${activeTab === tab.key ? 'bg-violet-500/15 border border-violet-500/20 text-violet-300' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'}`}
              style={{ fontSize: '0.8rem', fontWeight: activeTab === tab.key ? 600 : 400 }}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-[#111520] border border-[#1e2236] rounded-2xl p-5">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-slate-200 mb-4" style={{ fontSize: '1rem', fontWeight: 600 }}>Profile Settings</h2>
              <div className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 mb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                  {profile.name?.charAt(0)}
                </div>
                <div>
                  <div className="text-slate-200" style={{ fontSize: '0.95rem', fontWeight: 600 }}>{profile.name}</div>
                  <div className="text-slate-500" style={{ fontSize: '0.75rem' }}>{profile.email}</div>
                  <span className="px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20" style={{ fontSize: '0.62rem' }}>{profile.plan} Plan</span>
                </div>
              </div>
              {[
                { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Rahul Sharma' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'you@example.com' },
                { label: 'Phone', key: 'phone', type: 'tel', placeholder: '+91 98765 43210' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-slate-500 mb-1.5" style={{ fontSize: '0.78rem' }}>{field.label}</label>
                  <input type={field.type} value={(profile as any)[field.key]}
                    onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-violet-500/50 placeholder-slate-700"
                    style={{ fontSize: '0.85rem' }} />
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'risk' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-slate-200 mb-4" style={{ fontSize: '1rem', fontWeight: 600 }}>Risk Profile</h2>
              <div>
                <label className="block text-slate-500 mb-1.5" style={{ fontSize: '0.78rem' }}>Risk Profile</label>
                <div className="flex gap-2">
                  {['Conservative', 'Moderate', 'Aggressive'].map(p => (
                    <button key={p} onClick={() => setRisk(prev => ({ ...prev, profile: p }))}
                      className={`flex-1 py-2.5 rounded-xl border transition-all ${risk.profile === p ? 'bg-violet-500/15 border-violet-500/30 text-violet-300' : 'border-slate-700/50 text-slate-500 hover:text-slate-300'}`}
                      style={{ fontSize: '0.8rem' }}>{p}</button>
                  ))}
                </div>
              </div>
              {[
                { label: 'Max Risk Per Trade (%)', key: 'maxRiskPerTrade', min: 0.5, max: 5, step: 0.5 },
                { label: 'Max Daily Loss (%)', key: 'maxDailyLoss', min: 1, max: 10, step: 1 },
                { label: 'Max Portfolio Risk (%)', key: 'maxPortfolioRisk', min: 5, max: 30, step: 5 },
                { label: 'Max MTF Leverage (x)', key: 'maxLeverage', min: 1, max: 8, step: 1 },
              ].map(field => (
                <div key={field.key}>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-slate-500" style={{ fontSize: '0.78rem' }}>{field.label}</label>
                    <span className="text-violet-400" style={{ fontSize: '0.78rem', fontWeight: 600 }}>{(risk as any)[field.key]}{field.key === 'maxLeverage' ? 'x' : '%'}</span>
                  </div>
                  <input type="range" min={field.min} max={field.max} step={field.step} value={(risk as any)[field.key]}
                    onChange={e => setRisk(p => ({ ...p, [field.key]: +e.target.value }))}
                    className="w-full accent-violet-500" />
                </div>
              ))}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30">
                <span className="text-slate-400" style={{ fontSize: '0.82rem' }}>Allow MTF Trading</span>
                <button onClick={() => setRisk(p => ({ ...p, mtfAllowed: !p.mtfAllowed }))}
                  className={`w-10 h-5.5 rounded-full transition-all relative ${risk.mtfAllowed ? 'bg-violet-600' : 'bg-slate-700'}`}
                  style={{ height: '22px' }}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${risk.mtfAllowed ? 'left-5.5' : 'left-0.5'}`}
                    style={{ left: risk.mtfAllowed ? '22px' : '2px' }} />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'scanner' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-slate-200 mb-4" style={{ fontSize: '1rem', fontWeight: 600 }}>Scanner Preferences</h2>
              {[
                { label: 'Min Momentum Score', key: 'minScore', min: 0, max: 100, step: 5 },
                { label: 'Min AI Confidence (%)', key: 'minConfidence', min: 50, max: 100, step: 5 },
                { label: 'Min Volume Breakout (x)', key: 'minVolumeBreakout', min: 1, max: 3, step: 0.1 },
              ].map(field => (
                <div key={field.key}>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-slate-500" style={{ fontSize: '0.78rem' }}>{field.label}</label>
                    <span className="text-violet-400" style={{ fontSize: '0.78rem', fontWeight: 600 }}>{(scanner as any)[field.key]}</span>
                  </div>
                  <input type="range" min={field.min} max={field.max} step={field.step} value={(scanner as any)[field.key]}
                    onChange={e => setScanner(p => ({ ...p, [field.key]: +e.target.value }))}
                    className="w-full accent-violet-500" />
                </div>
              ))}
              <div>
                <label className="block text-slate-500 mb-2" style={{ fontSize: '0.78rem' }}>Preferred Sectors</label>
                <div className="flex flex-wrap gap-2">
                  {sectors.map(s => (
                    <button key={s}
                      onClick={() => setScanner(p => ({
                        ...p,
                        preferredSectors: p.preferredSectors.includes(s) ? p.preferredSectors.filter(x => x !== s) : [...p.preferredSectors, s],
                      }))}
                      className={`px-2.5 py-1 rounded-lg border transition-colors ${scanner.preferredSectors.includes(s) ? 'bg-violet-500/15 border-violet-500/30 text-violet-300' : 'border-slate-700/50 text-slate-500 hover:text-slate-300'}`}
                      style={{ fontSize: '0.75rem' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'broker' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-slate-200 mb-4" style={{ fontSize: '1rem', fontWeight: 600 }}>Broker Management</h2>
              <div className={`p-4 rounded-xl border ${broker.connected ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-800/30 border-slate-700/30'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400" style={{ fontSize: '1.2rem' }}>📊</div>
                    <div>
                      <div className="text-slate-200" style={{ fontSize: '0.88rem', fontWeight: 600 }}>FYERS Securities</div>
                      <div className="text-slate-500" style={{ fontSize: '0.7rem' }}>App ID: {broker.appId?.slice(0, 12)}...</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full border ${broker.connected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`} style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                    {broker.connected ? '● Connected' : '● Disconnected'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: 'Last Sync', value: broker.lastSync },
                    { label: 'Data Feed', value: 'Live (WebSocket)' },
                    { label: 'Order API', value: 'v3 (Enabled)' },
                    { label: 'Auth Method', value: 'OAuth 2.0' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="text-slate-600" style={{ fontSize: '0.68rem' }}>{item.label}</div>
                      <div className="text-slate-300" style={{ fontSize: '0.75rem', fontWeight: 500 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-700/30">
                  <p className="text-slate-600 mb-2" style={{ fontSize: '0.68rem' }}>
                    ⚠️ FYERS_APP_ID and SECRET_KEY must be configured in <code className="text-violet-400">/src/app/services/fyersApi.ts</code>
                  </p>
                  <button className="px-3 py-1.5 rounded-lg bg-orange-500/15 border border-orange-500/30 text-orange-400 hover:bg-orange-500/25 transition-colors" style={{ fontSize: '0.75rem' }}>
                    Reconnect FYERS
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-slate-200 mb-4" style={{ fontSize: '1rem', fontWeight: 600 }}>Alert Preferences</h2>
              <div className="space-y-3">
                {[
                  { key: 'app', label: 'In-App Notifications', icon: '🔔' },
                  { key: 'telegram', label: 'Telegram Alerts', icon: '📱' },
                  { key: 'email', label: 'Email Alerts', icon: '📧' },
                  { key: 'whatsapp', label: 'WhatsApp Alerts', icon: '💬' },
                ].map(ch => (
                  <div key={ch.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '1rem' }}>{ch.icon}</span>
                      <span className="text-slate-400" style={{ fontSize: '0.82rem' }}>{ch.label}</span>
                    </div>
                    <button onClick={() => setAlertPrefs(p => ({ ...p, [ch.key]: !(p as any)[ch.key] }))}
                      className={`w-10 h-5.5 rounded-full transition-all relative`}
                      style={{ backgroundColor: (alertPrefs as any)[ch.key] ? '#7c3aed' : '#374151', height: '22px', width: '40px' }}>
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all`}
                        style={{ left: (alertPrefs as any)[ch.key] ? '22px' : '2px' }} />
                    </button>
                  </div>
                ))}
              </div>
              {alertPrefs.telegram && (
                <div>
                  <label className="block text-slate-500 mb-1.5" style={{ fontSize: '0.78rem' }}>Telegram Bot Username</label>
                  <input value={alertPrefs.telegramId} onChange={e => setAlertPrefs(p => ({ ...p, telegramId: e.target.value }))}
                    placeholder="@your_telegram_id"
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-violet-500/50 placeholder-slate-700"
                    style={{ fontSize: '0.85rem' }} />
                </div>
              )}
              <div className="pt-3 border-t border-[#1e2236]">
                <h4 className="text-slate-400 mb-3" style={{ fontSize: '0.82rem', fontWeight: 600 }}>Alert Types</h4>
                <div className="space-y-2">
                  {[
                    { key: 'volumeAlert', label: 'Volume Breakout Alerts' },
                    { key: 'priceAlert', label: 'Price Breakout Alerts' },
                    { key: 'aiAlert', label: 'AI Confidence Change Alerts' },
                  ].map(at => (
                    <div key={at.key} className="flex items-center justify-between">
                      <span className="text-slate-500" style={{ fontSize: '0.8rem' }}>{at.label}</span>
                      <button onClick={() => setAlertPrefs(p => ({ ...p, [at.key]: !(p as any)[at.key] }))}
                        className="rounded-full transition-all relative flex-shrink-0"
                        style={{ backgroundColor: (alertPrefs as any)[at.key] ? '#7c3aed' : '#374151', height: '22px', width: '40px' }}>
                        <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all"
                          style={{ left: (alertPrefs as any)[at.key] ? '22px' : '2px' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'theme' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <h2 className="text-slate-200 mb-4" style={{ fontSize: '1rem', fontWeight: 600 }}>Theme & Display</h2>
              <div>
                <label className="block text-slate-500 mb-2" style={{ fontSize: '0.78rem' }}>Color Mode</label>
                <div className="flex gap-3">
                  {[
                    { value: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Recommended for trading' },
                    { value: 'light', label: 'Light Mode', icon: Sun, desc: 'Better in bright environments' },
                  ].map(mode => (
                    <button key={mode.value} onClick={() => setTheme(p => ({ ...p, mode: mode.value }))}
                      className={`flex-1 p-4 rounded-xl border text-left transition-all ${theme.mode === mode.value ? 'bg-violet-500/15 border-violet-500/30' : 'border-slate-700/50 hover:border-slate-600/50'}`}>
                      <mode.icon className={`w-5 h-5 mb-2 ${theme.mode === mode.value ? 'text-violet-400' : 'text-slate-500'}`} />
                      <div className={theme.mode === mode.value ? 'text-violet-300' : 'text-slate-400'} style={{ fontSize: '0.82rem', fontWeight: 600 }}>{mode.label}</div>
                      <div className="text-slate-600" style={{ fontSize: '0.68rem' }}>{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-2" style={{ fontSize: '0.78rem' }}>Accent Color</label>
                <div className="flex gap-2">
                  {[
                    { value: 'violet', color: '#8b5cf6' }, { value: 'blue', color: '#3b82f6' },
                    { value: 'emerald', color: '#10b981' }, { value: 'amber', color: '#f59e0b' },
                    { value: 'rose', color: '#f43f5e' },
                  ].map(acc => (
                    <button key={acc.value} onClick={() => setTheme(p => ({ ...p, accent: acc.value }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${theme.accent === acc.value ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: acc.color }} />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30">
                <div>
                  <div className="text-slate-400" style={{ fontSize: '0.82rem' }}>Compact Mode</div>
                  <div className="text-slate-600" style={{ fontSize: '0.68rem' }}>Reduce spacing for more data</div>
                </div>
                <button onClick={() => setTheme(p => ({ ...p, compactMode: !p.compactMode }))}
                  className="rounded-full transition-all relative flex-shrink-0"
                  style={{ backgroundColor: theme.compactMode ? '#7c3aed' : '#374151', height: '22px', width: '40px' }}>
                  <div className="absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all"
                    style={{ left: theme.compactMode ? '22px' : '2px' }} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
