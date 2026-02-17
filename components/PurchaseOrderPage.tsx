
import React, { useState } from 'react';
import { Medicine, PurchaseOrder, POItem } from '../types';

interface PurchaseOrderProps {
  medicines: Medicine[];
  onSubmit: (po: PurchaseOrder) => void;
}

const PurchaseOrderPage: React.FC<PurchaseOrderProps> = ({ medicines, onSubmit }) => {
  const [selectedItems, setSelectedItems] = useState<POItem[]>([]);
  const [supplier, setSupplier] = useState('');

  const addToPO = (m: Medicine) => {
    if (selectedItems.find(item => item.medicineId === m.id)) return;
    setSelectedItems([...selectedItems, { medicineId: m.id, name: m.name, quantity: 1, unit: m.unit }]);
  };

  const updateQty = (id: string, qty: number) => {
    setSelectedItems(items => items.map(item => 
      item.medicineId === id ? { ...item, quantity: Math.max(1, qty) } : item
    ));
  };

  const removeItem = (id: string) => {
    setSelectedItems(items => items.filter(i => i.medicineId !== id));
  };

  const handleSubmit = () => {
    if (!supplier || selectedItems.length === 0) return;
    
    const newPO: PurchaseOrder = {
      id: `PO-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID'),
      supplier,
      items: selectedItems,
      status: 'Sent'
    };
    
    onSubmit(newPO);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Pilih Obat untuk Dipesan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medicines.map(m => (
              <div 
                key={m.id} 
                onClick={() => addToPO(m)}
                className="p-4 border border-slate-100 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition-all flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-slate-900">{m.name}</p>
                  <p className="text-xs text-slate-500">Stok: {m.systemStock} {m.unit}</p>
                </div>
                <span className="text-emerald-500 font-bold">+</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-24">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
            <span>Daftar Pesanan</span>
            <span className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded uppercase">Draft SP</span>
          </h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Supplier (PBF)</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-emerald-500 focus:outline-none"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
            >
              <option value="">-- Pilih Supplier --</option>
              <option value="PBF Bina Sanata">PBF Bina Sanata</option>
              <option value="Kimia Farma Trading">Kimia Farma Trading</option>
              <option value="Enseval Putera Megatrading">Enseval Putera Megatrading</option>
            </select>
          </div>

          <div className="space-y-4 max-h-96 overflow-auto mb-6">
            {selectedItems.length > 0 ? selectedItems.map(item => (
              <div key={item.medicineId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{item.name}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <input 
                      type="number" 
                      className="w-16 px-1 py-0.5 text-sm border border-slate-200 rounded"
                      value={item.quantity}
                      onChange={(e) => updateQty(item.medicineId, parseInt(e.target.value))}
                    />
                    <span className="text-xs text-slate-500">{item.unit}</span>
                  </div>
                </div>
                <button 
                  onClick={() => removeItem(item.medicineId)}
                  className="text-slate-400 hover:text-red-500 ml-4"
                >
                  🗑️
                </button>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-400 text-sm">
                Belum ada obat dipilih
              </div>
            )}
          </div>

          <button 
            disabled={selectedItems.length === 0 || !supplier}
            onClick={handleSubmit}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buat Surat Pesanan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderPage;
