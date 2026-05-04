'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ScanLine, Filter, Zap, TrendingUp, TrendingDown, ChevronUp, ChevronDown, RefreshCw, Info, X } from 'lucide-react';
import { stocks, type Stock } from '../data/mockData';
import { SparklineChart } from '../components/SparklineChart';
import { motion, AnimatePresence } from 'motion/react';

const riskColor = { Low: 'text-emerald-400 bg-emerald-500/10', Medium: 'text-amber-400 bg-amber-500/10', High: 'text-red-400 bg-red-500/10' };

export function Scanner() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    sector: 'All', riskLevel: 'All', minRsi: 30, maxRsi: 80,
    minMomentum: 0, minAiConfidence: 0, minVolumeBreakout: 1.0, breakoutPattern: 'All',
  });
  const [sortBy, setSortBy] = useState<{ key: keyof Stock; dir: 'asc' | 'desc' }>({ key: 'momentumScore', dir: 'desc' });
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCount, setScanCount] = useState(0);

  const sectors = ['All', ...Array.from(new Set(stocks.map(s => s.sector)))];
  const patterns = ['All', 'Cup & Handle', 'Bull Flag', 'Ascending Triangle', 'Breakout Retest', 'Dip Recovery', 'Continuation'];

  const filtered = useMemo(() => {
    return stocks.filter(s => {
      if (filters.sector !== 'All' && s.sector !== filters.sector) return false;
      if (filters.riskLevel !== 'All' && s.riskLevel !== filters.riskLevel) return false;
      if (s.rsi < filters.minRsi || s.rsi > filters.maxRsi) return false;
      if (s.momentumScore < filters.minMomentum) return false;
      if (s.aiConfidence < filters.minAiConfidence) return false;
      if (s.volumeBreakout < filters.minVolumeBreakout) return false;
      if (filters.breakoutPattern !== 'All' && s.breakoutPattern !== filters.breakoutPattern) return false;
      return true;
    }).sort((a, b) => {
      const aVal = a[sortBy.key] as number;
      const bVal = b[sortBy.key] as number;
      return sortBy.dir === 'desc' ? (bVal - aVal) : (aVal - bVal);
    });
  }, [filters, sortBy]);

  const handleSort = (key: keyof Stock) => {
    setSortBy(prev => ({ key, dir: prev.key === key && prev.dir === 'desc' ? 'asc' : 'desc' }));
  };

  const runScan = async () => {
    setIsScanning(true);
    await new Promise(r => setTimeout(r, 1500));
    setScanCount(prev => prev + 1);
    setIsScanning(false);
  };

  const SortIcon = ({ col }: { col: keyof Stock }) => {
    if (sortBy.key !== col) return <ChevronUp className="w-3 h-3 text-slate-700" />;
    return sortBy.dir === 'desc' ? <ChevronDown className="w-3 h-3 text-violet-400" /> : <ChevronUp className="w-3 h-3 text-violet-400" />;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center">
            <ScanLine className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h1 className="text-slate-100" style={{ fontSize: '1.2rem', fontWeight: 700 }}>AI Stock Scanner</h1>
            <p className="text-slate-500" style={{ fontSize: '0.72rem' }}>{filtered.length} stocks matching filters • {stocks.length} total scanned</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${showFilters ? 'bg-violet-500/15 border-violet-500/30 text-violet-300' : 'bg-slate-800/60 border-slate-700/50 text-slate-400'}`} style={{ fontSize: '0.78rem' }}>
            <Filter className="w-3.5 h-3.5" /> Filters
          </button>
          <button onClick={runScan} disabled={isScanning}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors disabled:opacity-60" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
            {isScanning ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Scanning...</> : <><Zap className="w-3.5 h-3.5" /> Run Scan</>}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4 overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              <div>
                <label className="text-slate-500 block mb-1" style={{ fontSize: '0.68rem' }}>Sector</label>
                <select value={filters.sector} onChange={e => setFilters(p => ({ ...p, sector: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-slate-300 outline-none" style={{ fontSize: '0.75rem' }}>
                  {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-500 block mb-1" style={{ fontSize: '0.68rem' }}>Risk Level</label>
                <select value={filters.riskLevel} onChange={e => setFilters(p => ({ ...p, riskLevel: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-slate-300 outline-none" style={{ fontSize: '0.75rem' }}>
                  {['All', 'Low', 'Medium', 'High'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-500 block mb-1" style={{ fontSize: '0.68rem' }}>Min RSI</label>
                <input type="number" value={filters.minRsi} min={0} max={100}
                  onChange={e => setFilters(p => ({ ...p, minRsi: +e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-slate-300 outline-none" style={{ fontSize: '0.75rem' }} />
              </div>
              <div>
                <label className="text-slate-500 block mb-1" style={{ fontSize: '0.68rem' }}>Max RSI</label>
                <input type="number" value={filters.maxRsi} min={0} max={100}
                  onChange={e => setFilters(p => ({ ...p, maxRsi: +e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-slate-300 outline-none" style={{ fontSize: '0.75rem' }} />
              </div>
              <div>
                <label className="text-slate-500 block mb-1" style={{ fontSize: '0.68rem' }}>Min Score</label>
                <input type="number" value={filters.minMomentum} min={0} max={100}
                  onChange={e => setFilters(p => ({ ...p, minMomentum: +e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-slate-300 outline-none" style={{ fontSize: '0.75rem' }} />
              </div>
              <div>
                <label className="text-slate-500 block mb-1" style={{ fontSize: '0.68rem' }}>AI Conf %</label>
                <input type="number" value={filters.minAiConfidence} min={0} max={100}
                  onChange={e => setFilters(p => ({ ...p, minAiConfidence: +e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-slate-300 outline-none" style={{ fontSize: '0.75rem' }} />
              </div>
              <div>
                <label className="text-slate-500 block mb-1" style={{ fontSize: '0.68rem' }}>Vol Breakout</label>
                <input type="number" step={0.1} value={filters.minVolumeBreakout} min={1}
                  onChange={e => setFilters(p => ({ ...p, minVolumeBreakout: +e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-slate-300 outline-none" style={{ fontSize: '0.75rem' }} />
              </div>
              <div>
                <label className="text-slate-500 block mb-1" style={{ fontSize: '0.68rem' }}>Pattern</label>
                <select value={filters.breakoutPattern} onChange={e => setFilters(p => ({ ...p, breakoutPattern: e.target.value }))}
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-2 py-1.5 text-slate-300 outline-none" style={{ fontSize: '0.75rem' }}>
                  {patterns.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Table */}
      <div className="bg-[#111520] border border-[#1e2236] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e2236]">
                {[
                  { key: 'name', label: 'Stock' },
                  { key: 'price', label: 'Price' },
                  { key: 'changePercent', label: '% Chg' },
                  { key: 'momentumScore', label: 'Score' },
                  { key: 'aiConfidence', label: 'AI Conf' },
                  { key: 'volumeBreakout', label: 'Vol BO' },
                  { key: 'rsi', label: 'RSI' },
                  { key: 'sectorStrength', label: 'Sector' },
                  { key: 'suggestedEntry', label: 'Entry' },
                  { key: 'suggestedExit', label: 'Target' },
                  { key: 'riskLevel', label: 'Risk' },
                ].map(col => (
                  <th key={col.key} onClick={() => col.key !== 'name' && col.key !== 'riskLevel' && handleSort(col.key as keyof Stock)}
                    className="text-left px-3 py-2.5 text-slate-500 cursor-pointer hover:text-slate-300 transition-colors whitespace-nowrap select-none"
                    style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.key !== 'name' && col.key !== 'riskLevel' && <SortIcon col={col.key as keyof Stock} />}
                    </span>
                  </th>
                ))}
                <th className="px-3 py-2.5 text-slate-500" style={{ fontSize: '0.7rem' }}>Chart</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1d2e]">
              {filtered.map((stock, i) => (
                <motion.tr
                  key={stock.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedStock(selectedStock?.id === stock.id ? null : stock)}
                  className={`hover:bg-slate-800/30 cursor-pointer transition-colors ${selectedStock?.id === stock.id ? 'bg-violet-500/5' : ''}`}
                >
                  <td className="px-3 py-2.5">
                    <div className="text-slate-200" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{stock.id}</div>
                    <div className="text-slate-600" style={{ fontSize: '0.65rem' }}>{stock.sector}</div>
                  </td>
                  <td className="px-3 py-2.5 text-slate-300 whitespace-nowrap" style={{ fontSize: '0.8rem' }}>
                    ₹{stock.price.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`flex items-center gap-0.5 ${stock.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`} style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                      {stock.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full" style={{ width: `${stock.momentumScore}%` }} />
                      </div>
                      <span className="text-violet-400" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{stock.momentumScore}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full ${stock.aiConfidence >= 80 ? 'bg-emerald-500/10 text-emerald-400' : stock.aiConfidence >= 65 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-500'}`} style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                      {stock.aiConfidence}%
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`${stock.volumeBreakout >= 1.5 ? 'text-emerald-400' : 'text-slate-400'}`} style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                      {stock.volumeBreakout.toFixed(2)}x
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`${stock.rsi >= 70 ? 'text-red-400' : stock.rsi <= 40 ? 'text-emerald-400' : 'text-slate-300'}`} style={{ fontSize: '0.78rem' }}>
                      {stock.rsi.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-10 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stock.sectorStrength}%` }} />
                      </div>
                      <span className="text-slate-400" style={{ fontSize: '0.72rem' }}>{stock.sectorStrength}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-emerald-400" style={{ fontSize: '0.78rem' }}>₹{stock.suggestedEntry.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2.5 text-blue-400" style={{ fontSize: '0.78rem' }}>₹{stock.suggestedExit.toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2.5">
                    <span className={`px-2 py-0.5 rounded-full ${riskColor[stock.riskLevel]}`} style={{ fontSize: '0.68rem', fontWeight: 600 }}>
                      {stock.riskLevel}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="w-16 h-8">
                      <SparklineChart data={stock.sparkData} color="auto" />
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Explanation Card */}
      <AnimatePresence>
        {selectedStock && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-gradient-to-r from-violet-900/20 to-indigo-900/20 border border-violet-500/30 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <div className="text-violet-300" style={{ fontSize: '0.9rem', fontWeight: 600 }}>AI Analysis: {selectedStock.id}</div>
                  <div className="text-slate-500" style={{ fontSize: '0.7rem' }}>Confidence: {selectedStock.aiConfidence}% • {selectedStock.breakoutPattern}</div>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={() => router.push(`/stock/${selectedStock.id}`)}
                  className="px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors" style={{ fontSize: '0.75rem' }}>
                  Full Analysis
                </button>
                <button onClick={() => setSelectedStock(null)} className="text-slate-500 hover:text-slate-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-slate-300 mb-4" style={{ fontSize: '0.82rem', lineHeight: 1.6 }}>{selectedStock.aiExplanation}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Entry Zone', value: `₹${selectedStock.suggestedEntry.toLocaleString('en-IN')}`, color: 'text-emerald-400' },
                { label: 'Target', value: `₹${selectedStock.suggestedExit.toLocaleString('en-IN')}`, color: 'text-blue-400' },
                { label: 'Avg Zone', value: `₹${selectedStock.avgZone.toLocaleString('en-IN')}`, color: 'text-amber-400' },
                { label: 'Delivery %', value: `${selectedStock.deliveryPercent}%`, color: 'text-slate-300' },
              ].map(item => (
                <div key={item.label} className="bg-slate-900/60 rounded-xl p-3 text-center">
                  <div className={item.color} style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.value}</div>
                  <div className="text-slate-600 mt-0.5" style={{ fontSize: '0.65rem' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
