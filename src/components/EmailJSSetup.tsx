
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail, Settings, CheckCircle } from 'lucide-react';

const EmailJSSetup = () => {
  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-2">
        <Mail className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">EmailJS Setup Guide</h1>
      </div>

      <Alert>
        <Settings className="h-4 w-4" />
        <AlertDescription>
          Follow these steps to enable real email sending with your Gmail account through EmailJS.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
              <span>Create EmailJS Account</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>Sign up for a free EmailJS account:</p>
            <Button asChild variant="outline">
              <a href="https://emailjs.com" target="_blank" rel="noopener noreferrer">
                Go to EmailJS <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
              <span>Connect Gmail Service</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to EmailJS Dashboard → Email Services</li>
              <li>Click "Add New Service"</li>
              <li>Select "Gmail"</li>
              <li>Authorize with your Gmail account</li>
              <li>Copy the <strong>Service ID</strong></li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
              <span>Create Email Template</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to Email Templates → Create New Template</li>
              <li>Use this template content:</li>
            </ol>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono">
              <div><strong>Subject:</strong> {'{{subject}}'}</div>
              <div><strong>To:</strong> {'{{to_email}}'}</div>
              <div><strong>From:</strong> {'{{from_name}} <{{from_email}}>'}</div>
              <div><strong>Message:</strong> {'{{message}}'}</div>
            </div>
            <p className="text-sm">Copy the <strong>Template ID</strong> after saving.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
              <span>Get Public Key</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to Account → API Keys</li>
              <li>Copy your <strong>Public Key</strong></li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
              <span>Configure in App</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>Now go to the Email Service page and enter your:</p>
            <ul className="list-disc list-inside space-y-1 text-sm ml-4">
              <li>Service ID</li>
              <li>Template ID</li>
              <li>Public Key</li>
              <li>Your Gmail address</li>
              <li>Your name/business name</li>
            </ul>
            <div className="flex items-center space-x-2 text-green-600 mt-4">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">You'll then be able to send real emails!</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <Mail className="h-4 w-4" />
        <AlertDescription>
          <strong>Free Tier:</strong> EmailJS allows 200 emails per month for free. 
          For higher volumes, check their pricing plans.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EmailJSSetup;
