import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, FileText, Download, TrendingUp, DollarSign, Users, Calendar } from 'lucide-react';

const Reports = () => {
  const reports = [
    {
      title: 'Revenue Report',
      description: 'Monthly and yearly revenue analysis',
      icon: DollarSign,
      lastGenerated: '2025-01-20',
      type: 'Financial'
    },
    {
      title: 'Client Analytics',
      description: 'Client engagement and payment patterns',
      icon: Users,
      lastGenerated: '2025-01-19',
      type: 'Client'
    },
    {
      title: 'Invoice Summary',
      description: 'Invoice status and payment tracking',
      icon: FileText,
      lastGenerated: '2025-01-21',
      type: 'Invoice'
    },
    {
      title: 'Performance Dashboard',
      description: 'Key business performance indicators',
      icon: TrendingUp,
      lastGenerated: '2025-01-20',
      type: 'Performance'
    }
  ];

  const quickStats = [
    { label: 'Total Revenue This Month', value: '$45,231', change: '+12.5%', trend: 'up' },
    { label: 'Invoices Sent', value: '342', change: '+8.2%', trend: 'up' },
    { label: 'Payment Success Rate', value: '94.2%', change: '+2.1%', trend: 'up' },
    { label: 'Average Invoice Value', value: '$2,450', change: '-3.5%', trend: 'down' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Business insights and performance metrics</p>
        </div>
        <Button className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardDescription className="text-sm">{stat.label}</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
              <div className={`text-xs flex items-center mt-1 ${
                stat.trend === 'up' ? 'text-success' : 'text-danger'
              }`}>
                <TrendingUp className={`h-3 w-3 mr-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Available Reports
          </CardTitle>
          <CardDescription>
            Generate and download detailed business reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <report.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-muted rounded-full">
                    {report.type}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Last: {report.lastGenerated}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm">
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Monthly revenue over the past year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Revenue chart will be displayed here</p>
              <p className="text-sm text-muted-foreground">Connect your data source to view charts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;