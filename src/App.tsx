
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './hooks/useAuth';
import { InvoiceProvider } from './contexts/InvoiceContext';
import { Toaster } from '@/components/ui/toaster';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import InvoiceList from './components/InvoiceList';
import EnhancedClientManagement from './components/EnhancedClientManagement';
import InventoryManagement from './components/InventoryManagement';
import FinancialReports from './components/FinancialReports';
import BankAccounts from './components/BankAccounts';
import PaymentTracking from './components/PaymentTracking';
import PaymentInitiation from './components/PaymentInitiation';
import EmailService from './components/EmailService';
import CompanySettings from './components/CompanySettings';
import IntegrationsPage from './components/IntegrationsPage';
import SettingsPage from './components/SettingsPage';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="numera-theme">
        <AuthProvider>
          <InvoiceProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute requiredPermission="dashboard">
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/invoices" element={
                    <ProtectedRoute requiredPermission="invoices">
                      <InvoiceList />
                    </ProtectedRoute>
                  } />
                  <Route path="/clients" element={
                    <ProtectedRoute requiredPermission="clients">
                      <EnhancedClientManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/inventory" element={
                    <ProtectedRoute requiredPermission="inventory">
                      <InventoryManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/financial-reports" element={
                    <ProtectedRoute requiredPermission="financial-reports">
                      <FinancialReports />
                    </ProtectedRoute>
                  } />
                  <Route path="/bank-accounts" element={
                    <ProtectedRoute requiredPermission="bank-accounts">
                      <BankAccounts />
                    </ProtectedRoute>
                  } />
                  <Route path="/payments" element={
                    <ProtectedRoute requiredPermission="payments">
                      <PaymentTracking />
                    </ProtectedRoute>
                  } />
                  <Route path="/payment-initiation" element={
                    <ProtectedRoute requiredPermission="payment-initiation">
                      <PaymentInitiation />
                    </ProtectedRoute>
                  } />
                  <Route path="/email-service" element={
                    <ProtectedRoute requiredPermission="email-service">
                      <EmailService />
                    </ProtectedRoute>
                  } />
                  <Route path="/company" element={
                    <ProtectedRoute requiredPermission="company">
                      <CompanySettings />
                    </ProtectedRoute>
                  } />
                  <Route path="/integrations" element={
                    <ProtectedRoute requiredPermission="integrations">
                      <IntegrationsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute requiredPermission="settings">
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </Router>
            <Toaster />
          </InvoiceProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
