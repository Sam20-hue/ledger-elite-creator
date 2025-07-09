
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, CreditCard, BarChart3, Clock, Shield, Package, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Home = () => {
  const { isLoggedIn, userRole } = useAuth();

  const systemUpdates = [
    {
      date: '2025-01-08',
      title: 'Enhanced Dark Mode Support',
      description: 'Improved visibility and contrast in dark mode across all components including tables and forms.',
      type: 'UI/UX'
    },
    {
      date: '2025-01-07',
      title: 'Inventory Management System',
      description: 'Added comprehensive inventory management with stock tracking, goods addition, and release functionality.',
      type: 'Feature'
    },
    {
      date: '2025-01-06',
      title: 'Excel Export Functionality',
      description: 'Implemented Excel export for all transaction details with proper totaling and structured formatting.',
      type: 'Feature'
    },
    {
      date: '2025-01-05',
      title: 'Cross-Device User Access',
      description: 'Enhanced user authentication to work seamlessly across multiple devices and platforms.',
      type: 'Security'
    },
    {
      date: '2025-01-04',
      title: 'Table Column Optimization',
      description: 'Reduced table column sizes for better mobile responsiveness and improved readability.',
      type: 'UI/UX'
    },
    {
      date: '2025-01-03',
      title: 'Password Security Enhancement',
      description: 'Added password strength validation and automatic 24-hour logout for non-admin users.',
      type: 'Security'
    }
  ];

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to <span className="text-primary">Numera</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your comprehensive invoice and business management solution
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="px-8 py-3">
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {/* System Updates */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <Bell className="h-6 w-6 text-primary mr-3" />
              <h2 className="text-2xl font-bold text-foreground">Latest System Updates</h2>
            </div>
            
            <div className="space-y-4">
              {systemUpdates.map((update, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <CardTitle className="text-lg">{update.title}</CardTitle>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            update.type === 'Feature' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                            update.type === 'Security' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                            'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                          }`}>
                            {update.type}
                          </span>
                        </div>
                        <CardDescription className="text-muted-foreground mb-2">
                          {update.description}
                        </CardDescription>
                        <p className="text-sm text-muted-foreground">{update.date}</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <Link to="/login">
              <Button size="lg" className="px-8 py-3">
                Get Started
              </Button>
            </Link>
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
              <Package className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>
                Track your goods, manage stock levels, and monitor inventory movements with ease.
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
      </div>
    </div>
  );
};

export default Home;
