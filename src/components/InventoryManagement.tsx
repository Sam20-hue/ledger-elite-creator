
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Package, Plus, Minus, Download, Search, Edit, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  minStock: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: 'addition' | 'release';
  quantity: number;
  price: number;
  total: number;
  reason: string;
  date: string;
  createdBy: string;
}

const InventoryManagement = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [transactionType, setTransactionType] = useState<'addition' | 'release'>('addition');

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: 0,
    price: 0,
    minStock: 0,
    description: ''
  });

  const [transactionData, setTransactionData] = useState({
    quantity: 0,
    price: 0,
    reason: ''
  });

  useEffect(() => {
    // Load data from localStorage
    const savedItems = localStorage.getItem('inventoryItems');
    const savedTransactions = localStorage.getItem('inventoryTransactions');
    
    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }
    
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  const saveToStorage = (items: InventoryItem[], transactions: InventoryTransaction[]) => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
    localStorage.setItem('inventoryTransactions', JSON.stringify(transactions));
  };

  const handleAddItem = () => {
    if (!formData.name || !formData.category) {
      toast({
        title: "Error",
        description: "Name and category are required",
        variant: "destructive"
      });
      return;
    }

    const newItem: InventoryItem = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    saveToStorage(updatedItems, transactions);

    toast({
      title: "Success",
      description: "Item added successfully"
    });

    setFormData({
      name: '',
      category: '',
      quantity: 0,
      price: 0,
      minStock: 0,
      description: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleTransaction = () => {
    if (!selectedItem || transactionData.quantity <= 0) {
      toast({
        title: "Error",
        description: "Please select an item and enter a valid quantity",
        variant: "destructive"
      });
      return;
    }

    if (transactionType === 'release' && transactionData.quantity > selectedItem.quantity) {
      toast({
        title: "Error",
        description: "Cannot release more items than available in stock",
        variant: "destructive"
      });
      return;
    }

    const newTransaction: InventoryTransaction = {
      id: Date.now().toString(),
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      type: transactionType,
      quantity: transactionData.quantity,
      price: transactionData.price || selectedItem.price,
      total: transactionData.quantity * (transactionData.price || selectedItem.price),
      reason: transactionData.reason,
      date: new Date().toISOString(),
      createdBy: 'Current User'
    };

    const updatedTransactions = [...transactions, newTransaction];

    // Update item quantity
    const updatedItems = items.map(item => {
      if (item.id === selectedItem.id) {
        const newQuantity = transactionType === 'addition' 
          ? item.quantity + transactionData.quantity
          : item.quantity - transactionData.quantity;
        
        return {
          ...item,
          quantity: newQuantity,
          updatedAt: new Date().toISOString()
        };
      }
      return item;
    });

    setItems(updatedItems);
    setTransactions(updatedTransactions);
    saveToStorage(updatedItems, updatedTransactions);

    toast({
      title: "Success",
      description: `${transactionType === 'addition' ? 'Added' : 'Released'} ${transactionData.quantity} items successfully`
    });

    setTransactionData({
      quantity: 0,
      price: 0,
      reason: ''
    });
    setIsTransactionDialogOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      saveToStorage(updatedItems, transactions);
      
      toast({
        title: "Success",
        description: "Item deleted successfully"
      });
    }
  };

  const exportToExcel = () => {
    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();

    // Inventory Items Sheet
    const itemsData = items.map(item => ({
      'Item Name': item.name,
      'Category': item.category,
      'Current Stock': item.quantity,
      'Unit Price': item.price,
      'Total Value': item.quantity * item.price,
      'Minimum Stock': item.minStock,
      'Status': item.quantity <= item.minStock ? 'Low Stock' : 'In Stock',
      'Description': item.description,
      'Created Date': new Date(item.createdAt).toLocaleDateString(),
      'Last Updated': new Date(item.updatedAt).toLocaleDateString()
    }));

    const ws1 = XLSX.utils.json_to_sheet(itemsData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Inventory Items');

    // Transactions Sheet
    const transactionsData = transactions.map(transaction => ({
      'Date': new Date(transaction.date).toLocaleDateString(),
      'Item Name': transaction.itemName,
      'Transaction Type': transaction.type.toUpperCase(),
      'Quantity': transaction.quantity,
      'Unit Price': transaction.price,
      'Total Amount': transaction.total,
      'Reason': transaction.reason,
      'Created By': transaction.createdBy
    }));

    const ws2 = XLSX.utils.json_to_sheet(transactionsData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Transactions');

    // Summary Sheet
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const lowStockItems = items.filter(item => item.quantity <= item.minStock).length;
    const totalItems = items.length;
    const totalTransactions = transactions.length;

    const summaryData = [
      { 'Metric': 'Total Items', 'Value': totalItems },
      { 'Metric': 'Total Inventory Value', 'Value': totalValue },
      { 'Metric': 'Low Stock Items', 'Value': lowStockItems },
      { 'Metric': 'Total Transactions', 'Value': totalTransactions },
      { 'Metric': 'Report Generated', 'Value': new Date().toLocaleString() }
    ];

    const ws3 = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Summary');

    // Save file
    XLSX.writeFile(wb, `Inventory_Report_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Success",
      description: "Inventory report exported successfully"
    });
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const lowStockItems = items.filter(item => item.quantity <= item.minStock);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Package className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={exportToExcel} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter item name"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="Enter category"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantity">Initial Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Unit Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="minStock">Minimum Stock Level</Label>
                  <Input
                    id="minStock"
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
                <Button onClick={handleAddItem} className="w-full">
                  Add Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{items.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{transactions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Inventory Items ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No items found</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                Add Your First Item
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-1 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-2 px-1 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-2 px-1 text-sm font-medium text-muted-foreground">Stock</th>
                    <th className="text-left py-2 px-1 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-2 px-1 text-sm font-medium text-muted-foreground">Value</th>
                    <th className="text-left py-2 px-1 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 px-1 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-1 text-sm font-medium text-foreground">{item.name}</td>
                      <td className="py-3 px-1 text-sm text-muted-foreground">{item.category}</td>
                      <td className="py-3 px-1 text-sm text-foreground">{item.quantity}</td>
                      <td className="py-3 px-1 text-sm text-foreground">${item.price.toFixed(2)}</td>
                      <td className="py-3 px-1 text-sm text-foreground">${(item.quantity * item.price).toFixed(2)}</td>
                      <td className="py-3 px-1 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.quantity <= item.minStock 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {item.quantity <= item.minStock ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="py-3 px-1">
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedItem(item);
                              setTransactionType('addition');
                              setIsTransactionDialogOpen(true);
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedItem(item);
                              setTransactionType('release');
                              setIsTransactionDialogOpen(true);
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Dialog */}
      <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {transactionType === 'addition' ? 'Add Stock' : 'Release Stock'} - {selectedItem?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="transactionQuantity">Quantity *</Label>
              <Input
                id="transactionQuantity"
                type="number"
                value={transactionData.quantity}
                onChange={(e) => setTransactionData({...transactionData, quantity: parseInt(e.target.value) || 0})}
                placeholder="Enter quantity"
              />
              {selectedItem && transactionType === 'release' && (
                <p className="text-sm text-muted-foreground mt-1">
                  Available: {selectedItem.quantity}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="transactionPrice">Unit Price</Label>
              <Input
                id="transactionPrice"
                type="number"
                step="0.01"
                value={transactionData.price}
                onChange={(e) => setTransactionData({...transactionData, price: parseFloat(e.target.value) || 0})}
                placeholder={`Default: $${selectedItem?.price || 0}`}
              />
            </div>
            <div>
              <Label htmlFor="transactionReason">Reason</Label>
              <Input
                id="transactionReason"
                value={transactionData.reason}
                onChange={(e) => setTransactionData({...transactionData, reason: e.target.value})}
                placeholder="Enter reason for transaction"
              />
            </div>
            <Button onClick={handleTransaction} className="w-full">
              {transactionType === 'addition' ? 'Add Stock' : 'Release Stock'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryManagement;
