
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  Edit, 
  Trash2, 
  UserPlus,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import * as XLSX from 'xlsx';

const Admin = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    permissions: [] as string[]
  });
  
  const { toast } = useToast();
  const { resetLoginAttempts } = useAuth();

  const availablePermissions = [
    'dashboard', 'invoices', 'clients', 'inventory', 'financial-reports', 
    'bank-accounts', 'payments', 'payment-initiation', 'email-service', 
    'company', 'integrations', 'settings'
  ];

  useEffect(() => {
    loadUsers();
    loadAlerts();
  }, []);

  const loadUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    setUsers(registeredUsers);
  };

  const loadAlerts = () => {
    const adminAlerts = JSON.parse(localStorage.getItem('adminAlerts') || '[]');
    setAlerts(adminAlerts);
  };

  const saveUser = () => {
    if (!userForm.name || !userForm.email || !userForm.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newUser = {
      id: editingUser?.id || crypto.randomUUID(),
      ...userForm,
      createdAt: editingUser?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedUsers;
    if (editingUser) {
      updatedUsers = users.map(user => user.id === editingUser.id ? newUser : user);
    } else {
      // Check if email already exists
      if (users.find(u => u.email === userForm.email)) {
        toast({
          title: "Error",
          description: "A user with this email already exists",
          variant: "destructive",
        });
        return;
      }
      updatedUsers = [...users, newUser];
    }

    setUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));

    toast({
      title: "Success",
      description: editingUser ? "User updated successfully" : "User created successfully",
    });

    resetUserForm();
  };

  const deleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    }
  };

  const unlockUser = (email: string) => {
    // Reset login attempts for specific user
    localStorage.removeItem(`loginAttempts_${email}`);
    localStorage.removeItem(`accountLocked_${email}`);
    resetLoginAttempts();
    
    toast({
      title: "Success",
      description: `Account unlocked for ${email}`,
    });
  };

  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      password: '',
      role: 'user',
      permissions: []
    });
    setEditingUser(null);
    setIsUserDialogOpen(false);
  };

  const editUser = (user: any) => {
    setUserForm({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role || 'user',
      permissions: user.permissions || []
    });
    setEditingUser(user);
    setIsUserDialogOpen(true);
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setUserForm(prev => ({
        ...prev,
        permissions: [...prev.permissions, permission]
      }));
    } else {
      setUserForm(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permission)
      }));
    }
  };

  const exportUsers = () => {
    const exportData = users.map(user => ({
      'Name': user.name,
      'Email': user.email,
      'Role': user.role,
      'Permissions': user.permissions?.join(', ') || '',
      'Created Date': new Date(user.createdAt).toLocaleDateString(),
      'Last Updated': new Date(user.updatedAt).toLocaleDateString()
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, `users_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: "Success",
      description: "Users exported successfully",
    });
  };

  const clearAlert = (alertId: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== alertId);
    setAlerts(updatedAlerts);
    localStorage.setItem('adminAlerts', JSON.stringify(updatedAlerts));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportUsers} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetUserForm()}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={userForm.name}
                      onChange={(e) => setUserForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={userForm.password}
                        onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Select value={userForm.role} onValueChange={(value) => setUserForm(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="finance">Finance Manager</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {availablePermissions.map(permission => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission}
                          checked={userForm.permissions.includes(permission)}
                          onCheckedChange={(checked) => handlePermissionChange(permission, !!checked)}
                        />
                        <Label htmlFor={permission} className="text-sm capitalize">
                          {permission.replace('-', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={saveUser} className="w-full">
                  {editingUser ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Security Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Security Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-800">{alert.message}</p>
                    <p className="text-sm text-red-600">
                      {new Date(alert.timestamp).toLocaleString()} - {alert.attempts} attempts
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => unlockUser(alert.email)}>
                      <Unlock className="h-4 w-4 mr-1" />
                      Unlock
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => clearAlert(alert.id)}>
                      Clear
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>User Management ({users.length} users)</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2">Email</th>
                    <th className="text-left py-3 px-2">Role</th>
                    <th className="text-left py-3 px-2">Permissions</th>
                    <th className="text-left py-3 px-2">Created</th>
                    <th className="text-left py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-2 font-medium">{user.name}</td>
                      <td className="py-4 px-2">{user.email}</td>
                      <td className="py-4 px-2">
                        <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'finance' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-sm text-muted-foreground">
                          {user.permissions?.length || 0} permissions
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.email !== 'amayamusamson@gmail.com' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteUser(user.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
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
    </div>
  );
};

export default Admin;
