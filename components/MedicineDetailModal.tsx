
import React, { useRef } from 'react';
import { Medicine } from '../types';

interface MedicineDetailModalProps {
  medicine: Medicine | null;
  onClose: () => void;
}

const MedicineDetailModal: React.FC<MedicineDetailModalProps> = ({ medicine, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!medicine) return null;

  const sellingPrice = Math.round((medicine.hna + medicine.ppn) * (1 + medicine.margin / 100));

  const handlePrintBarcode = () => {
    const printContent = document.getElementById('barcode-to-print');
    if (!printContent) return;
    
    const windowUrl = 'about:blank';
    const uniqueName = new Date();
    const windowName = 'Print' + uniqueName.getTime();
    const printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=0,height=0');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Barcode - ${medicine.name}</title>
            <style>
              @page { size: 40mm 20mm; margin: 0; }
              body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; margin: 0; padding: 2px; }
              .name { font-size: 8px; font-weight: bold; margin-bottom: 2px; text-align: center; }
              .barcode-box { border: 1px solid black; padding: 4px; font-family: 'Libre Barcode 39', cursive; font-size: 24px; }
              .code { font-size: 8px; margin-top: 2px; }
            </style>
          </head>
          <body>
            <div class="name">${medicine.name.toUpperCase()}</div>
            <div class="barcode-box">|||||||||||||||||</div>
            <div class="code">${medicine.barcode}</div>
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 my-8">
        {/* Header */}
        <div className="bg-emerald-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            ✕
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              💊
            </div>
            <div>
              <h3 className="text-2xl font-bold">{medicine.name}</h3>
              <p className="text-emerald-100 opacity-90">{medicine.category} • {medicine.barcode}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inventory Info */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Informasi Inventori</h4>
              <div className="space-y-4">
                <InfoItem label="Stok Saat Ini" value={`${medicine.systemStock} ${medicine.unit}`} highlight />
                <InfoItem label="Satuan" value={medicine.unit} />
                <InfoItem label="Terakhir Audit" value={medicine.lastStockOpname ? new Date(medicine.lastStockOpname).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Belum pernah'} />
              </div>
            </div>

            {/* Barcode Preview Placeholder */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-200 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Preview Barcode</p>
              <div className="bg-white p-3 border border-slate-200 inline-block rounded">
                <div className="h-8 w-32 bg-slate-100 flex items-center justify-center space-x-1 opacity-50">
                   {[...Array(12)].map((_, i) => <div key={i} className={`h-full bg-slate-800 ${i % 3 === 0 ? 'w-1' : 'w-0.5'}`}></div>)}
                </div>
                <p className="text-[10px] font-mono mt-1 text-slate-600">{medicine.barcode}</p>
              </div>
              <button 
                onClick={handlePrintBarcode}
                className="mt-3 w-full py-1.5 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span>🖨️</span>
                <span>Cetak Label Barcode</span>
              </button>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Informasi Harga</h4>
              <div className="space-y-4">
                <InfoItem label="HNA (Harga Netto)" value={`Rp ${medicine.hna.toLocaleString()}`} />
                <InfoItem label="PPN (11%)" value={`Rp ${medicine.ppn.toLocaleString()}`} />
                <InfoItem label="Margin" value={`${medicine.margin}%`} />
                <div className="pt-4 mt-2 border-t border-slate-100">
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                    <p className="text-xs font-medium text-emerald-600 mb-1 uppercase">Harga Jual Konsumen</p>
                    <p className="text-2xl font-black text-emerald-900">Rp {sellingPrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
          <button 
            className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-colors"
          >
            Edit Informasi
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-slate-500">{label}</span>
    <span className={`text-sm font-semibold ${highlight ? 'text-emerald-600 font-bold' : 'text-slate-800'}`}>{value}</span>
  </div>
);

export default MedicineDetailModal;
