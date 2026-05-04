'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Activity, Eye, EyeOff, Lock, Mail, ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@swingai.in');
  const [password, setPassword] = useState('Demo@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#0b0d18';
    if (localStorage.getItem('auth_token')) router.push('/dashboard');
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    // Simulate API call: POST /auth/login
    await new Promise(r => setTimeout(r, 1200));
    // Mock auth — replace with real API: fetch('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    if (password.length >= 6) {
      localStorage.setItem('auth_token', `mock_jwt_${Date.now()}`);
      localStorage.setItem('user', JSON.stringify({ name: 'Rahul Sharma', email, plan: 'Pro' }));
      router.push('/dashboard');
    } else {
      setError('Invalid credentials. Use demo@swingai.in / Demo@1234');
    }
    setLoading(false);
  };

  const handleFyersConnect = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    // Real FYERS OAuth: window.location.href = getAuthUrl();
    localStorage.setItem('auth_token', `fyers_mock_jwt_${Date.now()}`);
    localStorage.setItem('user', JSON.stringify({ name: 'FYERS User', email: 'fyers@broker.in', plan: 'Pro', broker: 'FYERS' }));
    router.push('/dashboard');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0d18] flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-[#0b0d18] to-indigo-900/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
                Swing<span className="text-violet-400">AI</span>
              </div>
              <div className="text-slate-500" style={{ fontSize: '0.7rem' }}>Trading Intelligence Platform</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-white mb-4" style={{ fontSize: '2.2rem', fontWeight: 700, lineHeight: 1.2 }}>
              AI-Powered<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                Swing Trading
              </span><br />
              Intelligence
            </h1>
            <p className="text-slate-400" style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>
              Identify high-probability momentum stocks for Indian markets using advanced AI, volume analysis, and sector strength signals.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Zap, title: 'AI Momentum Scanner', desc: 'Real-time breakout detection with 85%+ confidence' },
              { icon: Shield, title: 'Risk-First Approach', desc: 'AI-calculated stop-loss and position sizing' },
              { icon: TrendingUp, title: 'Sector Rotation Engine', desc: 'Follow smart money across NSE sectors' },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                  <feat.icon className="w-4 h-4 text-violet-400" />
                </div>
                <div>
                  <div className="text-slate-200" style={{ fontSize: '0.85rem', fontWeight: 500 }}>{feat.title}</div>
                  <div className="text-slate-500" style={{ fontSize: '0.75rem' }}>{feat.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4">
            {['2,500+ Stocks Scanned Daily', '68% Avg Win Rate', 'FYERS Integrated'].map((stat, i) => (
              <div key={i} className="text-slate-600" style={{ fontSize: '0.7rem' }}>{i > 0 && '•'} {stat}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Activity className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-white" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Swing<span className="text-violet-400">AI</span></span>
          </div>

          <div className="mb-8">
            <h2 className="text-white mb-1" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Welcome back</h2>
            <p className="text-slate-500" style={{ fontSize: '0.85rem' }}>Sign in to your trading account</p>
          </div>

          {/* FYERS Connect Button */}
          <button
            onClick={handleFyersConnect}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-all mb-4 disabled:opacity-60"
            style={{ fontSize: '0.9rem', fontWeight: 600 }}
          >
            <span>📊</span>
            Connect with FYERS
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-slate-600" style={{ fontSize: '0.75rem' }}>or continue with email</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400" style={{ fontSize: '0.82rem' }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-slate-400 mb-1.5" style={{ fontSize: '0.8rem' }}>Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500/60 transition-colors"
                  style={{ fontSize: '0.88rem' }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-400" style={{ fontSize: '0.8rem' }}>Password</label>
                <button type="button" className="text-violet-400 hover:text-violet-300 transition-colors" style={{ fontSize: '0.75rem' }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-10 py-3 text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500/60 transition-colors"
                  style={{ fontSize: '0.88rem' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 transition-all disabled:opacity-60"
              style={{ fontSize: '0.9rem', fontWeight: 600 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-slate-500 mt-6" style={{ fontSize: '0.82rem' }}>
            Don't have an account?{' '}
            <Link href="/signup" className="text-violet-400 hover:text-violet-300 transition-colors">
              Create free account
            </Link>
          </p>

          <p className="text-center text-slate-700 mt-4" style={{ fontSize: '0.7rem' }}>
            By signing in, you agree to our Terms of Service and Privacy Policy.<br />
            ⚠️ Not for collecting PII or sensitive financial data in production.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
