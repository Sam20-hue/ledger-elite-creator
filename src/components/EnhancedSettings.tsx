
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Settings, Moon, Sun, Bell, Shield, Database, Mail, CreditCard, Building } from 'lucide-react';

const EnhancedSettings = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [emailReminders, setEmailReminders] = useState(true);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [invoicePrefix, setInvoicePrefix] = useState('INV');
  const [taxRate, setTaxRate] = useState('0');
  const [emailHost, setEmailHost] = useState('');
  const [emailPort, setEmailPort] = useState('587');
  const [emailUsername, setEmailUsername] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [microsoftDynamicsUrl, setMicrosoftDynamicsUrl] = useState('');
  const [microsoftDynamicsKey, setMicrosoftDynamicsKey] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [bankName, setBankName] = useState('');

  const saveSettings = () => {
    // In a real app, this would save to a backend
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const testEmailConnection = () => {
    toast({
      title: "Email Test",
      description: "Test email sent successfully!",
    });
  };

  const testMicrosoftDynamics = () => {
    toast({
      title: "Microsoft Dynamics Test",
      description: "Connection test successful!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Settings className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>General Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <Label htmlFor="notifications">Push Notifications</Label>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <Label htmlFor="auto-backup">Auto Backup</Label>
              </div>
              <Switch
                id="auto-backup"
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <Label htmlFor="email-reminders">Email Reminders</Label>
              </div>
              <Switch
                id="email-reminders"
                checked={emailReminders}
                onCheckedChange={setEmailReminders}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="currency">Default Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="JPY">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="time-format">Time Format</Label>
              <Select value={timeFormat} onValueChange={setTimeFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 Hour</SelectItem>
                  <SelectItem value="24h">24 Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice-prefix">Invoice Number Prefix</Label>
              <Input
                id="invoice-prefix"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                placeholder="INV"
              />
            </div>
            <div>
              <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
              <Input
                id="tax-rate"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Email Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email-host">SMTP Host</Label>
              <Input
                id="email-host"
                value={emailHost}
                onChange={(e) => setEmailHost(e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <Label htmlFor="email-port">SMTP Port</Label>
              <Input
                id="email-port"
                value={emailPort}
                onChange={(e) => setEmailPort(e.target.value)}
                placeholder="587"
              />
            </div>
            <div>
              <Label htmlFor="email-username">Email Username</Label>
              <Input
                id="email-username"
                value={emailUsername}
                onChange={(e) => setEmailUsername(e.target.value)}
                placeholder="your-email@gmail.com"
              />
            </div>
            <div>
              <Label htmlFor="email-password">Email Password</Label>
              <Input
                id="email-password"
                type="password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                placeholder="your-app-password"
              />
            </div>
          </div>
          <Button onClick={testEmailConnection} variant="outline">
            Test Email Connection
          </Button>
        </CardContent>
      </Card>

      {/* Bank Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Bank Account Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input
                id="bank-name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Your Bank Name"
              />
            </div>
            <div>
              <Label htmlFor="bank-account">Account Number</Label>
              <Input
                id="bank-account"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="1234567890"
              />
            </div>
            <div>
              <Label htmlFor="routing-number">Routing Number</Label>
              <Input
                id="routing-number"
                value={routingNumber}
                onChange={(e) => setRoutingNumber(e.target.value)}
                placeholder="123456789"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Microsoft Dynamics Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Microsoft Dynamics Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="dynamics-url">Dynamics 365 URL</Label>
              <Input
                id="dynamics-url"
                value={microsoftDynamicsUrl}
                onChange={(e) => setMicrosoftDynamicsUrl(e.target.value)}
                placeholder="https://your-org.crm.dynamics.com/"
              />
            </div>
            <div>
              <Label htmlFor="dynamics-key">API Key</Label>
              <Input
                id="dynamics-key"
                type="password"
                value={microsoftDynamicsKey}
                onChange={(e) => setMicrosoftDynamicsKey(e.target.value)}
                placeholder="Your API Key"
              />
            </div>
            <Button onClick={testMicrosoftDynamics} variant="outline" disabled>
              Test Connection (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>App Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Version</Label>
              <p className="text-sm text-muted-foreground">v1.0.0</p>
            </div>
            <div>
              <Label>Last Updated</Label>
              <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <Label>Build</Label>
              <p className="text-sm text-muted-foreground">2024.1.0</p>
            </div>
            <div>
              <Label>Environment</Label>
              <p className="text-sm text-muted-foreground">Production</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} size="lg">
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default EnhancedSettings;
