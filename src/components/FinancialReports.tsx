
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import FinancialExports from './FinancialExports';

const FinancialReports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <BarChart3 className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold">Financial Reports</h1>
      </div>

      <FinancialExports />

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Advanced financial reporting features including charts, trends analysis, 
            and detailed profit & loss statements will be available in future updates.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReports;
