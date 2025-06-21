
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

const EmailService = () => {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'samsonakula3@gmail.com',
    smtpPassword: '',
    fromEmail: 'samsonakula3@gmail.com',
    fromName: 'Ledger Elite Creator',
    autoReminders: false,
    reminderInterval: 7
  });

  const [testEmailOpen, setTestEmailOpen] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Error",
        description: "Please enter a test email address",
        variant: "destructive",
      });
      return;
    }

    if (!mpesaNumber && !bankAccount) {
      toast({
        title: "Error",
        description: "Please provide either M-Pesa number or bank account before sending",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate actual email sending with company details
      const emailBody = `
        Dear Customer,
        
        Please find your payment details below:
        
        ${mpesaNumber ? `M-Pesa Number: ${mpesaNumber}` : ''}
        ${bankAccount ? `Bank Account: ${bankAccount}` : ''}
        
        Best regards,
        Ledger Elite Creator Team
        samsonakula3@gmail.com
      `;
      
      // In production, this would use actual SMTP
      console.log('Sending email to:', testEmail);
      console.log('Email body:', emailBody);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Email Sent Successfully",
        description: `Test email sent to ${testEmail} with payment details`,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Mail className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Email Service</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Details Required</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>M-Pesa Number</Label>
              <Input
                value={mpesaNumber}
                onChange={(e) => setMpesaNumber(e.target.value)}
                placeholder="254712345678"
              />
            </div>
            <div>
              <Label>Bank Account Number</Label>
              <Input
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="1234567890"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Dialog open={testEmailOpen} onOpenChange={setTestEmailOpen}>
            <DialogTrigger asChild>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send Test Email/Prompt
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Payment Prompt</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Recipient Email</Label>
                  <Input
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    placeholder="client@example.com"
                  />
                </div>
                <Button onClick={sendTestEmail} className="w-full">
                  Send Payment Prompt
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailService;
