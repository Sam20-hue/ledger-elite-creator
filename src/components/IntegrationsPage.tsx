
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link as LinkIcon, Zap, Mail, Database, CreditCard, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IntegrationsPage = () => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState('');
  const [emailSettings, setEmailSettings] = useState({
    smtpServer: '',
    smtpPort: '',
    username: '',
    password: ''
  });

  const handleWebhookSave = () => {
    localStorage.setItem('webhook_url', webhookUrl);
    toast({
      title: "Success",
      description: "Webhook URL saved successfully",
    });
  };

  const handleEmailSave = () => {
    localStorage.setItem('email_settings', JSON.stringify(emailSettings));
    toast({
      title: "Success",
      description: "Email settings saved successfully",
    });
  };

  const integrations = [
    {
      name: 'Zapier',
      description: 'Automate workflows with 5000+ apps',
      icon: Zap,
      status: 'Available',
      color: 'text-orange-600'
    },
    {
      name: 'Stripe',
      description: 'Accept online payments',
      icon: CreditCard,
      status: 'Coming Soon',
      color: 'text-blue-600'
    },
    {
      name: 'QuickBooks',
      description: 'Sync with your accounting software',
      icon: FileText,
      status: 'Coming Soon',
      color: 'text-green-600'
    },
    {
      name: 'Gmail',
      description: 'Send invoices via email',
      icon: Mail,
      status: 'Available',
      color: 'text-red-600'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <LinkIcon className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Integrations</h1>
      </div>

      {/* Available Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <div key={integration.name} className="flex items-center space-x-4 p-4 border rounded-lg">
                <integration.icon className={`h-8 w-8 ${integration.color}`} />
                <div className="flex-1">
                  <h3 className="font-semibold">{integration.name}</h3>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded ${
                    integration.status === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {integration.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="webhook">Webhook URL</Label>
            <div className="flex space-x-2">
              <Input
                id="webhook"
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <Button onClick={handleWebhookSave}>Save</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Connect to Zapier or other webhook services to automate your workflow
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtp-server">SMTP Server</Label>
              <Input
                id="smtp-server"
                placeholder="smtp.gmail.com"
                value={emailSettings.smtpServer}
                onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input
                id="smtp-port"
                placeholder="587"
                value={emailSettings.smtpPort}
                onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email-username">Username</Label>
              <Input
                id="email-username"
                placeholder="your-email@gmail.com"
                value={emailSettings.username}
                onChange={(e) => setEmailSettings({...emailSettings, username: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="email-password">Password</Label>
              <Input
                id="email-password"
                type="password"
                placeholder="Your app password"
                value={emailSettings.password}
                onChange={(e) => setEmailSettings({...emailSettings, password: e.target.value})}
              />
            </div>
          </div>
          <Button onClick={handleEmailSave}>Save Email Settings</Button>
          <p className="text-sm text-muted-foreground">
            Use app-specific passwords for Gmail. These settings are stored locally in your browser.
          </p>
        </CardContent>
      </Card>

      {/* API Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Webhook Events</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <code>invoice.created</code> - Triggered when a new invoice is created</li>
                <li>• <code>invoice.updated</code> - Triggered when an invoice is updated</li>
                <li>• <code>invoice.paid</code> - Triggered when an invoice is marked as paid</li>
                <li>• <code>client.created</code> - Triggered when a new client is added</li>
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Sample Webhook Payload</h4>
              <pre className="text-xs text-muted-foreground">
{`{
  "event": "invoice.created",
  "data": {
    "invoiceNumber": "INV-2024-0001",
    "client": "Client Name",
    "amount": 1000.00,
    "status": "draft"
  }
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsPage;
