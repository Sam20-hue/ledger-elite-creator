
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InvoiceProvider } from "@/contexts/InvoiceContext";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import InvoiceList from "@/components/InvoiceList";
import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import ClientManagement from "@/components/ClientManagement";
import CompanySettings from "@/components/CompanySettings";
import PaymentTracking from "@/components/PaymentTracking";
import IntegrationsPage from "@/components/IntegrationsPage";
import SettingsPage from "@/components/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <InvoiceProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/invoices" element={<InvoiceList />} />
              <Route path="/invoices/new" element={<InvoiceForm />} />
              <Route path="/invoices/:id" element={<InvoiceForm />} />
              <Route path="/invoices/:id/preview" element={<InvoicePreview />} />
              <Route path="/clients" element={<ClientManagement />} />
              <Route path="/payments" element={<PaymentTracking />} />
              <Route path="/company" element={<CompanySettings />} />
              <Route path="/integrations" element={<IntegrationsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </InvoiceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
