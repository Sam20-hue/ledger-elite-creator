
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInvoice } from '@/contexts/InvoiceContext';
import { useForm } from 'react-hook-form';
import { Company } from '@/types/invoice';
import { Upload, Save, Building2, X, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CompanySettings = () => {
  const { company, updateCompany } = useInvoice();
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState(company.logo);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Company>({
    defaultValues: company
  });

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setLogoPreview(result);
        setValue('logo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview('');
    setValue('logo', '');
    toast({
      title: "Logo Removed",
      description: "Company logo has been removed",
    });
  };

  const onSubmit = (data: Company) => {
    updateCompany(data);
    toast({
      title: "Success",
      description: "Company settings updated successfully",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <Building2 className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Company Settings</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Logo */}
        <Card>
          <CardHeader>
            <CardTitle>Company Logo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-4">
              {logoPreview ? (
                <div className="relative group">
                  <div className="w-24 h-24 border rounded-lg overflow-hidden bg-gray-50">
                    <img src={logoPreview} alt="Company Logo" className="w-full h-full object-contain" />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleRemoveLogo}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Label htmlFor="logo" className="cursor-pointer flex-1">
                    <div className="flex items-center justify-center space-x-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors">
                      {logoPreview ? <Edit className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                      <span>{logoPreview ? 'Change Logo' : 'Upload Logo'}</span>
                    </div>
                  </Label>
                  {logoPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveLogo}
                      className="px-3"
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <p className="text-sm text-muted-foreground">
                  Recommended: 200x100px or similar ratio. Accepts JPG, PNG, SVG.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  {...register('name', { required: 'Company name is required' })}
                  placeholder="Enter company name"
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
                <Label htmlFor="website">Website</Label>
                <Input
                  {...register('website')}
                  placeholder="Enter website URL"
                />
              </div>

              <div>
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  {...register('taxId')}
                  placeholder="Enter tax ID"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                {...register('address')}
                placeholder="Enter company address"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  {...register('country')}
                  placeholder="Enter country"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettings;
