import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, AlertCircle, Plus, CheckCircle } from 'lucide-react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRealtimePresence } from '@/hooks/useRealtimePresence';

interface LeaveRequest {
  id: string;
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  urgency: string;
  created_at: string;
}

const SupabaseEmployeePortal: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const { onlineUsers } = useRealtimePresence('/hr');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [urgency, setUrgency] = useState('normal');

  useEffect(() => {
    if (user) {
      loadLeaveRequests();
    }
  }, [user]);

  const loadLeaveRequests = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('leave_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading leave requests:', error);
    } else {
      setLeaveRequests(data || []);
    }
  };

  const submitLeaveRequest = async () => {
    if (!user) return;

    if (!leaveType || !startDate || !endDate || !reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast({
        title: "Error", 
        description: "Start date cannot be after end date",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('leave_requests')
      .insert({
        user_id: user.id,
        type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason,
        urgency,
        status: 'pending',
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit leave request",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      });
      
      // Reset form
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');
      setUrgency('normal');
      setIsDialogOpen(false);
      
      // Reload requests
      loadLeaveRequests();
    }

    setLoading(false);
  };

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
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
  };

  if (!user) {
    return <div>Please log in to access the employee portal.</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Employee Portal</h1>
          <p className="text-muted-foreground">Manage your leave requests and view your dashboard</p>
        </div>
        
        {onlineUsers.length > 0 && (
          <Badge variant="secondary" className="animate-pulse">
            {onlineUsers.length} HR staff online
          </Badge>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Leave Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="leave-type">Leave Type</Label>
                <Select value={leaveType} onValueChange={setLeaveType}>
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
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={urgency} onValueChange={setUrgency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reason">Reason for Leave</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide details about your leave request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <Button 
                onClick={submitLeaveRequest} 
                className="w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22 days</div>
            <p className="text-xs text-muted-foreground">Remaining this year</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38.5h</div>
            <p className="text-xs text-muted-foreground">Out of 40h target</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveRequests.filter(r => r.status === 'pending').length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wellness Score</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5/10</div>
            <p className="text-xs text-muted-foreground">Based on activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests */}
      <Card>
        <CardHeader>
          <CardTitle>My Leave Requests</CardTitle>
          <CardDescription>Track your submitted leave requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaveRequests.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No leave requests yet</h3>
                <p className="text-muted-foreground mb-4">Submit your first leave request to get started</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            ) : (
              leaveRequests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold capitalize">{request.type.replace(/([A-Z])/g, ' $1').trim()}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Duration: {calculateDuration(request.start_date, request.end_date)} day(s)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <Badge className={getUrgencyColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm">Reason:</h4>
                    <p className="text-sm text-muted-foreground">{request.reason}</p>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Submitted: {new Date(request.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseEmployeePortal;