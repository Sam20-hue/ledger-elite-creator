
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
import emailjs from '@emailjs/browser';

const EmailService = () => {
  const { toast } = useToast();
  const [emailSettings, setEmailSettings] = useState({
    serviceId: '',
    templateId: '',
    publicKey: '',
    fromEmail: 'samsonakula3@gmail.com',
    fromName: 'Ledger Elite Creator',
    autoReminders: false,
    reminderInterval: 7
  });

  const [reminderEmailOpen, setReminderEmailOpen] = useState(false);
  const [clientEmailOpen, setClientEmailOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
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

    if (!emailSettings.serviceId || !emailSettings.templateId || !emailSettings.publicKey) {
      toast({
        title: "Email Service Not Configured",
        description: "Please configure EmailJS settings first",
        variant: "destructive",
      });
      return;
    }

    try {
      const templateParams = {
        to_email: reminderEmail,
        from_name: emailSettings.fromName,
        from_email: emailSettings.fromEmail,
        subject: 'Payment Reminder',
        message: `Dear Valued Client,
        
This is a friendly reminder that you have an outstanding payment due.

Please process your payment at your earliest convenience.

If you have any questions, please don't hesitate to contact us.

Best regards,
${emailSettings.fromName}
${emailSettings.fromEmail}`
      };

      await emailjs.send(
        emailSettings.serviceId,
        emailSettings.templateId,
        templateParams,
        emailSettings.publicKey
      );
      
      toast({
        title: "Payment Reminder Sent",
        description: `Reminder sent to ${reminderEmail}`,
      });
      
      setReminderEmailOpen(false);
      setReminderEmail('');
    } catch (error) {
      console.error('Email sending error:', error);
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

    if (!emailSettings.serviceId || !emailSettings.templateId || !emailSettings.publicKey) {
      toast({
        title: "Email Service Not Configured",
        description: "Please configure EmailJS settings first",
        variant: "destructive",
      });
      return;
    }

    try {
      const templateParams = {
        to_email: clientEmail,
        from_name: emailSettings.fromName,
        from_email: emailSettings.fromEmail,
        subject: emailSubject,
        message: emailMessage
      };

      await emailjs.send(
        emailSettings.serviceId,
        emailSettings.templateId,
        templateParams,
        emailSettings.publicKey
      );
      
      toast({
        title: "Email Sent Successfully",
        description: `Email sent to ${clientEmail}`,
      });
      
      setClientEmailOpen(false);
      setClientEmail('');
      setEmailSubject('');
      setEmailMessage('');
    } catch (error) {
      console.error('Email sending error:', error);
      toast({
        title: "Email Failed",
        description: "Failed to send email. Please check your settings.",
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
    setSettingsOpen(false);
  };

  React.useEffect(() => {
    const savedSettings = localStorage.getItem('emailSettings');
    if (savedSettings) {
      setEmailSettings(JSON.parse(savedSettings));
    }
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
        <Mail className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
        <h1 className="text-2xl sm:text-3xl font-bold">Email Service</h1>
      </div>

      {/* Email Settings Configuration */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Email Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Configure EmailJS Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>EmailJS Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <Label>Service ID</Label>
                  <Input
                    value={emailSettings.serviceId}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, serviceId: e.target.value }))}
                    placeholder="Your EmailJS Service ID"
                  />
                </div>
                <div>
                  <Label>Template ID</Label>
                  <Input
                    value={emailSettings.templateId}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, templateId: e.target.value }))}
                    placeholder="Your EmailJS Template ID"
                  />
                </div>
                <div>
                  <Label>Public Key</Label>
                  <Input
                    value={emailSettings.publicKey}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, publicKey: e.target.value }))}
                    placeholder="Your EmailJS Public Key"
                  />
                </div>
                <div>
                  <Label>From Email</Label>
                  <Input
                    value={emailSettings.fromEmail}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromEmail: e.target.value }))}
                    placeholder="your-email@example.com"
                  />
                </div>
                <div>
                  <Label>From Name</Label>
                  <Input
                    value={emailSettings.fromName}
                    onChange={(e) => setEmailSettings(prev => ({ ...prev, fromName: e.target.value }))}
                    placeholder="Your Business Name"
                  />
                </div>
                <Button onClick={saveEmailSettings} className="w-full">
                  Save Settings
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
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
              <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
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
                      type="email"
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
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
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
              <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Send Email to Client</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <Label>Client Email</Label>
                    <Input
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@example.com"
                      type="email"
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
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Auto Reminder Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm sm:text-base">Enable Auto Reminders</Label>
            <Switch
              checked={emailSettings.autoReminders}
              onCheckedChange={(checked) => 
                setEmailSettings(prev => ({ ...prev, autoReminders: checked }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Reminder Interval (days)</Label>
            <Select 
              value={emailSettings.reminderInterval.toString()} 
              onValueChange={(value) => 
                setEmailSettings(prev => ({ ...prev, reminderInterval: parseInt(value) }))
              }
            >
              <SelectTrigger className="w-full">
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
