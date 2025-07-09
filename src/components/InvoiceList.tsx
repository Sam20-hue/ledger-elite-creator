
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInvoice } from '@/contexts/InvoiceContext';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Download, Plus, Search, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const InvoiceList = () => {
  const { invoices, deleteInvoice, updateInvoice } = useInvoice();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceDialogOpen, setPriceDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [sellingPrice, setSellingPrice] = useState('');

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(id);
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
    }
  };

  const handleStatusChange = (invoice: any, newStatus: string) => {
    const updatedInvoice = { ...invoice, status: newStatus, updatedAt: new Date().toISOString() };
    updateInvoice(updatedInvoice);
    toast({
      title: "Success",
      description: `Invoice status updated to ${newStatus}`,
    });
  };

  const updateSellingPrice = () => {
    if (!selectedInvoice || !sellingPrice) return;
    
    const updatedInvoice = { 
      ...selectedInvoice, 
      total: parseFloat(sellingPrice),
      updatedAt: new Date().toISOString() 
    };
    updateInvoice(updatedInvoice);
    toast({
      title: "Success",
      description: "Selling price updated successfully",
    });
    setPriceDialogOpen(false);
    setSellingPrice('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
        <Link to="/invoices/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </Link>
      </div>

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

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            All Invoices ({filteredInvoices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No invoices found</p>
              <Link to="/invoices/new">
                <Button>Create Your First Invoice</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto table-responsive">
              <table className="w-full compact-table invoice-table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-muted-foreground">Invoice #</th>
                    <th className="text-left text-muted-foreground">Client</th>
                    <th className="text-left text-muted-foreground">Issue Date</th>
                    <th className="text-left text-muted-foreground">Due Date</th>
                    <th className="text-left text-muted-foreground">Selling Price</th>
                    <th className="text-left text-muted-foreground">Buying Price</th>
                    <th className="text-left text-muted-foreground">Profit</th>
                    <th className="text-left text-muted-foreground">Status</th>
                    <th className="text-left text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => {
                    const buyingPrice = invoice.total * 0.7; // Demo: 70% of selling price
                    const profit = invoice.total - buyingPrice;
                    
                    return (
                      <tr key={invoice.id} className="border-b border-border hover:bg-muted/50">
                        <td className="font-medium text-foreground">{invoice.invoiceNumber}</td>
                        <td className="text-foreground">{invoice.client.name}</td>
                        <td className="text-foreground">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                        <td className="text-foreground">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                        <td className="font-medium text-foreground">
                          <div className="flex items-center space-x-1">
                            <span>${invoice.total.toFixed(2)}</span>
                            <Dialog open={priceDialogOpen} onOpenChange={setPriceDialogOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setSellingPrice(invoice.total.toString());
                                  }}
                                >
                                  <DollarSign className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle className="text-foreground">Update Selling Price</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-2 text-foreground">Selling Price</label>
                                    <Input
                                      type="number"
                                      value={sellingPrice}
                                      onChange={(e) => setSellingPrice(e.target.value)}
                                      placeholder="Enter selling price"
                                    />
                                  </div>
                                  <Button onClick={updateSellingPrice} className="w-full">
                                    Update Price
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                        <td className="text-orange-600">${buyingPrice.toFixed(2)}</td>
                        <td className="font-medium text-green-600">${profit.toFixed(2)}</td>
                        <td>
                          <Select
                            value={invoice.status}
                            onValueChange={(value) => handleStatusChange(invoice, value)}
                          >
                            <SelectTrigger className="w-24 h-8">
                              <Badge className={getStatusColor(invoice.status)}>
                                {invoice.status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="sent">Sent</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td>
                          <div className="flex space-x-1">
                            <Link to={`/invoices/${invoice.id}/preview`}>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </Link>
                            <Link to={`/invoices/${invoice.id}`}>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleDelete(invoice.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
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

export default InvoiceList;
