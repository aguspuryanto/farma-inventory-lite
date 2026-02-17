
import React from 'react';

interface SessionChange {
  id: string;
  name: string;
  oldStock: number;
  newStock: number;
  analysis: string;
  unit: string;
}

interface StockOpnameSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  changes: SessionChange[];
}

const StockOpnameSummaryModal: React.FC<StockOpnameSummaryModalProps> = ({ isOpen, onClose, changes }) => {
  if (!isOpen) return null;

  const totalDiscrepancies = changes.filter(c => c.newStock !== c.oldStock).length;
  const totalItems = changes.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl my-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 bg-emerald-600 text-white shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Ringkasan Stock Opname</h2>
              <p className="text-emerald-100 opacity-90 mt-1">Sesi audit selesai dilakukan pada {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">✕</button>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
              <p className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Item Diperiksa</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
              <p className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Selisih Ditemukan</p>
              <p className="text-2xl font-bold">{totalDiscrepancies}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
              <p className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Status Akurasi</p>
              <p className="text-2xl font-bold">{totalItems > 0 ? Math.round(((totalItems - totalDiscrepancies) / totalItems) * 100) : 0}%</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {changes.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-5xl mb-4">🔍</p>
              <p>Belum ada item yang diperiksa dalam sesi ini.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="font-bold text-slate-800 text-lg">Detail Perubahan Stok</h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                    <tr>
                      <th className="px-6 py-4">Nama Obat</th>
                      <th className="px-6 py-4 text-center">Sistem</th>
                      <th className="px-6 py-4 text-center">Fisik</th>
                      <th className="px-6 py-4 text-center">Selisih</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {changes.map((item) => {
                      const diff = item.newStock - item.oldStock;
                      return (
                        <React.Fragment key={item.id}>
                          <tr className="bg-white">
                            <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                            <td className="px-6 py-4 text-center text-slate-500">{item.oldStock} {item.unit}</td>
                            <td className="px-6 py-4 text-center font-bold text-slate-900">{item.newStock} {item.unit}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                diff === 0 ? 'bg-slate-100 text-slate-500' : 
                                diff > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {diff > 0 ? '+' : ''}{diff}
                              </span>
                            </td>
                          </tr>
                          {item.analysis && (
                            <tr className="bg-slate-50/50">
                              <td colSpan={4} className="px-6 py-4 border-t border-slate-100">
                                <div className="flex items-start space-x-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                  <span className="text-xl">🤖</span>
                                  <div className="text-sm">
                                    <p className="font-bold text-emerald-800 mb-1">Analisis Gemini AI:</p>
                                    <div className="text-slate-600 italic whitespace-pre-line leading-relaxed">
                                      {item.analysis}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end space-x-4 shrink-0">
          <button 
            className="px-6 py-2 text-slate-600 font-medium hover:text-slate-900 transition-colors"
            onClick={() => window.print()}
          >
            🖨️ Cetak Laporan
          </button>
          <button 
            className="px-8 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
            onClick={onClose}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockOpnameSummaryModal;
