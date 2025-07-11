
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoice } from '@/contexts/InvoiceContext';
import InvoicePreview from './InvoicePreview';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const InvoicePreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { invoices } = useInvoice();
  const navigate = useNavigate();
  
  console.log('InvoicePreviewPage - ID:', id);
  console.log('InvoicePreviewPage - All invoices:', invoices);
  
  const invoice = invoices.find(inv => inv.id === id);
  console.log('InvoicePreviewPage - Found invoice:', invoice);

  if (!id) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Invalid Invoice ID</h2>
          <p className="text-muted-foreground mb-4">No invoice ID provided.</p>
          <Button onClick={() => navigate('/invoices')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Button>
        </Card>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Invoice Not Found</h2>
          <p className="text-muted-foreground mb-4">The invoice you're looking for doesn't exist or failed to load.</p>
          <Button onClick={() => navigate('/invoices')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/invoices')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Invoice Preview</h1>
      </div>
      <InvoicePreview invoice={invoice} />
    </div>
  );
};

export default InvoicePreviewPage;
