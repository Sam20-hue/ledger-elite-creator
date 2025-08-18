import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './hooks/useAuth';
import { InvoiceProvider } from './contexts/InvoiceContext';
import { FreezeProvider } from './contexts/FreezeContext';
import { Toaster } from '@/components/ui/toaster';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
import InvoiceList from './components/InvoiceList';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreviewPage from './components/InvoicePreviewPage';
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
import FreezeSettings from './components/FreezeSettings';
import Admin from './pages/Admin';
import UserManagement from './components/UserManagement';
import HRManagement from './components/HRManagement';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="numera-theme">
        <AuthProvider>
          <FreezeProvider>
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
                    <Route path="/invoices/new" element={
                      <ProtectedRoute requiredPermission="invoices">
                        <InvoiceForm />
                      </ProtectedRoute>
                    } />
                    <Route path="/invoices/:id" element={
                      <ProtectedRoute requiredPermission="invoices">
                        <InvoiceForm />
                      </ProtectedRoute>
                    } />
                    <Route path="/invoices/:id/preview" element={
                      <ProtectedRoute requiredPermission="invoices">
                        <InvoicePreviewPage />
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
                    <Route path="/freeze" element={
                      <ProtectedRoute requiredPermission="freeze">
                        <FreezeSettings />
                      </ProtectedRoute>
                    } />
                    <Route path="/users" element={
                      <ProtectedRoute requiredPermission="users">
                        <UserManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/hr" element={
                      <ProtectedRoute requiredPermission="hr">
                        <HRManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                      <ProtectedRoute requiredPermission="admin">
                        <Admin />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </Router>
              <Toaster />
            </InvoiceProvider>
          </FreezeProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
