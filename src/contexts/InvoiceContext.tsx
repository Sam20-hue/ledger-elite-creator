
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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

const defaultCompany: Company = {
  name: '',
  logo: '',
  address: '',
  city: '',
  zipCode: '',
  country: '',
  phone: '',
  email: '',
  website: '',
  taxId: ''
};

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [company, setCompany] = useState<Company>(defaultCompany);

  useEffect(() => {
    // Load shared data (no longer user-specific)
    const savedInvoices = JSON.parse(localStorage.getItem('sharedInvoices') || '[]');
    const savedClients = JSON.parse(localStorage.getItem('sharedClients') || '[]');
    const savedCompany = JSON.parse(localStorage.getItem('sharedCompany') || JSON.stringify(defaultCompany));
    setInvoices(savedInvoices);
    setClients(savedClients);
    setCompany(savedCompany);
  }, []);

  const addInvoice = (invoice: Invoice) => {
    const updatedInvoices = [...invoices, invoice];
    setInvoices(updatedInvoices);
    localStorage.setItem('sharedInvoices', JSON.stringify(updatedInvoices));
  };

  const updateInvoice = (invoice: Invoice) => {
    const updatedInvoices = invoices.map(inv => inv.id === invoice.id ? invoice : inv);
    setInvoices(updatedInvoices);
    localStorage.setItem('sharedInvoices', JSON.stringify(updatedInvoices));
  };

  const deleteInvoice = (id: string) => {
    const updatedInvoices = invoices.filter(inv => inv.id !== id);
    setInvoices(updatedInvoices);
    localStorage.setItem('sharedInvoices', JSON.stringify(updatedInvoices));
  };

  const addClient = (client: Client) => {
    const updatedClients = [...clients, client];
    setClients(updatedClients);
    localStorage.setItem('sharedClients', JSON.stringify(updatedClients));
  };

  const updateClient = (client: Client) => {
    const updatedClients = clients.map(c => c.id === client.id ? client : c);
    setClients(updatedClients);
    localStorage.setItem('sharedClients', JSON.stringify(updatedClients));
  };

  const deleteClient = (id: string) => {
    const updatedClients = clients.filter(c => c.id !== id);
    setClients(updatedClients);
    localStorage.setItem('sharedClients', JSON.stringify(updatedClients));
  };

  const updateCompany = (companyData: Company) => {
    setCompany(companyData);
    localStorage.setItem('sharedCompany', JSON.stringify(companyData));
  };

  const getNextInvoiceNumber = () => {
    const lastInvoice = invoices
      .filter(inv => inv.invoiceNumber.startsWith('INV-'))
      .sort((a, b) => {
        const numA = parseInt(a.invoiceNumber.replace('INV-', ''));
        const numB = parseInt(b.invoiceNumber.replace('INV-', ''));
        return numB - numA;
      })[0];

    if (!lastInvoice) {
      return 'INV-001';
    }

    const lastNumber = parseInt(lastInvoice.invoiceNumber.replace('INV-', ''));
    const nextNumber = lastNumber + 1;
    return `INV-${nextNumber.toString().padStart(3, '0')}`;
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
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};
