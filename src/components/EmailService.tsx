
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, Clock, Settings, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'invoice' | 'reminder' | 'thank_you';
}

interface EmailSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  autoReminders: boolean;
  reminderInterval: number;
}

const EmailService = () => {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'samsonakula3@gmail.com',
    fromName: 'Numera Invoicing',
    autoReminders: false,
    reminderInterval: 7
  });

  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: '1',
      name: 'Invoice Template',
      subject: 'Invoice {INVOICE_NUMBER} - Payment Due',
      body: `Dear {CLIENT_NAME},

I hope this email finds you well.

Please find attached invoice {INVOICE_NUMBER} for the amount of {CURRENCY}{TOTAL_AMOUNT}, which is due on {DUE_DATE}.

Payment Details:
- Invoice Number: {INVOICE_NUMBER}
- Amount Due: {CURRENCY}{TOTAL_AMOUNT}
- Due Date: {DUE_DATE}

Payment Methods:
- Bank Transfer: Account Number {BANK_ACCOUNT}
- M-Pesa: {MPESA_NUMBER}

Please let us know if you have any questions regarding this invoice.

Thank you for your business!

Best regards,
{COMPANY_NAME}
{COMPANY_EMAIL}
{COMPANY_PHONE}`,
      type: 'invoice'
    },
    {
      id: '2',
      name: 'Payment Reminder',
      subject: 'Payment Reminder - Invoice {INVOICE_NUMBER}',
      body: `Dear {CLIENT_NAME},

This is a friendly reminder that invoice {INVOICE_NUMBER} for {CURRENCY}{TOTAL_AMOUNT} is now {DAYS_OVERDUE} days overdue.

Original Due Date: {DUE_DATE}
Current Amount Due: {CURRENCY}{TOTAL_AMOUNT}

Please arrange payment at your earliest convenience. If you have already made payment, please disregard this reminder.

Payment Methods:
- Bank Transfer: Account Number {BANK_ACCOUNT}
- M-Pesa: {MPESA_NUMBER}

If you have any questions or concerns, please don't hesitate to contact us.

Best regards,
{COMPANY_NAME}
{COMPANY_EMAIL}
{COMPANY_PHONE}`,
      type: 'reminder'
    },
    {
      id: '3',
      name: 'Payment Received',
      subject: 'Payment Received - Invoice {INVOICE_NUMBER}',
      body: `Dear {CLIENT_NAME},

Thank you for your payment!

We have successfully received your payment of {CURRENCY}{TOTAL_AMOUNT} for invoice {INVOICE_NUMBER}.

Payment Details:
- Invoice Number: {INVOICE_NUMBER}
- Amount Paid: {CURRENCY}{TOTAL_AMOUNT}
- Payment Date: {PAYMENT_DATE}

We appreciate your prompt payment and look forward to continuing our business relationship.

Best regards,
{COMPANY_NAME}
{COMPANY_EMAIL}
{COMPANY_PHONE}`,
      type: 'thank_you'
    }
  ]);

  const [testEmailOpen, setTestEmailOpen] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('1');

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Error",
        description: "Please enter a test email address",
        variant: "destructive",
      });
      return;
    }

    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;

    // Simulate sending email
    try {
      // In a real implementation, this would connect to your email service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Test Email Sent",
        description: `Test email sent successfully to ${testEmail}`,
      });
      
      setTestEmailOpen(false);
      setTestEmail('');
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Failed to send test email. Please check your settings.",
        variant: "destructive",
      });
    }
  };

  const saveEmailSettings = () => {
    localStorage.setItem('emailSettings', JSON.stringify(emailSettings));
    toast({
      title: "Settings Saved",
      description: "Email settings have been saved successfully",
    });
  };

  const saveTemplate = (template: EmailTemplate) => {
    setTemplates(prev => prev.map(t => t.id === template.id ? template : t));
    localStorage.setItem('emailTemplates', JSON.stringify(templates));
    toast({
      title: "Template Saved",
      description: "Email template has been saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Mail className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Email Service</h1>
      </div>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Email Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>From Email *</Label>
              <Input
                value={emailSettings.fromEmail}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                placeholder="samsonakula3@gmail.com"
              />
            </div>
            <div>
              <Label>From Name</Label>
              <Input
                value={emailSettings.fromName}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                placeholder="Numera Invoicing"
              />
            </div>
            <div>
              <Label>SMTP Host</Label>
              <Input
                value={emailSettings.smtpHost}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div>
              <Label>SMTP Port</Label>
              <Input
                value={emailSettings.smtpPort}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                placeholder="587"
              />
            </div>
            <div>
              <Label>SMTP Username</Label>
              <Input
                value={emailSettings.smtpUsername}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUsername: e.target.value }))}
                placeholder="your-email@gmail.com"
              />
            </div>
            <div>
              <Label>SMTP Password</Label>
              <Input
                type="password"
                value={emailSettings.smtpPassword}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPassword: e.target.value }))}
                placeholder="your-app-password"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <Label htmlFor="auto-reminders">Auto Payment Reminders</Label>
            </div>
            <Switch
              id="auto-reminders"
              checked={emailSettings.autoReminders}
              onCheckedChange={(checked) => setEmailSettings(prev => ({ ...prev, autoReminders: checked }))}
            />
          </div>

          {emailSettings.autoReminders && (
            <div>
              <Label>Reminder Interval (days)</Label>
              <Input
                type="number"
                value={emailSettings.reminderInterval}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, reminderInterval: parseInt(e.target.value) }))}
                placeholder="7"
              />
            </div>
          )}

          <div className="flex space-x-2">
            <Button onClick={saveEmailSettings}>
              Save Settings
            </Button>
            <Dialog open={testEmailOpen} onOpenChange={setTestEmailOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Test Email
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Test Email</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Test Email Address</Label>
                    <Input
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="test@example.com"
                    />
                  </div>
                  <div>
                    <Label>Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={sendTestEmail} className="w-full">
                    Send Test Email
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {templates.map(template => (
              <Card key={template.id} className="border">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Subject</Label>
                    <Input
                      value={template.subject}
                      onChange={(e) => {
                        const updatedTemplate = { ...template, subject: e.target.value };
                        setTemplates(prev => prev.map(t => t.id === template.id ? updatedTemplate : t));
                      }}
                    />
                  </div>
                  <div>
                    <Label>Body</Label>
                    <Textarea
                      value={template.body}
                      onChange={(e) => {
                        const updatedTemplate = { ...template, body: e.target.value };
                        setTemplates(prev => prev.map(t => t.id === template.id ? updatedTemplate : t));
                      }}
                      rows={10}
                    />
                  </div>
                  <Button onClick={() => saveTemplate(template)}>
                    Save Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Variables */}
      <Card>
        <CardHeader>
          <CardTitle>Available Template Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
            <code>{'{CLIENT_NAME}'}</code>
            <code>{'{INVOICE_NUMBER}'}</code>
            <code>{'{TOTAL_AMOUNT}'}</code>
            <code>{'{CURRENCY}'}</code>
            <code>{'{DUE_DATE}'}</code>
            <code>{'{DAYS_OVERDUE}'}</code>
            <code>{'{COMPANY_NAME}'}</code>
            <code>{'{COMPANY_EMAIL}'}</code>
            <code>{'{COMPANY_PHONE}'}</code>
            <code>{'{BANK_ACCOUNT}'}</code>
            <code>{'{MPESA_NUMBER}'}</code>
            <code>{'{PAYMENT_DATE}'}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailService;
