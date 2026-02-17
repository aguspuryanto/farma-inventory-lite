
import React, { useState } from 'react';
import { Medicine } from '../types';
import { analyzeStockDiscrepancy } from '../services/geminiService';
import BarcodeScannerModal from './BarcodeScannerModal';
import StockOpnameSummaryModal from './StockOpnameSummaryModal';
import { useHardwareScanner } from '../hooks/useHardwareScanner';

interface SessionChange {
  id: string;
  name: string;
  oldStock: number;
  newStock: number;
  analysis: string;
  unit: string;
}

interface StockOpnameProps {
  medicines: Medicine[];
  onUpdate: (id: string, actual: number) => void;
}

const StockOpname: React.FC<StockOpnameProps> = ({ medicines, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actualValue, setActualValue] = useState<string>('');
  const [analysis, setAnalysis] = useState<{ [key: string]: string }>({});
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [sessionChanges, setSessionChanges] = useState<SessionChange[]>([]);

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hardware Scanner Integration
  useHardwareScanner((barcode) => {
    setSearchTerm(barcode);
    const found = medicines.find(m => m.barcode === barcode);
    if (found) {
      handleStartEdit(found);
    }
  });

  const handleCameraScan = (barcode: string) => {
    setSearchTerm(barcode);
    setIsScannerOpen(false);
    const found = medicines.find(m => m.barcode === barcode);
    if (found) {
      handleStartEdit(found);
    }
  };

  const handleStartEdit = (m: Medicine) => {
    setEditingId(m.id);
    setActualValue(m.systemStock.toString());
  };

  const handleSave = async (m: Medicine) => {
    const val = parseInt(actualValue);
    if (!isNaN(val)) {
      onUpdate(m.id, val);
      
      let aiResult = "";
      if (val !== m.systemStock) {
        aiResult = await analyzeStockDiscrepancy(m, val);
        setAnalysis(prev => ({ ...prev, [m.id]: aiResult }));
      }

      setSessionChanges(prev => [
        ...prev.filter(c => c.id !== m.id),
        {
          id: m.id,
          name: m.name,
          oldStock: m.systemStock,
          newStock: val,
          analysis: aiResult,
          unit: m.unit
        }
      ]);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <BarcodeScannerModal 
        isOpen={isScannerOpen} 
        onClose={() => setIsScannerOpen(false)} 
        onScan={handleCameraScan} 
      />

      <StockOpnameSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => {
          setIsSummaryOpen(false);
          setSessionChanges([]);
        }}
        changes={sessionChanges}
      />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Cari nama obat atau scan barcode..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 shadow-lg shadow-emerald-100"
            >
              <span>📷</span>
              <span>Scan Barcode</span>
            </button>
            <button 
              onClick={() => setIsSummaryOpen(true)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium relative"
            >
              <span>Selesaikan Sesi</span>
              {sessionChanges.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
                  {sessionChanges.length}
                </span>
              )}
            </button>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-slate-400 italic">Sistem otomatis mendeteksi scanner fisik (Plug & Play)</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
            <tr>
              <th className="px-6 py-4 font-semibold">Nama Obat</th>
              <th className="px-6 py-4 font-semibold">Stok Sistem</th>
              <th className="px-6 py-4 font-semibold">Stok Fisik</th>
              <th className="px-6 py-4 font-semibold">Selisih</th>
              <th className="px-6 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMedicines.map(m => {
              const sessionChange = sessionChanges.find(c => c.id === m.id);
              return (
                <React.Fragment key={m.id}>
                  <tr className={`hover:bg-slate-50 transition-colors ${editingId === m.id ? 'bg-emerald-50/30' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-slate-900">{m.name}</p>
                        {sessionChange && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 rounded-md font-bold uppercase">Terhitung</span>}
                      </div>
                      <p className="text-xs text-slate-500">{m.barcode} • {m.category}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {m.systemStock} {m.unit}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === m.id ? (
                        <input
                          type="number"
                          className="w-20 px-2 py-1 border border-emerald-500 rounded focus:outline-none focus:ring-2 focus:ring-emerald-200"
                          value={actualValue}
                          onChange={(e) => setActualValue(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-slate-900">{m.systemStock} {m.unit}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm px-2 py-1 rounded-full ${m.systemStock - m.systemStock === 0 ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-600'}`}>
                        {0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {editingId === m.id ? (
                        <div className="flex items-center space-x-3">
                           <button 
                            onClick={() => handleSave(m)}
                            className="text-emerald-600 font-bold hover:text-emerald-700"
                          >
                            Simpan
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-slate-400 text-sm">Batal</button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleStartEdit(m)}
                          className="text-blue-600 font-medium hover:underline flex items-center space-x-1"
                        >
                          <span>{sessionChange ? 'Ulangi Cek' : 'Cek Fisik'}</span>
                          <span className="text-xs">➡️</span>
                        </button>
                      )}
                    </td>
                  </tr>
                  {analysis[m.id] && !isSummaryOpen && (
                    <tr>
                      <td colSpan={5} className="bg-emerald-50 px-6 py-4">
                        <div className="flex items-start space-x-2 text-sm text-emerald-800">
                          <span className="mt-1">🤖</span>
                          <div className="flex-1">
                            <p className="font-bold mb-1">Analisis AI Bumi Farma:</p>
                            <div className="whitespace-pre-line opacity-90">{analysis[m.id]}</div>
                          </div>
                          <button 
                            onClick={() => setAnalysis(prev => {
                              const n = {...prev};
                              delete n[m.id];
                              return n;
                            })}
                            className="text-emerald-400 hover:text-emerald-600"
                          >
                            ✕
                          </button>
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
  );
};

export default StockOpname;
