
import React, { useState } from 'react';
import { Medicine, ReturnRecord } from '../types';

interface ReturnsProps {
  medicines: Medicine[];
  returns: ReturnRecord[];
  onAdd: (record: ReturnRecord) => void;
}

const ReturnsManagement: React.FC<ReturnsProps> = ({ medicines, returns, onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ medicineId: '', quantity: '1', type: 'Purchase' as 'Purchase' | 'Sales', reason: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const med = medicines.find(m => m.id === formData.medicineId);
    if (!med) return;

    onAdd({
      id: `RET-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID'),
      medicineId: med.id,
      medicineName: med.name,
      quantity: parseInt(formData.quantity),
      type: formData.type,
      reason: formData.reason,
      status: 'Pending'
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Manajemen Retur Obat</h3>
          <p className="text-slate-500 text-sm">Catat pengembalian stok rusak atau expired.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-2.5 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 shadow-lg shadow-orange-100 transition-all flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>Catat Retur Baru</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-orange-200 shadow-xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Pilih Obat</label>
              <select 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                value={formData.medicineId}
                onChange={e => setFormData({...formData, medicineId: e.target.value})}
                required
              >
                <option value="">-- Pilih Obat --</option>
                {medicines.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.systemStock} {m.unit})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Jumlah</label>
              <input 
                type="number"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Tipe Retur</label>
              <select 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="Purchase">Retur Pembelian (Ke Supplier)</option>
                <option value="Sales">Retur Penjualan (Dari Konsumen)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Alasan Retur</label>
              <textarea 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                rows={2}
                placeholder="Contoh: Expired, Rusak Fisik, atau Salah Kirim"
                value={formData.reason}
                onChange={e => setFormData({...formData, reason: e.target.value})}
                required
              ></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500 font-medium">Batal</button>
              <button type="submit" className="px-6 py-2 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600">Simpan Retur</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <th className="px-6 py-4">ID / Tanggal</th>
              <th className="px-6 py-4">Nama Obat</th>
              <th className="px-6 py-4">Tipe</th>
              <th className="px-6 py-4">Jumlah</th>
              <th className="px-6 py-4">Alasan</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {returns.map(ret => (
              <tr key={ret.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800 text-xs">{ret.id}</p>
                  <p className="text-[10px] text-slate-400">{ret.date}</p>
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">{ret.medicineName}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    ret.type === 'Purchase' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {ret.type === 'Purchase' ? 'Ke Supplier' : 'Dari Konsumen'}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900">{ret.quantity}</td>
                <td className="px-6 py-4 text-xs text-slate-500 italic">{ret.reason}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center space-x-1 text-amber-600 font-bold text-[10px] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>{ret.status}</span>
                  </span>
                </td>
              </tr>
            ))}
            {returns.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">Belum ada data retur.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnsManagement;
