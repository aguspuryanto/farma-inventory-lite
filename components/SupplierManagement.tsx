
import React, { useState } from 'react';
import { Supplier } from '../types';

interface SupplierProps {
  suppliers: Supplier[];
  onAdd: (supplier: Supplier) => void;
}

const SupplierManagement: React.FC<SupplierProps> = ({ suppliers, onAdd }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      id: `SUP-${Date.now()}`,
      ...formData
    });
    setFormData({ name: '', phone: '', email: '', address: '' });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Daftar Distributor (PBF)</h3>
          <p className="text-slate-500 text-sm">Kelola data rekanan pemasok obat apotek.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all flex items-center space-x-2"
        >
          <span>➕</span>
          <span>Tambah Supplier</span>
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-emerald-200 shadow-xl animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nama PBF / Distributor</label>
              <input 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Nomor Telepon</label>
              <input 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
              <input 
                type="email"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Alamat Kantor</label>
              <textarea 
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                rows={2}
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              ></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 pt-2">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500 font-medium">Batal</button>
              <button type="submit" className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700">Simpan Supplier</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map(sup => (
          <div key={sup.id} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all group shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100">
                🏢
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">{sup.id}</span>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-1">{sup.name}</h4>
            <div className="space-y-2 mt-4 text-sm">
              <p className="flex items-center text-slate-600">
                <span className="w-6">📞</span> {sup.phone}
              </p>
              <p className="flex items-center text-slate-600">
                <span className="w-6">📧</span> {sup.email || '-'}
              </p>
              <p className="flex items-start text-slate-500 mt-2 text-xs italic">
                <span className="w-6">📍</span> {sup.address}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end">
              <button className="text-emerald-600 text-xs font-bold hover:underline">Riwayat Transaksi →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierManagement;
