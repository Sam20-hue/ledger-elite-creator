
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Building2, Plus, Edit, Trash2, DollarSign, CreditCard } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const BankAccounts = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [accountForm, setAccountForm] = useState({
    accountName: '',
    bankName: '',
    accountNumber: '',
    accountType: 'checking',
    balance: '',
    currency: 'USD'
  });

  useEffect(() => {
    // Load shared bank accounts
    const savedAccounts = JSON.parse(localStorage.getItem('sharedBankAccounts') || '[]');
    setAccounts(savedAccounts);
  }, []);

  const saveAccount = () => {
    if (!accountForm.accountName || !accountForm.bankName || !accountForm.accountNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newAccount = {
      id: editingAccount?.id || crypto.randomUUID(),
      ...accountForm,
      balance: parseFloat(accountForm.balance) || 0,
      createdAt: editingAccount?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedAccounts;
    if (editingAccount) {
      updatedAccounts = accounts.map(acc => acc.id === editingAccount.id ? newAccount : acc);
    } else {
      updatedAccounts = [...accounts, newAccount];
    }

    setAccounts(updatedAccounts);
    localStorage.setItem('sharedBankAccounts', JSON.stringify(updatedAccounts));

    toast({
      title: "Success",
      description: editingAccount ? "Account updated successfully" : "Account added successfully",
    });

    resetForm();
  };

  const deleteAccount = (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      const updatedAccounts = accounts.filter(acc => acc.id !== id);
      setAccounts(updatedAccounts);
      localStorage.setItem('sharedBankAccounts', JSON.stringify(updatedAccounts));
      
      toast({
        title: "Success",
        description: "Account deleted successfully",
      });
    }
  };

  const resetForm = () => {
    setAccountForm({
      accountName: '',
      bankName: '',
      accountNumber: '',
      accountType: 'checking',
      balance: '',
      currency: 'USD'
    });
    setEditingAccount(null);
    setIsDialogOpen(false);
  };

  const editAccount = (account: any) => {
    setAccountForm({
      accountName: account.accountName,
      bankName: account.bankName,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      balance: account.balance.toString(),
      currency: account.currency
    });
    setEditingAccount(account);
    setIsDialogOpen(true);
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Bank Accounts</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingAccount ? 'Edit Account' : 'Add New Account'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Account Name</Label>
                <Input
                  value={accountForm.accountName}
                  onChange={(e) => setAccountForm(prev => ({ ...prev, accountName: e.target.value }))}
                  placeholder="Main Business Account"
                />
              </div>
              <div>
                <Label>Bank Name</Label>
                <Input
                  value={accountForm.bankName}
                  onChange={(e) => setAccountForm(prev => ({ ...prev, bankName: e.target.value }))}
                  placeholder="Bank of America"
                />
              </div>
              <div>
                <Label>Account Number</Label>
                <Input
                  value={accountForm.accountNumber}
                  onChange={(e) => setAccountForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                  placeholder="1234567890"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Account Type</Label>
                  <Select value={accountForm.accountType} onValueChange={(value) => setAccountForm(prev => ({ ...prev, accountType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select value={accountForm.currency} onValueChange={(value) => setAccountForm(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="KES">KES (KSh)</SelectItem>
                      <SelectItem value="TZS">TZS (TSh)</SelectItem>
                      <SelectItem value="UGX">UGX (USh)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Current Balance</Label>
                <Input
                  type="number"
                  value={accountForm.balance}
                  onChange={(e) => setAccountForm(prev => ({ ...prev, balance: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <Button onClick={saveAccount} className="w-full">
                {editingAccount ? 'Update Account' : 'Add Account'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Total Balance Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Balance (All Accounts)</p>
              <p className="text-3xl font-bold">${totalBalance.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">{account.accountName}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Button size="sm" variant="outline" onClick={() => editAccount(account)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteAccount(account.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Bank</p>
                  <p className="font-medium">{account.bankName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Number</p>
                  <p className="font-medium">****{account.accountNumber.slice(-4)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{account.accountType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p className="text-xl font-bold text-green-600">
                    {account.currency === 'USD' ? '$' : account.currency + ' '}{account.balance.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {accounts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No bank accounts found</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Account
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BankAccounts;
