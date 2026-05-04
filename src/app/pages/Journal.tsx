'use client';

import { useState } from 'react';
import { BookOpen, Plus, Star, TrendingUp, TrendingDown, Zap, X, Upload } from 'lucide-react';
import { journalEntries } from '../data/mockData';
import { getJournalInsights } from '../services/aiService';
import { motion, AnimatePresence } from 'motion/react';

const emotionColors: Record<string, string> = {
  Confident: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Anxious: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  FOMO: 'bg-red-500/10 text-red-400 border-red-500/20',
  Disciplined: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Fearful: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Greedy: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};

export function Journal() {
  const [entries, setEntries] = useState(journalEntries);
  const [showAdd, setShowAdd] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [newEntry, setNewEntry] = useState({
    symbol: '', type: 'BUY', qty: '', entry: '', setup: '',
    emotion: 'Confident', notes: '', date: new Date().toISOString().split('T')[0],
  });

  const totalPnl = entries.filter(e => e.pnl != null).reduce((s, e) => s + (e.pnl || 0), 0);
  const winTrades = entries.filter(e => e.pnl != null && (e.pnl || 0) > 0);
  const lossTrades = entries.filter(e => e.pnl != null && (e.pnl || 0) < 0);
  const winRate = entries.filter(e => e.status === 'Closed').length > 0
    ? Math.round(winTrades.length / entries.filter(e => e.status === 'Closed').length * 100)
    : 0;

  const addEntry = () => {
    if (!newEntry.symbol || !newEntry.entry) return;
    const entry = {
      id: Date.now(),
      date: newEntry.date,
      symbol: newEntry.symbol.toUpperCase(),
      type: newEntry.type as 'BUY' | 'SELL',
      qty: +newEntry.qty || 1,
      entry: +newEntry.entry,
      exit: null,
      pnl: null,
      status: 'Open' as const,
      emotion: newEntry.emotion,
      setup: newEntry.setup,
      notes: newEntry.notes,
      aiInsight: 'AI analysis will be available after market close.',
      rating: null,
    };
    setEntries(prev => [entry, ...prev]);
    setShowAdd(false);
    setNewEntry({ symbol: '', type: 'BUY', qty: '', entry: '', setup: '', emotion: 'Confident', notes: '', date: new Date().toISOString().split('T')[0] });
  };

  const loadInsights = async () => {
    setLoadingInsights(true);
    const data = await getJournalInsights(entries);
    setInsights(data);
    setLoadingInsights(false);
  };

  const ratingStars = (rating: number | null) => {
    if (rating == null) return null;
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'}`} />
    ));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-slate-100" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Trade Journal</h1>
            <p className="text-slate-500" style={{ fontSize: '0.72rem' }}>AI-assisted performance tracking & improvement</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={loadInsights} disabled={loadingInsights}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 hover:bg-violet-500/25 transition-colors disabled:opacity-60"
            style={{ fontSize: '0.78rem' }}>
            <Zap className="w-3.5 h-3.5" />
            {loadingInsights ? 'Analyzing...' : 'AI Insights'}
          </button>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
            style={{ fontSize: '0.78rem', fontWeight: 600 }}>
            <Plus className="w-3.5 h-3.5" /> Add Trade
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Trades', value: entries.length, color: 'text-slate-300' },
          { label: 'Win Rate', value: `${winRate}%`, color: winRate >= 60 ? 'text-emerald-400' : 'text-amber-400' },
          { label: 'Total P&L', value: `${totalPnl >= 0 ? '+' : ''}₹${Math.abs(totalPnl).toLocaleString('en-IN')}`, color: totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400' },
          { label: 'Open Trades', value: entries.filter(e => e.status === 'Open').length, color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4 text-center">
            <div className={s.color} style={{ fontSize: '1.1rem', fontWeight: 700 }}>{s.value}</div>
            <div className="text-slate-600" style={{ fontSize: '0.65rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* AI Insights Panel */}
      <AnimatePresence>
        {insights && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-gradient-to-r from-violet-900/15 to-indigo-900/10 border border-violet-500/25 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-400" />
                <h3 className="text-violet-300" style={{ fontSize: '0.9rem', fontWeight: 600 }}>AI Performance Insights</h3>
              </div>
              <button onClick={() => setInsights(null)} className="text-slate-600 hover:text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h4 className="text-red-400 mb-2" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Key Mistakes</h4>
                <ul className="space-y-1.5">
                  {insights.keyMistakes.map((m: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5" style={{ fontSize: '0.6rem' }}>✗</span>
                      <span className="text-slate-400" style={{ fontSize: '0.75rem' }}>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-emerald-400 mb-2" style={{ fontSize: '0.78rem', fontWeight: 600 }}>Improvements</h4>
                <ul className="space-y-1.5">
                  {insights.improvements.map((imp: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5" style={{ fontSize: '0.6rem' }}>✓</span>
                      <span className="text-slate-400" style={{ fontSize: '0.75rem' }}>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-violet-500/20 flex gap-4">
              <div>
                <span className="text-slate-600" style={{ fontSize: '0.7rem' }}>Best Trade: </span>
                <span className="text-emerald-400" style={{ fontSize: '0.72rem' }}>{insights.bestTrade}</span>
              </div>
              <div>
                <span className="text-slate-600" style={{ fontSize: '0.7rem' }}>Worst Trade: </span>
                <span className="text-red-400" style={{ fontSize: '0.72rem' }}>{insights.worstTrade}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Journal Entries */}
      <div className="space-y-3">
        {entries.map((entry, i) => (
          <motion.div key={entry.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`bg-[#111520] border rounded-2xl p-4 ${entry.status === 'Open' ? 'border-blue-500/20' : 'border-[#1e2236]'}`}>
            <div className="flex items-start gap-4">
              {/* Type Badge */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${entry.type === 'BUY' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                {entry.type === 'BUY' ? <TrendingUp className={`w-5 h-5 text-emerald-400`} /> : <TrendingDown className="w-5 h-5 text-red-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <span className="text-slate-100" style={{ fontSize: '0.9rem', fontWeight: 700 }}>{entry.symbol}</span>
                  <span className={`px-2 py-0.5 rounded-full border ${entry.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
                    style={{ fontSize: '0.65rem', fontWeight: 700 }}>{entry.type}</span>
                  <span className={`px-2 py-0.5 rounded-full border ${entry.status === 'Open' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-slate-700/50 text-slate-400 border-slate-600/50'}`}
                    style={{ fontSize: '0.65rem' }}>{entry.status}</span>
                  {entry.emotion && (
                    <span className={`px-2 py-0.5 rounded-full border ${emotionColors[entry.emotion] || 'bg-slate-800 text-slate-400'}`} style={{ fontSize: '0.62rem' }}>
                      {entry.emotion}
                    </span>
                  )}
                  <span className="text-slate-700" style={{ fontSize: '0.68rem' }}>{entry.date}</span>
                </div>

                <div className="flex items-center gap-4 mb-2">
                  <span className="text-slate-500" style={{ fontSize: '0.72rem' }}>Qty: <span className="text-slate-300">{entry.qty}</span></span>
                  <span className="text-slate-500" style={{ fontSize: '0.72rem' }}>Entry: <span className="text-slate-300">₹{entry.entry}</span></span>
                  {entry.exit && <span className="text-slate-500" style={{ fontSize: '0.72rem' }}>Exit: <span className="text-slate-300">₹{entry.exit}</span></span>}
                  {entry.pnl != null && (
                    <span className={entry.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'} style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                      {entry.pnl >= 0 ? '+' : ''}₹{entry.pnl.toLocaleString('en-IN')}
                    </span>
                  )}
                  {entry.setup && <span className="text-violet-400" style={{ fontSize: '0.68rem' }}>{entry.setup}</span>}
                </div>

                {entry.notes && <p className="text-slate-500 mb-2" style={{ fontSize: '0.73rem', lineHeight: 1.5 }}>{entry.notes}</p>}

                {/* AI Insight */}
                <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-violet-500/5 border border-violet-500/15">
                  <Zap className="w-3 h-3 text-violet-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-400" style={{ fontSize: '0.7rem', lineHeight: 1.5 }}>{entry.aiInsight}</p>
                </div>
              </div>

              {/* Rating */}
              {entry.rating != null && (
                <div className="flex gap-0.5 flex-shrink-0">{ratingStars(entry.rating)}</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Trade Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-[#111520] border border-[#1e2236] rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-slate-100" style={{ fontSize: '1rem', fontWeight: 700 }}>Log Trade</h3>
                <button onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-slate-300"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 block mb-1" style={{ fontSize: '0.75rem' }}>Symbol</label>
                    <input value={newEntry.symbol} onChange={e => setNewEntry(p => ({ ...p, symbol: e.target.value }))}
                      placeholder="RELIANCE"
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-slate-200 outline-none placeholder-slate-600" style={{ fontSize: '0.82rem' }} />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1" style={{ fontSize: '0.75rem' }}>Type</label>
                    <select value={newEntry.type} onChange={e => setNewEntry(p => ({ ...p, type: e.target.value }))}
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-slate-300 outline-none" style={{ fontSize: '0.82rem' }}>
                      <option value="BUY">BUY</option>
                      <option value="SELL">SELL</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-500 block mb-1" style={{ fontSize: '0.75rem' }}>Qty</label>
                    <input type="number" value={newEntry.qty} onChange={e => setNewEntry(p => ({ ...p, qty: e.target.value }))}
                      placeholder="50"
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-slate-200 outline-none placeholder-slate-600" style={{ fontSize: '0.82rem' }} />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1" style={{ fontSize: '0.75rem' }}>Entry Price (₹)</label>
                    <input type="number" value={newEntry.entry} onChange={e => setNewEntry(p => ({ ...p, entry: e.target.value }))}
                      placeholder="2820"
                      className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-slate-200 outline-none placeholder-slate-600" style={{ fontSize: '0.82rem' }} />
                  </div>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1" style={{ fontSize: '0.75rem' }}>Setup / Pattern</label>
                  <input value={newEntry.setup} onChange={e => setNewEntry(p => ({ ...p, setup: e.target.value }))}
                    placeholder="e.g. Cup & Handle Breakout"
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-slate-200 outline-none placeholder-slate-600" style={{ fontSize: '0.82rem' }} />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1" style={{ fontSize: '0.75rem' }}>Emotion</label>
                  <select value={newEntry.emotion} onChange={e => setNewEntry(p => ({ ...p, emotion: e.target.value }))}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-slate-300 outline-none" style={{ fontSize: '0.82rem' }}>
                    {['Confident', 'Disciplined', 'Anxious', 'FOMO', 'Fearful', 'Greedy'].map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1" style={{ fontSize: '0.75rem' }}>Notes</label>
                  <textarea value={newEntry.notes} onChange={e => setNewEntry(p => ({ ...p, notes: e.target.value }))}
                    rows={2} placeholder="Trade rationale, observations..."
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-slate-200 outline-none placeholder-slate-600 resize-none" style={{ fontSize: '0.82rem' }} />
                </div>
                <button onClick={addEntry}
                  className="w-full py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                  style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                  Log Trade
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
