
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
    { id: View.MedicineList, label: 'Daftar Obat', icon: '💊' },
    { id: View.Suppliers, label: 'Master Supplier', icon: '🏢' },
    { id: View.StockOpname, label: 'Stock Opname', icon: '📋' },
    { id: View.PurchaseOrder, label: 'Surat Pesanan', icon: '✍️' },
    { id: View.Invoices, label: 'Input Faktur', icon: '🧾' },
    { id: View.Returns, label: 'Retur Obat', icon: '🔄' },
    { id: View.Financials, label: 'Utang & Piutang', icon: '💳' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-emerald-700 text-white flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-emerald-600">
          <h1 className="text-xl font-bold tracking-tight">Bumi Farma</h1>
          <p className="text-emerald-200 text-xs">Smart Pharmacy System</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                currentView === item.id 
                ? 'bg-white/20 text-white shadow-inner' 
                : 'text-emerald-100 hover:bg-white/10'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-600 bg-emerald-800/50">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-emerald-100 hover:text-white transition-colors text-sm"
          >
            <span>🚪</span>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 capitalize flex items-center space-x-2">
            <span className="text-emerald-500 opacity-50">#</span>
            <span>{currentView.replace('-', ' ')}</span>
          </h2>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-400 uppercase">Unit Apotek</span>
              <span className="text-sm font-bold text-slate-700">Pusat Bumi Farma</span>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                A
              </div>
              <span className="text-sm font-semibold text-slate-600">Admin</span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
