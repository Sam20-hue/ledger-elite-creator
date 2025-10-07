import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Auth: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === 'SIGNED_IN') {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login for:', loginEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      console.log('Login response:', { data, error });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          // Attempt to resend verification email automatically
          const redirectTo = window.location.hostname === 'localhost'
            ? 'http://localhost:3000/'
            : `${window.location.origin}/`;
          const { error: resendError } = await supabase.auth.resend({
            type: 'signup',
            email: loginEmail,
            options: { emailRedirectTo: redirectTo }
          });

          if (resendError) {
            console.error('Resend verification failed:', resendError);
            toast({
              title: 'Email Not Verified',
              description: 'We tried to resend the verification email but encountered an issue. Please try again or contact support.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Verify Your Email',
              description: 'We just sent you a new verification link. Please check your inbox (and spam).',
            });
          }
        } else if (error.message.includes('Invalid login credentials')) {
          toast({
            title: 'Login Failed', 
            description: 'Invalid email or password. If you just signed up, verify your email first.',
            variant: 'destructive',
          });
        } else {
          throw error;
        }
        return;
      }

      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Email Not Verified",
          description: "Please check your email and click the verification link before logging in.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Logged in successfully!",
      });

      // Navigation will be handled by the auth state change listener
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!loginEmail) {
      toast({
        title: 'Enter your email',
        description: 'Please enter your email above, then click resend.',
        variant: 'destructive',
      });
      return;
    }
    const redirectTo = window.location.hostname === 'localhost'
      ? 'http://localhost:3000/'
      : `${window.location.origin}/`;
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: loginEmail,
        options: { emailRedirectTo: redirectTo },
      });
      if (error) throw error;
      toast({
        title: 'Verification Sent',
        description: 'A new verification email has been sent. Check your inbox and spam folder.',
      });
    } catch (err: any) {
      console.error('Resend verification error:', err);
      toast({
        title: 'Could not resend',
        description: err.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!loginEmail) {
      toast({
        title: 'Enter your email',
        description: 'Please enter your email above to reset your password.',
        variant: 'destructive',
      });
      return;
    }
    const redirectTo = window.location.hostname === 'localhost'
      ? 'http://localhost:3000/'
      : `${window.location.origin}/`;
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, {
        redirectTo,
      });
      if (error) throw error;
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your email for a link to reset your password.',
      });
    } catch (err: any) {
      console.error('Password reset error:', err);
      toast({
        title: 'Could not send reset email',
        description: err.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Numera</CardTitle>
          <CardDescription>
            Access your business management platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
            
            <div className="flex flex-col gap-2 mt-2">
              <div className="text-xs text-muted-foreground text-center">
                Forgot your password?
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={handleForgotPassword}
                  className="px-1"
                >
                  Reset password
                </Button>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Didn't receive the email?
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={resendVerification}
                  className="px-1"
                >
                  Resend verification
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
