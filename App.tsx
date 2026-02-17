
import React, { useState, useEffect } from 'react';
import { View, Medicine, PurchaseOrder, Invoice } from './types';
import { INITIAL_MEDICINES } from './constants';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import StockOpname from './components/StockOpname';
import PurchaseOrderPage from './components/PurchaseOrderPage';
import InvoicePage from './components/InvoicePage';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Simple auth check simulation
  useEffect(() => {
    const auth = localStorage.getItem('pharmacy_auth');
    if (auth === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('pharmacy_auth', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('pharmacy_auth');
    setIsLoggedIn(false);
  };

  const updateMedicineStock = (id: string, actual: number) => {
    setMedicines(prev => prev.map(m => 
      m.id === id ? { ...m, systemStock: actual, lastStockOpname: new Date().toISOString() } : m
    ));
  };

  const addPurchaseOrder = (po: PurchaseOrder) => {
    setPurchaseOrders(prev => [po, ...prev]);
    setCurrentView(View.Dashboard);
  };

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
    // Update stock when invoice received
    setMedicines(prev => prev.map(m => {
      const item = invoice.items.find(i => i.medicineId === m.id);
      return item ? { ...m, systemStock: m.systemStock + item.quantity } : m;
    }));
    setCurrentView(View.Dashboard);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout}>
      {currentView === View.Dashboard && (
        <Dashboard 
          medicines={medicines} 
          purchaseOrders={purchaseOrders} 
          invoices={invoices} 
          setCurrentView={setCurrentView}
        />
      )}
      {currentView === View.StockOpname && (
        <StockOpname medicines={medicines} onUpdate={updateMedicineStock} />
      )}
      {currentView === View.PurchaseOrder && (
        <PurchaseOrderPage medicines={medicines} onSubmit={addPurchaseOrder} />
      )}
      {currentView === View.Invoices && (
        <InvoicePage purchaseOrders={purchaseOrders} medicines={medicines} onSubmit={addInvoice} />
      )}
    </Layout>
  );
};

export default App;
