import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { InvoiceProvider } from '@/contexts/InvoiceContext';
import { FreezeProvider } from '@/contexts/FreezeContext';
import { AuthProvider } from '@/hooks/useSupabaseAuth';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Invoices from '@/pages/Invoices';
import Clients from '@/pages/Clients';
import BankAccounts from '@/pages/BankAccounts';
import Reports from '@/pages/Reports';
import Admin from '@/pages/Admin';
import Inventory from '@/pages/Inventory';
import Integrations from '@/pages/Integrations';
import Settings from '@/pages/Settings';
import EmployeePortal from '@/components/EmployeePortal';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <FreezeProvider>
          <InvoiceProvider>
            <Router>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/bank-accounts" element={<BankAccounts />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/hr" element={<EmployeePortal />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/integrations" element={<Integrations />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </InvoiceProvider>
        </FreezeProvider>
      </AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;