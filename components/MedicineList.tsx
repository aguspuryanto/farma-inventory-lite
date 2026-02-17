
import React, { useState, useMemo } from 'react';
import { Medicine } from '../types';
import MedicineDetailModal from './MedicineDetailModal';

interface MedicineListProps {
  medicines: Medicine[];
}

type SortField = 'name' | 'category' | 'systemStock' | 'price';
type SortOrder = 'asc' | 'desc';

const MedicineList: React.FC<MedicineListProps> = ({ medicines }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Calculate selling price helper
  const getSellingPrice = (m: Medicine) => Math.round((m.hna + m.ppn) * (1 + m.margin / 100));

  // 1. Filtering
  const filteredMedicines = useMemo(() => {
    return medicines.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      m.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [medicines, searchTerm]);

  // 2. Sorting
  const sortedMedicines = useMemo(() => {
    const sorted = [...filteredMedicines].sort((a, b) => {
      let valA: any, valB: any;
      
      switch (sortField) {
        case 'name': valA = a.name; valB = b.name; break;
        case 'category': valA = a.category; valB = b.category; break;
        case 'systemStock': valA = a.systemStock; valB = b.systemStock; break;
        case 'price': valA = getSellingPrice(a); valB = getSellingPrice(b); break;
        default: valA = a.name; valB = b.name;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredMedicines, sortField, sortOrder]);

  // 3. Pagination
  const totalPages = Math.ceil(sortedMedicines.length / itemsPerPage);
  const paginatedMedicines = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedMedicines.slice(start, start + itemsPerPage);
  }, [sortedMedicines, currentPage]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // Reset to page 1 on sort
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return <span className="text-slate-300 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">↕</span>;
    return sortOrder === 'asc' ? <span className="text-emerald-500 ml-1">↑</span> : <span className="text-emerald-500 ml-1">↓</span>;
  };

  return (
    <div className="space-y-6">
      <MedicineDetailModal 
        medicine={selectedMedicine} 
        onClose={() => setSelectedMedicine(null)} 
      />

      {/* Control Bar */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Cari obat (nama, kategori, barcode)..."
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Menampilkan {paginatedMedicines.length} dari {filteredMedicines.length} obat
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th 
                  className="px-6 py-4 cursor-pointer group hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nama Obat {renderSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer group hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Kategori {renderSortIcon('category')}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer group hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('systemStock')}
                >
                  <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Stok {renderSortIcon('systemStock')}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 cursor-pointer group hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Harga Jual {renderSortIcon('price')}
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedMedicines.length > 0 ? paginatedMedicines.map(m => (
                <tr 
                  key={m.id} 
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  onClick={() => setSelectedMedicine(m)}
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">{m.name}</p>
                    <p className="text-xs text-slate-400">{m.barcode}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                      {m.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-bold ${m.systemStock < 20 ? 'text-red-500' : 'text-slate-700'}`}>
                        {m.systemStock}
                      </span>
                      <span className="text-xs text-slate-400">{m.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">
                      Rp {getSellingPrice(m).toLocaleString()}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      className="text-emerald-600 font-bold text-sm hover:text-emerald-700 transition-colors flex items-center space-x-1"
                    >
                      <span>Detail</span>
                      <span>→</span>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-4xl mb-4">💊</p>
                    <p className="text-slate-500 font-medium">Obat tidak ditemukan.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Halaman <span className="font-bold text-slate-900">{currentPage}</span> dari <span className="font-bold text-slate-900">{totalPages}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.max(1, prev - 1)); }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Sebelumnya
              </button>
              
              <div className="hidden md:flex items-center space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={(e) => { e.stopPropagation(); setCurrentPage(i + 1); }}
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                      currentPage === i + 1 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' 
                      : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={(e) => { e.stopPropagation(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Tooltip */}
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center space-x-4">
        <div className="p-2 bg-emerald-100 rounded-lg text-xl">💡</div>
        <p className="text-sm text-emerald-800 leading-relaxed">
          Klik pada <strong>judul kolom</strong> untuk mengurutkan data. Stok berwarna <span className="text-red-600 font-bold">merah</span> menunjukkan persediaan yang sangat menipis (dibawah 20 item).
        </p>
      </div>
    </div>
  );
};

export default MedicineList;
