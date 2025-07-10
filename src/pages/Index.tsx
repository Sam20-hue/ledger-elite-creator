
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, BarChart3, Building2 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-foreground">
            Welcome to <span className="text-primary">Numera</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional Invoice Management System - Streamline your business operations with powerful invoicing, client management, and financial reporting tools.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="px-8">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <FileText className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Invoice Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create, manage, and track invoices with professional templates and automated workflows.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Client Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Organize client information, track payment history, and maintain professional relationships.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate comprehensive financial reports and track your business performance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Building2 className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Business Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Complete business solution with inventory, payments, and company settings.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Transform Your Business?</h2>
          <p className="text-muted-foreground mb-6">Join thousands of businesses using Numera for their invoice management needs.</p>
          <Link to="/login">
            <Button size="lg" className="px-12">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
