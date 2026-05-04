'use client';

import { useState } from 'react';
import { Bell, Plus, X, Volume2, TrendingUp, Activity, Target, Zap, BarChart3, CheckCircle, Clock } from 'lucide-react';
import { alertsData } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

const alertTypeIcons: Record<string, any> = {
  'Volume Breakout': Volume2,
  'Price Breakout': TrendingUp,
  'RSI Reversal': Activity,
  'Target Reached': Target,
  'AI Confidence': Zap,
  'Sector Shift': BarChart3,
  'Stoploss Alert': X,
};

const priorityColor = { high: 'text-red-400 bg-red-500/10 border-red-500/20', medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20', low: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };

export function Alerts() {
  const [alerts, setAlerts] = useState(alertsData);
  const [showCreate, setShowCreate] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [newAlert, setNewAlert] = useState({
    symbol: '', type: 'Price Breakout', condition: 'above', value: '', channels: ['App'],
  });

  const alertTypes = ['All', 'Volume Breakout', 'Price Breakout', 'RSI Reversal', 'Target Reached', 'AI Confidence', 'Sector Shift'];
  const channels = ['App', 'Telegram', 'WhatsApp', 'Email'];

  const filtered = activeFilter === 'All' ? alerts : alerts.filter(a => a.type === activeFilter);

  const dismissAlert = (id: number) => setAlerts(prev => prev.filter(a => a.id !== id));

  const createAlert = () => {
    if (!newAlert.symbol || !newAlert.value) return;
    const alert = {
      id: Date.now(),
      type: newAlert.type,
      symbol: newAlert.symbol.toUpperCase(),
      message: `${newAlert.type}: ${newAlert.symbol.toUpperCase()} ${newAlert.condition} ₹${newAlert.value}`,
      time: 'Just now',
      priority: 'medium' as const,
      triggered: false,
    };
    setAlerts(prev => [alert, ...prev]);
    setShowCreate(false);
    setNewAlert({ symbol: '', type: 'Price Breakout', condition: 'above', value: '', channels: ['App'] });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
            <Bell className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-slate-100" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Alerts Center</h1>
            <p className="text-slate-500" style={{ fontSize: '0.72rem' }}>{alerts.filter(a => a.triggered).length} triggered • {alerts.filter(a => !a.triggered).length} pending</p>
          </div>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors"
          style={{ fontSize: '0.78rem', fontWeight: 600 }}>
          <Plus className="w-3.5 h-3.5" /> Create Alert
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: alerts.length, color: 'text-slate-300' },
          { label: 'Triggered', value: alerts.filter(a => a.triggered).length, color: 'text-emerald-400' },
          { label: 'Pending', value: alerts.filter(a => !a.triggered).length, color: 'text-amber-400' },
          { label: 'High Priority', value: alerts.filter(a => a.priority === 'high').length, color: 'text-red-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#111520] border border-[#1e2236] rounded-xl p-3 text-center">
            <div className={stat.color} style={{ fontSize: '1.1rem', fontWeight: 700 }}>{stat.value}</div>
            <div className="text-slate-600" style={{ fontSize: '0.65rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Notification Channels */}
      <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
        <h3 className="text-slate-300 mb-3" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Notification Channels</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: 'App', emoji: '🔔', active: true, note: 'Always active' },
            { name: 'Telegram', emoji: '📱', active: true, note: '@swingai_bot' },
            { name: 'WhatsApp', emoji: '💬', active: false, note: 'Setup required' },
            { name: 'Email', emoji: '📧', active: true, note: 'rahul@example.com' },
          ].map(ch => (
            <div key={ch.name} className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${ch.active ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-slate-800/30 border-slate-700/30 opacity-50'}`}>
              <span style={{ fontSize: '1rem' }}>{ch.emoji}</span>
              <div>
                <div className="text-slate-300" style={{ fontSize: '0.78rem', fontWeight: 500 }}>{ch.name}</div>
                <div className="text-slate-600" style={{ fontSize: '0.62rem' }}>{ch.active ? ch.note : 'Inactive'}</div>
              </div>
              <div className={`ml-auto w-2 h-2 rounded-full ${ch.active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {alertTypes.map(t => (
          <button key={t} onClick={() => setActiveFilter(t)}
            className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-colors flex-shrink-0 ${activeFilter === t ? 'bg-violet-500/15 border-violet-500/30 text-violet-300' : 'bg-slate-800/40 border-slate-700/40 text-slate-500 hover:text-slate-300'}`}
            style={{ fontSize: '0.75rem' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map(alert => {
            const IconComp = alertTypeIcons[alert.type] || Bell;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${alert.triggered ? 'bg-[#111520]' : 'bg-[#111520]/60 opacity-70'} border-[#1e2236] hover:border-slate-600/50`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${priorityColor[alert.priority]}`}>
                  <IconComp className="w-4 h-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-slate-200" style={{ fontSize: '0.82rem', fontWeight: 600 }}>{alert.symbol}</span>
                    <span className="text-violet-400" style={{ fontSize: '0.72rem' }}>{alert.type}</span>
                    {alert.triggered ? (
                      <span className="flex items-center gap-0.5 text-emerald-400" style={{ fontSize: '0.65rem' }}>
                        <CheckCircle className="w-3 h-3" /> Triggered
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-amber-400" style={{ fontSize: '0.65rem' }}>
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400" style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>{alert.message}</p>
                  <span className="text-slate-700" style={{ fontSize: '0.65rem' }}>{alert.time}</span>
                </div>

                {/* Priority Badge */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full border capitalize ${priorityColor[alert.priority]}`} style={{ fontSize: '0.62rem', fontWeight: 600 }}>
                    {alert.priority}
                  </span>
                  <button onClick={() => dismissAlert(alert.id)}
                    className="text-slate-700 hover:text-red-400 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-600" style={{ fontSize: '0.85rem' }}>No alerts for this filter</div>
        )}
      </div>

      {/* Create Alert Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#111520] border border-[#1e2236] rounded-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-slate-100" style={{ fontSize: '1rem', fontWeight: 700 }}>Create Alert</h3>
                <button onClick={() => setShowCreate(false)} className="text-slate-500 hover:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 mb-1.5" style={{ fontSize: '0.8rem' }}>Stock Symbol</label>
                  <input value={newAlert.symbol} onChange={e => setNewAlert(p => ({ ...p, symbol: e.target.value }))}
                    placeholder="e.g. RELIANCE, HDFCBANK"
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-violet-500/50 placeholder-slate-600"
                    style={{ fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5" style={{ fontSize: '0.8rem' }}>Alert Type</label>
                  <select value={newAlert.type} onChange={e => setNewAlert(p => ({ ...p, type: e.target.value }))}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-slate-300 outline-none" style={{ fontSize: '0.85rem' }}>
                    {['Volume Breakout', 'Price Breakout', 'RSI Reversal', 'Target Reached', 'Stoploss Alert', 'AI Confidence'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1.5" style={{ fontSize: '0.8rem' }}>Condition</label>
                    <select value={newAlert.condition} onChange={e => setNewAlert(p => ({ ...p, condition: e.target.value }))}
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-slate-300 outline-none" style={{ fontSize: '0.85rem' }}>
                      <option value="above">Price Above</option>
                      <option value="below">Price Below</option>
                      <option value="crosses">Price Crosses</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1.5" style={{ fontSize: '0.8rem' }}>Value (₹)</label>
                    <input type="number" value={newAlert.value} onChange={e => setNewAlert(p => ({ ...p, value: e.target.value }))}
                      placeholder="e.g. 1680"
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-violet-500/50 placeholder-slate-600"
                      style={{ fontSize: '0.85rem' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 mb-2" style={{ fontSize: '0.8rem' }}>Notification Channels</label>
                  <div className="flex gap-2">
                    {channels.map(ch => (
                      <button key={ch} onClick={() => setNewAlert(p => ({
                        ...p,
                        channels: p.channels.includes(ch) ? p.channels.filter(c => c !== ch) : [...p.channels, ch],
                      }))}
                        className={`px-3 py-1.5 rounded-lg border transition-colors ${newAlert.channels.includes(ch) ? 'bg-violet-500/15 border-violet-500/30 text-violet-300' : 'bg-slate-800/40 border-slate-700/40 text-slate-500'}`}
                        style={{ fontSize: '0.72rem' }}>
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={createAlert}
                  className="w-full py-2.5 rounded-xl bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                  style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  Create Alert
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
