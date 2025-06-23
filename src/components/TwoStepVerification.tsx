
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Mail, Lock } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

interface TwoStepVerificationProps {
  onVerificationSuccess: () => void;
  userEmail: string;
}

const TwoStepVerification: React.FC<TwoStepVerificationProps> = ({ onVerificationSuccess, userEmail }) => {
  const [step, setStep] = useState<'password' | 'otp'>('password');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const verifyPassword = async () => {
    if (password !== 'finance2024secure') {
      toast({
        title: "Authentication Failed",
        description: "Invalid finance manager password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Generate 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    
    // Simulate sending email
    try {
      console.log(`Sending OTP ${newOtp} to ${userEmail}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "OTP Sent",
        description: `Verification code sent to ${userEmail}`,
      });
      
      setStep('otp');
    } catch (error) {
      toast({
        title: "Failed to Send OTP",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      toast({
        title: "Verification Successful",
        description: "Access granted to Payment Initiation",
      });
      onVerificationSuccess();
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please check the code and try again",
        variant: "destructive",
      });
    }
  };

  if (step === 'password') {
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
            <Button onClick={verifyPassword} className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending OTP...' : 'Continue'}
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
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Two-Step Verification</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-green-600" />
            <p className="text-sm text-muted-foreground mb-4">
              Enter the 6-digit code sent to {userEmail}
            </p>
          </div>
          <div className="flex justify-center">
            <InputOTP value={otp} onChange={setOtp} maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button onClick={verifyOtp} className="w-full" disabled={otp.length !== 6}>
            Verify & Access
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => setStep('password')}
          >
            Back
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Demo OTP: {generatedOtp}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TwoStepVerification;
