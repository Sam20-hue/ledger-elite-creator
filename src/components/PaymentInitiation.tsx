
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock, CreditCard } from 'lucide-react';

const PaymentInitiation = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const authenticate = () => {
    // Finance manager security password
    if (password === 'finance2024secure' && userRole === 'admin') {
      setIsAuthenticated(true);
      toast({
        title: "Authentication Successful",
        description: "Access granted to payment initiation",
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid credentials or insufficient permissions",
        variant: "destructive",
      });
    }
  };

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
      initiatedBy: 'Finance Manager',
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    const existingPayments = JSON.parse(localStorage.getItem('initiatedPayments') || '[]');
    existingPayments.push(paymentRecord);
    localStorage.setItem('initiatedPayments', JSON.stringify(existingPayments));

    toast({
      title: "Payment Initiated",
      description: `Payment of $${amount} to ${recipient} has been initiated`,
    });

    // Reset form
    setAmount('');
    setRecipient('');
    setPaymentMethod('');
  };

  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
            <p className="text-muted-foreground">
              This section is only accessible to Finance Managers
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Finance Manager Authentication</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Security Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter finance manager password"
              />
            </div>
            <Button onClick={authenticate} className="w-full">
              Authenticate
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Demo password: finance2024secure
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <CreditCard className="h-8 w-8 text-green-600" />
        <h1 className="text-3xl font-bold">Payment Initiation</h1>
      </div>

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
    </div>
  );
};

export default PaymentInitiation;
