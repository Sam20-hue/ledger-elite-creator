
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InvoiceFieldSelectorProps {
  selectedFields: {
    company: {
      logo: boolean;
      name: boolean;
      address: boolean;
      city: boolean;
      zipCode: boolean;
      country: boolean;
      phone: boolean;
      email: boolean;
      website: boolean;
      taxId: boolean;
    };
    client: {
      name: boolean;
      address: boolean;
      city: boolean;
      zipCode: boolean;
      country: boolean;
      email: boolean;
      phone: boolean;
    };
    invoice: {
      invoiceNumber: boolean;
      issueDate: boolean;
      dueDate: boolean;
      notes: boolean;
      currency: boolean;
      taxRate: boolean;
    };
  };
  onFieldChange: (section: string, field: string, checked: boolean) => void;
}

const InvoiceFieldSelector: React.FC<InvoiceFieldSelectorProps> = ({
  selectedFields,
  onFieldChange,
}) => {
  const sections = [
    {
      title: 'Company Information',
      key: 'company',
      fields: [
        { key: 'logo', label: 'Company Logo' },
        { key: 'name', label: 'Company Name' },
        { key: 'address', label: 'Address' },
        { key: 'city', label: 'City' },
        { key: 'zipCode', label: 'Zip Code' },
        { key: 'country', label: 'Country' },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'website', label: 'Website' },
        { key: 'taxId', label: 'Tax ID' },
      ],
    },
    {
      title: 'Client Information',
      key: 'client',
      fields: [
        { key: 'name', label: 'Client Name' },
        { key: 'address', label: 'Address' },
        { key: 'city', label: 'City' },
        { key: 'zipCode', label: 'Zip Code' },
        { key: 'country', label: 'Country' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
      ],
    },
    {
      title: 'Invoice Details',
      key: 'invoice',
      fields: [
        { key: 'invoiceNumber', label: 'Invoice Number' },
        { key: 'issueDate', label: 'Issue Date' },
        { key: 'dueDate', label: 'Due Date' },
        { key: 'notes', label: 'Notes' },
        { key: 'currency', label: 'Currency' },
        { key: 'taxRate', label: 'Tax Rate' },
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Select Fields to Include</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.map((section) => (
          <div key={section.key} className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground">{section.title}</h4>
            <div className="grid grid-cols-2 gap-2">
              {section.fields.map((field) => (
                <div key={field.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${section.key}-${field.key}`}
                    checked={selectedFields[section.key as keyof typeof selectedFields][field.key as keyof any]}
                    onCheckedChange={(checked) =>
                      onFieldChange(section.key, field.key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`${section.key}-${field.key}`} className="text-xs">
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default InvoiceFieldSelector;
