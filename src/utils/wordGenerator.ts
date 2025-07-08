
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
  // Create HTML content that Word can import
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #000; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .company-info { flex: 1; }
        .invoice-info { text-align: right; }
        .invoice-title { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
        .client-section { margin: 30px 0; }
        .section-title { font-weight: bold; margin-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .totals { margin-top: 20px; text-align: right; }
        .total-row { margin: 5px 0; }
        .final-total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 10px; }
        .notes { margin-top: 30px; }
        .footer { margin-top: 50px; text-align: center; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
  `;

  // Company Information
  if (selectedFields.company.logo && company.logo) {
    htmlContent += `<img src="${company.logo}" alt="Company Logo" style="height: 60px; margin-bottom: 15px;"><br>`;
  }
  if (selectedFields.company.name && company.name) {
    htmlContent += `<div class="invoice-title">${company.name}</div>`;
  }
  if (selectedFields.company.address && company.address) {
    htmlContent += `<div>${company.address}</div>`;
  }
  if (selectedFields.company.city && company.city) {
    htmlContent += `<div>${company.city}${selectedFields.company.zipCode && company.zipCode ? ', ' + company.zipCode : ''}</div>`;
  }
  if (selectedFields.company.country && company.country) {
    htmlContent += `<div>${company.country}</div>`;
  }
  if (selectedFields.company.phone && company.phone) {
    htmlContent += `<div>Phone: ${company.phone}</div>`;
  }
  if (selectedFields.company.email && company.email) {
    htmlContent += `<div>Email: ${company.email}</div>`;
  }
  if (selectedFields.company.website && company.website) {
    htmlContent += `<div>Website: ${company.website}</div>`;
  }
  if (selectedFields.company.taxId && company.taxId) {
    htmlContent += `<div>Tax ID: ${company.taxId}</div>`;
  }

  htmlContent += `
        </div>
        <div class="invoice-info">
          <h2>INVOICE</h2>
  `;

  if (selectedFields.invoice.invoiceNumber) {
    htmlContent += `<div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">${invoice.invoiceNumber}</div>`;
  }
  if (selectedFields.invoice.issueDate) {
    htmlContent += `<div><strong>Issue Date:</strong> ${formatDateToDDMMYYYY(invoice.issueDate)}</div>`;
  }
  if (selectedFields.invoice.dueDate) {
    htmlContent += `<div><strong>Due Date:</strong> ${formatDateToDDMMYYYY(invoice.dueDate)}</div>`;
  }

  htmlContent += `
        </div>
      </div>

      <div class="client-section">
        <div class="section-title">Bill To:</div>
  `;

  // Client Information
  if (selectedFields.client.name && invoice.client.name) {
    htmlContent += `<div style="font-weight: bold;">${invoice.client.name}</div>`;
  }
  if (selectedFields.client.address && invoice.client.address) {
    htmlContent += `<div>${invoice.client.address}</div>`;
  }
  if (selectedFields.client.city && invoice.client.city) {
    htmlContent += `<div>${invoice.client.city}${selectedFields.client.zipCode && invoice.client.zipCode ? ', ' + invoice.client.zipCode : ''}</div>`;
  }
  if (selectedFields.client.country && invoice.client.country) {
    htmlContent += `<div>${invoice.client.country}</div>`;
  }
  if (selectedFields.client.email && invoice.client.email) {
    htmlContent += `<div>Email: ${invoice.client.email}</div>`;
  }
  if (selectedFields.client.phone && invoice.client.phone) {
    htmlContent += `<div>Phone: ${invoice.client.phone}</div>`;
  }

  htmlContent += `
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: right;">Qty</th>
            <th style="text-align: right;">Rate</th>
            <th style="text-align: right;">Amount</th>
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

  htmlContent += `
        <div class="total-row final-total">Total: ${invoice.currency === 'USD' ? '$' : invoice.currency}${Number(invoice.total).toFixed(2)}</div>
      </div>
  `;

  if (selectedFields.invoice.notes && invoice.notes) {
    htmlContent += `
      <div class="notes">
        <div class="section-title">Notes:</div>
        <div>${invoice.notes.replace(/\n/g, '<br>')}</div>
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
