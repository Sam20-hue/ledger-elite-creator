
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInvoice } from '@/contexts/InvoiceContext';
import { CreditCard, Search, DollarSign, TrendingUp, Clock, CheckCircle, Mail, Send, PiggyBank } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const PaymentTracking = () => {
  const { invoices, updateInvoice } = useInvoice();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [emailSubject, setEmailSubject] = useState('Payment Reminder');
  const [emailMessage, setEmailMessage] = useState('');
  const [bankAccount, setBankAccount] = useState('');

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsPaid = (invoice: any) => {
    const updatedInvoice = { 
      ...invoice, 
      status: 'paid', 
      updatedAt: new Date().toISOString() 
    };
    updateInvoice(updatedInvoice);
    toast({
      title: "Success",
      description: `Invoice ${invoice.invoiceNumber} marked as paid`,
    });
  };

  const sendEmailReminder = () => {
    if (!selectedInvoice) return;
    
    // In a real app, this would send an actual email
    toast({
      title: "Email Sent",
      description: `Payment reminder sent to ${selectedInvoice.client.email}`,
    });
    setEmailDialogOpen(false);
    setEmailMessage('');
  };

  const sendPaymentPrompt = () => {
    if (!selectedInvoice) return;
    
    // In a real app, this would integrate with payment systems
    toast({
      title: "Payment Prompt Sent",
      description: `Payment prompt sent to ${selectedInvoice.client.name}`,
    });
    setPaymentDialogOpen(false);
  };

  // Calculate statistics with profit tracking
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices.filter(inv => inv.status !== 'paid').reduce((sum, inv) => sum + inv.total, 0);
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
  
  // Sample profit calculation (assuming 30% profit margin for demo)
  const estimatedProfit = paidAmount * 0.3;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <CreditCard className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Payment Tracking</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Paid Amount</p>
                <p className="text-2xl font-bold">${paidAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending Amount</p>
                <p className="text-2xl font-bold">${pendingAmount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Overdue Invoices</p>
                <p className="text-2xl font-bold">{overdueInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <PiggyBank className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Estimated Profit</p>
                <p className="text-2xl font-bold">${estimatedProfit.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bank Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bank Account Number</label>
              <Input
                placeholder="Enter your bank account number"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">External System URL</label>
              <Input
                placeholder="https://your-buying-price-system.com/api"
                type="url"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search invoices or clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payment List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Status ({filteredInvoices.length} invoices)</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No invoices found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Invoice #</th>
                    <th className="text-left py-3 px-2">Client</th>
                    <th className="text-left py-3 px-2">Due Date</th>
                    <th className="text-left py-3 px-2">Selling Price</th>
                    <th className="text-left py-3 px-2">Buying Price</th>
                    <th className="text-left py-3 px-2">Profit</th>
                    <th className="text-left py-3 px-2">Status</th>
                    <th className="text-left py-3 px-2">Days Overdue</th>
                    <th className="text-left py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => {
                    const dueDate = new Date(invoice.dueDate);
                    const today = new Date();
                    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
                    const buyingPrice = invoice.total * 0.7; // Demo: 70% of selling price
                    const profit = invoice.total - buyingPrice;
                    
                    return (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-2 font-medium">{invoice.invoiceNumber}</td>
                        <td className="py-4 px-2">{invoice.client.name}</td>
                        <td className="py-4 px-2">{dueDate.toLocaleDateString()}</td>
                        <td className="py-4 px-2 font-medium">${invoice.total.toFixed(2)}</td>
                        <td className="py-4 px-2 text-orange-600">${buyingPrice.toFixed(2)}</td>
                        <td className="py-4 px-2 font-medium text-green-600">${profit.toFixed(2)}</td>
                        <td className="py-4 px-2">
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-2">
                          {invoice.status !== 'paid' && daysOverdue > 0 ? (
                            <span className="text-red-600 font-medium">{daysOverdue} days</span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex space-x-2">
                            {invoice.status !== 'paid' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => markAsPaid(invoice)}
                                >
                                  Mark as Paid
                                </Button>
                                <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setSelectedInvoice(invoice)}
                                    >
                                      <Mail className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Send Payment Reminder</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <label className="block text-sm font-medium mb-2">Subject</label>
                                        <Input
                                          value={emailSubject}
                                          onChange={(e) => setEmailSubject(e.target.value)}
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-sm font-medium mb-2">Message</label>
                                        <Textarea
                                          placeholder="Dear client, this is a reminder..."
                                          value={emailMessage}
                                          onChange={(e) => setEmailMessage(e.target.value)}
                                          rows={4}
                                        />
                                      </div>
                                      <Button onClick={sendEmailReminder} className="w-full">
                                        Send Reminder
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setSelectedInvoice(invoice)}
                                    >
                                      <Send className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Send Payment Prompt</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <p>Send a payment prompt to {selectedInvoice?.client.name} for invoice {selectedInvoice?.invoiceNumber}?</p>
                                      <p className="text-sm text-muted-foreground">
                                        This will send a payment link directly to the client's phone/email.
                                      </p>
                                      <Button onClick={sendPaymentPrompt} className="w-full">
                                        Send Payment Prompt
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTracking;
