
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
        <p className="text-muted-foreground">Invoice not found</p>
        <Link to="/invoices">
          <Button className="mt-4">Back to Invoices</Button>
        </Link>
      </div>
    );
  }

  const downloadPDF = async () => {
    if (!invoiceRef.current) return;

    const canvas = await html2canvas(invoiceRef.current);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/invoices">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Button>
        </Link>
        <div className="space-x-2">
          <Link to={`/invoices/${invoice.id}`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button onClick={downloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <div ref={invoiceRef} className="bg-white">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                {company.logo && (
                  <img src={company.logo} alt="Company Logo" className="h-16 mb-4" />
                )}
                <h1 className="text-3xl font-bold text-blue-600">{company.name}</h1>
                <div className="text-sm text-gray-600 mt-2">
                  <p>{company.address}</p>
                  <p>{company.city}, {company.zipCode}</p>
                  <p>{company.country}</p>
                  <p className="mt-2">
                    Phone: {company.phone}<br />
                    Email: {company.email}<br />
                    Website: {company.website}
                  </p>
                  {company.taxId && <p>Tax ID: {company.taxId}</p>}
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold mb-2">INVOICE</h2>
                <p className="text-lg font-semibold">{invoice.invoiceNumber}</p>
                <div className="text-sm text-gray-600 mt-4">
                  <p><strong>Issue Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</p>
                  <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Bill To:</h3>
              <div className="text-sm">
                <p className="font-semibold">{invoice.client.name}</p>
                <p>{invoice.client.address}</p>
                <p>{invoice.client.city}, {invoice.client.zipCode}</p>
                <p>{invoice.client.country}</p>
                <p className="mt-2">
                  Email: {invoice.client.email}<br />
                  Phone: {invoice.client.phone}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Qty</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Rate</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{Number(item.quantity)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">${Number(item.rate).toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">${Number(item.amount).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span>Subtotal:</span>
                  <span>${Number(invoice.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Tax ({Number(invoice.taxRate)}%):</span>
                  <span>${Number(invoice.tax).toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-300 flex justify-between py-2 font-bold text-lg">
                  <span>Total:</span>
                  <span>${Number(invoice.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Notes:</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 border-t pt-4">
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
