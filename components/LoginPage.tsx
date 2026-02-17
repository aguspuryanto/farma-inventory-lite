
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
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
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
          >
            Masuk Sekarang
          </button>

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
