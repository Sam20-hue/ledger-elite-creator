
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { InvoiceProvider } from "@/contexts/InvoiceContext";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/ThemeProvider";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import Dashboard from "@/components/Dashboard";
import InvoiceList from "@/components/InvoiceList";
import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import EnhancedClientManagement from "@/components/EnhancedClientManagement";
import CompanySettings from "@/components/CompanySettings";
import PaymentTracking from "@/components/PaymentTracking";
import FinancialReports from "@/components/FinancialReports";
import PaymentInitiation from "@/components/PaymentInitiation";
import EmailService from "@/components/EmailService";
import IntegrationsPage from "@/components/IntegrationsPage";
import EnhancedSettings from "@/components/EnhancedSettings";
import NotFound from "@/pages/NotFound";
import BankAccounts from "@/components/BankAccounts";
import EmailJSSetup from "@/components/EmailJSSetup";
import InventoryManagement from "@/components/InventoryManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ledger-elite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <AuthProvider>
          <InvoiceProvider>
            <HashRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/invoices" element={<InvoiceList />} />
                  <Route path="/invoices/new" element={<InvoiceForm />} />
                  <Route path="/invoices/:id" element={<InvoiceForm />} />
                  <Route path="/invoices/:id/preview" element={<InvoicePreview />} />
                  <Route path="/clients" element={<EnhancedClientManagement />} />
                  <Route path="/inventory" element={<InventoryManagement />} />
                  <Route path="/financial-reports" element={<FinancialReports />} />
                  <Route path="/bank-accounts" element={<BankAccounts />} />
                  <Route path="/payments" element={<PaymentTracking />} />
                  <Route path="/payment-initiation" element={<PaymentInitiation />} />
                  <Route path="/email-service" element={<EmailService />} />
                  <Route path="/email-setup" element={<EmailJSSetup />} />
                  <Route path="/company" element={<CompanySettings />} />
                  <Route path="/integrations" element={<IntegrationsPage />} />
                  <Route path="/settings" element={<EnhancedSettings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </HashRouter>
          </InvoiceProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
