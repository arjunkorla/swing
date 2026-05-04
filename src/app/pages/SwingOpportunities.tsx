'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Zap, Target, Clock, Shield, ChevronRight, Filter } from 'lucide-react';
import { swingOpportunities } from '../data/mockData';
import { motion } from 'motion/react';

const typeColors: Record<string, string> = {
  Breakout: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Momentum: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'Dip Recovery': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Sector Rotation': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Breakout Retest': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'Cup & Handle': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
};

const tagColor = 'bg-slate-800/60 text-slate-500 border-slate-700/50';

export function SwingOpportunities() {
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  const types = ['All', 'Breakout', 'Momentum', 'Dip Recovery', 'Sector Rotation', 'Breakout Retest'];

  const filtered = filter === 'All' ? swingOpportunities : swingOpportunities.filter(o => o.type === filter);

  const totalExpectedReturn = filtered.reduce((s, o) => s + parseFloat(o.expectedMove), 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-slate-100" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Swing Opportunity Engine</h1>
            <p className="text-slate-500" style={{ fontSize: '0.72rem' }}>{filtered.length} high-probability setups • AI-curated</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-slate-500 hidden sm:flex items-center gap-1" style={{ fontSize: '0.75rem' }}>
            <Zap className="w-3.5 h-3.5 text-violet-400" />
            Avg expected: <span className="text-emerald-400 ml-1">+{(totalExpectedReturn / filtered.length).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all flex-shrink-0 ${filter === t ? 'bg-violet-500/15 border-violet-500/30 text-violet-300' : 'bg-slate-800/40 border-slate-700/40 text-slate-500 hover:text-slate-300'}`}
            style={{ fontSize: '0.75rem', fontWeight: filter === t ? 600 : 400 }}>
            {t}
          </button>
        ))}
      </div>

      {/* Opportunity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((opp, i) => (
          <motion.div
            key={opp.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-[#111520] border border-[#1e2236] rounded-2xl overflow-hidden hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all group"
          >
            {/* Card Header */}
            <div className="p-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-100" style={{ fontSize: '1rem', fontWeight: 700 }}>{opp.symbol}</span>
                    <span className={`px-2 py-0.5 rounded-full border ${typeColors[opp.type] || tagColor}`} style={{ fontSize: '0.62rem', fontWeight: 600 }}>{opp.type}</span>
                  </div>
                  <div className="text-slate-600" style={{ fontSize: '0.7rem' }}>{opp.name} • {opp.sector}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400" style={{ fontSize: '1.1rem', fontWeight: 800 }}>{opp.expectedMove}</div>
                  <div className="text-slate-600" style={{ fontSize: '0.65rem' }}>expected</div>
                </div>
              </div>

              {/* Probability Bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${opp.probability}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08 + 0.2 }}
                    className={`h-full rounded-full ${opp.probability >= 85 ? 'bg-emerald-500' : opp.probability >= 75 ? 'bg-amber-500' : 'bg-blue-500'}`}
                  />
                </div>
                <span className={`${opp.probability >= 85 ? 'text-emerald-400' : opp.probability >= 75 ? 'text-amber-400' : 'text-blue-400'}`} style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                  {opp.probability}%
                </span>
                <span className="text-slate-600" style={{ fontSize: '0.65rem' }}>prob</span>
              </div>
            </div>

            {/* Trade Setup */}
            <div className="px-4 pb-4">
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                  <div className="text-emerald-400" style={{ fontSize: '0.8rem', fontWeight: 700 }}>₹{opp.entry.toLocaleString('en-IN')}</div>
                  <div className="text-slate-600" style={{ fontSize: '0.6rem' }}>Entry</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-blue-500/5 border border-blue-500/15">
                  <div className="text-blue-400" style={{ fontSize: '0.8rem', fontWeight: 700 }}>₹{opp.target.toLocaleString('en-IN')}</div>
                  <div className="text-slate-600" style={{ fontSize: '0.6rem' }}>Target</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-red-500/5 border border-red-500/15">
                  <div className="text-red-400" style={{ fontSize: '0.8rem', fontWeight: 700 }}>₹{opp.stoploss.toLocaleString('en-IN')}</div>
                  <div className="text-slate-600" style={{ fontSize: '0.6rem' }}>SL</div>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1 text-slate-500" style={{ fontSize: '0.7rem' }}>
                  <Clock className="w-3 h-3" />{opp.holdDays}
                </div>
                <div className="flex items-center gap-1 text-violet-400" style={{ fontSize: '0.7rem' }}>
                  <Target className="w-3 h-3" />R:R {opp.riskReward}
                </div>
              </div>

              {/* AI Explanation */}
              <p className="text-slate-500 mb-3" style={{ fontSize: '0.72rem', lineHeight: 1.5 }}>{opp.aiExplanation}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {opp.tags.map(tag => (
                  <span key={tag} className={`px-2 py-0.5 rounded-full border ${tagColor}`} style={{ fontSize: '0.6rem' }}>{tag}</span>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => router.push(`/stock/${opp.symbol}`)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 hover:bg-violet-500/20 group-hover:border-violet-500/40 transition-all"
                style={{ fontSize: '0.78rem', fontWeight: 500 }}
              >
                Full Analysis <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Setups', value: filtered.length, icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Avg Probability', value: `${Math.round(filtered.reduce((s, o) => s + o.probability, 0) / filtered.length)}%`, icon: Target, color: 'text-violet-400' },
          { label: 'Avg R:R Ratio', value: '3.3x', icon: Shield, color: 'text-blue-400' },
          { label: 'Avg Hold Days', value: '12 days', icon: Clock, color: 'text-amber-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#111520] border border-[#1e2236] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800/60 flex items-center justify-center flex-shrink-0">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <div className={stat.color} style={{ fontSize: '1rem', fontWeight: 700 }}>{stat.value}</div>
              <div className="text-slate-600" style={{ fontSize: '0.65rem' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
