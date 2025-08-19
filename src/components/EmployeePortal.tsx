import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, FileText, Send, CalendarDays, Heart, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';

const EmployeePortal = () => {
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: '',
    urgency: 'normal'
  });

  const employeeName = 'John Doe'; // This would come from auth context

  useEffect(() => {
    const savedRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
    setLeaveRequests(savedRequests);
  }, []);

  const submitLeaveRequest = () => {
    if (!leaveForm.type || !leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newRequest = {
      id: crypto.randomUUID(),
      ...leaveForm,
      employeeName,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      days: Math.ceil((new Date(leaveForm.endDate).getTime() - new Date(leaveForm.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    };

    const updatedRequests = [...leaveRequests, newRequest];
    setLeaveRequests(updatedRequests);
    localStorage.setItem('leaveRequests', JSON.stringify(updatedRequests));

    toast({
      title: "Success",
      description: "Leave request submitted successfully",
    });

    setLeaveForm({
      type: '',
      startDate: '',
      endDate: '',
      reason: '',
      urgency: 'normal'
    });
    setIsLeaveDialogOpen(false);
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: User, active: true },
    { name: 'Leave Requests', icon: CalendarDays },
    { name: 'Time Tracking', icon: Clock },
    { name: 'Health Records', icon: Heart },
    { name: 'Documents', icon: FileText },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="w-64 bg-sidebar border-r border-sidebar-border">
          <SidebarHeader className="p-4 border-b border-sidebar-border">
            <h2 className="text-xl font-bold text-sidebar-foreground">Employee Portal</h2>
            <p className="text-sm text-sidebar-foreground/70">Welcome, {employeeName}</p>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton asChild isActive={item.active}>
                        <button className="flex items-center gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground p-2 rounded w-full text-left">
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <div className="flex-1 flex flex-col">
          <header className="border-b border-border p-4 bg-sidebar">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-sidebar-foreground">Employee Dashboard</h1>
              <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Request Leave
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Leave Request</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Leave Type</Label>
                      <Select value={leaveForm.type} onValueChange={(value) => setLeaveForm(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vacation">Vacation Leave</SelectItem>
                          <SelectItem value="sick">Sick Leave</SelectItem>
                          <SelectItem value="personal">Personal Leave</SelectItem>
                          <SelectItem value="emergency">Emergency Leave</SelectItem>
                          <SelectItem value="maternity">Maternity/Paternity Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={leaveForm.startDate}
                          onChange={(e) => setLeaveForm(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={leaveForm.endDate}
                          onChange={(e) => setLeaveForm(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Urgency Level</Label>
                      <Select value={leaveForm.urgency} onValueChange={(value) => setLeaveForm(prev => ({ ...prev, urgency: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Reason</Label>
                      <Textarea
                        value={leaveForm.reason}
                        onChange={(e) => setLeaveForm(prev => ({ ...prev, reason: e.target.value }))}
                        placeholder="Please provide a reason for your leave request..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={submitLeaveRequest} className="w-full">
                      Submit Request
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <CalendarDays className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Leave Balance</p>
                      <p className="text-2xl font-bold">15 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Hours This Week</p>
                      <p className="text-2xl font-bold">40h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <AlertCircle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Requests</p>
                      <p className="text-2xl font-bold">{leaveRequests.filter(r => r.status === 'pending').length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Heart className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Wellness Score</p>
                      <p className="text-2xl font-bold">85%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leave Requests */}
            <Card>
              <CardHeader>
                <CardTitle>My Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {leaveRequests.length > 0 ? (
                  <div className="space-y-4">
                    {leaveRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="font-medium capitalize">{request.type.replace('_', ' ')} Leave</span>
                            <Badge className={getUrgencyColor(request.urgency)}>
                              {request.urgency}
                            </Badge>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Start Date</p>
                            <p className="font-medium">{new Date(request.startDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">End Date</p>
                            <p className="font-medium">{new Date(request.endDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">{request.days} day{request.days !== 1 ? 's' : ''}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Submitted</p>
                            <p className="font-medium">{new Date(request.submittedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-muted-foreground text-sm">Reason:</p>
                          <p className="text-sm">{request.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No leave requests submitted yet</p>
                    <Button onClick={() => setIsLeaveDialogOpen(true)}>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Your First Request
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default EmployeePortal;