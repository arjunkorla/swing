'use client';

import { useState } from 'react';
import { FlaskConical, Play, TrendingUp, Target, BarChart3, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { backtestResults } from '../data/mockData';
import { motion } from 'motion/react';

const monthlyReturns = [
  { month: 'Jan', return: 4.2 }, { month: 'Feb', return: 7.8 }, { month: 'Mar', return: -2.1 },
  { month: 'Apr', return: 9.4 }, { month: 'May', return: 5.6 }, { month: 'Jun', return: -4.2 },
  { month: 'Jul', return: 11.2 }, { month: 'Aug', return: 3.8 }, { month: 'Sep', return: -1.5 },
  { month: 'Oct', return: 8.9 }, { month: 'Nov', return: 6.3 }, { month: 'Dec', return: 4.7 },
];

export function Backtesting() {
  const [config, setConfig] = useState({
    strategy: 'Momentum Breakout',
    capital: 500000,
    dateFrom: '2024-01-01',
    dateTo: '2026-04-30',
    indicators: ['RSI', 'Volume', '50-DMA'],
    riskPerTrade: 2,
    minScore: 70,
    minConfidence: 75,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState(backtestResults);
  const [hasRun, setHasRun] = useState(true);

  const indicators = ['RSI', 'Volume', '50-DMA', '200-DMA', 'MACD', 'Bollinger', 'ATR', 'Stochastic'];

  const runBacktest = async () => {
    setIsRunning(true);
    setHasRun(false);
    await new Promise(r => setTimeout(r, 2500));
    setResults({
      ...backtestResults,
      cagr: Math.round((25 + Math.random() * 15) * 10) / 10,
      winRate: Math.round((60 + Math.random() * 10) * 10) / 10,
      totalReturn: Math.round((50 + Math.random() * 30) * 10) / 10,
      profitFactor: Math.round((2 + Math.random()) * 100) / 100,
    });
    setIsRunning(false);
    setHasRun(true);
  };

  const metricsGood = [
    { label: 'CAGR', value: `${results.cagr}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Win Rate', value: `${results.winRate}%`, icon: Target, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Profit Factor', value: results.profitFactor, icon: BarChart3, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Sharpe Ratio', value: results.sharpeRatio, icon: Activity, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-slate-100" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Backtesting Module</h1>
            <p className="text-slate-500" style={{ fontSize: '0.72rem' }}>Test your strategies on historical NSE data</p>
          </div>
        </div>
        <button onClick={runBacktest} disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
          style={{ fontSize: '0.82rem', fontWeight: 600 }}>
          {isRunning ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Running...</>
          ) : (
            <><Play className="w-4 h-4" /> Run Backtest</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Strategy Builder */}
        <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
          <h3 className="text-slate-300 mb-4" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Strategy Builder</h3>
          <div className="space-y-3">
            <div>
              <label className="text-slate-500 block mb-1.5" style={{ fontSize: '0.75rem' }}>Strategy Name</label>
              <select value={config.strategy} onChange={e => setConfig(p => ({ ...p, strategy: e.target.value }))}
                className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-slate-300 outline-none" style={{ fontSize: '0.82rem' }}>
                {['Momentum Breakout', 'RSI Reversal', 'Volume Surge', 'Cup & Handle', 'Sector Rotation', 'Dip Recovery'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-500 block mb-1.5" style={{ fontSize: '0.75rem' }}>From</label>
                <input type="date" value={config.dateFrom} onChange={e => setConfig(p => ({ ...p, dateFrom: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-2 py-2 text-slate-300 outline-none" style={{ fontSize: '0.75rem' }} />
              </div>
              <div>
                <label className="text-slate-500 block mb-1.5" style={{ fontSize: '0.75rem' }}>To</label>
                <input type="date" value={config.dateTo} onChange={e => setConfig(p => ({ ...p, dateTo: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-2 py-2 text-slate-300 outline-none" style={{ fontSize: '0.75rem' }} />
              </div>
            </div>

            <div>
              <label className="text-slate-500 block mb-1.5" style={{ fontSize: '0.75rem' }}>Capital (₹)</label>
              <input type="number" value={config.capital} onChange={e => setConfig(p => ({ ...p, capital: +e.target.value }))}
                className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-slate-300 outline-none" style={{ fontSize: '0.82rem' }} />
            </div>

            <div>
              <label className="text-slate-500 block mb-1.5" style={{ fontSize: '0.75rem' }}>Risk per Trade (%)</label>
              <input type="number" value={config.riskPerTrade} min={0.5} max={5} step={0.5}
                onChange={e => setConfig(p => ({ ...p, riskPerTrade: +e.target.value }))}
                className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-3 py-2 text-slate-300 outline-none" style={{ fontSize: '0.82rem' }} />
            </div>

            <div>
              <label className="text-slate-500 block mb-2" style={{ fontSize: '0.75rem' }}>Indicators</label>
              <div className="flex flex-wrap gap-1.5">
                {indicators.map(ind => (
                  <button key={ind}
                    onClick={() => setConfig(p => ({
                      ...p,
                      indicators: p.indicators.includes(ind) ? p.indicators.filter(i => i !== ind) : [...p.indicators, ind],
                    }))}
                    className={`px-2.5 py-1 rounded-lg border text-xs transition-colors ${config.indicators.includes(ind) ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300' : 'bg-slate-800/40 border-slate-700/40 text-slate-500'}`}>
                    {ind}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-500 block mb-1.5" style={{ fontSize: '0.75rem' }}>Min Score</label>
                <input type="number" value={config.minScore} min={50} max={100}
                  onChange={e => setConfig(p => ({ ...p, minScore: +e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-2 py-2 text-slate-300 outline-none" style={{ fontSize: '0.75rem' }} />
              </div>
              <div>
                <label className="text-slate-500 block mb-1.5" style={{ fontSize: '0.75rem' }}>Min AI Conf %</label>
                <input type="number" value={config.minConfidence} min={50} max={100}
                  onChange={e => setConfig(p => ({ ...p, minConfidence: +e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-2 py-2 text-slate-300 outline-none" style={{ fontSize: '0.75rem' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {metricsGood.map(m => (
              <motion.div key={m.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${m.bg} border border-current/10 rounded-2xl p-4 text-center`}
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className={m.color} style={{ fontSize: '1.3rem', fontWeight: 800 }}>{m.value}</div>
                <div className="text-slate-500 mt-0.5" style={{ fontSize: '0.7rem' }}>{m.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Equity Curve */}
          <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-300" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Equity Curve</h3>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-slate-500" style={{ fontSize: '0.65rem' }}>Start</div>
                  <div className="text-slate-300" style={{ fontSize: '0.82rem', fontWeight: 600 }}>₹{(results.capital / 1e5).toFixed(1)}L</div>
                </div>
                <div>
                  <div className="text-slate-500" style={{ fontSize: '0.65rem' }}>End</div>
                  <div className="text-emerald-400" style={{ fontSize: '0.82rem', fontWeight: 600 }}>₹{(results.finalValue / 1e5).toFixed(2)}L</div>
                </div>
                <div>
                  <div className="text-slate-500" style={{ fontSize: '0.65rem' }}>Return</div>
                  <div className="text-emerald-400" style={{ fontSize: '0.82rem', fontWeight: 700 }}>+{results.totalReturn}%</div>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={results.equityCurve}>
                <defs>
                  <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2236" />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 9 }} interval={2} />
                <YAxis tick={{ fill: '#475569', fontSize: 9 }} tickFormatter={v => `₹${(v / 1e5).toFixed(1)}L`} width={60} domain={['auto', 'auto']} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Value']} contentStyle={{ backgroundColor: '#1e2236', border: '1px solid #334155', borderRadius: '8px', fontSize: '0.72rem' }} />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fill="url(#eqGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Returns */}
          <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
            <h3 className="text-slate-300 mb-3" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Monthly Returns (2025)</h3>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={monthlyReturns}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2236" />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 9 }} />
                <YAxis tick={{ fill: '#475569', fontSize: 9 }} tickFormatter={v => `${v}%`} width={35} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Return']} contentStyle={{ backgroundColor: '#1e2236', border: '1px solid #334155', borderRadius: '8px', fontSize: '0.72rem' }} />
                <Bar dataKey="return" radius={[3, 3, 0, 0]}>
                  {monthlyReturns.map((entry, i) => (
                    <Cell key={i} fill={entry.return >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { label: 'Total Trades', value: results.totalTrades },
              { label: 'Wins', value: results.winningTrades, color: 'text-emerald-400' },
              { label: 'Losses', value: results.losingTrades, color: 'text-red-400' },
              { label: 'Avg Win', value: `+${results.avgWin}%`, color: 'text-emerald-400' },
              { label: 'Avg Loss', value: `${results.avgLoss}%`, color: 'text-red-400' },
              { label: 'Max DD', value: `${results.maxDrawdown}%`, color: 'text-amber-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#111520] border border-[#1e2236] rounded-xl p-3 text-center">
                <div className={s.color || 'text-slate-300'} style={{ fontSize: '0.9rem', fontWeight: 700 }}>{s.value}</div>
                <div className="text-slate-600" style={{ fontSize: '0.62rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}