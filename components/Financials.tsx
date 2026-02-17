
import React from 'react';
import { PurchaseOrder } from '../types';

interface FinancialsProps {
  purchaseOrders: PurchaseOrder[];
}

const Financials: React.FC<FinancialsProps> = ({ purchaseOrders }) => {
  const unpaidPOs = purchaseOrders.filter(po => !po.isPaid);
  const totalDebt = unpaidPOs.reduce((acc, po) => acc + po.totalAmount, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-red-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Utang Dagang</p>
          <p className="text-2xl font-black text-slate-900">Rp {totalDebt.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-2 italic">Ke Distributor (PBF)</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Piutang</p>
          <p className="text-2xl font-black text-slate-900">Rp 1.250.000</p>
          <p className="text-xs text-slate-500 mt-2 italic">Dari Pelanggan / Konsumen</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-blue-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Kas Apotek</p>
          <p className="text-2xl font-black text-slate-900">Rp 45.200.000</p>
          <p className="text-xs text-slate-500 mt-2 italic">Saldo Berjalan</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Daftar Tagihan Belum Lunas (Utang)</h3>
          <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
            {unpaidPOs.length} Tagihan Tertunda
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">ID Transaksi</th>
                <th className="px-6 py-4">Distributor</th>
                <th className="px-6 py-4">Jatuh Tempo</th>
                <th className="px-6 py-4">Total Tagihan</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {unpaidPOs.map(po => (
                <tr key={po.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-xs text-slate-800">{po.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{po.supplierName}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{po.date}</td>
                  <td className="px-6 py-4 font-bold text-red-600 text-sm">Rp {po.totalAmount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <button className="px-4 py-1.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-700 transition-colors">Bayar Lunas</button>
                  </td>
                </tr>
              ))}
              {unpaidPOs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Tidak ada utang dagang. Luar biasa! ✨</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Financials;
