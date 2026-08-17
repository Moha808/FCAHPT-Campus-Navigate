import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Lock, Mail, Loader2, MapPin, Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid admin credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060d1a] flex items-center justify-center p-4 font-sans relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-600 rounded-full blur-[120px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="bg-[#0f1e33] rounded-3xl shadow-2xl border border-white/[0.06] overflow-hidden">

          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-brand-600 via-blue-500 to-purple-600" />

          <div className="p-8 sm:p-10">

            {/* Logo + title */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-500/30 mb-5">
                <Shield className="text-white w-8 h-8" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Admin Portal</h1>
              <p className="text-gray-500 text-sm mt-1.5 text-center">FCAHPT Campus Navigation System</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm transition-all"
                    placeholder="admin@fcahpt.edu.ng"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium py-3 px-4 rounded-xl"
                >
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-4 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-brand-500/20 mt-2"
              >
                {isLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</>
                  : <><Shield className="w-4 h-4" /> Sign In</>
                }
              </button>
            </form>
          </div>

          {/* Footer row */}
          <div className="bg-white/[0.02] border-t border-white/[0.06] px-8 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1.5 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to map
            </button>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              <span className="text-xs font-bold text-gray-500">FCAHPT, Vom</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
