
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface LoginPageProps {
  onLogin: () => void;
  onGoToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoToRegister }) => {
  const [email, setEmail] = useState('admin@bumifarma.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Menggunakan Supabase Auth untuk login nyata
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Jika gagal dengan Supabase, kita izinkan simulasi untuk testing awal jika perlu
        // Namun demi keamanan, sebaiknya throw error
        throw error;
      }

      onLogin();
    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
        <div className="bg-emerald-600 p-8 text-white text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            💊
          </div>
          <h1 className="text-2xl font-bold">Apotek Bumi Farma</h1>
          <p className="text-emerald-100 text-sm">Masuk ke Sistem Smart Inventory</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-medium border border-red-100">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 text-slate-600">
              <input type="checkbox" className="rounded text-emerald-600" defaultChecked />
              <span>Ingat saya</span>
            </label>
            <a href="#" className="text-emerald-600 font-semibold hover:underline">Lupa password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Masuk Sekarang'}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-500">
              Belum punya akun?{' '}
              <button 
                type="button"
                onClick={onGoToRegister}
                className="text-emerald-600 font-bold hover:underline"
              >
                Daftar di sini
              </button>
            </p>
          </div>

          <p className="text-center text-slate-400 text-xs">
            Aman • Terintegrasi • Efisien
            <br />
            Powered by Vmedis Technology
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
