import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { Activity, Eye, EyeOff, User, Mail, Lock, ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';

export function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#0b0d18';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('All fields required.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    // Mock: POST /api/v1/auth/register
    await new Promise(r => setTimeout(r, 1200));
    localStorage.setItem('auth_token', `mock_jwt_${Date.now()}`);
    localStorage.setItem('user', JSON.stringify({ name: form.name, email: form.email, plan: 'Free Trial' }));
    navigate('/dashboard');
    setLoading(false);
  };

  const perks = [
    '✓ 14-day free trial (no card required)',
    '✓ Real-time FYERS market data',
    '✓ AI stock analysis & signals',
    '✓ Portfolio tracking & alerts',
  ];

  return (
    <div className="min-h-screen bg-[#0b0d18] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-white" style={{ fontSize: '1.2rem', fontWeight: 700 }}>Swing<span className="text-violet-400">AI</span></span>
        </div>

        <div className="mb-6">
          <h2 className="text-white mb-1" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Create your account</h2>
          <p className="text-slate-500" style={{ fontSize: '0.85rem' }}>Start your 14-day free trial today</p>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {perks.map((perk, i) => (
            <div key={i} className="text-emerald-400" style={{ fontSize: '0.72rem' }}>{perk}</div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400" style={{ fontSize: '0.82rem' }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-1.5" style={{ fontSize: '0.8rem' }}>Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Rahul Sharma"
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500/60 transition-colors"
                style={{ fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5" style={{ fontSize: '0.8rem' }}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500/60 transition-colors"
                style={{ fontSize: '0.88rem' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5" style={{ fontSize: '0.8rem' }}>Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Min. 6 characters"
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-10 py-3 text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500/60 transition-colors"
                style={{ fontSize: '0.88rem' }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5" style={{ fontSize: '0.8rem' }}>Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Repeat password"
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-3 text-slate-200 placeholder-slate-600 outline-none focus:border-violet-500/60 transition-colors"
                style={{ fontSize: '0.88rem' }}
              />
              {form.confirmPassword && form.password === form.confirmPassword && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              )}
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
              <>Create Account <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="text-center text-slate-500 mt-6" style={{ fontSize: '0.82rem' }}>
          Already have an account?{' '}
          <Link to="/login" className="text-violet-400 hover:text-violet-300">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
