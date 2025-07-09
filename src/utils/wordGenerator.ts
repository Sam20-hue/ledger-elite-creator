
import { Invoice } from '@/types/invoice';
import { Company } from '@/types/invoice';
import { formatDateToDDMMYYYY } from '@/utils/dateUtils';

interface SelectedFields {
  company: Record<string, boolean>;
  client: Record<string, boolean>;
  invoice: Record<string, boolean>;
}

export const generateWordDocument = (
  invoice: Invoice,
  company: Company,
  selectedFields: SelectedFields
) => {
  // Create HTML content that Word can import with proper sizing
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        @page {
          size: A4;
          margin: 2cm;
        }
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 0;
          color: #000; 
          background: #fff;
          font-size: 11pt;
          line-height: 1.3;
          width: 17cm;
          max-width: 17cm;
        }
        .header { 
          display: flex; 
          justify-content: space-between; 
          margin-bottom: 20px; 
          align-items: flex-start;
        }
        .company-info { 
          flex: 1; 
          max-width: 50%;
        }
        .invoice-info { 
          text-align: right; 
          max-width: 40%;
        }
        .invoice-title { 
          font-size: 20pt; 
          font-weight: bold; 
          color: #2563eb; 
          margin-bottom: 8px; 
        }
        .client-section { 
          margin: 20px 0; 
          clear: both;
        }
        .section-title { 
          font-weight: bold; 
          margin-bottom: 8px; 
          font-size: 12pt;
        }
        .company-logo {
          height: 50px;
          max-width: 150px;
          margin-bottom: 10px;
          object-fit: contain;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 15px 0; 
          font-size: 10pt;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: left; 
        }
        th { 
          background-color: #f5f5f5; 
          font-weight: bold; 
        }
        .totals { 
          margin-top: 15px; 
          text-align: right; 
          font-size: 11pt;
        }
        .total-row { 
          margin: 3px 0; 
          padding: 2px 0;
        }
        .final-total { 
          font-weight: bold; 
          font-size: 12pt; 
          border-top: 2px solid #333; 
          padding-top: 8px; 
          margin-top: 8px;
        }
        .notes { 
          margin-top: 20px; 
        }
        .footer { 
          margin-top: 30px; 
          text-align: center; 
          color: #666; 
          border-top: 1px solid #ddd; 
          padding-top: 15px; 
          font-size: 9pt;
        }
        .info-line {
          margin: 2px 0;
          font-size: 10pt;
        }
        .invoice-number {
          font-size: 14pt;
          font-weight: bold;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
  `;

  // Company Information
  if (selectedFields.company.logo && company.logo) {
    htmlContent += `<img src="${company.logo}" alt="Company Logo" class="company-logo">`;
  }
  if (selectedFields.company.name && company.name) {
    htmlContent += `<div class="invoice-title">${company.name}</div>`;
  }
  if (selectedFields.company.address && company.address) {
    htmlContent += `<div class="info-line">${company.address}</div>`;
  }
  if (selectedFields.company.city && company.city) {
    htmlContent += `<div class="info-line">${company.city}${selectedFields.company.zipCode && company.zipCode ? ', ' + company.zipCode : ''}</div>`;
  }
  if (selectedFields.company.country && company.country) {
    htmlContent += `<div class="info-line">${company.country}</div>`;
  }
  if (selectedFields.company.phone && company.phone) {
    htmlContent += `<div class="info-line">Phone: ${company.phone}</div>`;
  }
  if (selectedFields.company.email && company.email) {
    htmlContent += `<div class="info-line">Email: ${company.email}</div>`;
  }
  if (selectedFields.company.website && company.website) {
    htmlContent += `<div class="info-line">Website: ${company.website}</div>`;
  }
  if (selectedFields.company.taxId && company.taxId) {
    htmlContent += `<div class="info-line">Tax ID: ${company.taxId}</div>`;
  }

  htmlContent += `
        </div>
        <div class="invoice-info">
          <h2 style="font-size: 16pt; margin-bottom: 10px;">INVOICE</h2>
  `;

  if (selectedFields.invoice.invoiceNumber) {
    htmlContent += `<div class="invoice-number">${invoice.invoiceNumber}</div>`;
  }
  if (selectedFields.invoice.issueDate) {
    htmlContent += `<div class="info-line"><strong>Issue Date:</strong> ${formatDateToDDMMYYYY(invoice.issueDate)}</div>`;
  }
  if (selectedFields.invoice.dueDate) {
    htmlContent += `<div class="info-line"><strong>Due Date:</strong> ${formatDateToDDMMYYYY(invoice.dueDate)}</div>`;
  }

  htmlContent += `
        </div>
      </div>

      <div class="client-section">
        <div class="section-title">Bill To:</div>
  `;

  // Client Information
  if (selectedFields.client.name && invoice.client.name) {
    htmlContent += `<div class="info-line" style="font-weight: bold;">${invoice.client.name}</div>`;
  }
  if (selectedFields.client.address && invoice.client.address) {
    htmlContent += `<div class="info-line">${invoice.client.address}</div>`;
  }
  if (selectedFields.client.city && invoice.client.city) {
    htmlContent += `<div class="info-line">${invoice.client.city}${selectedFields.client.zipCode && invoice.client.zipCode ? ', ' + invoice.client.zipCode : ''}</div>`;
  }
  if (selectedFields.client.country && invoice.client.country) {
    htmlContent += `<div class="info-line">${invoice.client.country}</div>`;
  }
  if (selectedFields.client.email && invoice.client.email) {
    htmlContent += `<div class="info-line">Email: ${invoice.client.email}</div>`;
  }
  if (selectedFields.client.phone && invoice.client.phone) {
    htmlContent += `<div class="info-line">Phone: ${invoice.client.phone}</div>`;
  }

  htmlContent += `
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 50%;">Description</th>
            <th style="text-align: right; width: 15%;">Qty</th>
            <th style="text-align: right; width: 15%;">Rate</th>
            <th style="text-align: right; width: 20%;">Amount</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Invoice Items
  invoice.items.forEach((item) => {
    htmlContent += `
      <tr>
        <td>${item.description}</td>
        <td style="text-align: right;">${item.quantity}</td>
        <td style="text-align: right;">${invoice.currency === 'USD' ? '$' : invoice.currency}${Number(item.rate).toFixed(2)}</td>
        <td style="text-align: right;">${invoice.currency === 'USD' ? '$' : invoice.currency}${Number(item.amount).toFixed(2)}</td>
      </tr>
    `;
  });

  htmlContent += `
        </tbody>
      </table>

      <div class="totals">
        <div class="total-row">Subtotal: ${invoice.currency === 'USD' ? '$' : invoice.currency}${Number(invoice.subtotal).toFixed(2)}</div>
  `;

  if (selectedFields.invoice.taxRate) {
    htmlContent += `<div class="total-row">Tax (${Number(invoice.taxRate)}%): ${invoice.currency === 'USD' ? '$' : invoice.currency}${Number(invoice.tax).toFixed(2)}</div>`;
  }

  const finalTotal = selectedFields.invoice.taxRate ? Number(invoice.total) : Number(invoice.subtotal);
  
  htmlContent += `
        <div class="total-row final-total">Total: ${invoice.currency === 'USD' ? '$' : invoice.currency}${finalTotal.toFixed(2)}</div>
      </div>
  `;

  if (selectedFields.invoice.notes && invoice.notes) {
    htmlContent += `
      <div class="notes">
        <div class="section-title">Notes:</div>
        <div style="font-size: 10pt;">${invoice.notes.replace(/\n/g, '<br>')}</div>
      </div>
    `;
  }

  htmlContent += `
      <div class="footer">
        <p>Thank you for your business!</p>
        <p>This invoice was generated electronically and is valid without signature.</p>
      </div>
    </body>
    </html>
  `;

  // Create and download the file
  const blob = new Blob([htmlContent], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${invoice.invoiceNumber}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
