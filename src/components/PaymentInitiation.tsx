
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Shield, CreditCard, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TwoStepVerification from './TwoStepVerification';

const PaymentInitiation = () => {
  const { userRole, currentUser } = useAuth();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);
  const [promptEmail, setPromptEmail] = useState('');

  const initiatePayment = () => {
    if (!amount || !recipient || !paymentMethod) {
      toast({
        title: "Error",
        description: "Please fill in all payment details",
        variant: "destructive",
      });
      return;
    }

    // Log payment for audit trail
    const paymentRecord = {
      id: crypto.randomUUID(),
      amount: parseFloat(amount),
      recipient,
      paymentMethod,
      initiatedBy: currentUser || 'Finance Manager',
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    const existingPayments = JSON.parse(localStorage.getItem('initiatedPayments') || '[]');
    existingPayments.push(paymentRecord);
    localStorage.setItem('initiatedPayments', JSON.stringify(existingPayments));

    // Update bank account balance
    const bankAccounts = JSON.parse(localStorage.getItem('bankAccounts') || '[]');
    if (bankAccounts.length > 0) {
      bankAccounts[0].balance -= parseFloat(amount);
      localStorage.setItem('bankAccounts', JSON.stringify(bankAccounts));
    }

    toast({
      title: "Payment Initiated",
      description: `Payment of $${amount} to ${recipient} has been initiated`,
    });

    // Reset form
    setAmount('');
    setRecipient('');
    setPaymentMethod('');
  };

  const sendPaymentPrompt = async () => {
    if (!promptEmail) {
      toast({
        title: "Error",
        description: "Please enter a client email address",
        variant: "destructive",
      });
      return;
    }

    if (!mpesaNumber && !bankAccount) {
      toast({
        title: "Error",
        description: "Please provide either M-Pesa number or bank account before sending prompt",
        variant: "destructive",
      });
      return;
    }

    try {
      const promptBody = `
        Dear Customer,
        
        Please find your payment details below:
        
        ${mpesaNumber ? `M-Pesa Number: ${mpesaNumber}` : ''}
        ${bankAccount ? `Bank Account: ${bankAccount}` : ''}
        
        Please process your payment using the above details.
        
        Best regards,
        Ledger Elite Creator Team
        samsonakula3@gmail.com
      `;
      
      console.log('Sending payment prompt to:', promptEmail);
      console.log('Prompt body:', promptBody);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Prompt Sent",
        description: `Payment prompt sent to ${promptEmail}`,
      });
      
      setPromptDialogOpen(false);
      setPromptEmail('');
    } catch (error) {
      toast({
        title: "Prompt Failed",
        description: "Failed to send payment prompt. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Only finance users and admins can access this page
  if (userRole !== 'finance' && userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              This section is only accessible to Finance Managers and Administrators
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Two-step verification for finance users
  if (userRole === 'finance' && !isAuthenticated) {
    return (
      <TwoStepVerification 
        onVerificationSuccess={() => setIsAuthenticated(true)}
        userEmail={currentUser || ''}
      />
    );
  }

  // Admin bypass (no additional authentication needed)
  if (userRole === 'admin' && !isAuthenticated) {
    setIsAuthenticated(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <CreditCard className="h-8 w-8 text-green-600" />
        <h1 className="text-3xl font-bold">Payment Initiation</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Secure Payment Portal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label>Recipient</Label>
                <Input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Recipient name or account"
                />
              </div>
              <div>
                <Label>Payment Method</Label>
                <Input
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  placeholder="Bank transfer, M-Pesa, etc."
                />
              </div>
            </div>
            <Button onClick={initiatePayment} className="w-full">
              Initiate Payment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Prompt</CardTitle>
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
            
            <Dialog open={promptDialogOpen} onOpenChange={setPromptDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Payment Prompt
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Payment Prompt</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Client Email</Label>
                    <Input
                      value={promptEmail}
                      onChange={(e) => setPromptEmail(e.target.value)}
                      placeholder="client@example.com"
                    />
                  </div>
                  <Button onClick={sendPaymentPrompt} className="w-full">
                    Send Prompt
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentInitiation;
