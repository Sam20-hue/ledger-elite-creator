
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInvoice } from '@/contexts/InvoiceContext';
import { DollarSign, FileText, Users, TrendingUp, Clock, CheckCircle, AlertCircle, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { invoices, clients } = useInvoice();
  const [bankAccounts, setBankAccounts] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Load shared bank accounts
    const accounts = JSON.parse(localStorage.getItem('sharedBankAccounts') || '[]');
    setBankAccounts(accounts);
  }, []);

  const totalRevenue = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const pendingAmount = invoices
    .filter(inv => inv.status === 'sent')
    .reduce((sum, inv) => sum + inv.total, 0);

  const totalBankBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0);

  const overdueInvoices = invoices.filter(inv => {
    const dueDate = new Date(inv.dueDate);
    const today = new Date();
    return inv.status === 'sent' && dueDate < today;
  });

  const recentInvoices = invoices
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/invoices/new">
          <Button>Create New Invoice</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From paid invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBankBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total in all accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">Active clients</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No invoices yet</p>
              ) : (
                recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">{invoice.client.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${invoice.total.toFixed(2)}</p>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bank Accounts Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-blue-500" />
              Bank Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bankAccounts.length === 0 ? (
                <div className="text-center py-4">
                  <Building2 className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No bank accounts added</p>
                </div>
              ) : (
                bankAccounts.slice(0, 3).map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{account.accountName}</p>
                      <p className="text-sm text-muted-foreground">{account.bankName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${account.balance.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground capitalize">{account.accountType}</p>
                    </div>
                  </div>
                ))
              )}
              {bankAccounts.length > 3 && (
                <p className="text-sm text-muted-foreground text-center">
                  +{bankAccounts.length - 3} more accounts
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
