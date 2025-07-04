
import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useInvoice } from '@/contexts/InvoiceContext';
import { Download, ArrowLeft, Edit } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InvoicePreview = () => {
  const { id } = useParams();
  const { invoices, company } = useInvoice();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const invoice = invoices.find(inv => inv.id === id);

  if (!invoice) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">Invoice not found</p>
        <Link to="/invoices">
          <Button className="mt-4 text-sm">Back to Invoices</Button>
        </Link>
      </div>
    );
  }

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // A4 format: 210mm x 297mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pageWidth = 210;
    const pageHeight = 297;
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    
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

    pdf.save(`${invoice.invoiceNumber}.pdf`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 p-2 sm:p-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Link to="/invoices">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Back to Invoices
          </Button>
        </Link>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Link to={`/invoices/${invoice.id}`} className="w-full sm:w-auto">
            <Button variant="outline" size="sm" className="w-full text-xs sm:text-sm">
              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Edit
            </Button>
          </Link>
          <Button onClick={downloadPDF} size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-2 sm:p-4 lg:p-8">
          <div 
            ref={invoiceRef} 
            className="invoice-preview bg-white text-black min-h-[297mm] w-full max-w-[210mm] mx-auto"
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '15mm',
              fontSize: '12px',
              lineHeight: '1.4'
            }}
          >
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start mb-6 lg:mb-8 gap-4">
              <div className="flex-1">
                {company.logo && (
                  <img 
                    src={company.logo} 
                    alt="Company Logo" 
                    className="h-12 sm:h-14 lg:h-16 mb-3 lg:mb-4 object-contain" 
                  />
                )}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-2">
                  {company.name}
                </h1>
                <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                  <p>{company.address}</p>
                  <p>{company.city}, {company.zipCode}</p>
                  <p>{company.country}</p>
                  <div className="mt-2 space-y-1">
                    <p>Phone: {company.phone}</p>
                    <p>Email: {company.email}</p>
                    <p>Website: {company.website}</p>
                    {company.taxId && <p>Tax ID: {company.taxId}</p>}
                  </div>
                </div>
              </div>
              <div className="text-left lg:text-right w-full lg:w-auto">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">INVOICE</h2>
                <p className="text-base sm:text-lg font-semibold mb-3">{invoice.invoiceNumber}</p>
                <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                  <p><strong>Issue Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</p>
                  <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-6 lg:mb-8">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2">Bill To:</h3>
              <div className="text-xs sm:text-sm space-y-1">
                <p className="font-semibold">{invoice.client.name}</p>
                <p>{invoice.client.address}</p>
                <p>{invoice.client.city}, {invoice.client.zipCode}</p>
                <p>{invoice.client.country}</p>
                <div className="mt-2 space-y-1">
                  <p>Email: {invoice.client.email}</p>
                  <p>Phone: {invoice.client.phone}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6 lg:mb-8 overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left font-semibold">Description</th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 text-right font-semibold">Qty</th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 text-right font-semibold">Rate</th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 break-words">{item.description}</td>
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-right">{Number(item.quantity)}</td>
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-right">${Number(item.rate).toFixed(2)}</td>
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-right">${Number(item.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-6 lg:mb-8">
              <div className="w-full sm:w-64 text-xs sm:text-sm">
                <div className="flex justify-between py-1 sm:py-2">
                  <span>Subtotal:</span>
                  <span>${Number(invoice.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 sm:py-2">
                  <span>Tax ({Number(invoice.taxRate)}%):</span>
                  <span>${Number(invoice.tax).toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-300 flex justify-between py-2 font-bold text-sm sm:text-base lg:text-lg">
                  <span>Total:</span>
                  <span>${Number(invoice.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-6 lg:mb-8">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2">Notes:</h3>
                <p className="text-xs sm:text-sm text-gray-600 whitespace-pre-wrap break-words">{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 border-t pt-4 mt-8">
              <p>Thank you for your business!</p>
              <p>This invoice was generated electronically and is valid without signature.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicePreview;
