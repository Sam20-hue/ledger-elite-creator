import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp,
  FileText,
  UserCheck,
  Coffee,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Search
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const HRManagement = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [timeTracking, setTimeTracking] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    position: '',
    department: '',
    salary: '',
    startDate: '',
    status: 'active'
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'normal',
    type: 'general'
  });
  
  const { toast } = useToast();

  const departments = [
    'Administration', 'Finance', 'Human Resources', 'IT', 'Marketing', 
    'Sales', 'Operations', 'Customer Service', 'Legal', 'Research & Development'
  ];

  const leaveTypes = ['Annual Leave', 'Sick Leave', 'Emergency Leave', 'Maternity/Paternity Leave', 'Study Leave'];

  useEffect(() => {
    loadEmployees();
    loadLeaveRequests();
    loadTimeTracking();
    loadAnnouncements();
  }, []);

  const loadEmployees = () => {
    const storedEmployees = JSON.parse(localStorage.getItem('hrEmployees') || '[]');
    setEmployees(storedEmployees);
  };

  const loadLeaveRequests = () => {
    const storedRequests = JSON.parse(localStorage.getItem('hrLeaveRequests') || '[]');
    setLeaveRequests(storedRequests);
  };

  const loadTimeTracking = () => {
    const storedTracking = JSON.parse(localStorage.getItem('hrTimeTracking') || '[]');
    setTimeTracking(storedTracking);
  };

  const loadAnnouncements = () => {
    const storedAnnouncements = JSON.parse(localStorage.getItem('hrAnnouncements') || '[]');
    setAnnouncements(storedAnnouncements);
  };

  const saveEmployee = () => {
    if (!employeeForm.name || !employeeForm.email || !employeeForm.position) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newEmployee = {
      id: editingEmployee?.id || crypto.randomUUID(),
      ...employeeForm,
      createdAt: editingEmployee?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedEmployees;
    if (editingEmployee) {
      updatedEmployees = employees.map(emp => emp.id === editingEmployee.id ? newEmployee : emp);
    } else {
      if (employees.find(e => e.email === employeeForm.email)) {
        toast({
          title: "Error",
          description: "An employee with this email already exists",
          variant: "destructive",
        });
        return;
      }
      updatedEmployees = [...employees, newEmployee];
    }

    setEmployees(updatedEmployees);
    localStorage.setItem('hrEmployees', JSON.stringify(updatedEmployees));

    toast({
      title: "Success",
      description: editingEmployee ? "Employee updated successfully" : "Employee added successfully",
    });

    resetEmployeeForm();
  };

  const saveAnnouncement = () => {
    if (!announcementForm.title || !announcementForm.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newAnnouncement = {
      id: editingAnnouncement?.id || crypto.randomUUID(),
      ...announcementForm,
      createdAt: editingAnnouncement?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedAnnouncements;
    if (editingAnnouncement) {
      updatedAnnouncements = announcements.map(ann => ann.id === editingAnnouncement.id ? newAnnouncement : ann);
    } else {
      updatedAnnouncements = [...announcements, newAnnouncement];
    }

    setAnnouncements(updatedAnnouncements);
    localStorage.setItem('hrAnnouncements', JSON.stringify(updatedAnnouncements));

    toast({
      title: "Success",
      description: editingAnnouncement ? "Announcement updated successfully" : "Announcement created successfully",
    });

    resetAnnouncementForm();
  };

  const deleteEmployee = (employeeId: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
      setEmployees(updatedEmployees);
      localStorage.setItem('hrEmployees', JSON.stringify(updatedEmployees));
      
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    }
  };

  const deleteAnnouncement = (announcementId: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
      const updatedAnnouncements = announcements.filter(ann => ann.id !== announcementId);
      setAnnouncements(updatedAnnouncements);
      localStorage.setItem('hrAnnouncements', JSON.stringify(updatedAnnouncements));
      
      toast({
        title: "Success",
        description: "Announcement deleted successfully",
      });
    }
  };

  const handleLeaveAction = (requestId: string, action: 'approve' | 'reject') => {
    const updatedRequests = leaveRequests.map(request => 
      request.id === requestId 
        ? { ...request, status: action === 'approve' ? 'approved' : 'rejected', processedDate: new Date().toISOString() }
        : request
    );
    
    setLeaveRequests(updatedRequests);
    localStorage.setItem('hrLeaveRequests', JSON.stringify(updatedRequests));
    
    toast({
      title: "Success",
      description: `Leave request ${action}d successfully`,
    });
  };

  const resetEmployeeForm = () => {
    setEmployeeForm({
      name: '',
      email: '',
      position: '',
      department: '',
      salary: '',
      startDate: '',
      status: 'active'
    });
    setEditingEmployee(null);
    setIsEmployeeDialogOpen(false);
  };

  const resetAnnouncementForm = () => {
    setAnnouncementForm({
      title: '',
      content: '',
      priority: 'normal',
      type: 'general'
    });
    setEditingAnnouncement(null);
    setIsAnnouncementDialogOpen(false);
  };

  const editEmployee = (employee: any) => {
    setEmployeeForm(employee);
    setEditingEmployee(employee);
    setIsEmployeeDialogOpen(true);
  };

  const editAnnouncement = (announcement: any) => {
    setAnnouncementForm(announcement);
    setEditingAnnouncement(announcement);
    setIsAnnouncementDialogOpen(true);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(e => e.status === 'active').length,
    pendingLeaves: leaveRequests.filter(r => r.status === 'pending').length,
    todayAttendance: Math.floor(Math.random() * employees.length * 0.9) // Mock data
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">HR Management</h1>
        </div>
      </div>

      {/* HR Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">{stats.totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Employees</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeEmployees}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Leaves</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingLeaves}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Attendance</p>
                <p className="text-2xl font-bold text-blue-600">{stats.todayAttendance}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="leave">Leave Management</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Employee Directory ({filteredEmployees.length})</CardTitle>
                <Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetEmployeeForm()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Employee
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Full Name</Label>
                          <Input
                            value={employeeForm.name}
                            onChange={(e) => setEmployeeForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={employeeForm.email}
                            onChange={(e) => setEmployeeForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="john@company.com"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Position</Label>
                          <Input
                            value={employeeForm.position}
                            onChange={(e) => setEmployeeForm(prev => ({ ...prev, position: e.target.value }))}
                            placeholder="Software Engineer"
                          />
                        </div>
                        <div>
                          <Label>Department</Label>
                          <Select value={employeeForm.department} onValueChange={(value) => setEmployeeForm(prev => ({ ...prev, department: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map(dept => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label>Salary</Label>
                          <Input
                            type="number"
                            value={employeeForm.salary}
                            onChange={(e) => setEmployeeForm(prev => ({ ...prev, salary: e.target.value }))}
                            placeholder="50000"
                          />
                        </div>
                        <div>
                          <Label>Start Date</Label>
                          <Input
                            type="date"
                            value={employeeForm.startDate}
                            onChange={(e) => setEmployeeForm(prev => ({ ...prev, startDate: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Select value={employeeForm.status} onValueChange={(value) => setEmployeeForm(prev => ({ ...prev, status: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                              <SelectItem value="on-leave">On Leave</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button onClick={saveEmployee} className="w-full">
                        {editingEmployee ? 'Update Employee' : 'Add Employee'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            
            <CardContent>
              {filteredEmployees.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No employees found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2">Name</th>
                        <th className="text-left py-3 px-2">Email</th>
                        <th className="text-left py-3 px-2">Position</th>
                        <th className="text-left py-3 px-2">Department</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((employee) => (
                        <tr key={employee.id} className="border-b hover:bg-muted/50">
                          <td className="py-4 px-2 font-medium">{employee.name}</td>
                          <td className="py-4 px-2">{employee.email}</td>
                          <td className="py-4 px-2">{employee.position}</td>
                          <td className="py-4 px-2">{employee.department}</td>
                          <td className="py-4 px-2">
                            <Badge variant={employee.status === 'active' ? 'default' : employee.status === 'on-leave' ? 'secondary' : 'destructive'}>
                              {employee.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => editEmployee(employee)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteEmployee(employee.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests ({leaveRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {leaveRequests.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No leave requests found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{request.employeeName}</h3>
                          <p className="text-sm text-muted-foreground">{request.type}</p>
                        </div>
                        <Badge variant={request.status === 'pending' ? 'secondary' : request.status === 'approved' ? 'default' : 'destructive'}>
                          {request.status}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{request.reason}</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        {request.startDate} to {request.endDate} ({request.days} days)
                      </p>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleLeaveAction(request.id, 'approve')}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleLeaveAction(request.id, 'reject')}>
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Company Announcements ({announcements.length})</CardTitle>
                <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetAnnouncementForm()}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Announcement
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={announcementForm.title}
                          onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Announcement title"
                        />
                      </div>
                      
                      <div>
                        <Label>Content</Label>
                        <Textarea
                          value={announcementForm.content}
                          onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Announcement content..."
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Priority</Label>
                          <Select value={announcementForm.priority} onValueChange={(value) => setAnnouncementForm(prev => ({ ...prev, priority: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Type</Label>
                          <Select value={announcementForm.type} onValueChange={(value) => setAnnouncementForm(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General</SelectItem>
                              <SelectItem value="policy">Policy</SelectItem>
                              <SelectItem value="event">Event</SelectItem>
                              <SelectItem value="emergency">Emergency</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button onClick={saveAnnouncement} className="w-full">
                        {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            
            <CardContent>
              {announcements.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No announcements found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{announcement.title}</h3>
                          <Badge variant={announcement.priority === 'urgent' ? 'destructive' : announcement.priority === 'high' ? 'default' : 'secondary'}>
                            {announcement.priority}
                          </Badge>
                          <Badge variant="outline">{announcement.type}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editAnnouncement(announcement)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteAnnouncement(announcement.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{announcement.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(announcement.createdAt).toLocaleDateString()} - {new Date(announcement.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRManagement;