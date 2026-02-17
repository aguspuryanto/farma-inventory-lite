
import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setCurrentView: (view: View) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView, onLogout }) => {
  const menuItems = [
    { id: View.Dashboard, label: 'Dashboard', icon: '📊' },
    { id: View.StockOpname, label: 'Stock Opname', icon: '📋' },
    { id: View.PurchaseOrder, label: 'Surat Pesanan', icon: '✍️' },
    { id: View.Invoices, label: 'Input Faktur', icon: '🧾' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-emerald-700 text-white flex flex-col">
        <div className="p-6 border-b border-emerald-600">
          <h1 className="text-xl font-bold tracking-tight">Bumi Farma</h1>
          <p className="text-emerald-200 text-xs">Smart Pharmacy System</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === item.id 
                ? 'bg-white/20 text-white' 
                : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-600">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-emerald-100 hover:text-white transition-colors"
          >
            <span>🚪</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800 capitalize">
            {currentView.replace('-', ' ')}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              A
            </div>
            <span className="text-sm font-medium text-slate-600">Admin Apotek</span>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
