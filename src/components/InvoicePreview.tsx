
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
        padding: isDownload ? '10mm' : '40px',
        fontFamily: '"Arial", "Helvetica", sans-serif',
        lineHeight: '1.3',
        fontSize: isDownload ? '9pt' : '12px',
        width: isDownload ? '190mm' : '100%',
        minHeight: isDownload ? '277mm' : 'auto',
        maxWidth: isDownload ? '190mm' : '800px',
        margin: '0 auto',
        boxShadow: isDownload ? 'none' : '0 0 20px rgba(0,0,0,0.1)',
        position: 'relative' as const,
        pageBreakInside: 'avoid' as const,
        overflow: 'visible' as const,
        '@media print': {
          margin: '0',
          padding: '10mm',
          boxShadow: 'none',
          width: '190mm',
          minHeight: '277mm'
        }
      },
      header: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        marginBottom: isDownload ? '15px' : '25px',
        paddingBottom: isDownload ? '10px' : '15px',
        borderBottom: '2px solid #4285f4',
        textAlign: 'center' as const
      },
      logoContainer: {
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
      logo: {
        maxWidth: isDownload ? '80px' : '120px',
        maxHeight: isDownload ? '40px' : '60px',
        objectFit: 'contain' as const
      },
      companySection: {
        marginBottom: '15px',
        textAlign: 'center' as const
      },
      companyName: {
        fontSize: isDownload ? '14pt' : '20px',
        fontWeight: 'bold',
        color: '#4285f4',
        marginBottom: '8px',
        fontFamily: '"Arial Black", Arial, sans-serif'
      },
      invoiceSection: {
        textAlign: 'center' as const,
        marginBottom: '10px'
      },
      invoiceTitle: {
        fontSize: isDownload ? '18pt' : '24px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: '8px',
        fontFamily: '"Arial Black", Arial, sans-serif'
      },
      invoiceDetails: {
        fontSize: isDownload ? '8pt' : '12px',
        color: '#555555',
        lineHeight: '1.3'
      },
      contentGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: isDownload ? '15px' : '20px',
        marginBottom: isDownload ? '15px' : '20px'
      },
      clientSection: {
        backgroundColor: '#f8f9fa',
        padding: isDownload ? '8px' : '12px',
        borderRadius: '4px',
        border: '1px solid #e9ecef'
      },
      companyInfoSection: {
        backgroundColor: '#f8f9fa',
        padding: isDownload ? '8px' : '12px',
        borderRadius: '4px',
        border: '1px solid #e9ecef'
      },
      sectionTitle: {
        fontSize: isDownload ? '10pt' : '14px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: '6px'
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        marginBottom: isDownload ? '12px' : '16px',
        fontSize: isDownload ? '8pt' : '11px',
        backgroundColor: '#ffffff',
        border: '1px solid #dee2e6'
      },
      th: {
        backgroundColor: '#4285f4',
        color: '#ffffff',
        padding: isDownload ? '4px 3px' : '8px 6px',
        textAlign: 'left' as const,
        fontWeight: 'bold',
        fontSize: isDownload ? '8pt' : '11px',
        border: '1px solid #ffffff'
      },
      td: {
        padding: isDownload ? '3px' : '6px',
        borderBottom: '1px solid #dee2e6',
        verticalAlign: 'top' as const,
        fontSize: isDownload ? '8pt' : '11px',
        wordWrap: 'break-word' as const,
        backgroundColor: '#ffffff',
        color: '#000000'
      },
      totalSection: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: isDownload ? '12px' : '16px'
      },
      totalBox: {
        minWidth: isDownload ? '120px' : '200px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        overflow: 'hidden'
      },
      totalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: isDownload ? '4px 6px' : '8px 12px',
        borderBottom: '1px solid #dee2e6',
        fontSize: isDownload ? '8pt' : '11px',
        backgroundColor: '#ffffff'
      },
      grandTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: isDownload ? '6px' : '10px 12px',
        backgroundColor: '#4285f4',
        color: '#ffffff',
        fontSize: isDownload ? '10pt' : '13px',
        fontWeight: 'bold'
      },
      notesSection: {
        marginBottom: isDownload ? '12px' : '16px',
        pageBreakInside: 'avoid' as const
      },
      notesContent: {
        backgroundColor: '#f8f9fa',
        padding: isDownload ? '6px' : '10px',
        borderRadius: '4px',
        border: '1px solid #dee2e6',
        color: '#333333',
        fontSize: isDownload ? '8pt' : '10px',
        lineHeight: '1.4',
        wordWrap: 'break-word' as const,
        whiteSpace: 'pre-wrap' as const
      },
      footer: {
        marginTop: isDownload ? '12px' : '16px',
        padding: isDownload ? '8px' : '12px',
        backgroundColor: '#f1f3f4',
        textAlign: 'center' as const,
        color: '#666666',
        fontSize: isDownload ? '7pt' : '10px',
        borderRadius: '4px',
        pageBreakInside: 'avoid' as const
      }
    };

    return (
      <div 
        ref={ref} 
        style={styles.container}
        className={`invoice-preview ${isDownload ? 'invoice-download' : ''}`}
      >
        <div style={styles.header}>
          {company.logo && (
            <div style={styles.logoContainer}>
              <img src={company.logo} alt="Company Logo" style={styles.logo} />
            </div>
          )}
          <div style={styles.companySection}>
            <h1 style={styles.companyName}>{company.name || 'Your Company Name'}</h1>
          </div>
          <div style={styles.invoiceSection}>
            <h2 style={styles.invoiceTitle}>INVOICE</h2>
            <div style={styles.invoiceDetails}>
              <div style={{ marginBottom: '3px' }}>
                <strong>Invoice #:</strong> {invoice.invoiceNumber}
              </div>
              <div style={{ marginBottom: '3px' }}>
                <strong>Issue Date:</strong> {new Date(invoice.issueDate).toLocaleDateString()}
              </div>
              <div>
                <strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.contentGrid}>
          <div style={styles.clientSection}>
            <h3 style={styles.sectionTitle}>Bill To:</h3>
            <div style={{ fontSize: isDownload ? '8pt' : '12px', lineHeight: '1.3' }}>
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

          <div style={styles.companyInfoSection}>
            <h3 style={styles.sectionTitle}>From:</h3>
            <div style={{ fontSize: isDownload ? '8pt' : '12px', lineHeight: '1.3' }}>
              {company.address && <div style={{ marginBottom: '2px' }}>{company.address}</div>}
              {company.city && company.zipCode && (
                <div style={{ marginBottom: '2px' }}>{company.city}, {company.zipCode}</div>
              )}
              {company.country && <div style={{ marginBottom: '2px' }}>{company.country}</div>}
              {company.phone && <div style={{ marginBottom: '2px' }}>Phone: {company.phone}</div>}
              {company.email && <div style={{ marginBottom: '2px' }}>Email: {company.email}</div>}
              {company.website && <div style={{ marginBottom: '2px' }}>Website: {company.website}</div>}
              {company.taxId && <div>Tax ID: {company.taxId}</div>}
            </div>
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
                      <div style={{ fontSize: isDownload ? '7pt' : '9px', color: '#666666' }}>
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
          <div style={{ fontSize: isDownload ? '6pt' : '9px', marginTop: '6px' }}>
            This invoice was generated electronically and is valid without signature.
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = 'InvoicePreview';

export default InvoicePreview;
