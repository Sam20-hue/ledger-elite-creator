
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInvoice } from '@/contexts/InvoiceContext';
import { useAuth } from '@/hooks/useAuth';
import { Building2, TrendingUp, BarChart3, FileText, Lock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FinancialReports = () => {
  const { invoices } = useInvoice();
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [bankBalance, setBankBalance] = useState(50000);
  const [isFrozen, setIsFrozen] = useState(false);

  // Calculate financial metrics
  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const totalExpenses = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.buyingTotal || 0), 0);
  const profit = totalRevenue - totalExpenses;
  const assets = bankBalance + invoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const liabilities = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);
  const equity = assets - liabilities;

  const freezePayments = () => {
    if (userRole !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Only admin can freeze/unfreeze payments",
        variant: "destructive",
      });
      return;
    }
    setIsFrozen(!isFrozen);
    toast({
      title: isFrozen ? "Payments Unfrozen" : "Payments Frozen",
      description: isFrozen ? "Users can now make changes" : "All payments and invoices are now frozen",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Accounts/Financial Reports</h1>
        </div>
        {userRole === 'admin' && (
          <Button onClick={freezePayments} variant={isFrozen ? "default" : "destructive"}>
            <Lock className="h-4 w-4 mr-2" />
            {isFrozen ? 'Unfreeze Payments' : 'Freeze Payments'}
          </Button>
        )}
      </div>

      {isFrozen && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-700">
              <Shield className="h-5 w-5" />
              <span className="font-medium">System Frozen: All payments and invoices are locked for editing</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trial-balance">Trial Balance</TabsTrigger>
          <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
          <TabsTrigger value="profit-loss">P&L Statement</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bank Balance</p>
                    <p className="text-2xl font-bold">${bankBalance.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {userRole === 'admin' && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Net Profit</p>
                      <p className="text-2xl font-bold text-green-600">${profit.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="KES">KES (KSh)</SelectItem>
                      <SelectItem value="TZS">TZS (TSh)</SelectItem>
                      <SelectItem value="UGX">UGX (USh)</SelectItem>
                      <SelectItem value="RWF">RWF (RF)</SelectItem>
                      <SelectItem value="ETB">ETB (Br)</SelectItem>
                      <SelectItem value="GHS">GHS (₵)</SelectItem>
                      <SelectItem value="NGN">NGN (₦)</SelectItem>
                      <SelectItem value="ZAR">ZAR (R)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trial-balance">
          <Card>
            <CardHeader>
              <CardTitle>Trial Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Account</th>
                      <th className="text-right py-2">Debit</th>
                      <th className="text-right py-2">Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Cash at Bank</td>
                      <td className="text-right py-2">${bankBalance.toFixed(2)}</td>
                      <td className="text-right py-2">-</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Accounts Receivable</td>
                      <td className="text-right py-2">${(assets - bankBalance).toFixed(2)}</td>
                      <td className="text-right py-2">-</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Revenue</td>
                      <td className="text-right py-2">-</td>
                      <td className="text-right py-2">${totalRevenue.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Expenses</td>
                      <td className="text-right py-2">${totalExpenses.toFixed(2)}</td>
                      <td className="text-right py-2">-</td>
                    </tr>
                    <tr className="border-t-2 font-bold">
                      <td className="py-2">Total</td>
                      <td className="text-right py-2">${(bankBalance + assets - bankBalance + totalExpenses).toFixed(2)}</td>
                      <td className="text-right py-2">${totalRevenue.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance-sheet">
          <Card>
            <CardHeader>
              <CardTitle>Balance Sheet</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Assets</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Cash at Bank</span>
                      <span>${bankBalance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accounts Receivable</span>
                      <span>${(assets - bankBalance).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total Assets</span>
                      <span>${assets.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Liabilities & Equity</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Accounts Payable</span>
                      <span>${liabilities.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Owner's Equity</span>
                      <span>${equity.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total Liab. & Equity</span>
                      <span>${assets.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit-loss">
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Statement</CardTitle>
            </CardHeader>
            <CardContent>
              {userRole !== 'admin' ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4" />
                  <p>Access Restricted: Only administrators can view profit details</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="text-green-600">${totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost of Goods Sold</span>
                    <span className="text-red-600">${totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Net Profit</span>
                    <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${profit.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Profit Margin: {totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0}%
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation">
          <Card>
            <CardHeader>
              <CardTitle>Bank Reconciliation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bank Statement Balance</label>
                  <Input type="number" placeholder="Enter bank statement balance" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Outstanding Deposits</label>
                  <Input type="number" placeholder="Enter outstanding deposits" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Outstanding Checks</label>
                  <Input type="number" placeholder="Enter outstanding checks" />
                </div>
                <Button>Reconcile Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Item Name" />
                  <Input type="number" placeholder="Quantity" />
                  <Input type="number" placeholder="Unit Cost" />
                </div>
                <Button>Add Inventory Item</Button>
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Current Inventory</h4>
                  <div className="text-sm text-muted-foreground">No inventory items yet</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialReports;
