
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Invoice, Client, Company } from '@/types/invoice';

interface InvoiceContextType {
  invoices: Invoice[];
  clients: Client[];
  company: Company;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  updateCompany: (company: Company) => void;
  getNextInvoiceNumber: () => string;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

const defaultCompany: Company = {
  name: 'Your Company Name',
  logo: '',
  address: '123 Business Street',
  city: 'Business City',
  zipCode: '12345',
  country: 'Country',
  phone: '+1 (555) 123-4567',
  email: 'info@yourcompany.com',
  website: 'www.yourcompany.com',
  taxId: 'TAX123456789'
};

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [company, setCompany] = useState<Company>(defaultCompany);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    const savedClients = localStorage.getItem('clients');
    const savedCompany = localStorage.getItem('company');

    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
    if (savedCompany) {
      setCompany(JSON.parse(savedCompany));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('company', JSON.stringify(company));
  }, [company]);

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [...prev, invoice]);
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const addClient = (client: Client) => {
    setClients(prev => [...prev, client]);
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(client => client.id === updatedClient.id ? updatedClient : client));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const updateCompany = (updatedCompany: Company) => {
    setCompany(updatedCompany);
  };

  const getNextInvoiceNumber = () => {
    const currentYear = new Date().getFullYear();
    const currentInvoices = invoices.filter(inv => 
      inv.invoiceNumber.startsWith(`INV-${currentYear}`)
    );
    const nextNumber = currentInvoices.length + 1;
    return `INV-${currentYear}-${nextNumber.toString().padStart(4, '0')}`;
  };

  return (
    <InvoiceContext.Provider value={{
      invoices,
      clients,
      company,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      addClient,
      updateClient,
      deleteClient,
      updateCompany,
      getNextInvoiceNumber
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};
