
import React, { useState, useEffect } from 'react';
import { View, Medicine, PurchaseOrder, Invoice, Supplier, ReturnRecord } from './types';
import { INITIAL_MEDICINES } from './constants';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import StockOpname from './components/StockOpname';
import PurchaseOrderPage from './components/PurchaseOrderPage';
import InvoicePage from './components/InvoicePage';
import InitialStock from './components/InitialStock';
import MedicineList from './components/MedicineList';
import SupplierManagement from './components/SupplierManagement';
import ReturnsManagement from './components/ReturnsManagement';
import Financials from './components/Financials';
import Layout from './components/Layout';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState<View>(View.Dashboard);
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 'SUP-001', name: 'PBF Bina Sanata', phone: '021-889900', email: 'sales@binasanata.com', address: 'Jl. Industri No. 45, Jakarta' },
    { id: 'SUP-002', name: 'Kimia Farma Trading', phone: '021-112233', email: 'order@kftd.co.id', address: 'Jl. Budi Utomo No. 1, Jakarta' }
  ]);
  const [returns, setReturns] = useState<ReturnRecord[]>([]);

  // Check auth session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  const updateMedicineStock = (id: string, actual: number) => {
    setMedicines(prev => prev.map(m => 
      m.id === id ? { ...m, systemStock: actual, lastStockOpname: new Date().toISOString() } : m
    ));
  };

  const addMedicine = (newMed: Medicine) => {
    setMedicines(prev => [...prev, newMed]);
  };

  const addPurchaseOrder = (po: PurchaseOrder) => {
    setPurchaseOrders(prev => [po, ...prev]);
    setCurrentView(View.Dashboard);
  };

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
    setMedicines(prev => prev.map(m => {
      const item = invoice.items.find(i => i.medicineId === m.id);
      return item ? { ...m, systemStock: m.systemStock + item.quantity } : m;
    }));
    setCurrentView(View.Dashboard);
  };

  const addSupplier = (sup: Supplier) => {
    setSuppliers(prev => [sup, ...prev]);
  };

  const addReturnRecord = (record: ReturnRecord) => {
    setReturns(prev => [record, ...prev]);
    setMedicines(prev => prev.map(m => {
      if (m.id === record.medicineId) {
        const modifier = record.type === 'Sales' ? 1 : -1;
        return { ...m, systemStock: Math.max(0, m.systemStock + (record.quantity * modifier)) };
      }
      return m;
    }));
  };

  if (!isLoggedIn) {
    if (authView === 'register') {
      return (
        <RegisterPage 
          onBackToLogin={() => setAuthView('login')} 
          onRegisterSuccess={() => setAuthView('login')} 
        />
      );
    }
    return <LoginPage onLogin={handleLogin} onGoToRegister={() => setAuthView('register')} />;
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
      {currentView === View.MedicineList && (
        <MedicineList medicines={medicines} />
      )}
      {currentView === View.Suppliers && (
        <SupplierManagement suppliers={suppliers} onAdd={addSupplier} />
      )}
      {currentView === View.InitialStock && (
        <InitialStock onAdd={addMedicine} />
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
      {currentView === View.Returns && (
        <ReturnsManagement medicines={medicines} returns={returns} onAdd={addReturnRecord} />
      )}
      {currentView === View.Financials && (
        <Financials purchaseOrders={purchaseOrders} />
      )}
    </Layout>
  );
};

export default App;
