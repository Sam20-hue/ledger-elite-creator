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
        padding: isDownload ? '20px' : '40px',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        lineHeight: '1.4',
        fontSize: '12px',
        width: '210mm', // A4 width
        minHeight: '297mm', // A4 height
        maxWidth: '210mm',
        margin: '0 auto',
        boxShadow: isDownload ? 'none' : '0 0 20px rgba(0,0,0,0.1)',
        position: 'relative' as const,
        pageBreakInside: 'avoid' as const,
        overflow: 'hidden' as const
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '25px',
        paddingBottom: '15px',
        borderBottom: '2px solid #2563eb'
      },
      companySection: {
        flex: 1,
        maxWidth: '48%'
      },
      companyName: {
        fontSize: isDownload ? '20px' : '24px',
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: '6px',
        fontFamily: '"Arial Black", Arial, sans-serif',
        wordWrap: 'break-word' as const
      },
      invoiceSection: {
        textAlign: 'right' as const,
        flex: 1,
        maxWidth: '48%'
      },
      invoiceTitle: {
        fontSize: isDownload ? '24px' : '28px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '8px',
        fontFamily: '"Arial Black", Arial, sans-serif'
      },
      invoiceDetails: {
        fontSize: isDownload ? '11px' : '13px',
        color: '#374151'
      },
      clientSection: {
        marginBottom: '20px',
        backgroundColor: '#f8fafc',
        padding: '15px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0'
      },
      sectionTitle: {
        fontSize: isDownload ? '14px' : '16px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '8px'
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        marginBottom: '20px',
        fontSize: isDownload ? '10px' : '12px'
      },
      th: {
        backgroundColor: '#2563eb',
        color: '#ffffff',
        padding: isDownload ? '8px 6px' : '12px 10px',
        textAlign: 'left' as const,
        fontWeight: 'bold',
        borderBottom: '2px solid #1d4ed8',
        fontSize: isDownload ? '10px' : '12px'
      },
      td: {
        padding: isDownload ? '6px' : '10px',
        borderBottom: '1px solid #e5e7eb',
        verticalAlign: 'top' as const,
        fontSize: isDownload ? '10px' : '12px',
        wordWrap: 'break-word' as const,
        maxWidth: '0',
        overflow: 'hidden' as const
      },
      totalSection: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px'
      },
      totalBox: {
        minWidth: isDownload ? '200px' : '250px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '6px',
        overflow: 'hidden'
      },
      totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: isDownload ? '8px 12px' : '10px 15px',
        borderBottom: '1px solid #e2e8f0',
        fontSize: isDownload ? '11px' : '12px'
      },
      grandTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: isDownload ? '10px 12px' : '12px 15px',
        backgroundColor: '#2563eb',
        color: '#ffffff',
        fontSize: isDownload ? '13px' : '15px',
        fontWeight: 'bold'
      },
      notesSection: {
        marginBottom: '20px',
        pageBreakInside: 'avoid' as const
      },
      notesContent: {
        backgroundColor: '#f8fafc',
        padding: isDownload ? '10px' : '12px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        color: '#374151',
        fontSize: isDownload ? '10px' : '11px',
        lineHeight: '1.4',
        wordWrap: 'break-word' as const,
        maxHeight: isDownload ? '60px' : 'auto',
        overflow: isDownload ? 'hidden' : 'visible' as const
      },
      footer: {
        marginTop: '20px',
        padding: isDownload ? '12px' : '15px',
        backgroundColor: '#f1f5f9',
        textAlign: 'center' as const,
        color: '#64748b',
        fontSize: isDownload ? '9px' : '11px',
        borderRadius: '6px',
        pageBreakInside: 'avoid' as const
      },
      logo: {
        maxWidth: isDownload ? '80px' : '100px',
        maxHeight: isDownload ? '40px' : '50px',
        objectFit: 'contain' as const,
        marginBottom: '8px'
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
            <div style={{ color: '#6b7280', fontSize: isDownload ? '10px' : '12px' }}>
              {company.address && <div>{company.address}</div>}
              {company.city && company.zipCode && (
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
              <div style={{ marginBottom: '6px' }}>
                <strong>Invoice #:</strong> {invoice.invoiceNumber}
              </div>
              <div style={{ marginBottom: '6px' }}>
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
          <div style={{ fontSize: isDownload ? '11px' : '13px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '3px' }}>{invoice.client.name}</div>
            {invoice.client.company && <div style={{ marginBottom: '3px' }}>{invoice.client.company}</div>}
            {invoice.client.address && <div style={{ marginBottom: '3px' }}>{invoice.client.address}</div>}
            {invoice.client.city && invoice.client.zipCode && (
              <div style={{ marginBottom: '3px' }}>{invoice.client.city}, {invoice.client.zipCode}</div>
            )}
            {invoice.client.country && <div style={{ marginBottom: '3px' }}>{invoice.client.country}</div>}
            <div style={{ marginBottom: '3px' }}>Email: {invoice.client.email}</div>
            {invoice.client.phone && <div>Phone: {invoice.client.phone}</div>}
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{...styles.th, width: '50%'}}>Description</th>
              <th style={{...styles.th, width: '15%'}}>Qty</th>
              <th style={{...styles.th, width: '20%'}}>Rate</th>
              <th style={{...styles.th, width: '15%'}}>Amount</th>
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
                    <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{item.description}</div>
                    {item.details && (
                      <div style={{ fontSize: isDownload ? '9px' : '10px', color: '#6b7280' }}>
                        {isDownload && item.details.length > 50 ? 
                          `${item.details.substring(0, 50)}...` : 
                          item.details
                        }
                      </div>
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

        {invoice.notes && invoice.notes.trim() && (
          <div style={styles.notesSection}>
            <h3 style={styles.sectionTitle}>Notes:</h3>
            <div style={styles.notesContent}>
              {isDownload && invoice.notes.length > 200 ? 
                `${invoice.notes.substring(0, 200)}...` : 
                invoice.notes
              }
            </div>
          </div>
        )}

        <div style={styles.footer}>
          <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Thank you for your business!</div>
          <div style={{ marginBottom: '6px' }}>We appreciate your partnership and look forward to serving you again.</div>
          <div style={{ fontSize: isDownload ? '8px' : '10px', marginTop: '8px' }}>
            This invoice was generated electronically and is valid without signature.
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
