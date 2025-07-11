
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock } from 'lucide-react';
import { useFreeze } from '@/contexts/FreezeContext';

const FreezeSettings = () => {
  const { toast } = useToast();
  const { freezeSettings, updateFreezeSettings } = useFreeze();

  const handleSettingChange = (setting: keyof typeof freezeSettings, value: boolean) => {
    const newSettings = {
      ...freezeSettings,
      [setting]: value
    };
    updateFreezeSettings(newSettings);
  };

  const saveSettings = () => {
    toast({
      title: "Success",
      description: "Freeze settings saved successfully",
    });
  };

  const resetSettings = () => {
    const defaultSettings = {
      paidInvoices: false,
      savedClients: false,
      completedPayments: false,
      finalizedReports: false,
      confirmedOrders: false,
      processedTransactions: false,
    };
    updateFreezeSettings(defaultSettings);
    toast({
      title: "Success",
      description: "Freeze settings reset successfully",
    });
  };

  const freezeOptions = [
    {
      key: 'paidInvoices' as keyof typeof freezeSettings,
      title: 'Paid Invoices',
      description: 'Prevent editing of invoices marked as paid'
    },
    {
      key: 'savedClients' as keyof typeof freezeSettings,
      title: 'Saved Clients',
      description: 'Prevent editing of client information once saved'
    },
    {
      key: 'completedPayments' as keyof typeof freezeSettings,
      title: 'Completed Payments',
      description: 'Prevent editing of completed payment records'
    },
    {
      key: 'finalizedReports' as keyof typeof freezeSettings,
      title: 'Finalized Reports',
      description: 'Prevent editing of finalized financial reports'
    },
    {
      key: 'confirmedOrders' as keyof typeof freezeSettings,
      title: 'Confirmed Orders',
      description: 'Prevent editing of confirmed inventory orders'
    },
    {
      key: 'processedTransactions' as keyof typeof freezeSettings,
      title: 'Processed Transactions',
      description: 'Prevent editing of processed bank transactions'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Freeze Settings</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetSettings}>
            <Unlock className="h-4 w-4 mr-2" />
            Reset All
          </Button>
          <Button onClick={saveSettings}>
            <Lock className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">System Freeze Controls</CardTitle>
          <p className="text-muted-foreground">
            Configure which parts of the Numera system should be frozen to prevent accidental edits
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {freezeOptions.map((option) => (
            <div key={option.key} className="flex items-start space-x-3">
              <Checkbox
                id={option.key}
                checked={freezeSettings[option.key]}
                onCheckedChange={(checked) => 
                  handleSettingChange(option.key, checked as boolean)
                }
                className="mt-1"
              />
              <div className="space-y-1">
                <label
                  htmlFor={option.key}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground cursor-pointer"
                >
                  {option.title}
                </label>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freezeOptions.map((option) => (
              <div key={option.key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span className="text-sm font-medium text-foreground">{option.title}</span>
                <div className="flex items-center gap-2">
                  {freezeSettings[option.key] ? (
                    <>
                      <Lock className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-500">Frozen</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">Editable</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreezeSettings;
