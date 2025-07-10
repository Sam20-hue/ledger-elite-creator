
import React from 'react';
import { useParams } from 'react-router-dom';
import { useInvoice } from '@/contexts/InvoiceContext';
import InvoicePreview from './InvoicePreview';
import { Card } from '@/components/ui/card';

const InvoicePreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { invoices } = useInvoice();
  
  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Invoice Not Found</h2>
          <p className="text-muted-foreground">The invoice you're looking for doesn't exist.</p>
        </Card>
      </div>
    );
  }

  return <InvoicePreview invoice={invoice} />;
};

export default InvoicePreviewPage;
