
import React, { forwardRef } from 'react';
import { Invoice } from '@/types/invoice';
import { useInvoice } from '@/contexts/InvoiceContext';

interface InvoicePreviewProps {
  invoice: Invoice;
  isDownload?: boolean;
}

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(
  ({ invoice, isDownload = false }, ref) => {
    const { company } = useInvoice();

    // Helper function to safely convert to number and format
    const formatCurrency = (value: string | number): string => {
      const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
      return numValue.toFixed(2);
    };

    const safeNumber = (value: string | number): number => {
      return typeof value === 'string' ? parseFloat(value) || 0 : value;
    };

    const styles = {
      container: {
        backgroundColor: '#ffffff',
        color: '#000000',
        padding: '40px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        lineHeight: '1.6',
        fontSize: '14px',
        width: '794px', // A4 width in pixels (210mm)
        minHeight: '1123px', // A4 height in pixels (297mm)
        margin: '0 auto',
        boxShadow: isDownload ? 'none' : '0 0 20px rgba(0,0,0,0.1)',
        position: 'relative' as const
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '40px',
        paddingBottom: '20px',
        borderBottom: '3px solid #2563eb'
      },
      companySection: {
        flex: 1,
        maxWidth: '50%'
      },
      companyName: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: '8px',
        fontFamily: '"Arial Black", Arial, sans-serif'
      },
      invoiceSection: {
        textAlign: 'right' as const,
        flex: 1,
        maxWidth: '50%'
      },
      invoiceTitle: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '10px',
        fontFamily: '"Arial Black", Arial, sans-serif'
      },
      invoiceDetails: {
        fontSize: '16px',
        color: '#374151'
      },
      clientSection: {
        marginBottom: '30px',
        backgroundColor: '#f8fafc',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      },
      sectionTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '12px'
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        marginBottom: '30px',
        fontSize: '14px'
      },
      th: {
        backgroundColor: '#2563eb',
        color: '#ffffff',
        padding: '15px 12px',
        textAlign: 'left' as const,
        fontWeight: 'bold',
        borderBottom: '2px solid #1d4ed8'
      },
      td: {
        padding: '12px',
        borderBottom: '1px solid #e5e7eb',
        verticalAlign: 'top' as const
      },
      totalSection: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '30px'
      },
      totalBox: {
        minWidth: '300px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        overflow: 'hidden'
      },
      totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '1px solid #e2e8f0'
      },
      grandTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px 20px',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        fontSize: '18px',
        fontWeight: 'bold'
      },
      footer: {
        marginTop: '40px',
        padding: '20px',
        backgroundColor: '#f1f5f9',
        textAlign: 'center' as const,
        color: '#64748b',
        fontSize: '12px',
        borderRadius: '8px'
      },
      logo: {
        maxWidth: '120px',
        maxHeight: '60px',
        objectFit: 'contain' as const,
        marginBottom: '10px'
      }
    };

    return (
      <div 
        ref={ref} 
        style={styles.container}
        className={isDownload ? 'invoice-download' : 'invoice-preview'}
      >
        <div style={styles.header}>
          <div style={styles.companySection}>
            {company.logo && (
              <img src={company.logo} alt="Company Logo" style={styles.logo} />
            )}
            <h1 style={styles.companyName}>{company.name || 'Your Company Name'}</h1>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>
              {company.address && <div>{company.address}</div>}
              {company.city && company.zipCode && company.country && (
                <div>{company.city}, {company.zipCode}</div>
              )}
              {company.country && <div>{company.country}</div>}
              {company.phone && <div>Phone: {company.phone}</div>}
              {company.email && <div>Email: {company.email}</div>}
              {company.website && <div>Website: {company.website}</div>}
              {company.taxId && <div>Tax ID: {company.taxId}</div>}
            </div>
          </div>
          <div style={styles.invoiceSection}>
            <h2 style={styles.invoiceTitle}>INVOICE</h2>
            <div style={styles.invoiceDetails}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Invoice #:</strong> {invoice.invoiceNumber}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Issue Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.clientSection}>
          <h3 style={styles.sectionTitle}>Bill To:</h3>
          <div style={{ fontSize: '16px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{invoice.client.name}</div>
            {invoice.client.company && <div style={{ marginBottom: '4px' }}>{invoice.client.company}</div>}
            {invoice.client.address && <div style={{ marginBottom: '4px' }}>{invoice.client.address}</div>}
            {invoice.client.city && invoice.client.zipCode && (
              <div style={{ marginBottom: '4px' }}>{invoice.client.city}, {invoice.client.zipCode}</div>
            )}
            {invoice.client.country && <div style={{ marginBottom: '4px' }}>{invoice.client.country}</div>}
            <div style={{ marginBottom: '4px' }}>Email: {invoice.client.email}</div>
            {invoice.client.phone && <div>Phone: {invoice.client.phone}</div>}
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Rate</th>
              <th style={styles.th}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => {
              const quantity = safeNumber(item.quantity);
              const rate = safeNumber(item.rate);
              const amount = quantity * rate;
              
              return (
                <tr key={index}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{item.description}</div>
                    {item.details && (
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.details}</div>
                    )}
                  </td>
                  <td style={styles.td}>{quantity}</td>
                  <td style={styles.td}>${formatCurrency(rate)}</td>
                  <td style={styles.td}>${formatCurrency(amount)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={styles.totalSection}>
          <div style={styles.totalBox}>
            <div style={styles.totalRow}>
              <span>Subtotal:</span>
              <span>${formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.taxRate > 0 && (
              <div style={styles.totalRow}>
                <span>Tax ({invoice.taxRate}%):</span>
                <span>${formatCurrency(invoice.tax)}</span>
              </div>
            )}
            {invoice.discount > 0 && (
              <div style={{ ...styles.totalRow, color: '#dc2626' }}>
                <span>Discount:</span>
                <span>-${formatCurrency(invoice.discount)}</span>
              </div>
            )}
            <div style={styles.grandTotal}>
              <span>TOTAL:</span>
              <span>${formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div style={{ marginBottom: '30px' }}>
            <h3 style={styles.sectionTitle}>Notes:</h3>
            <div style={{ 
              backgroundColor: '#f8fafc', 
              padding: '15px', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              color: '#374151' 
            }}>
              {invoice.notes}
            </div>
          </div>
        )}

        <div style={styles.footer}>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Thank you for your business!</div>
          <div style={{ marginBottom: '8px' }}>We appreciate your partnership and look forward to serving you again.</div>
          <div style={{ fontSize: '11px', marginTop: '10px' }}>
            This invoice was generated electronically and is valid without signature.
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
