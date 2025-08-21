import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package, AlertTriangle, TrendingUp, Edit, Trash2 } from 'lucide-react';

const Inventory = () => {
  const items = [
    { 
      id: 1, 
      name: 'Laptop Computer', 
      sku: 'LT-001', 
      category: 'Electronics', 
      stock: 25, 
      minStock: 10, 
      price: 1200, 
      status: 'In Stock' 
    },
    { 
      id: 2, 
      name: 'Office Chair', 
      sku: 'OC-002', 
      category: 'Furniture', 
      stock: 5, 
      minStock: 10, 
      price: 350, 
      status: 'Low Stock' 
    },
    { 
      id: 3, 
      name: 'Wireless Mouse', 
      sku: 'WM-003', 
      category: 'Electronics', 
      stock: 0, 
      minStock: 20, 
      price: 45, 
      status: 'Out of Stock' 
    },
    { 
      id: 4, 
      name: 'Desk Lamp', 
      sku: 'DL-004', 
      category: 'Office Supplies', 
      stock: 15, 
      minStock: 8, 
      price: 85, 
      status: 'In Stock' 
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const inventoryStats = [
    { label: 'Total Items', value: items.length.toString(), icon: Package },
    { label: 'Low Stock Items', value: items.filter(i => i.status === 'Low Stock').length.toString(), icon: AlertTriangle },
    { label: 'Out of Stock', value: items.filter(i => i.status === 'Out of Stock').length.toString(), icon: AlertTriangle },
    { label: 'Total Value', value: `$${items.reduce((sum, item) => sum + (item.stock * item.price), 0).toLocaleString()}`, icon: TrendingUp }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage your inventory items</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Inventory Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {inventoryStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Inventory Items
          </CardTitle>
          <CardDescription>
            All inventory items with stock levels and pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Item Name</th>
                  <th className="text-left p-4 font-medium">SKU</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Stock</th>
                  <th className="text-left p-4 font-medium">Min Stock</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{item.name}</td>
                    <td className="p-4 font-mono text-sm">{item.sku}</td>
                    <td className="p-4">{item.category}</td>
                    <td className="p-4">
                      <span className={item.stock <= item.minStock ? 'text-red-600 font-medium' : ''}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="p-4">{item.minStock}</td>
                    <td className="p-4">${item.price}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Alerts</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {items.filter(item => item.status !== 'In Stock').map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{item.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common inventory tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Package className="h-4 w-4 mr-2" />
              Bulk Import
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Generate Alerts
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Stock Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Items by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['Electronics', 'Furniture', 'Office Supplies'].map(category => (
                <div key={category} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{category}</span>
                  <span className="text-xs text-muted-foreground">
                    {items.filter(item => item.category === category).length} items
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inventory;