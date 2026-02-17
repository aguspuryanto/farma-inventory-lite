
import React, { useState } from 'react';
import { Medicine } from '../types';
import { analyzeStockDiscrepancy } from '../services/geminiService';

interface StockOpnameProps {
  medicines: Medicine[];
  onUpdate: (id: string, actual: number) => void;
}

const StockOpname: React.FC<StockOpnameProps> = ({ medicines, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actualValue, setActualValue] = useState<string>('');
  const [analysis, setAnalysis] = useState<{ [key: string]: string }>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStartEdit = (m: Medicine) => {
    setEditingId(m.id);
    setActualValue(m.systemStock.toString());
  };

  const handleSave = async (m: Medicine) => {
    const val = parseInt(actualValue);
    if (!isNaN(val)) {
      onUpdate(m.id, val);
      
      // Trigger AI analysis if there's a discrepancy
      if (val !== m.systemStock) {
        setIsAnalyzing(true);
        const result = await analyzeStockDiscrepancy(m, val);
        setAnalysis(prev => ({ ...prev, [m.id]: result }));
        setIsAnalyzing(false);
      }
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
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
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2">
            <span>📷</span>
            <span>Scan Barcode</span>
          </button>
        </div>
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
            {filteredMedicines.map(m => (
              <React.Fragment key={m.id}>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{m.name}</p>
                    <p className="text-xs text-slate-500">{m.barcode} • {m.category}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {m.systemStock} {m.unit}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === m.id ? (
                      <input
                        type="number"
                        className="w-20 px-2 py-1 border border-emerald-500 rounded focus:outline-none"
                        value={actualValue}
                        onChange={(e) => setActualValue(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium text-slate-900">{m.systemStock} {m.unit}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm px-2 py-1 rounded-full ${0 === 0 ? 'bg-slate-100 text-slate-600' : 'bg-red-100 text-red-600'}`}>
                      0
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === m.id ? (
                      <button 
                        onClick={() => handleSave(m)}
                        className="text-emerald-600 font-medium hover:text-emerald-700"
                      >
                        Simpan
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleStartEdit(m)}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        Cek Fisik
                      </button>
                    )}
                  </td>
                </tr>
                {analysis[m.id] && (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockOpname;
