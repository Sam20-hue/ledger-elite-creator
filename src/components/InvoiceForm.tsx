
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInvoice } from '@/contexts/InvoiceContext';
import { Invoice, InvoiceItem } from '@/types/invoice';
import { Plus, Trash2, Save, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface InvoiceFormData {
  clientId: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  taxRate: number;
  notes: string;
}

const InvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clients, invoices, addInvoice, updateInvoice, getNextInvoiceNumber } = useInvoice();
  const [isEditing, setIsEditing] = useState(false);

  const { register, control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<InvoiceFormData>({
    defaultValues: {
      clientId: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ id: crypto.randomUUID(), description: '', quantity: 1, rate: 0, amount: 0 }],
      taxRate: 10,
      notes: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');
  const watchedTaxRate = watch('taxRate');

  useEffect(() => {
    if (id && id !== 'new') {
      const invoice = invoices.find(inv => inv.id === id);
      if (invoice) {
        setIsEditing(true);
        reset({
          clientId: invoice.clientId,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          items: invoice.items,
          taxRate: invoice.taxRate,
          notes: invoice.notes
        });
      }
    }
  }, [id, invoices, reset]);

  // Calculate amounts
  useEffect(() => {
    watchedItems.forEach((item, index) => {
      const amount = item.quantity * item.rate;
      setValue(`items.${index}.amount`, amount);
    });
  }, [watchedItems, setValue]);

  const subtotal = watchedItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const tax = subtotal * (watchedTaxRate / 100);
  const total = subtotal + tax;

  const onSubmit = (data: InvoiceFormData) => {
    const selectedClient = clients.find(client => client.id === data.clientId);
    if (!selectedClient) {
      toast({
        title: "Error",
        description: "Please select a client",
        variant: "destructive",
      });
      return;
    }

    const invoiceData: Invoice = {
      id: isEditing ? id! : crypto.randomUUID(),
      invoiceNumber: isEditing ? invoices.find(inv => inv.id === id)!.invoiceNumber : getNextInvoiceNumber(),
      clientId: data.clientId,
      client: selectedClient,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      items: data.items,
      subtotal,
      tax,
      taxRate: data.taxRate,
      total,
      status: 'draft',
      notes: data.notes,
      createdAt: isEditing ? invoices.find(inv => inv.id === id)!.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (isEditing) {
      updateInvoice(invoiceData);
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
    } else {
      addInvoice(invoiceData);
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
    }

    navigate('/invoices');
  };

  const addItem = () => {
    append({ id: crypto.randomUUID(), description: '', quantity: 1, rate: 0, amount: 0 });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Edit Invoice' : 'Create New Invoice'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="client">Client *</Label>
                <Select onValueChange={(value) => setValue('clientId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.clientId && <span className="text-red-500 text-sm">Client is required</span>}
              </div>

              <div>
                <Label htmlFor="issueDate">Issue Date *</Label>
                <Input
                  type="date"
                  {...register('issueDate', { required: 'Issue date is required' })}
                />
                {errors.issueDate && <span className="text-red-500 text-sm">{errors.issueDate.message}</span>}
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  type="date"
                  {...register('dueDate', { required: 'Due date is required' })}
                />
                {errors.dueDate && <span className="text-red-500 text-sm">{errors.dueDate.message}</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Invoice Items
              <Button type="button" onClick={addItem} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Label>Description</Label>
                    <Input
                      {...register(`items.${index}.description`, { required: 'Description is required' })}
                      placeholder="Item description"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.quantity`, { 
                        required: 'Quantity is required',
                        min: { value: 0.01, message: 'Quantity must be positive' }
                      })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Rate</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.rate`, { 
                        required: 'Rate is required',
                        min: { value: 0, message: 'Rate must be positive' }
                      })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={(watchedItems[index]?.quantity || 0) * (watchedItems[index]?.rate || 0)}
                      disabled
                    />
                  </div>
                  <div className="col-span-1">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span>Tax:</span>
                      <Input
                        type="number"
                        step="0.1"
                        className="w-16 h-6 text-xs"
                        {...register('taxRate', { min: 0, max: 100 })}
                      />
                      <span>%</span>
                    </div>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              {...register('notes')}
              placeholder="Additional notes or terms..."
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => navigate('/invoices')}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            {isEditing ? 'Update Invoice' : 'Save Invoice'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
