
import { Medicine } from './types';

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: '1',
    name: 'Amoxicillin 500mg',
    unit: 'Strip',
    systemStock: 120,
    hna: 5000,
    ppn: 550,
    margin: 20,
    category: 'Antibiotik',
    barcode: 'AMX-001'
  },
  {
    id: '2',
    name: 'Paracetamol 500mg',
    unit: 'Box',
    systemStock: 45,
    hna: 12000,
    ppn: 1320,
    margin: 15,
    category: 'Analgesik',
    barcode: 'PCT-002'
  },
  {
    id: '3',
    name: 'Cetirizine 10mg',
    unit: 'Strip',
    systemStock: 80,
    hna: 3500,
    ppn: 385,
    margin: 25,
    category: 'Antihistamin',
    barcode: 'CTR-003'
  },
  {
    id: '4',
    name: 'Metformin 500mg',
    unit: 'Strip',
    systemStock: 200,
    hna: 2500,
    ppn: 275,
    margin: 20,
    category: 'Antidiabetik',
    barcode: 'MTF-004'
  },
  {
    id: '5',
    name: 'Amlodipine 5mg',
    unit: 'Strip',
    systemStock: 65,
    hna: 4200,
    ppn: 462,
    margin: 18,
    category: 'Hipertensi',
    barcode: 'AMD-005'
  }
];
