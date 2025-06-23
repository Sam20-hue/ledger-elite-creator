
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  currency: string;
  type: 'savings' | 'checking' | 'business';
}

interface Transaction {
  id: string;
  accountId: string;
  type: 'debit' | 'credit';
  amount: number;
  description: string;
  date: string;
  currency: string;
}

const BankAccounts = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  
  const [accountForm, setAccountForm] = useState({
    name: '',
    accountNumber: '',
    balance: 0,
    currency: 'KES',
    type: 'checking' as 'savings' | 'checking' | 'business'
  });

  const [transactionForm, setTransactionForm] = useState({
    accountId: '',
    type: 'credit' as 'debit' | 'credit',
    amount: 0,
    description: '',
    currency: 'KES'
  });

  const currencies = [
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
    { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF' },
    { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' }
  ];

  const addAccount = () => {
    if (!accountForm.name || !accountForm.accountNumber) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newAccount: BankAccount = {
      id: crypto.randomUUID(),
      ...accountForm
    };

    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    localStorage.setItem('bankAccounts', JSON.stringify(updatedAccounts));

    toast({
      title: "Success",
      description: "Bank account added successfully"
    });

    setAccountForm({ name: '', accountNumber: '', balance: 0, currency: 'KES', type: 'checking' });
    setIsAccountDialogOpen(false);
  };

  const addTransaction = () => {
    if (!transactionForm.accountId || !transactionForm.amount || !transactionForm.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...transactionForm,
      date: new Date().toISOString()
    };

    // Update account balance
    const updatedAccounts = accounts.map(account => {
      if (account.id === transactionForm.accountId) {
        const balanceChange = transactionForm.type === 'credit' 
          ? transactionForm.amount 
          : -transactionForm.amount;
        return { ...account, balance: account.balance + balanceChange };
      }
      return account;
    });

    const updatedTransactions = [...transactions, newTransaction];
    
    setAccounts(updatedAccounts);
    setTransactions(updatedTransactions);
    localStorage.setItem('bankAccounts', JSON.stringify(updatedAccounts));
    localStorage.setItem('bankTransactions', JSON.stringify(updatedTransactions));

    toast({
      title: "Success",
      description: `${transactionForm.type === 'credit' ? 'Credit' : 'Debit'} transaction added successfully`
    });

    setTransactionForm({ accountId: '', type: 'credit', amount: 0, description: '', currency: 'KES' });
    setIsTransactionDialogOpen(false);
  };

  const deleteAccount = (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      const updatedAccounts = accounts.filter(account => account.id !== id);
      setAccounts(updatedAccounts);
      localStorage.setItem('bankAccounts', JSON.stringify(updatedAccounts));
      
      toast({
        title: "Success",
        description: "Account deleted successfully"
      });
    }
  };

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || code;
  };

  const getAccountTransactions = (accountId: string) => {
    return transactions.filter(t => t.accountId === accountId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bank Accounts</h2>
        <div className="space-x-2">
          <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Bank Account</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Account Name</Label>
                  <Input
                    value={accountForm.name}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Main Business Account"
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
                <div>
                  <Label>Initial Balance</Label>
                  <Input
                    type="number"
                    value={accountForm.balance}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, balance: parseFloat(e.target.value) }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select value={accountForm.currency} onValueChange={(value) => setAccountForm(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.name} ({currency.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Account Type</Label>
                  <Select value={accountForm.type} onValueChange={(value: 'savings' | 'checking' | 'business') => setAccountForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="checking">Checking</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addAccount} className="w-full">
                  Add Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Account</Label>
                  <Select value={transactionForm.accountId} onValueChange={(value) => setTransactionForm(prev => ({ ...prev, accountId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} - {account.accountNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Transaction Type</Label>
                  <Select value={transactionForm.type} onValueChange={(value: 'debit' | 'credit') => setTransactionForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit">Credit (Money In)</SelectItem>
                      <SelectItem value="debit">Debit (Money Out)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={transactionForm.description}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Payment from client"
                  />
                </div>
                <Button onClick={addTransaction} className="w-full">
                  Add Transaction
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{account.name}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteAccount(account.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Account: {account.accountNumber}</p>
                <p className="text-2xl font-bold">
                  {getCurrencySymbol(account.currency)} {account.balance.toFixed(2)}
                </p>
                <p className="text-sm capitalize">{account.type} Account</p>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Recent Transactions</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {getAccountTransactions(account.id).slice(-3).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          {transaction.type === 'credit' ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <span className="truncate max-w-20">{transaction.description}</span>
                        </div>
                        <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                          {transaction.type === 'credit' ? '+' : '-'}{getCurrencySymbol(transaction.currency)}{transaction.amount}
                        </span>
                      </div>
                    ))}
                    {getAccountTransactions(account.id).length === 0 && (
                      <p className="text-xs text-muted-foreground">No transactions yet</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {accounts.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="pt-6 text-center">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No bank accounts added yet</p>
              <Button onClick={() => setIsAccountDialogOpen(true)}>
                Add Your First Account
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BankAccounts;
