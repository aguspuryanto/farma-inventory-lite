
export interface Medicine {
  id: string;
  name: string;
  unit: string;
  systemStock: number;
  actualStock?: number;
  hna: number; // Harga Netto Apotek
  ppn: number; // 11%
  margin: number; // Percentage
  category: string;
  lastStockOpname?: string;
  barcode?: string;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
}

export interface PurchaseOrder {
  id: string;
  date: string;
  supplierId: string;
  supplierName: string;
  items: POItem[];
  status: 'Draft' | 'Sent' | 'Received';
  totalAmount: number;
  isPaid: boolean;
}

export interface POItem {
  medicineId: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface ReturnRecord {
  id: string;
  date: string;
  medicineId: string;
  medicineName: string;
  quantity: number;
  type: 'Purchase' | 'Sales'; // Purchase (ke supplier), Sales (dari pelanggan)
  reason: string;
  status: 'Pending' | 'Completed';
}

export interface Invoice {
  id: string;
  poId: string;
  invoiceNumber: string;
  date: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  medicineId: string;
  name: string;
  quantity: number;
  hna: number;
  ppn: number;
  sellingPrice: number;
}

export enum View {
  Dashboard = 'dashboard',
  MedicineList = 'medicine-list',
  StockOpname = 'stock-opname',
  InitialStock = 'initial-stock',
  PurchaseOrder = 'purchase-order',
  Invoices = 'invoices',
  Suppliers = 'suppliers',
  Returns = 'returns',
  Financials = 'financials',
  Login = 'login'
}
