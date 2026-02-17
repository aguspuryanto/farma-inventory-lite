
import React, { useState } from 'react';
import { PurchaseOrder, Medicine, Invoice, InvoiceItem } from '../types';

interface InvoicePageProps {
  purchaseOrders: PurchaseOrder[];
  medicines: Medicine[];
  onSubmit: (invoice: Invoice) => void;
}

const InvoicePage: React.FC<InvoicePageProps> = ({ purchaseOrders, medicines, onSubmit }) => {
  const [selectedPOId, setSelectedPOId] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  const handleSelectPO = (poId: string) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po) return;
    
    setSelectedPOId(poId);
    const items = po.items.map(item => {
      const med = medicines.find(m => m.id === item.medicineId)!;
      return {
        medicineId: med.id,
        name: med.name,
        quantity: item.quantity,
        hna: med.hna,
        ppn: med.ppn,
        sellingPrice: Math.round((med.hna + med.ppn) * (1 + med.margin/100))
      };
    });
    setInvoiceItems(items);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, val: number) => {
    setInvoiceItems(items => items.map(item => {
      if (item.medicineId !== id) return item;
      const updated = { ...item, [field]: val };
      
      // Recalculate selling price if HNA or PPN changes
      if (field === 'hna' || field === 'ppn') {
        const med = medicines.find(m => m.id === id)!;
        updated.sellingPrice = Math.round((updated.hna + updated.ppn) * (1 + med.margin/100));
      }
      return updated;
    }));
  };

  const handleComplete = () => {
    if (!invoiceNumber || !selectedPOId) return;
    
    const invoice: Invoice = {
      id: `INV-${Date.now()}`,
      poId: selectedPOId,
      invoiceNumber,
      date: new Date().toLocaleDateString('id-ID'),
      items: invoiceItems
    };
    
    onSubmit(invoice);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Salin Nomor PO</label>
            <div className="flex space-x-2">
              <select 
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-emerald-500 focus:outline-none bg-slate-50"
                value={selectedPOId}
                onChange={(e) => handleSelectPO(e.target.value)}
              >
                <option value="">-- Pilih Nomor Surat Pesanan --</option>
                {purchaseOrders.map(po => (
                  <option key={po.id} value={po.id}>{po.id} ({po.supplier})</option>
                ))}
              </select>
            </div>
            <p className="text-xs text-slate-500 mt-2">✨ Tip: Pilih nomor PO untuk mengisi data otomatis</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nomor Faktur PBF</label>
            <input 
              type="text" 
              placeholder="Contoh: INV/BS/2023/001"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-emerald-500 focus:outline-none"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          </div>
        </div>

        {invoiceItems.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Nama Obat</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">HNA (Rp)</th>
                  <th className="px-4 py-3">PPN (11%)</th>
                  <th className="px-4 py-3">Harga Jual (Nett)</th>
                  <th className="px-4 py-3">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoiceItems.map(item => (
                  <tr key={item.medicineId}>
                    <td className="px-4 py-4 text-sm font-medium">{item.name}</td>
                    <td className="px-4 py-4">
                      <input 
                        type="number" 
                        className="w-20 px-2 py-1 border border-slate-200 rounded text-sm"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.medicineId, 'quantity', parseInt(e.target.value))}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input 
                        type="number" 
                        className="w-28 px-2 py-1 border border-slate-200 rounded text-sm"
                        value={item.hna}
                        onChange={(e) => updateItem(item.medicineId, 'hna', parseInt(e.target.value))}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <input 
                        type="number" 
                        className="w-24 px-2 py-1 border border-slate-200 rounded text-sm bg-slate-50"
                        value={item.ppn}
                        onChange={(e) => updateItem(item.medicineId, 'ppn', parseInt(e.target.value))}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-bold text-emerald-600">
                        Rp {item.sellingPrice.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400">Otomatis Terhitung</div>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-800">
                      Rp {((item.hna + item.ppn) * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 border-t-2 border-slate-200">
                <tr>
                  <td colSpan={5} className="px-4 py-4 text-right font-bold text-slate-600">Total Faktur</td>
                  <td className="px-4 py-4 font-black text-lg text-slate-900">
                    Rp {invoiceItems.reduce((acc, i) => acc + ((i.hna + i.ppn) * i.quantity), 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button 
            disabled={!invoiceNumber || invoiceItems.length === 0}
            onClick={handleComplete}
            className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50"
          >
            Simpan Faktur & Update Stok
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
