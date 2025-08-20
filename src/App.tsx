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
                  <Route index element={<Index />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/hr" element={<EmployeePortal />} />
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