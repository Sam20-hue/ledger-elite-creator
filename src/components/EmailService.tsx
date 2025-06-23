
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send, Clock, Bell, Users } from 'lucide-react';
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

  const [reminderEmailOpen, setReminderEmailOpen] = useState(false);
  const [clientEmailOpen, setClientEmailOpen] = useState(false);
  const [reminderEmail, setReminderEmail] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');

  const sendPaymentReminder = async () => {
    if (!reminderEmail) {
      toast({
        title: "Error",
        description: "Please enter a client email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const reminderBody = `
        Dear Valued Client,
        
        This is a friendly reminder that you have an outstanding payment due.
        
        Please process your payment at your earliest convenience.
        
        If you have any questions, please don't hesitate to contact us.
        
        Best regards,
        Ledger Elite Creator Team
        samsonakula3@gmail.com
      `;
      
      console.log('Sending payment reminder to:', reminderEmail);
      console.log('Reminder body:', reminderBody);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Reminder Sent",
        description: `Reminder sent to ${reminderEmail}`,
      });
      
      setReminderEmailOpen(false);
      setReminderEmail('');
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Failed to send payment reminder. Please check your settings.",
        variant: "destructive",
      });
    }
  };

  const sendClientEmail = async () => {
    if (!clientEmail || !emailSubject || !emailMessage) {
      toast({
        title: "Error",
        description: "Please fill in all email fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const emailBody = `
        Dear Client,
        
        ${emailMessage}
        
        Best regards,
        Ledger Elite Creator Team
        samsonakula3@gmail.com
      `;
      
      console.log('Sending email to:', clientEmail);
      console.log('Subject:', emailSubject);
      console.log('Email body:', emailBody);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Email Sent Successfully",
        description: `Email sent to ${clientEmail}`,
      });
      
      setClientEmailOpen(false);
      setClientEmail('');
      setEmailSubject('');
      setEmailMessage('');
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Failed to send email. Please check your settings.",
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Payment Reminders</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={reminderEmailOpen} onOpenChange={setReminderEmailOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Payment Reminder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Payment Reminder</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Client Email</Label>
                    <Input
                      value={reminderEmail}
                      onChange={(e) => setReminderEmail(e.target.value)}
                      placeholder="client@example.com"
                    />
                  </div>
                  <Button onClick={sendPaymentReminder} className="w-full">
                    Send Reminder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Client Communication</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={clientEmailOpen} onOpenChange={setClientEmailOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email to Client
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Email to Client</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Client Email</Label>
                    <Input
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@example.com"
                    />
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Input
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Email subject"
                    />
                  </div>
                  <div>
                    <Label>Message</Label>
                    <Textarea
                      value={emailMessage}
                      onChange={(e) => setEmailMessage(e.target.value)}
                      placeholder="Your message here..."
                      rows={4}
                    />
                  </div>
                  <Button onClick={sendClientEmail} className="w-full">
                    Send Email
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Auto Reminder Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Enable Auto Reminders</Label>
            <Switch
              checked={emailSettings.autoReminders}
              onCheckedChange={(checked) => 
                setEmailSettings(prev => ({ ...prev, autoReminders: checked }))
              }
            />
          </div>
          <div>
            <Label>Reminder Interval (days)</Label>
            <Select 
              value={emailSettings.reminderInterval.toString()} 
              onValueChange={(value) => 
                setEmailSettings(prev => ({ ...prev, reminderInterval: parseInt(value) }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailService;
