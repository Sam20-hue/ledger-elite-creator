import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, CheckCircle, Circle, ExternalLink, Settings } from 'lucide-react';

const Integrations = () => {
  const integrations = [
    {
      name: 'PayPal',
      description: 'Accept payments through PayPal for your invoices',
      icon: '💳',
      connected: true,
      category: 'Payment',
      status: 'Active'
    },
    {
      name: 'Stripe',
      description: 'Process credit card payments securely',
      icon: '🔒',
      connected: true,
      category: 'Payment',
      status: 'Active'
    },
    {
      name: 'QuickBooks',
      description: 'Sync your financial data with QuickBooks',
      icon: '📊',
      connected: false,
      category: 'Accounting',
      status: 'Available'
    },
    {
      name: 'Slack',
      description: 'Get notifications in your Slack workspace',
      icon: '💬',
      connected: true,
      category: 'Communication',
      status: 'Active'
    },
    {
      name: 'Google Drive',
      description: 'Store and backup your documents',
      icon: '☁️',
      connected: false,
      category: 'Storage',
      status: 'Available'
    },
    {
      name: 'Mailchimp',
      description: 'Sync client data for email marketing',
      icon: '📧',
      connected: false,
      category: 'Marketing',
      status: 'Available'
    }
  ];

  const categories = ['All', 'Payment', 'Accounting', 'Communication', 'Storage', 'Marketing'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground">Connect your favorite tools and services</p>
        </div>
        <Button className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          View API Keys
        </Button>
      </div>

      {/* Integration Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Integrations</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter(i => i.connected).length}
            </div>
            <p className="text-xs text-muted-foreground">
              of {integrations.length} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Gateways</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {integrations.filter(i => i.category === 'Payment' && i.connected).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Connected payment methods
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
            <Shield className="h-4 w-4 text-accent-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button key={category} variant="outline" size="sm">
            {category}
          </Button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <span className="px-2 py-1 text-xs rounded-full bg-muted">
                      {integration.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {integration.connected ? (
                    <CheckCircle className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <CardDescription className="text-sm">
                {integration.description}
              </CardDescription>
              
              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  integration.status === 'Active' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {integration.status}
                </span>
                
                <div className="flex gap-2">
                  {integration.connected ? (
                    <>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button size="sm">
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Integration Help */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help with Integrations?</CardTitle>
          <CardDescription>
            Find guides and documentation for setting up your integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <ExternalLink className="h-4 w-4 mr-2" />
              Integration Documentation
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="h-4 w-4 mr-2" />
              API Reference
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Webhook Setup
            </Button>
            <Button variant="outline" className="justify-start">
              <Zap className="h-4 w-4 mr-2" />
              Troubleshooting Guide
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Integrations;