import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101946] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#171B4B] border border-[#252C6A] p-8 sm:p-10 rounded-3xl shadow-2xl text-left text-white relative">
        <div className="text-center mb-8">
          <img
            src="/artish-logo.png"
            alt="Artish UK logo"
            className="h-12 w-auto mx-auto mb-3"
          />
          <h1 className="text-2xl font-extrabold tracking-tight">Admin Portal</h1>
          <p className="text-xs text-gray-400 mt-1">Sign in to manage enquiries and website content</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500 text-red-400 flex items-center gap-2 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#101946] border border-[#252C6A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#B8FF00]"
              autoComplete="off"
              placeholder="admin@artish.uk"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#101946] border border-[#252C6A] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#B8FF00]"
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B8FF00] hover:bg-[#A3E600] text-[#101946] font-extrabold text-sm py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#B8FF00]/25 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Login to Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#252C6A] text-center">
          <a href="/" className="text-xs text-gray-400 hover:text-[#B8FF00] transition-colors">
            ← Back to Public Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
