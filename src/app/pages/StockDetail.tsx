import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, TrendingUp, TrendingDown, Plus, Minus, Star, Bell, Share2, Zap, Target, Shield, Activity, BarChart3 } from 'lucide-react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { stocks } from '../data/mockData';
import { getHistory } from '../services/fyersApi';
import { getStockAnalysis } from '../services/aiService';
import { motion } from 'motion/react';

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2" style={{ fontSize: '0.72rem' }}>
      <div className="text-slate-400">{d?.date}</div>
      <div className="text-slate-200">O: ₹{d?.open?.toFixed(2)} H: ₹{d?.high?.toFixed(2)}</div>
      <div className="text-slate-200">L: ₹{d?.low?.toFixed(2)} C: ₹{d?.close?.toFixed(2)}</div>
      <div className="text-slate-400">Vol: {(d?.volume / 1e6)?.toFixed(2)}M</div>
    </div>
  );
};

export function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('D');
  const [watchlisted, setWatchlisted] = useState(false);

  const stock = stocks.find(s => s.id === symbol) || stocks[0];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [hist, ai] = await Promise.all([
        getHistory(stock.symbol, timeframe as any, timeframe === 'D' ? 60 : 30),
        getStockAnalysis(stock.id, stock),
      ]);
      setChartData(hist.slice(-40).map(c => ({ ...c, fill: c.close >= c.open ? '#10b981' : '#ef4444' })));
      setAnalysis(ai);
      setLoading(false);
    };
    loadData();
  }, [stock, timeframe]);

  const recColor = analysis?.recommendation?.includes('BUY') ? 'text-emerald-400' : analysis?.recommendation?.includes('SELL') ? 'text-red-400' : 'text-amber-400';
  const recBg = analysis?.recommendation?.includes('BUY') ? 'bg-emerald-500/10 border-emerald-500/30' : analysis?.recommendation?.includes('SELL') ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-slate-100" style={{ fontSize: '1.3rem', fontWeight: 700 }}>{stock.id}</h1>
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${stock.changePercent >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`} style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                {stock.changePercent >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </span>
            </div>
            <p className="text-slate-500" style={{ fontSize: '0.75rem' }}>{stock.name} • {stock.exchange} • {stock.sector}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWatchlisted(!watchlisted)} className={`p-2 rounded-xl border transition-colors ${watchlisted ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-amber-400'}`}>
            <Star className="w-4 h-4" fill={watchlisted ? 'currentColor' : 'none'} />
          </button>
          <button className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-slate-200 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1.5" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
            <Plus className="w-3.5 h-3.5" /> Buy
          </button>
          <button className="px-4 py-2 rounded-xl bg-red-600/80 text-white hover:bg-red-700 transition-colors flex items-center gap-1.5" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
            <Minus className="w-3.5 h-3.5" /> Sell
          </button>
        </div>
      </div>

      {/* Price Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="col-span-2 sm:col-span-1 bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
          <div className="text-slate-500 mb-1" style={{ fontSize: '0.7rem' }}>LTP</div>
          <div className="text-slate-100" style={{ fontSize: '1.6rem', fontWeight: 700 }}>₹{stock.price.toLocaleString('en-IN')}</div>
          <div className={`flex items-center gap-1 mt-0.5 ${stock.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`} style={{ fontSize: '0.8rem', fontWeight: 600 }}>
            {stock.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </div>
        </div>
        {[
          { label: '52W High', value: `₹${stock.high52w.toLocaleString('en-IN')}`, sub: 'Resistance', color: 'text-slate-300' },
          { label: '52W Low', value: `₹${stock.low52w.toLocaleString('en-IN')}`, sub: 'Support', color: 'text-slate-300' },
          { label: 'Market Cap', value: stock.marketCap, sub: 'NSE', color: 'text-slate-300' },
          { label: 'Volume', value: `${(stock.volume / 1e6).toFixed(2)}M`, sub: `${stock.volumeBreakout.toFixed(2)}x avg`, color: stock.volumeBreakout >= 1.5 ? 'text-emerald-400' : 'text-slate-300' },
          { label: 'Delivery %', value: `${stock.deliveryPercent}%`, sub: 'of volume', color: 'text-slate-300' },
        ].map(item => (
          <div key={item.label} className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
            <div className="text-slate-500 mb-1" style={{ fontSize: '0.7rem' }}>{item.label}</div>
            <div className={item.color} style={{ fontSize: '0.95rem', fontWeight: 700 }}>{item.value}</div>
            <div className="text-slate-600" style={{ fontSize: '0.65rem' }}>{item.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="lg:col-span-2 bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-200" style={{ fontSize: '0.9rem', fontWeight: 600 }}>Price Chart</h3>
            <div className="flex gap-1">
              {['1', '5', '15', '60', 'D', 'W'].map(tf => (
                <button key={tf} onClick={() => setTimeframe(tf)}
                  className={`px-2 py-1 rounded-lg transition-colors ${timeframe === tf ? 'bg-violet-600 text-white' : 'bg-slate-800/60 text-slate-500 hover:text-slate-300'}`}
                  style={{ fontSize: '0.7rem' }}>{tf === 'D' ? '1D' : tf === 'W' ? '1W' : `${tf}m`}</button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-slate-600" style={{ fontSize: '0.85rem' }}>
              <div className="flex items-center gap-2"><Activity className="w-4 h-4 animate-pulse text-violet-400" /> Loading chart data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2236" />
                <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} tickFormatter={v => v.slice(5)} interval={7} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickFormatter={v => `₹${v.toFixed(0)}`} width={60} domain={['auto', 'auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="close" stroke="#8b5cf6" strokeWidth={2} fill="url(#priceGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {/* Support/Resistance */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Support 1', value: `₹${(stock.suggestedEntry * 0.97).toFixed(0)}`, color: 'text-emerald-400' },
              { label: 'Support 2', value: `₹${(stock.avgZone).toFixed(0)}`, color: 'text-emerald-500' },
              { label: 'Resistance', value: `₹${(stock.suggestedExit).toFixed(0)}`, color: 'text-red-400' },
            ].map(sr => (
              <div key={sr.label} className="text-center p-2 rounded-lg bg-slate-800/40">
                <div className={sr.color} style={{ fontSize: '0.82rem', fontWeight: 700 }}>{sr.value}</div>
                <div className="text-slate-600" style={{ fontSize: '0.62rem' }}>{sr.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Panel */}
        <div className="space-y-3">
          {/* Recommendation */}
          <div className={`bg-[#111520] border rounded-2xl p-4 ${recBg}`}>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-slate-300" style={{ fontSize: '0.85rem', fontWeight: 600 }}>AI Recommendation</span>
            </div>
            {analysis ? (
              <>
                <div className={`text-center py-3 rounded-xl bg-slate-900/60 mb-3`}>
                  <div className={recColor} style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                    {analysis.recommendation}
                  </div>
                  <div className="text-slate-500 mt-1" style={{ fontSize: '0.7rem' }}>AI Confidence: {analysis.confidence}%</div>
                </div>
                {/* Confidence Meter */}
                <div className="mb-3">
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${analysis.confidence}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full rounded-full ${analysis.confidence >= 80 ? 'bg-emerald-500' : analysis.confidence >= 65 ? 'bg-amber-500' : 'bg-red-500'}`}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-slate-700" style={{ fontSize: '0.6rem' }}>0%</span>
                    <span className="text-slate-500" style={{ fontSize: '0.6rem' }}>{analysis.confidence}% confidence</span>
                    <span className="text-slate-700" style={{ fontSize: '0.6rem' }}>100%</span>
                  </div>
                </div>
                <p className="text-slate-400 mb-3" style={{ fontSize: '0.75rem', lineHeight: 1.6 }}>{analysis.summary}</p>
                <div className="space-y-1.5">
                  {[
                    { label: 'Entry', value: `₹${analysis.entry.toLocaleString('en-IN')}`, color: 'text-emerald-400' },
                    { label: 'Target 1', value: `₹${analysis.target1.toLocaleString('en-IN')}`, color: 'text-blue-400' },
                    { label: 'Target 2', value: `₹${analysis.target2.toLocaleString('en-IN')}`, color: 'text-blue-300' },
                    { label: 'Stoploss', value: `₹${analysis.stoploss.toLocaleString('en-IN')}`, color: 'text-red-400' },
                    { label: 'R:R Ratio', value: analysis.riskReward, color: 'text-violet-400' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center">
                      <span className="text-slate-600" style={{ fontSize: '0.72rem' }}>{item.label}</span>
                      <span className={item.color} style={{ fontSize: '0.78rem', fontWeight: 600 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-40 flex items-center justify-center text-slate-600" style={{ fontSize: '0.8rem' }}>Analyzing...</div>
            )}
          </div>

          {/* Technical Indicators */}
          <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
            <h3 className="text-slate-300 mb-3" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Technical Indicators</h3>
            <div className="space-y-2">
              {[
                { label: 'RSI (14)', value: stock.rsi.toFixed(1), color: stock.rsi > 70 ? 'text-red-400' : stock.rsi < 40 ? 'text-emerald-400' : 'text-slate-300' },
                { label: 'Momentum Score', value: `${stock.momentumScore}/100`, color: stock.momentumScore >= 70 ? 'text-emerald-400' : 'text-amber-400' },
                { label: '50-DMA', value: `₹${stock.dma50.toLocaleString('en-IN')}`, color: stock.price > stock.dma50 ? 'text-emerald-400' : 'text-red-400' },
                { label: '200-DMA', value: `₹${stock.dma200.toLocaleString('en-IN')}`, color: stock.price > stock.dma200 ? 'text-emerald-400' : 'text-red-400' },
                { label: 'ATR', value: `₹${stock.atr.toFixed(2)}`, color: 'text-slate-300' },
                { label: 'Pattern', value: stock.breakoutPattern, color: 'text-violet-400' },
              ].map(item => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-slate-600" style={{ fontSize: '0.72rem' }}>{item.label}</span>
                  <span className={item.color} style={{ fontSize: '0.75rem', fontWeight: 500 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Catalysts & Risks */}
          {analysis && (
            <div className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4">
              <h3 className="text-slate-300 mb-2" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Catalysts & Risks</h3>
              <div className="space-y-1 mb-3">
                {analysis.catalysts?.slice(0, 3).map((c: string, i: number) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400 mt-0.5" style={{ fontSize: '0.6rem' }}>↑</span>
                    <span className="text-slate-400" style={{ fontSize: '0.7rem' }}>{c}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                {analysis.risks?.slice(0, 2).map((r: string, i: number) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-red-400 mt-0.5" style={{ fontSize: '0.6rem' }}>↓</span>
                    <span className="text-slate-500" style={{ fontSize: '0.7rem' }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
