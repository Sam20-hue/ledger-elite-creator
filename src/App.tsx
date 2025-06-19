
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InvoiceProvider } from "@/contexts/InvoiceContext";
import { AuthProvider } from "@/hooks/useAuth";
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
import IntegrationsPage from "@/components/IntegrationsPage";
import EnhancedSettings from "@/components/EnhancedSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <InvoiceProvider>
          <BrowserRouter>
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
                <Route path="/payments" element={<PaymentTracking />} />
                <Route path="/company" element={<CompanySettings />} />
                <Route path="/integrations" element={<IntegrationsPage />} />
                <Route path="/settings" element={<EnhancedSettings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </InvoiceProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
