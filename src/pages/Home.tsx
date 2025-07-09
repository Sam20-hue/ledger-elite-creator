
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, CreditCard, BarChart3, Clock, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Home = () => {
  const { isLoggedIn, userRole } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Welcome to <span className="text-primary">Numera</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            The ultimate invoice management system designed to streamline your business operations. 
            Create professional invoices, manage clients, track payments, and grow your business with ease.
          </p>
          <div className="flex gap-4 justify-center">
            {!isLoggedIn && (
              <Link to="/login">
                <Button size="lg" className="px-8 py-3">
                  Get Started
                </Button>
              </Link>
            )}
            {!isLoggedIn && (
              <Link to="/invoices">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  View Demo
                </Button>
              </Link>
            )}
            {isLoggedIn && (
              <Link to="/dashboard">
                <Button size="lg" className="px-8 py-3">
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Professional Invoices</CardTitle>
              <CardDescription>
                Create stunning, professional invoices with customizable templates and your company branding.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Client Management</CardTitle>
              <CardDescription>
                Organize and manage all your clients in one place with detailed contact information and history.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CreditCard className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Payment Tracking</CardTitle>
              <CardDescription>
                Track payments, monitor overdue invoices, and maintain healthy cash flow for your business.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Get insights into your business performance with comprehensive analytics and reporting.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Time Saving</CardTitle>
              <CardDescription>
                Automate repetitive tasks and save hours of manual work with our intelligent features.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 text-indigo-600 mb-4" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Your data is protected with enterprise-grade security and reliable cloud infrastructure.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Call to Action */}
        {!isLoggedIn && (
          <div className="bg-card rounded-lg shadow-xl p-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of businesses already using Numera to streamline their invoice management 
              and accelerate their growth.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
