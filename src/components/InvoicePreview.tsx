
import React, { forwardRef } from 'react';
import { Invoice } from '@/types/invoice';

interface InvoicePreviewProps {
  invoice: Invoice;
  isDownload?: boolean;
}

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoice, isDownload = false }, ref) => {
    const styles = {
      container: {
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.5',
        fontSize: '14px'
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '1rem'
      },
      companyInfo: {
        flex: 1
      },
      companyName: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '0.5rem'
      },
      invoiceTitle: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#2563eb',
        textAlign: 'right' as const
      },
      section: {
        marginBottom: '1.5rem'
      },
      sectionTitle: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: '0.5rem'
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        marginBottom: '1rem'
      },
      th: {
        backgroundColor: '#f3f4f6',
        color: '#374151',
        padding: '0.75rem',
        textAlign: 'left' as const,
        borderBottom: '1px solid #d1d5db',
        fontWeight: 'bold'
      },
      td: {
        padding: '0.75rem',
        borderBottom: '1px solid #e5e7eb'
      },
      total: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'right' as const,
        backgroundColor: '#f9fafb',
        padding: '1rem'
      },
      footer: {
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#f8fafc',
        textAlign: 'center' as const,
        color: '#6b7280',
        fontSize: '12px'
      }
    };

    return (
      <div 
        ref={ref} 
        style={styles.container}
        className={isDownload ? 'invoice-download' : 'invoice-preview'}
      >
        <div style={styles.header}>
          <div style={styles.companyInfo}>
            <h1 style={styles.companyName}>Numera Business Solutions</h1>
            <div style={{ color: '#6b7280' }}>
              <p>Professional Invoice System</p>
              <p>Email: info@numera.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div>
            <h2 style={styles.invoiceTitle}>INVOICE</h2>
            <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
              <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
              <p><strong>Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Bill To:</h3>
          <div>
            <p><strong>{invoice.client.name}</strong></p>
            {invoice.client.company && <p>{invoice.client.company}</p>}
            <p>{invoice.client.email}</p>
            {invoice.client.phone && <p>{invoice.client.phone}</p>}
            {invoice.client.address && <p>{invoice.client.address}</p>}
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Rate</th>
              <th style={styles.th}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td style={styles.td}>
                  <strong>{item.description}</strong>
                  {item.details && <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.details}</div>}
                </td>
                <td style={styles.td}>{item.quantity}</td>
                <td style={styles.td}>${item.rate.toFixed(2)}</td>
                <td style={styles.td}>${(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ minWidth: '250px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span>Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span>Tax ({invoice.taxRate}%):</span>
                <span>${invoice.tax.toFixed(2)}</span>
              </div>
            )}
            {invoice.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: '#dc2626' }}>
                <span>Discount:</span>
                <span>-${invoice.discount.toFixed(2)}</span>
              </div>
            )}
            <div style={styles.total}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>TOTAL:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Notes:</h3>
            <p style={{ color: '#6b7280' }}>{invoice.notes}</p>
          </div>
        )}

        <div style={styles.footer}>
          <p><strong>Thank you for your business!</strong></p>
          <p>We appreciate your partnership and look forward to serving you again.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '11px' }}>
            This invoice was generated by Numera Business Solutions
          </p>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
