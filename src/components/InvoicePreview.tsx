
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
        padding: isDownload ? '15mm' : '40px',
        fontFamily: '"Arial", "Helvetica", sans-serif',
        lineHeight: '1.4',
        fontSize: isDownload ? '10pt' : '12px',
        width: isDownload ? '210mm' : '100%',
        minHeight: isDownload ? '297mm' : 'auto',
        maxWidth: isDownload ? '210mm' : '800px',
        margin: '0 auto',
        boxShadow: isDownload ? 'none' : '0 0 20px rgba(0,0,0,0.1)',
        position: 'relative' as const,
        pageBreakInside: 'avoid' as const,
        overflow: 'visible' as const,
        '@media print': {
          margin: '0',
          padding: '15mm',
          boxShadow: 'none'
        }
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: isDownload ? '20px' : '25px',
        paddingBottom: isDownload ? '12px' : '15px',
        borderBottom: '2px solid #4285f4'
      },
      companySection: {
        flex: 1,
        maxWidth: '48%'
      },
      companyName: {
        fontSize: isDownload ? '16pt' : '24px',
        fontWeight: 'bold',
        color: '#4285f4',
        marginBottom: '6px',
        fontFamily: '"Arial Black", Arial, sans-serif',
        wordWrap: 'break-word' as const,
        lineHeight: '1.2'
      },
      invoiceSection: {
        textAlign: 'right' as const,
        flex: 1,
        maxWidth: '48%'
      },
      invoiceTitle: {
        fontSize: isDownload ? '20pt' : '28px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: '8px',
        fontFamily: '"Arial Black", Arial, sans-serif'
      },
      invoiceDetails: {
        fontSize: isDownload ? '9pt' : '13px',
        color: '#555555',
        lineHeight: '1.3'
      },
      clientSection: {
        marginBottom: isDownload ? '15px' : '20px',
        backgroundColor: '#f8f9fa',
        padding: isDownload ? '10px' : '15px',
        borderRadius: '4px',
        border: '1px solid #e9ecef'
      },
      sectionTitle: {
        fontSize: isDownload ? '12pt' : '16px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: '6px'
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        marginBottom: isDownload ? '15px' : '20px',
        fontSize: isDownload ? '9pt' : '12px',
        backgroundColor: '#ffffff',
        border: '1px solid #dee2e6'
      },
      th: {
        backgroundColor: '#4285f4',
        color: '#ffffff',
        padding: isDownload ? '6px 4px' : '12px 10px',
        textAlign: 'left' as const,
        fontWeight: 'bold',
        fontSize: isDownload ? '9pt' : '12px',
        border: '1px solid #ffffff'
      },
      td: {
        padding: isDownload ? '4px' : '10px',
        borderBottom: '1px solid #dee2e6',
        verticalAlign: 'top' as const,
        fontSize: isDownload ? '9pt' : '12px',
        wordWrap: 'break-word' as const,
        backgroundColor: '#ffffff',
        color: '#000000'
      },
      totalSection: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: isDownload ? '15px' : '20px'
      },
      totalBox: {
        minWidth: isDownload ? '150px' : '250px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        overflow: 'hidden'
      },
      totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: isDownload ? '6px 8px' : '10px 15px',
        borderBottom: '1px solid #dee2e6',
        fontSize: isDownload ? '9pt' : '12px',
        backgroundColor: '#ffffff'
      },
      grandTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: isDownload ? '8px' : '12px 15px',
        backgroundColor: '#4285f4',
        color: '#ffffff',
        fontSize: isDownload ? '11pt' : '15px',
        fontWeight: 'bold'
      },
      notesSection: {
        marginBottom: isDownload ? '15px' : '20px',
        pageBreakInside: 'avoid' as const
      },
      notesContent: {
        backgroundColor: '#f8f9fa',
        padding: isDownload ? '8px' : '12px',
        borderRadius: '4px',
        border: '1px solid #dee2e6',
        color: '#333333',
        fontSize: isDownload ? '9pt' : '11px',
        lineHeight: '1.4',
        wordWrap: 'break-word' as const,
        whiteSpace: 'pre-wrap' as const
      },
      footer: {
        marginTop: isDownload ? '15px' : '20px',
        padding: isDownload ? '10px' : '15px',
        backgroundColor: '#f1f3f4',
        textAlign: 'center' as const,
        color: '#666666',
        fontSize: isDownload ? '8pt' : '11px',
        borderRadius: '4px',
        pageBreakInside: 'avoid' as const
      },
      logo: {
        maxWidth: isDownload ? '60px' : '100px',
        maxHeight: isDownload ? '30px' : '50px',
        objectFit: 'contain' as const,
        marginBottom: '6px'
      }
    };

    return (
      <div 
        ref={ref} 
        style={styles.container}
        className={`invoice-preview ${isDownload ? 'invoice-download' : ''}`}
      >
        <div style={styles.header}>
          <div style={styles.companySection}>
            {company.logo && (
              <img src={company.logo} alt="Company Logo" style={styles.logo} />
            )}
            <h1 style={styles.companyName}>{company.name || 'Your Company Name'}</h1>
            <div style={{ color: '#666666', fontSize: isDownload ? '8pt' : '12px', lineHeight: '1.3' }}>
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
              <div style={{ marginBottom: '4px' }}>
                <strong>Invoice #:</strong> {invoice.invoiceNumber}
              </div>
              <div style={{ marginBottom: '4px' }}>
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
          <div style={{ fontSize: isDownload ? '9pt' : '13px', lineHeight: '1.3' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{invoice.client.name}</div>
            {invoice.client.company && <div style={{ marginBottom: '2px' }}>{invoice.client.company}</div>}
            {invoice.client.address && <div style={{ marginBottom: '2px' }}>{invoice.client.address}</div>}
            {invoice.client.city && invoice.client.zipCode && (
              <div style={{ marginBottom: '2px' }}>{invoice.client.city}, {invoice.client.zipCode}</div>
            )}
            {invoice.client.country && <div style={{ marginBottom: '2px' }}>{invoice.client.country}</div>}
            <div style={{ marginBottom: '2px' }}>Email: {invoice.client.email}</div>
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
                      <div style={{ fontSize: isDownload ? '8pt' : '10px', color: '#666666' }}>
                        {item.details}
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
              <div style={{ ...styles.totalRow, color: '#dc3545' }}>
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
              {invoice.notes}
            </div>
          </div>
        )}

        <div style={styles.footer}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Thank you for your business!</div>
          <div style={{ marginBottom: '4px' }}>We appreciate your partnership and look forward to serving you again.</div>
          <div style={{ fontSize: isDownload ? '7pt' : '10px', marginTop: '6px' }}>
            This invoice was generated electronically and is valid without signature.
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
