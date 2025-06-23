
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Invoice, Client } from '@/types/invoice';

interface InvoiceContextType {
  invoices: Invoice[];
  clients: Client[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    // Load shared data (no longer user-specific)
    const savedInvoices = JSON.parse(localStorage.getItem('sharedInvoices') || '[]');
    const savedClients = JSON.parse(localStorage.getItem('sharedClients') || '[]');
    setInvoices(savedInvoices);
    setClients(savedClients);
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

  return (
    <InvoiceContext.Provider value={{
      invoices,
      clients,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      addClient,
      updateClient,
      deleteClient
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
