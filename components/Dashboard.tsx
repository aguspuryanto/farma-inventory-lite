
import React from 'react';
import { Medicine, PurchaseOrder, Invoice, View } from '../types';

interface DashboardProps {
  medicines: Medicine[];
  purchaseOrders: PurchaseOrder[];
  invoices: Invoice[];
  setCurrentView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ medicines, purchaseOrders, invoices, setCurrentView }) => {
  const lowStockItems = medicines.filter(m => m.systemStock < 50);
  const totalValue = medicines.reduce((acc, m) => acc + (m.systemStock * m.hna), 0);

  return (
    <div className="space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Obat" value={medicines.length.toString()} icon="💊" color="blue" />
        <MetricCard title="Stok Menipis" value={lowStockItems.length.toString()} icon="⚠️" color="amber" />
        <MetricCard title="Surat Pesanan" value={purchaseOrders.length.toString()} icon="📝" color="emerald" />
        <MetricCard title="Estimasi Nilai" value={`Rp ${totalValue.toLocaleString()}`} icon="💰" color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Stok Hampir Habis</h3>
            <button 
              onClick={() => setCurrentView(View.PurchaseOrder)}
              className="text-emerald-600 text-sm font-medium hover:underline"
            >
              Buat SP Baru
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {lowStockItems.length > 0 ? (
              lowStockItems.map(m => (
                <div key={m.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-900">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.category}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${m.systemStock < 20 ? 'text-red-600' : 'text-amber-600'}`}>
                      {m.systemStock} {m.unit}
                    </p>
                    <p className="text-xs text-slate-400">Tersisa</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                Semua stok terjaga aman ✨
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-800">Aktivitas Terakhir</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">✅</div>
              <div>
                <p className="text-sm font-medium text-slate-900">Stok Opname Selesai</p>
                <p className="text-xs text-slate-500">2 jam yang lalu • Oleh Admin</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl">🧾</div>
              <div>
                <p className="text-sm font-medium text-slate-900">Faktur Baru Diinput</p>
                <p className="text-xs text-slate-500">Kemarin • PBF Bina Sanata</p>
              </div>
            </div>
            {invoices.length > 0 && invoices.map(inv => (
              <div key={inv.id} className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl">📦</div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Pengiriman Diterima</p>
                  <p className="text-xs text-slate-500">ID: {inv.invoiceNumber} • {inv.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ title: string; value: string; icon: string; color: string }> = ({ title, value, icon, color }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <span className={`p-3 rounded-lg text-2xl ${colors[color]}`}>{icon}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;
