
import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoice } from '@/contexts/InvoiceContext';
import InvoicePreview from './InvoicePreview';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Printer, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InvoicePreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const { invoices } = useInvoice();
  const navigate = useNavigate();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  
  console.log('InvoicePreviewPage - ID:', id);
  console.log('InvoicePreviewPage - All invoices:', invoices);
  
  const invoice = invoices.find(inv => inv.id === id);
  console.log('InvoicePreviewPage - Found invoice:', invoice);

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice ${invoice?.invoiceNumber}</title>
              <style>
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF();
      
      if (printRef.current) {
        const canvas = await import('html2canvas');
        const canvasElement = await canvas.default(printRef.current);
        const imgData = canvasElement.toDataURL('image/png');
        
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvasElement.height * imgWidth) / canvasElement.width;
        let heightLeft = imgHeight;
        
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save(`invoice-${invoice?.invoiceNumber}.pdf`);
        toast({
          title: "Success",
          description: "Invoice downloaded as PDF successfully",
        });
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadWord = () => {
    if (printRef.current && invoice) {
      const htmlContent = printRef.current.innerHTML;
      const blob = new Blob([
        `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice ${invoice.invoiceNumber}</title>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
        `
      ], { type: 'application/msword' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.invoiceNumber}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Invoice downloaded as Word document successfully",
      });
    }
  };

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
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={handleDownloadWord}>
            <FileText className="h-4 w-4 mr-2" />
            Download Word
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold text-foreground">Invoice Preview</h1>
      </div>
      <InvoicePreview ref={printRef} invoice={invoice} />
    </div>
  );
};

export default InvoicePreviewPage;
