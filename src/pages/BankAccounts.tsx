import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, CreditCard, Building2, Edit, Trash2, Eye } from 'lucide-react';

const BankAccounts = () => {
  const accounts = [
    {
      id: 1,
      bankName: 'Chase Bank',
      accountNumber: '****1234',
      accountType: 'Business Checking',
      balance: 125000,
      status: 'Active'
    },
    {
      id: 2,
      bankName: 'Bank of America',
      accountNumber: '****5678',
      accountType: 'Business Savings',
      balance: 75000,
      status: 'Active'
    },
    {
      id: 3,
      bankName: 'Wells Fargo',
      accountNumber: '****9012',
      accountType: 'Business Checking',
      balance: 45000,
      status: 'Inactive'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bank Accounts</h1>
          <p className="text-muted-foreground">Manage your business bank accounts</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{account.bankName}</CardTitle>
                    <CardDescription>{account.accountType}</CardDescription>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  account.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {account.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono">{account.accountNumber}</span>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Current Balance</span>
                    <span className="text-2xl font-bold text-foreground">
                      ${account.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
          <CardDescription>Overview of all your bank accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="text-2xl font-bold text-primary">
                {accounts.filter(a => a.status === 'Active').length}
              </h3>
              <p className="text-sm text-muted-foreground">Active Accounts</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="text-2xl font-bold text-green-600">
                ${accounts.reduce((sum, account) => sum + account.balance, 0).toLocaleString()}
              </h3>
              <p className="text-sm text-muted-foreground">Total Balance</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <h3 className="text-2xl font-bold text-orange-600">
                ${accounts.filter(a => a.status === 'Active').reduce((sum, account) => sum + account.balance, 0).toLocaleString()}
              </h3>
              <p className="text-sm text-muted-foreground">Active Balance</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankAccounts;