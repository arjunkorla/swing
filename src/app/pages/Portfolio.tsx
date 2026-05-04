import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Briefcase, TrendingUp, TrendingDown, PieChart as PieIcon, AlertTriangle, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { portfolioHoldings, mtfPositions } from '../data/mockData';
import { motion } from 'motion/react';

const SECTOR_COLORS: Record<string, string> = {
  Energy: '#f59e0b', Banking: '#8b5cf6', Auto: '#10b981', IT: '#3b82f6', Pharma: '#06b6d4', Realty: '#ec4899',
};

const pnlHistory = [
  { date: 'Apr 25', value: 580000 }, { date: 'Apr 27', value: 595000 }, { date: 'Apr 29', value: 571000 },
  { date: 'May 1', value: 608000 }, { date: 'May 2', value: 612000 }, { date: 'May 4', value: 621967 },
];

export function Portfolio() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'holdings' | 'mtf'>('holdings');

  const totalInvested = portfolioHoldings.reduce((s, h) => s + h.investedValue, 0);
  const totalCurrent = portfolioHoldings.reduce((s, h) => s + h.currentValue, 0);
  const totalPnl = portfolioHoldings.reduce((s, h) => s + h.pnl, 0);
  const dayPnl = portfolioHoldings.reduce((s, h) => s + h.dayChange, 0);
  const mtfExposure = mtfPositions.reduce((s, p) => s + p.exposure, 0);
  const mtfPnl = mtfPositions.reduce((s, p) => s + p.pnl, 0);

  // Sector allocation
  const sectorMap: Record<string, number> = {};
  portfolioHoldings.forEach(h => {
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.currentValue;
  });
  const sectorAlloc = Object.entries(sectorMap).map(([name, value]) => ({
    name, value: Math.round(value), percent: Math.round(value / totalCurrent * 100),
  }));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-slate-100" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Portfolio & MTF</h1>
            <p className="text-slate-500" style={{ fontSize: '0.72rem' }}>{portfolioHoldings.length} holdings • {mtfPositions.length} MTF positions</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
          <Plus className="w-3.5 h-3.5" /> Add Position
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Invested', value: `₹${(totalInvested / 1e5).toFixed(2)}L`, sub: 'Cost basis', color: 'text-slate-300' },
          { label: 'Current Value', value: `₹${(totalCurrent / 1e5).toFixed(2)}L`, sub: 'Market value', color: 'text-slate-300' },
          { label: 'Total P&L', value: `${totalPnl >= 0 ? '+' : ''}₹${Math.abs(totalPnl).toLocaleString('en-IN')}`, sub: `${((totalPnl / totalInvested) * 100).toFixed(2)}% return`, color: totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400' },
          { label: "Today's P&L", value: `${dayPnl >= 0 ? '+' : ''}₹${Math.abs(dayPnl).toLocaleString('en-IN')}`, sub: 'Day change', color: dayPnl >= 0 ? 'text-emerald-400' : 'text-red-400' },
        ].map(card => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
            <div className="text-slate-500 mb-1" style={{ fontSize: '0.72rem' }}>{card.label}</div>
            <div className={card.color} style={{ fontSize: '1rem', fontWeight: 700 }}>{card.value}</div>
            <div className="text-slate-600" style={{ fontSize: '0.65rem' }}>{card.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* P&L Chart */}
        <div className="lg:col-span-2 bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
          <h3 className="text-slate-300 mb-3" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Portfolio Value (Week)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={pnlHistory}>
              <defs>
                <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2236" />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickFormatter={v => `₹${(v / 1e5).toFixed(1)}L`} width={65} domain={['auto', 'auto']} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Value']} contentStyle={{ backgroundColor: '#1e2236', border: '1px solid #334155', borderRadius: '12px', fontSize: '0.75rem' }} />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fill="url(#portfolioGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 mb-3 p-1 bg-slate-800/40 rounded-xl w-fit">
            {(['holdings', 'mtf'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-colors capitalize ${activeTab === tab ? 'bg-slate-700 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
                style={{ fontSize: '0.78rem', fontWeight: activeTab === tab ? 600 : 400 }}>
                {tab === 'mtf' ? 'MTF Positions' : 'Holdings'}
              </button>
            ))}
          </div>

          {activeTab === 'holdings' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1e2236]">
                    {['Stock', 'Qty', 'Avg Price', 'LTP', 'Invested', 'Current', 'P&L', 'Day P&L'].map(h => (
                      <th key={h} className="text-left py-2 text-slate-600 whitespace-nowrap" style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', paddingRight: '12px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1d2e]">
                  {portfolioHoldings.map(h => (
                    <tr key={h.symbol} onClick={() => navigate(`/stock/${h.symbol}`)}
                      className="hover:bg-slate-800/30 cursor-pointer transition-colors">
                      <td className="py-2.5 pr-3">
                        <div className="text-slate-200" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{h.symbol}</div>
                        <div className="text-slate-600" style={{ fontSize: '0.65rem' }}>{h.sector}</div>
                      </td>
                      <td className="py-2.5 pr-3 text-slate-400" style={{ fontSize: '0.78rem' }}>{h.qty}</td>
                      <td className="py-2.5 pr-3 text-slate-400" style={{ fontSize: '0.78rem' }}>₹{h.avgPrice.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 pr-3 text-slate-300" style={{ fontSize: '0.78rem', fontWeight: 500 }}>₹{h.currentPrice.toLocaleString('en-IN')}</td>
                      <td className="py-2.5 pr-3 text-slate-500" style={{ fontSize: '0.78rem' }}>₹{(h.investedValue / 1000).toFixed(1)}K</td>
                      <td className="py-2.5 pr-3 text-slate-300" style={{ fontSize: '0.78rem' }}>₹{(h.currentValue / 1000).toFixed(1)}K</td>
                      <td className="py-2.5 pr-3">
                        <div className={h.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'} style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                          {h.pnl >= 0 ? '+' : ''}₹{Math.abs(h.pnl).toLocaleString('en-IN')}
                        </div>
                        <div className={h.pnlPercent >= 0 ? 'text-emerald-500' : 'text-red-500'} style={{ fontSize: '0.65rem' }}>
                          {h.pnlPercent >= 0 ? '+' : ''}{h.pnlPercent.toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-2.5">
                        <span className={h.dayChange >= 0 ? 'text-emerald-400' : 'text-red-400'} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                          {h.dayChange >= 0 ? '+' : ''}₹{Math.abs(h.dayChange).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'mtf' && (
            <div className="space-y-3">
              {mtfPositions.map(pos => (
                <div key={pos.symbol} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-slate-200" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{pos.symbol}</span>
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400" style={{ fontSize: '0.65rem' }}>{pos.leverage} Leverage</span>
                    </div>
                    <span className={pos.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'} style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                      {pos.pnl >= 0 ? '+' : ''}₹{pos.pnl.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Qty', value: pos.qty },
                      { label: 'Avg', value: `₹${pos.avgPrice.toLocaleString('en-IN')}` },
                      { label: 'Exposure', value: `₹${(pos.exposure / 1000).toFixed(1)}K` },
                      { label: 'Margin Used', value: `₹${pos.margin.toLocaleString('en-IN')}` },
                    ].map(item => (
                      <div key={item.label} className="text-center">
                        <div className="text-slate-300" style={{ fontSize: '0.8rem', fontWeight: 600 }}>{item.value}</div>
                        <div className="text-slate-600" style={{ fontSize: '0.62rem' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-amber-400" style={{ fontSize: '0.68rem' }}>Margin call at ₹{pos.marginCallAt.toLocaleString('en-IN')} | {pos.daysHeld}d held</span>
                  </div>
                </div>
              ))}
              <div className="p-3 rounded-xl bg-slate-800/20 border border-slate-700/30">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500" style={{ fontSize: '0.78rem' }}>Total MTF Exposure</span>
                  <span className="text-amber-400" style={{ fontSize: '0.85rem', fontWeight: 700 }}>₹{(mtfExposure / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-slate-500" style={{ fontSize: '0.78rem' }}>MTF P&L</span>
                  <span className={mtfPnl >= 0 ? 'text-emerald-400' : 'text-red-400'} style={{ fontSize: '0.85rem', fontWeight: 700 }}>+₹{mtfPnl.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sector Allocation */}
        <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
          <h3 className="text-slate-300 mb-4" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sector Allocation</h3>
          <div className="flex justify-center mb-4">
            <PieChart width={180} height={180}>
              <Pie data={sectorAlloc} cx={86} cy={86} innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                {sectorAlloc.map((entry, i) => (
                  <Cell key={i} fill={SECTOR_COLORS[entry.name] || '#6366f1'} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`₹${(v / 1000).toFixed(1)}K`, '']} contentStyle={{ backgroundColor: '#1e2236', border: '1px solid #334155', borderRadius: '8px', fontSize: '0.72rem' }} />
            </PieChart>
          </div>
          <div className="space-y-2">
            {sectorAlloc.map(s => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: SECTOR_COLORS[s.name] || '#6366f1' }} />
                <span className="flex-1 text-slate-400" style={{ fontSize: '0.75rem' }}>{s.name}</span>
                <span className="text-slate-300" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{s.percent}%</span>
              </div>
            ))}
          </div>

          {/* Risk Exposure */}
          <div className="mt-4 pt-4 border-t border-[#1e2236] space-y-2">
            <h4 className="text-slate-400" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Risk Metrics</h4>
            {[
              { label: 'Portfolio Beta', value: '1.2', status: 'Moderate' },
              { label: 'VaR (95%)', value: '-₹28,400', status: '4.3%' },
              { label: 'MTF Usage', value: '19.7%', status: 'Healthy' },
            ].map(item => (
              <div key={item.label} className="flex justify-between">
                <span className="text-slate-600" style={{ fontSize: '0.72rem' }}>{item.label}</span>
                <div className="text-right">
                  <span className="text-slate-300" style={{ fontSize: '0.72rem', fontWeight: 600 }}>{item.value}</span>
                  <span className="text-slate-600 ml-1" style={{ fontSize: '0.65rem' }}>({item.status})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
