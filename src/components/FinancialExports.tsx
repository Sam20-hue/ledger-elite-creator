
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Download, FileSpreadsheet, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';

const FinancialExports = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const { toast } = useToast();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  const filterDataByMonth = (data: any[], dateField: string) => {
    const monthNum = parseInt(selectedMonth);
    const yearNum = parseInt(selectedYear);
    
    return data.filter(item => {
      const date = new Date(item[dateField]);
      return date.getMonth() === monthNum && date.getFullYear() === yearNum;
    });
  };

  const exportMonthlyReport = () => {
    // Get all data
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const bankTransactions = JSON.parse(localStorage.getItem('bankTransactions') || '[]');
    const payments = JSON.parse(localStorage.getItem('sharedInitiatedPayments') || '[]');
    const bankAccounts = JSON.parse(localStorage.getItem('sharedBankAccounts') || '[]');

    // Filter by selected month/year
    const monthlyInvoices = filterDataByMonth(invoices, 'issueDate');
    const monthlyTransactions = filterDataByMonth(bankTransactions, 'timestamp');
    const monthlyPayments = filterDataByMonth(payments, 'timestamp');

    // Calculate totals
    const totalRevenue = monthlyInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidInvoices = monthlyInvoices.filter(inv => inv.status === 'paid');
    const paidAmount = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const pendingAmount = totalRevenue - paidAmount;

    // Money In/Out calculations
    const moneyIn = monthlyTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
    const moneyOut = monthlyTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);
    const netFlow = moneyIn - moneyOut;

    // Profit calculations (assuming 30% profit margin)
    const estimatedCosts = paidAmount * 0.7;
    const grossProfit = paidAmount - estimatedCosts;

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = [
      ['Financial Summary', `${months[parseInt(selectedMonth)]} ${selectedYear}`],
      [''],
      ['REVENUE'],
      ['Total Revenue', totalRevenue.toFixed(2)],
      ['Paid Amount', paidAmount.toFixed(2)],
      ['Pending Amount', pendingAmount.toFixed(2)],
      [''],
      ['CASH FLOW'],
      ['Money In', moneyIn.toFixed(2)],
      ['Money Out', moneyOut.toFixed(2)],
      ['Net Cash Flow', netFlow.toFixed(2)],
      [''],
      ['PROFITABILITY'],
      ['Gross Profit', grossProfit.toFixed(2)],
      ['Estimated Costs', estimatedCosts.toFixed(2)],
      ['Profit Margin', `${((grossProfit / paidAmount) * 100 || 0).toFixed(1)}%`],
      [''],
      ['BANK BALANCES'],
      ...bankAccounts.map(acc => [`${acc.accountName} (${acc.currency})`, acc.balance.toFixed(2)])
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

    // Invoices Sheet
    const invoiceData = monthlyInvoices.map(inv => ({
      'Invoice Number': inv.invoiceNumber,
      'Client': inv.client.name,
      'Issue Date': new Date(inv.issueDate).toLocaleDateString(),
      'Due Date': new Date(inv.dueDate).toLocaleDateString(),
      'Amount': inv.total.toFixed(2),
      'Status': inv.status,
      'Currency': inv.currency || 'USD'
    }));

    if (invoiceData.length > 0) {
      const invoiceWs = XLSX.utils.json_to_sheet(invoiceData);
      XLSX.utils.book_append_sheet(wb, invoiceWs, 'Invoices');
    }

    // Transactions Sheet
    const transactionData = monthlyTransactions.map(trans => ({
      'Date': new Date(trans.timestamp).toLocaleDateString(),
      'Type': trans.type,
      'Account': trans.accountName,
      'Amount': trans.amount.toFixed(2),
      'Currency': trans.currency,
      'Description': trans.description || ''
    }));

    if (transactionData.length > 0) {
      const transactionWs = XLSX.utils.json_to_sheet(transactionData);
      XLSX.utils.book_append_sheet(wb, transactionWs, 'Transactions');
    }

    // Payments Sheet
    const paymentData = monthlyPayments.map(payment => ({
      'Date': new Date(payment.timestamp).toLocaleDateString(),
      'Recipient': payment.recipient,
      'Amount': payment.amount.toFixed(2),
      'Method': payment.paymentMethod,
      'Status': payment.status,
      'Initiated By': payment.initiatedBy
    }));

    if (paymentData.length > 0) {
      const paymentWs = XLSX.utils.json_to_sheet(paymentData);
      XLSX.utils.book_append_sheet(wb, paymentWs, 'Payments');
    }

    // Profit & Loss Sheet
    const plData = [
      ['PROFIT & LOSS STATEMENT', `${months[parseInt(selectedMonth)]} ${selectedYear}`],
      [''],
      ['INCOME'],
      ['Revenue from Invoices', paidAmount.toFixed(2)],
      ['Other Income', (moneyIn - paidAmount).toFixed(2)],
      ['Total Income', moneyIn.toFixed(2)],
      [''],
      ['EXPENSES'],
      ['Cost of Goods Sold', estimatedCosts.toFixed(2)],
      ['Operating Expenses', (moneyOut - estimatedCosts > 0 ? moneyOut - estimatedCosts : 0).toFixed(2)],
      ['Total Expenses', moneyOut.toFixed(2)],
      [''],
      ['NET PROFIT/LOSS', netFlow.toFixed(2)]
    ];

    const plWs = XLSX.utils.aoa_to_sheet(plData);
    XLSX.utils.book_append_sheet(wb, plWs, 'Profit & Loss');

    // Save file
    const fileName = `Financial_Report_${months[parseInt(selectedMonth)]}_${selectedYear}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast({
      title: "Success",
      description: `Financial report for ${months[parseInt(selectedMonth)]} ${selectedYear} exported successfully`,
    });
  };

  const exportAllPayments = () => {
    const payments = JSON.parse(localStorage.getItem('sharedInitiatedPayments') || '[]');
    const monthlyPayments = filterDataByMonth(payments, 'timestamp');

    if (monthlyPayments.length === 0) {
      toast({
        title: "No Data",
        description: "No payments found for the selected period",
        variant: "destructive",
      });
      return;
    }

    const exportData = monthlyPayments.map(payment => ({
      'Date': new Date(payment.timestamp).toLocaleDateString(),
      'Time': new Date(payment.timestamp).toLocaleTimeString(),
      'Recipient': payment.recipient,
      'Amount': payment.amount.toFixed(2),
      'Payment Method': payment.paymentMethod,
      'Status': payment.status,
      'Initiated By': payment.initiatedBy,
      'Reference': payment.id
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');
    
    const fileName = `Payments_${months[parseInt(selectedMonth)]}_${selectedYear}.xlsx`;
    XLSX.writeFile(wb, fileName);

    toast({
      title: "Success",
      description: "Payments exported successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileSpreadsheet className="h-5 w-5 text-green-600" />
          <span>Financial Exports</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">Select Period:</span>
          </div>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={exportMonthlyReport} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Complete Financial Report
          </Button>
          <Button onClick={exportAllPayments} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Payments Only
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Financial report includes:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Revenue summary and invoice details</li>
            <li>Money in/out analysis</li>
            <li>Profit & loss statement</li>
            <li>Bank account balances</li>
            <li>All transactions and payments</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialExports;
