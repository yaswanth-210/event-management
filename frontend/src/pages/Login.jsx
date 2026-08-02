import React, { useState } from 'react';
import { Lock, Mail, Shield, User, ArrowRight, Check, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = ({ onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let authRes;
      if (isRegister) {
        // Public registration defaults to visitor role
        authRes = await register(name, email, password, phone, 'visitor');
      } else {
        authRes = await login(email, password);
      }
      if (onSuccess) onSuccess(authRes?.user);
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Connection timed out. Please verify that the backend server is running on port 5000.');
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || 'Authentication failed. Please verify your email and password.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Discreet helper for admin sign-in
  const handleAdminFill = () => {
    setEmail('admin2006@gmail.com');
    setPassword('admin2006');
    setIsRegister(false);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="glass-card rounded-3xl p-8 border border-slate-800 space-y-6 shadow-2xl bg-slate-900/90 backdrop-blur-xl relative overflow-hidden">
        
        {/* Subtle Decorative Ambient Background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-600/20">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {isRegister ? 'Create Your Account' : 'Sign In To Portal'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister
              ? 'Register to manage your event bookings and access digital passes'
              : 'Enter your account credentials to manage your tickets and event pass'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center font-medium animate-fade-in">
            {error}
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Yaswanth Reddy"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() => alert('Please contact administrator or support to reset password.')}
                  className="text-[11px] text-blue-400 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Phone Number (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 019 2831"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          )}

          {!isRegister && (
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-0"
                />
                <span>Remember this device</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Form Toggle & Footer */}
        <div className="pt-4 border-t border-slate-800/80 text-center space-y-3">
          <p className="text-xs text-slate-400">
            {isRegister ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-blue-400 font-bold hover:underline"
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </p>

          {/* Discreet Admin Login Helper */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleAdminFill}
              className="text-[11px] text-slate-500 hover:text-slate-300 font-medium transition-colors"
            >
              System Administrator Sign In
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
