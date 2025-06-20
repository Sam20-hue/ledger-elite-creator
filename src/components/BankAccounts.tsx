
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Banknote, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Trash2,
  Edit,
  Download,
  Upload
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  bankName: string;
  currency: string;
  balance: number;
  createdAt: string;
}

interface Transaction {
  id: string;
  accountId: string;
  type: 'debit' | 'credit';
  amount: number;
  currency: string;
  description: string;
  reference: string;
  date: string;
  category: string;
}

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' }
];

const BankAccounts = () => {
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newAccountOpen, setNewAccountOpen] = useState(false);
  const [newTransactionOpen, setNewTransactionOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  
  // Form states
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [initialBalance, setInitialBalance] = useState('0');
  
  // Transaction form states
  const [transactionType, setTransactionType] = useState<'debit' | 'credit'>('credit');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [reference, setReference] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const savedAccounts = localStorage.getItem('bankAccounts');
    const savedTransactions = localStorage.getItem('bankTransactions');
    
    if (savedAccounts) {
      setAccounts(JSON.parse(savedAccounts));
    }
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bankAccounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('bankTransactions', JSON.stringify(transactions));
  }, [transactions]);

  const addAccount = () => {
    if (!accountName || !accountNumber || !bankName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newAccount: BankAccount = {
      id: crypto.randomUUID(),
      name: accountName,
      accountNumber,
      bankName,
      currency,
      balance: parseFloat(initialBalance),
      createdAt: new Date().toISOString()
    };

    setAccounts(prev => [...prev, newAccount]);
    
    // Add initial balance transaction if not zero
    if (parseFloat(initialBalance) !== 0) {
      const initialTransaction: Transaction = {
        id: crypto.randomUUID(),
        accountId: newAccount.id,
        type: 'credit',
        amount: parseFloat(initialBalance),
        currency,
        description: 'Initial balance',
        reference: 'INIT-' + Date.now(),
        date: new Date().toISOString(),
        category: 'Initial'
      };
      setTransactions(prev => [...prev, initialTransaction]);
    }

    toast({
      title: "Success",
      description: "Bank account added successfully",
    });

    setNewAccountOpen(false);
    resetAccountForm();
  };

  const addTransaction = () => {
    if (!selectedAccount || !amount || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const account = accounts.find(acc => acc.id === selectedAccount);
    if (!account) return;

    const transactionAmount = parseFloat(amount);
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      accountId: selectedAccount,
      type: transactionType,
      amount: transactionAmount,
      currency: account.currency,
      description,
      reference: reference || 'TXN-' + Date.now(),
      date: new Date().toISOString(),
      category: category || 'General'
    };

    setTransactions(prev => [...prev, newTransaction]);

    // Update account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === selectedAccount) {
        const newBalance = transactionType === 'credit' 
          ? acc.balance + transactionAmount 
          : acc.balance - transactionAmount;
        return { ...acc, balance: newBalance };
      }
      return acc;
    }));

    toast({
      title: "Success",
      description: "Transaction added successfully",
    });

    setNewTransactionOpen(false);
    resetTransactionForm();
  };

  const resetAccountForm = () => {
    setAccountName('');
    setAccountNumber('');
    setBankName('');
    setCurrency('USD');
    setInitialBalance('0');
  };

  const resetTransactionForm = () => {
    setTransactionType('credit');
    setAmount('');
    setDescription('');
    setReference('');
    setCategory('');
    setSelectedAccount('');
  };

  const getCurrencySymbol = (currencyCode: string) => {
    return currencies.find(c => c.code === currencyCode)?.symbol || currencyCode;
  };

  const getAccountTransactions = (accountId: string) => {
    return transactions.filter(t => t.accountId === accountId).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const getTotalByTypeAndCurrency = (type: 'debit' | 'credit') => {
    const totals: { [key: string]: number } = {};
    transactions.filter(t => t.type === type).forEach(t => {
      totals[t.currency] = (totals[t.currency] || 0) + t.amount;
    });
    return totals;
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'Account', 'Type', 'Amount', 'Currency', 'Description', 'Reference', 'Category'].join(','),
      ...transactions.map(t => {
        const account = accounts.find(acc => acc.id === t.accountId);
        return [
          new Date(t.date).toLocaleDateString(),
          account?.name || '',
          t.type,
          t.amount,
          t.currency,
          t.description,
          t.reference,
          t.category
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bank_transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const creditTotals = getTotalByTypeAndCurrency('credit');
  const debitTotals = getTotalByTypeAndCurrency('debit');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Banknote className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Bank Accounts</h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={exportTransactions} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Transactions
          </Button>
          <Dialog open={newAccountOpen} onOpenChange={setNewAccountOpen}>
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
                  <Label>Account Name *</Label>
                  <Input
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Business Checking"
                  />
                </div>
                <div>
                  <Label>Account Number *</Label>
                  <Input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="1234567890"
                  />
                </div>
                <div>
                  <Label>Bank Name *</Label>
                  <Input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Equity Bank"
                  />
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(curr => (
                        <SelectItem key={curr.code} value={curr.code}>
                          {curr.name} ({curr.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Initial Balance</Label>
                  <Input
                    type="number"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <Button onClick={addAccount} className="w-full">
                  Add Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Banknote className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Accounts</p>
                <p className="text-2xl font-bold">{accounts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Money Received</p>
                {Object.entries(creditTotals).map(([curr, amount]) => (
                  <p key={curr} className="text-lg font-bold text-green-600">
                    {getCurrencySymbol(curr)}{amount.toFixed(2)}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Money Sent</p>
                {Object.entries(debitTotals).map(([curr, amount]) => (
                  <p key={curr} className="text-lg font-bold text-red-600">
                    {getCurrencySymbol(curr)}{amount.toFixed(2)}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bank Accounts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Bank Accounts
            <Dialog open={newTransactionOpen} onOpenChange={setNewTransactionOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Account *</Label>
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} - {account.bankName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Type *</Label>
                    <Select value={transactionType} onValueChange={(value: 'debit' | 'credit') => setTransactionType(value)}>
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
                    <Label>Amount *</Label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Description *</Label>
                    <Input
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Payment received from client"
                    />
                  </div>
                  <div>
                    <Label>Reference</Label>
                    <Input
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      placeholder="REF-001"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Sales, Expenses, etc."
                    />
                  </div>
                  <Button onClick={addTransaction} className="w-full">
                    Add Transaction
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No bank accounts yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {accounts.map(account => {
                const accountTransactions = getAccountTransactions(account.id);
                return (
                  <Card key={account.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{account.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {account.bankName} - {account.accountNumber}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            {getCurrencySymbol(account.currency)}{account.balance.toFixed(2)}
                          </p>
                          <Badge variant="outline">{account.currency}</Badge>
                        </div>
                      </div>
                      
                      {accountTransactions.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-medium">Recent Transactions</h4>
                          <div className="max-h-40 overflow-y-auto space-y-1">
                            {accountTransactions.slice(0, 5).map(transaction => (
                              <div key={transaction.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{transaction.description}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(transaction.date).toLocaleDateString()} - {transaction.reference}
                                  </p>
                                </div>
                                <div className={`text-sm font-medium ${
                                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {transaction.type === 'credit' ? '+' : '-'}
                                  {getCurrencySymbol(transaction.currency)}{transaction.amount.toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BankAccounts;
