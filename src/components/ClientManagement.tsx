
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useInvoice } from '@/contexts/InvoiceContext';
import { Client } from '@/types/invoice';
import { Plus, Edit, Trash2, Search, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';

const ClientManagement = () => {
  const { clients, addClient, updateClient, deleteClient, invoices } = useInvoice();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Omit<Client, 'id'>>();

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getClientInvoiceStats = (clientId: string) => {
    const clientInvoices = invoices.filter(inv => inv.clientId === clientId);
    const totalInvoices = clientInvoices.length;
    const paidInvoices = clientInvoices.filter(inv => inv.status === 'paid').length;
    const totalAmount = clientInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidAmount = clientInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);

    return { totalInvoices, paidInvoices, totalAmount, paidAmount };
  };

  const onSubmit = (data: Omit<Client, 'id'>) => {
    const clientData: Client = {
      ...data,
      id: editingClient ? editingClient.id : crypto.randomUUID(),
    };

    if (editingClient) {
      updateClient(clientData);
      toast({
        title: "Success",
        description: "Client updated successfully",
      });
    } else {
      addClient(clientData);
      toast({
        title: "Success",
        description: "Client added successfully",
      });
    }

    setIsDialogOpen(false);
    setEditingClient(null);
    reset();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    reset(client);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const clientInvoices = invoices.filter(inv => inv.clientId === id);
    if (clientInvoices.length > 0) {
      toast({
        title: "Error",
        description: "Cannot delete client with existing invoices",
        variant: "destructive",
      });
      return;
    }

    if (confirm('Are you sure you want to delete this client?')) {
      deleteClient(id);
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    }
  };

  const handleAddNew = () => {
    setEditingClient(null);
    reset({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      country: ''
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Client Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Client Name *</Label>
                  <Input
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Enter client name"
                  />
                  {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    placeholder="Enter email address"
                  />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    {...register('phone')}
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    {...register('country')}
                    placeholder="Enter country"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    {...register('address')}
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    {...register('city')}
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    {...register('zipCode')}
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingClient ? 'Update Client' : 'Add Client'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Client List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No clients found</p>
            <Button onClick={handleAddNew}>Add Your First Client</Button>
          </div>
        ) : (
          filteredClients.map((client) => {
            const stats = getClientInvoiceStats(client.id);
            return (
              <Card key={client.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(client)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(client.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Email:</strong> {client.email}</p>
                    {client.phone && <p><strong>Phone:</strong> {client.phone}</p>}
                    <p><strong>Location:</strong> {client.city ? `${client.city}, ${client.country}` : client.country}</p>
                    
                    <div className="border-t pt-3 mt-3">
                      <p className="font-medium mb-1">Invoice Statistics:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p>Total Invoices: {stats.totalInvoices}</p>
                          <p>Paid Invoices: {stats.paidInvoices}</p>
                        </div>
                        <div>
                          <p>Total Amount: ${stats.totalAmount.toFixed(2)}</p>
                          <p>Paid Amount: ${stats.paidAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ClientManagement;
