import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { TrendingUp, TrendingDown, Activity, ArrowUpRight, ArrowDownRight, Zap, BarChart3, Target, AlertCircle, RefreshCw } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { SparklineChart } from '../components/SparklineChart';
import { indices, stocks, sectorData, marketBreadth, portfolioHoldings, alertsData } from '../data/mockData';
import { getMarketSentiment } from '../services/aiService';
import { motion } from 'motion/react';

export function Dashboard() {
  const navigate = useNavigate();
  const [sentiment, setSentiment] = useState<any>(null);
  const [liveIndices, setLiveIndices] = useState(indices);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    getMarketSentiment().then(setSentiment);
    const interval = setInterval(() => {
      setLiveIndices(prev => prev.map(idx => {
        const delta = (Math.random() - 0.49) * 8;
        return {
          ...idx,
          value: Math.round((idx.value + delta) * 100) / 100,
          change: Math.round((idx.change + delta) * 100) / 100,
          changePercent: Math.round((idx.changePercent + delta / idx.value * 100) * 100) / 100,
        };
      }));
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalPortfolioPnl = portfolioHoldings.reduce((s, h) => s + h.pnl, 0);
  const totalInvested = portfolioHoldings.reduce((s, h) => s + h.investedValue, 0);
  const topGainers = [...stocks].filter(s => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const topLosers = [...stocks].filter(s => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);

  const sectorAlloc = [
    { name: 'Banking', value: 28, color: '#8b5cf6' },
    { name: 'Auto', value: 22, color: '#10b981' },
    { name: 'Pharma', value: 18, color: '#3b82f6' },
    { name: 'IT', value: 24, color: '#f59e0b' },
    { name: 'Energy', value: 8, color: '#ef4444' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-100" style={{ fontSize: '1.3rem', fontWeight: 700 }}>Market Dashboard</h1>
          <p className="text-slate-500" style={{ fontSize: '0.78rem' }}>
            Last updated: {lastUpdate.toLocaleTimeString()} •{' '}
            <span className="text-emerald-400">Live</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLiveIndices(indices)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors" style={{ fontSize: '0.78rem' }}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button onClick={() => navigate('/scanner')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors" style={{ fontSize: '0.78rem' }}>
            <Zap className="w-3.5 h-3.5" /> AI Scanner
          </button>
        </div>
      </div>

      {/* Index Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {liveIndices.map((idx, i) => (
          <motion.div
            key={idx.symbol}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4 hover:border-slate-600/50 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500" style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{idx.name}</span>
              <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full ${idx.changePercent >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`} style={{ fontSize: '0.65rem', fontWeight: 600 }}>
                {idx.changePercent >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                {idx.changePercent >= 0 ? '+' : ''}{idx.changePercent.toFixed(2)}%
              </span>
            </div>
            <div className="text-slate-100 mb-1" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {idx.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </div>
            <div className={`${idx.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`} style={{ fontSize: '0.72rem' }}>
              {idx.change >= 0 ? '+' : ''}{idx.change.toFixed(2)}
            </div>
            <div className="mt-3 h-10">
              <SparklineChart data={idx.sparkData} color={idx.changePercent >= 0 ? '#10b981' : '#ef4444'} type="area" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Gainers / Losers */}
        <div className="bg-[#111520] border border-[#1e2236] rounded-2xl overflow-hidden">
          <div className="flex border-b border-[#1e2236]">
            {['Top Gainers', 'Top Losers'].map((tab, i) => (
              <button key={tab} className={`flex-1 py-3 text-center transition-colors ${i === 0 ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
                style={{ fontSize: '0.78rem', fontWeight: 600 }}>{tab}</button>
            ))}
          </div>
          <div className="divide-y divide-[#1e2236]">
            {topGainers.map(s => (
              <div key={s.id} onClick={() => navigate(`/stock/${s.id}`)}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/30 cursor-pointer transition-colors">
                <div>
                  <div className="text-slate-200" style={{ fontSize: '0.82rem', fontWeight: 500 }}>{s.id}</div>
                  <div className="text-slate-600" style={{ fontSize: '0.68rem' }}>{s.sector}</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-300" style={{ fontSize: '0.82rem', fontWeight: 500 }}>₹{s.price.toLocaleString('en-IN')}</div>
                  <div className="text-emerald-400 flex items-center justify-end gap-0.5" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                    <ArrowUpRight className="w-3 h-3" />+{s.changePercent.toFixed(2)}%
                  </div>
                </div>
                <div className="w-14 h-8 ml-2">
                  <SparklineChart data={s.sparkData} color="#10b981" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Sector Heatmap */}
        <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-slate-200" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sector Heatmap</h3>
            <button onClick={() => navigate('/sector')} className="text-violet-400 hover:text-violet-300 transition-colors" style={{ fontSize: '0.72rem' }}>
              View All →
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {sectorData.slice(0, 8).map(sector => (
              <div key={sector.name}
                className="p-3 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer"
                style={{
                  backgroundColor: sector.change > 0 ? `rgba(16,185,129,${Math.min(sector.change / 5, 0.25)})` : `rgba(239,68,68,${Math.min(Math.abs(sector.change) / 5, 0.25)})`,
                  borderColor: sector.change > 0 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                }}
                onClick={() => navigate('/sector')}
              >
                <div className="text-slate-300" style={{ fontSize: '0.75rem', fontWeight: 600 }}>{sector.name}</div>
                <div className={`${sector.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`} style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                  {sector.change >= 0 ? '+' : ''}{sector.change}%
                </div>
                <div className="text-slate-600 mt-0.5" style={{ fontSize: '0.62rem' }}>{sector.topStock} • {sector.stocks} stocks</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Sentiment + Market Breadth */}
        <div className="space-y-3">
          {/* AI Sentiment */}
          <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-violet-500/15 flex items-center justify-center">
                <Activity className="w-3 h-3 text-violet-400" />
              </div>
              <h3 className="text-slate-200" style={{ fontSize: '0.88rem', fontWeight: 600 }}>AI Market Sentiment</h3>
            </div>
            {sentiment ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-emerald-400" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{sentiment.overall}</span>
                  <span className="text-slate-400" style={{ fontSize: '0.78rem' }}>{sentiment.score}/100</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full mb-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sentiment.score}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full"
                  />
                </div>
                <p className="text-slate-500" style={{ fontSize: '0.72rem', lineHeight: 1.5 }}>{sentiment.summary.substring(0, 120)}...</p>
              </>
            ) : (
              <div className="h-20 flex items-center justify-center text-slate-600" style={{ fontSize: '0.8rem' }}>Analyzing market...</div>
            )}
          </div>

          {/* Market Breadth */}
          <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
            <h3 className="text-slate-200 mb-3" style={{ fontSize: '0.88rem', fontWeight: 600 }}>Market Breadth</h3>
            <div className="flex gap-3 mb-3">
              <div className="flex-1 text-center p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-emerald-400" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{marketBreadth.advances}</div>
                <div className="text-slate-500" style={{ fontSize: '0.65rem' }}>Advances</div>
              </div>
              <div className="flex-1 text-center p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="text-red-400" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{marketBreadth.declines}</div>
                <div className="text-slate-500" style={{ fontSize: '0.65rem' }}>Declines</div>
              </div>
            </div>
            <div className="space-y-2">
              {[
                { label: 'A/D Ratio', value: marketBreadth.advanceDeclineRatio, suffix: ':1', good: true },
                { label: 'New 52W Highs', value: marketBreadth.newHighs, suffix: '', good: true },
                { label: 'Above 50-DMA', value: `${marketBreadth.aboveDma50}%`, suffix: '', good: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-slate-500" style={{ fontSize: '0.72rem' }}>{item.label}</span>
                  <span className={item.good ? 'text-emerald-400' : 'text-red-400'} style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                    {item.value}{item.suffix}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Portfolio Snapshot + Momentum Stocks + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Portfolio Snapshot */}
        <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-200" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Portfolio Snapshot</h3>
            <button onClick={() => navigate('/portfolio')} className="text-violet-400" style={{ fontSize: '0.72rem' }}>View →</button>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-24 h-24 flex-shrink-0">
              <PieChart width={96} height={96}>
                <Pie data={sectorAlloc} cx={44} cy={44} innerRadius={28} outerRadius={44} dataKey="value" strokeWidth={0}>
                  {sectorAlloc.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </div>
            <div>
              <div className="text-slate-500 mb-0.5" style={{ fontSize: '0.72rem' }}>Total P&L</div>
              <div className={`${totalPortfolioPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`} style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {totalPortfolioPnl >= 0 ? '+' : ''}₹{Math.abs(totalPortfolioPnl).toLocaleString('en-IN')}
              </div>
              <div className="text-slate-500" style={{ fontSize: '0.72rem' }}>
                +{((totalPortfolioPnl / totalInvested) * 100).toFixed(2)}% overall
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            {portfolioHoldings.slice(0, 3).map(h => (
              <div key={h.symbol} className="flex items-center justify-between">
                <span className="text-slate-400" style={{ fontSize: '0.75rem' }}>{h.symbol}</span>
                <span className={`${h.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {h.pnl >= 0 ? '+' : ''}₹{Math.abs(h.pnl).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Momentum Stocks */}
        <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-400" />
              <h3 className="text-slate-200" style={{ fontSize: '0.9rem', fontWeight: 600 }}>AI Momentum Picks</h3>
            </div>
            <button onClick={() => navigate('/scanner')} className="text-violet-400" style={{ fontSize: '0.72rem' }}>Scanner →</button>
          </div>
          <div className="space-y-2">
            {stocks.filter(s => s.momentumScore >= 70).slice(0, 5).map(s => (
              <div key={s.id} onClick={() => navigate(`/stock/${s.id}`)}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/40 cursor-pointer transition-colors">
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-violet-400" style={{ fontSize: '0.6rem', fontWeight: 700 }}>{s.aiConfidence}%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-200" style={{ fontSize: '0.8rem', fontWeight: 500 }}>{s.id}</span>
                    <span className={`${s.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                      {s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600" style={{ fontSize: '0.68rem' }}>{s.breakoutPattern}</span>
                    <span className="text-slate-500" style={{ fontSize: '0.68rem' }}>Score: {s.momentumScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <h3 className="text-slate-200" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Recent Alerts</h3>
            </div>
            <button onClick={() => navigate('/alerts')} className="text-violet-400" style={{ fontSize: '0.72rem' }}>All →</button>
          </div>
          <div className="space-y-2">
            {alertsData.slice(0, 4).map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/30">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${alert.priority === 'high' ? 'bg-red-400' : alert.priority === 'medium' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-violet-400" style={{ fontSize: '0.72rem', fontWeight: 600 }}>{alert.symbol}</span>
                    <span className="text-slate-600" style={{ fontSize: '0.65rem' }}>• {alert.type}</span>
                  </div>
                  <div className="text-slate-400" style={{ fontSize: '0.7rem', lineHeight: 1.4 }}>{alert.message.substring(0, 60)}...</div>
                  <div className="text-slate-700 mt-0.5" style={{ fontSize: '0.62rem' }}>{alert.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
