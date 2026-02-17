
import React, { useState } from 'react';
import { Medicine } from '../types';
import BarcodeScannerModal from './BarcodeScannerModal';
import { useHardwareScanner } from '../hooks/useHardwareScanner';

interface InitialStockProps {
  onAdd: (medicine: Medicine) => void;
}

const InitialStock: React.FC<InitialStockProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Umum',
    barcode: '',
    unit: 'Strip',
    initialStock: '0',
    hna: '0',
    margin: '20'
  });

  const [message, setMessage] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // Hardware scanner integration
  useHardwareScanner((barcode) => {
    setFormData(prev => ({ ...prev, barcode }));
  });

  const handleCameraScan = (barcode: string) => {
    setFormData(prev => ({ ...prev, barcode }));
    setIsScannerOpen(false);
  };

  const hnaNum = parseFloat(formData.hna) || 0;
  const ppnNum = Math.round(hnaNum * 0.11);
  const marginNum = parseFloat(formData.margin) || 0;
  const sellingPrice = Math.round((hnaNum + ppnNum) * (1 + marginNum / 100));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Nama obat harus diisi");
      return;
    }

    const newMed: Medicine = {
      id: `MED-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      barcode: formData.barcode || `BC-${Date.now().toString().slice(-6)}`,
      unit: formData.unit,
      systemStock: parseInt(formData.initialStock) || 0,
      hna: hnaNum,
      ppn: ppnNum,
      margin: marginNum,
      lastStockOpname: new Date().toISOString()
    };

    onAdd(newMed);
    setMessage(`Berhasil menambahkan ${formData.name}!`);
    setFormData({
      name: '',
      category: 'Umum',
      barcode: '',
      unit: 'Strip',
      initialStock: '0',
      hna: '0',
      margin: '20'
    });

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <BarcodeScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScan={handleCameraScan} 
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">Registrasi Obat & Stok Awal</h3>
          <p className="text-sm text-slate-500">Gunakan formulir ini untuk setup sistem pertama kali atau menambah produk baru.</p>
        </div>

        {message && (
          <div className="mx-6 mt-6 p-4 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100 flex items-center space-x-2 animate-bounce">
            <span>✅</span>
            <span className="font-medium">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identity Group */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Identitas Obat</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Obat *</label>
                <input
                  type="text"
                  placeholder="Contoh: Panadol 500mg"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                  <select 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Umum</option>
                    <option>Antibiotik</option>
                    <option>Analgesik</option>
                    <option>Narkotika</option>
                    <option>Psikotropika</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Satuan</label>
                  <select 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                  >
                    <option>Strip</option>
                    <option>Box</option>
                    <option>Botol</option>
                    <option>Tube</option>
                    <option>Tablet</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Barcode</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Scan atau ketik barcode"
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={formData.barcode}
                    onChange={e => setFormData({...formData, barcode: e.target.value})}
                  />
                  <button 
                    type="button" 
                    onClick={() => setIsScannerOpen(true)}
                    className="px-3 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors text-emerald-600"
                    title="Buka Kamera Scanner"
                  >
                    📷
                  </button>
                </div>
                <p className="mt-1 text-[10px] text-slate-400 italic">Sistem otomatis mendeteksi scanner fisik (Plug & Play)</p>
              </div>
            </div>

            {/* Financial Group */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Data Stok & Harga</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stok Awal Fisik</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  value={formData.initialStock}
                  onChange={e => setFormData({...formData, initialStock: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">HNA (Rp)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={formData.hna}
                    onChange={e => setFormData({...formData, hna: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Margin (%)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={formData.margin}
                    onChange={e => setFormData({...formData, margin: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 space-y-2">
                <div className="flex justify-between text-xs text-emerald-700">
                  <span>PPN (11%):</span>
                  <span>Rp {ppnNum.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-900">
                  <span>Estimasi Harga Jual:</span>
                  <span>Rp {sellingPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end space-x-4">
            <button 
              type="button" 
              className="px-6 py-3 text-slate-500 font-medium hover:text-slate-800 transition-colors"
              onClick={() => setFormData({
                name: '',
                category: 'Umum',
                barcode: '',
                unit: 'Strip',
                initialStock: '0',
                hna: '0',
                margin: '20'
              })}
            >
              Reset
            </button>
            <button 
              type="submit" 
              className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
            >
              Simpan Obat Baru
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start space-x-4">
        <span className="text-2xl">💡</span>
        <div className="text-sm text-blue-800 leading-relaxed">
          <p className="font-bold mb-1">Informasi Setup Sistem</p>
          <p>Jika Anda sedang melakukan migrasi data, pastikan Stok Awal yang dimasukkan adalah jumlah fisik yang saat ini ada di rak. Sistem akan otomatis menghitung PPN dan merekomendasikan harga jual berdasarkan margin standar apotek.</p>
        </div>
      </div>
    </div>
  );
};

export default InitialStock;
