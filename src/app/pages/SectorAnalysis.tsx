'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';
import { sectorData, stocks } from '../data/mockData';
import { motion } from 'motion/react';

const momentumColor: Record<string, string> = {
  'Very Strong': 'text-emerald-300 bg-emerald-500/15 border-emerald-500/25',
  Strong: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Moderate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Neutral: 'text-slate-400 bg-slate-800/60 border-slate-700/40',
  Weak: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const radarData = sectorData.map(s => ({
  sector: s.name.substring(0, 5),
  strength: s.strength,
}));

export function SectorAnalysis() {
  const router = useRouter();
  const [selectedSector, setSelectedSector] = useState(sectorData[0]);
  const [view, setView] = useState<'bar' | 'table'>('bar');

  const sectorStocks = stocks.filter(s => s.sector === selectedSector.name);
  const sorted = [...sectorData].sort((a, b) => b.strength - a.strength);
  const rotationData = [...sectorData].sort((a, b) => b.change - a.change).map(s => ({
    name: s.name,
    change: s.change,
    fill: s.change >= 0 ? '#10b981' : '#ef4444',
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-slate-100" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Sector Strength Analysis</h1>
          <p className="text-slate-500" style={{ fontSize: '0.72rem' }}>Real-time sector rotation & momentum flow tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Heatmap */}
        <div className="lg:col-span-2 bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
          <h3 className="text-slate-300 mb-4" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sector Heatmap</h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {sectorData.map((sector, i) => {
              const intensity = Math.min(Math.abs(sector.change) / 3, 1);
              const isPos = sector.change >= 0;
              return (
                <motion.div
                  key={sector.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => setSelectedSector(sector)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.03] ${selectedSector.name === sector.name ? 'ring-2 ring-violet-500/50' : ''}`}
                  style={{
                    backgroundColor: isPos ? `rgba(16,185,129,${intensity * 0.25})` : `rgba(239,68,68,${intensity * 0.25})`,
                    borderColor: isPos ? `rgba(16,185,129,${intensity * 0.4})` : `rgba(239,68,68,${intensity * 0.4})`,
                  }}
                >
                  <div className="text-slate-300" style={{ fontSize: '0.78rem', fontWeight: 600 }}>{sector.name}</div>
                  <div className={isPos ? 'text-emerald-400' : 'text-red-400'} style={{ fontSize: '1rem', fontWeight: 800 }}>
                    {isPos ? '+' : ''}{sector.change}%
                  </div>
                  <div className="mt-1.5">
                    <div className="h-1 bg-slate-800/60 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isPos ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${sector.strength}%` }} />
                    </div>
                    <div className="text-slate-600 mt-0.5" style={{ fontSize: '0.58rem' }}>Str: {sector.strength}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Relative Strength Bars */}
          <div className="mt-4 pt-4 border-t border-[#1e2236]">
            <h4 className="text-slate-500 mb-3" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Relative Strength (0-100)</h4>
            <div className="space-y-2">
              {sorted.map(sector => (
                <div key={sector.name} className="flex items-center gap-3">
                  <span className="text-slate-400 w-16 text-right flex-shrink-0" style={{ fontSize: '0.72rem' }}>{sector.name}</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sector.strength}%` }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: sector.change >= 0 ? '#10b981' : '#ef4444' }}
                    />
                  </div>
                  <span className={sector.change >= 0 ? 'text-emerald-400' : 'text-red-400'}
                    style={{ fontSize: '0.72rem', fontWeight: 600, width: '30px' }}>{sector.strength}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-3">
          {/* Radar Chart */}
          <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
            <h3 className="text-slate-300 mb-3" style={{ fontSize: '0.88rem', fontWeight: 600 }}>Sector Radar</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData.slice(0, 8)}>
                <PolarGrid stroke="#1e2236" />
                <PolarAngleAxis dataKey="sector" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <Radar dataKey="strength" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Selected Sector Detail */}
          <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-slate-200" style={{ fontSize: '0.95rem', fontWeight: 700 }}>{selectedSector.name}</h3>
                <span className={`px-2 py-0.5 rounded-full border ${momentumColor[selectedSector.momentum]}`} style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                  {selectedSector.momentum}
                </span>
              </div>
              <div className={`text-right ${selectedSector.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{selectedSector.change >= 0 ? '+' : ''}{selectedSector.change}%</div>
                <div className="text-slate-600" style={{ fontSize: '0.65rem' }}>Today</div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-600" style={{ fontSize: '0.72rem' }}>Relative Strength</span>
                <span className="text-slate-300" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{selectedSector.strength}/100</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full" style={{ width: `${selectedSector.strength}%` }} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600" style={{ fontSize: '0.72rem' }}>Top Stock</span>
                <span className="text-violet-400" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{selectedSector.topStock}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-slate-500 mb-2" style={{ fontSize: '0.72rem', fontWeight: 600 }}>Top Stocks</div>
              {sectorStocks.slice(0, 3).map(s => (
                <div key={s.id} onClick={() => router.push(`/stock/${s.id}`)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/40 cursor-pointer transition-colors">
                  <div>
                    <span className="text-slate-300" style={{ fontSize: '0.78rem', fontWeight: 500 }}>{s.id}</span>
                    <div className="text-slate-600" style={{ fontSize: '0.62rem' }}>Score: {s.momentumScore}</div>
                  </div>
                  <span className={s.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                    {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                  </span>
                </div>
              ))}
              {sectorStocks.length === 0 && (
                <div className="text-slate-600 text-center py-3" style={{ fontSize: '0.75rem' }}>No stocks in scanner for this sector</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rotation Table/Chart */}
      <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-violet-400" />
            <h3 className="text-slate-300" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sector Rotation Intelligence</h3>
          </div>
          <div className="flex gap-1 p-1 bg-slate-800/40 rounded-xl">
            {(['bar', 'table'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${view === v ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
                style={{ fontSize: '0.72rem' }}>{v === 'bar' ? 'Chart' : 'Table'}</button>
            ))}
          </div>
        </div>

        {view === 'bar' ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={rotationData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2236" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#475569', fontSize: 10 }} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} width={65} />
              <Tooltip formatter={(v: number) => [`${v.toFixed(2)}%`, 'Change']}
                contentStyle={{ backgroundColor: '#1e2236', border: '1px solid #334155', borderRadius: '8px', fontSize: '0.72rem' }} />
              <Bar dataKey="change" radius={[0, 4, 4, 0]}>
                {rotationData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e2236]">
                  {['Sector', 'Today %', 'Strength', 'Momentum', 'Top Stock', 'Signal'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-slate-600 whitespace-nowrap"
                      style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1d2e]">
                {sectorData.sort((a, b) => b.strength - a.strength).map(s => (
                  <tr key={s.name} onClick={() => setSelectedSector(s)}
                    className="hover:bg-slate-800/30 cursor-pointer transition-colors">
                    <td className="py-3 px-3 text-slate-300" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{s.name}</td>
                    <td className="py-3 px-3">
                      <span className={`flex items-center gap-0.5 ${s.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                        style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                        {s.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {s.change >= 0 ? '+' : ''}{s.change}%
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${s.strength >= 70 ? 'bg-emerald-500' : s.strength >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${s.strength}%` }} />
                        </div>
                        <span className="text-slate-400" style={{ fontSize: '0.72rem' }}>{s.strength}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full border ${momentumColor[s.momentum]}`}
                        style={{ fontSize: '0.65rem', fontWeight: 600 }}>{s.momentum}</span>
                    </td>
                    <td className="py-3 px-3 text-violet-400" style={{ fontSize: '0.78rem' }}>{s.topStock}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold ${s.strength >= 70 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : s.strength >= 50 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}
                        style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                        {s.strength >= 70 ? 'BUY' : s.strength >= 50 ? 'HOLD' : 'AVOID'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
