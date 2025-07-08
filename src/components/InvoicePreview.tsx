import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useInvoice } from '@/contexts/InvoiceContext';
import { Download, ArrowLeft, Edit, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { generateWordDocument } from '@/utils/wordGenerator';
import { formatDateToDDMMYYYY } from '@/utils/dateUtils';

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

  const selectedFields = invoice.selectedFields || {
    company: {
      logo: true, name: true, address: true, city: true, zipCode: true, 
      country: true, phone: true, email: true, website: true, taxId: true,
    },
    client: {
      name: true, address: true, city: true, zipCode: true, 
      country: true, email: true, phone: true,
    },
    invoice: {
      invoiceNumber: true, issueDate: true, dueDate: true, 
      notes: true, currency: true, taxRate: true,
    },
  };

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    
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

  const downloadWord = () => {
    generateWordDocument(invoice, company, selectedFields);
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
          <Button onClick={downloadWord} variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Download Word
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
                {selectedFields.company.logo && company.logo && (
                  <img 
                    src={company.logo} 
                    alt="Company Logo" 
                    className="h-12 sm:h-14 lg:h-16 mb-3 lg:mb-4 object-contain" 
                  />
                )}
                {selectedFields.company.name && (
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-2">
                    {company.name}
                  </h1>
                )}
                <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                  {selectedFields.company.address && company.address && <p>{company.address}</p>}
                  {(selectedFields.company.city && company.city) && (
                    <p>
                      {company.city}
                      {selectedFields.company.zipCode && company.zipCode && `, ${company.zipCode}`}
                    </p>
                  )}
                  {selectedFields.company.country && company.country && <p>{company.country}</p>}
                  <div className="mt-2 space-y-1">
                    {selectedFields.company.phone && company.phone && <p>Phone: {company.phone}</p>}
                    {selectedFields.company.email && company.email && <p>Email: {company.email}</p>}
                    {selectedFields.company.website && company.website && <p>Website: {company.website}</p>}
                    {selectedFields.company.taxId && company.taxId && <p>Tax ID: {company.taxId}</p>}
                  </div>
                </div>
              </div>
              <div className="text-left lg:text-right w-full lg:w-auto">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">INVOICE</h2>
                {selectedFields.invoice.invoiceNumber && (
                  <p className="text-base sm:text-lg font-semibold mb-3">{invoice.invoiceNumber}</p>
                )}
                <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                  {selectedFields.invoice.issueDate && (
                    <p><strong>Issue Date:</strong> {formatDateToDDMMYYYY(invoice.issueDate)}</p>
                  )}
                  {selectedFields.invoice.dueDate && (
                    <p><strong>Due Date:</strong> {formatDateToDDMMYYYY(invoice.dueDate)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-6 lg:mb-8">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2">Bill To:</h3>
              <div className="text-xs sm:text-sm space-y-1">
                {selectedFields.client.name && <p className="font-semibold">{invoice.client.name}</p>}
                {selectedFields.client.address && invoice.client.address && <p>{invoice.client.address}</p>}
                {(selectedFields.client.city && invoice.client.city) && (
                  <p>
                    {invoice.client.city}
                    {selectedFields.client.zipCode && invoice.client.zipCode && `, ${invoice.client.zipCode}`}
                  </p>
                )}
                {selectedFields.client.country && invoice.client.country && <p>{invoice.client.country}</p>}
                <div className="mt-2 space-y-1">
                  {selectedFields.client.email && invoice.client.email && <p>Email: {invoice.client.email}</p>}
                  {selectedFields.client.phone && invoice.client.phone && <p>Phone: {invoice.client.phone}</p>}
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
                {selectedFields.invoice.taxRate && (
                  <div className="flex justify-between py-1 sm:py-2">
                    <span>Tax ({Number(invoice.taxRate)}%):</span>
                    <span>${Number(invoice.tax).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t-2 border-gray-300 flex justify-between py-2 font-bold text-sm sm:text-base lg:text-lg">
                  <span>Total:</span>
                  <span>${selectedFields.invoice.taxRate ? Number(invoice.total).toFixed(2) : Number(invoice.subtotal).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedFields.invoice.notes && invoice.notes && (
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
