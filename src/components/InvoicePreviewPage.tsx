
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
                  body { margin: 0; padding: 0; }
                  .no-print { display: none; }
                  * { box-sizing: border-box; }
                }
                @page {
                  size: A4;
                  margin: 0.5in;
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
      
      if (printRef.current) {
        // Create a clone for PDF generation with download styling
        const clonedElement = printRef.current.cloneNode(true) as HTMLElement;
        clonedElement.style.transform = 'scale(1)';
        clonedElement.style.transformOrigin = 'top left';
        
        // Temporarily add to DOM for canvas generation
        document.body.appendChild(clonedElement);
        
        const canvas = await import('html2canvas');
        const canvasElement = await canvas.default(clonedElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 794, // A4 width in pixels
          height: 1123, // A4 height in pixels
          logging: false
        });
        
        // Remove cloned element
        document.body.removeChild(clonedElement);
        
        const imgData = canvasElement.toDataURL('image/png', 1.0);
        
        // A4 size in mm (210 x 297)
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = 210;
        const pdfHeight = 297;
        
        // Calculate image dimensions to fit A4 properly
        const imgWidth = pdfWidth;
        const imgHeight = (canvasElement.height * pdfWidth) / canvasElement.width;
        
        if (imgHeight <= pdfHeight) {
          // Single page
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        } else {
          // Multiple pages
          let heightLeft = imgHeight;
          let position = 0;
          
          // Add first page
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
          
          // Add additional pages if needed
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
          }
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
      // Create a clean HTML version for Word with proper A4 styling
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            @page {
              size: A4;
              margin: 1in;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: #000000;
              margin: 0;
              padding: 0;
              background: white;
            }
            .invoice-container {
              max-width: 100%;
              margin: 0 auto;
              background: white;
              padding: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid #ddd;
              word-wrap: break-word;
            }
            th {
              background-color: #2563eb;
              color: white;
              font-weight: bold;
            }
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 2px solid #2563eb;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .invoice-title {
              font-size: 28px;
              font-weight: bold;
              color: #1f2937;
              text-align: right;
            }
            .client-section {
              background-color: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .total-section {
              float: right;
              width: 300px;
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 15px;
              border-bottom: 1px solid #e2e8f0;
            }
            .grand-total {
              background-color: #2563eb;
              color: white;
              font-weight: bold;
              font-size: 16px;
            }
            .notes-section {
              clear: both;
              background-color: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
              word-wrap: break-word;
            }
            .footer {
              text-align: center;
              background-color: #f1f5f9;
              padding: 15px;
              border-radius: 8px;
              color: #64748b;
              font-size: 11px;
              margin-top: 30px;
            }
            @media print {
              body { margin: 0; }
              .invoice-container { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${printRef.current.innerHTML}
          </div>
        </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      
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
