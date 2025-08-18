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
  Unlock,
  Search,
  Filter
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as XLSX from 'xlsx';

// Email validation function
const validateEmail = (email: string): { isValid: boolean; message: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }
  
  // Additional validations
  if (email.length > 254) {
    return { isValid: false, message: 'Email address is too long' };
  }
  
  const localPart = email.split('@')[0];
  if (localPart.length > 64) {
    return { isValid: false, message: 'Email local part is too long' };
  }
  
  return { isValid: true, message: 'Valid email' };
};

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    permissions: [] as string[]
  });
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });
  
  const { toast } = useToast();
  const { resetLoginAttempts } = useAuth();

  const availablePermissions = [
    'dashboard', 'invoices', 'clients', 'inventory', 'financial-reports', 
    'bank-accounts', 'payments', 'payment-initiation', 'email-service', 
    'company', 'integrations', 'settings', 'users', 'hr', 'admin'
  ];

  const defaultRoles = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access',
      permissions: availablePermissions,
      isDefault: true
    },
    {
      id: 'finance',
      name: 'Finance Manager',
      description: 'Financial operations access',
      permissions: ['dashboard', 'invoices', 'clients', 'financial-reports', 'bank-accounts', 'payments', 'payment-initiation'],
      isDefault: true
    },
    {
      id: 'hr',
      name: 'HR Manager',
      description: 'Human resources access',
      permissions: ['dashboard', 'clients', 'users', 'hr', 'company'],
      isDefault: true
    },
    {
      id: 'user',
      name: 'Standard User',
      description: 'Basic system access',
      permissions: ['dashboard', 'invoices', 'clients'],
      isDefault: true
    }
  ];

  useEffect(() => {
    loadUsers();
    loadAlerts();
    loadRoles();
  }, []);

  const loadUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    setUsers(registeredUsers);
  };

  const loadAlerts = () => {
    const adminAlerts = JSON.parse(localStorage.getItem('adminAlerts') || '[]');
    setAlerts(adminAlerts);
  };

  const loadRoles = () => {
    let storedRoles = JSON.parse(localStorage.getItem('systemRoles') || '[]');
    
    // Initialize with default roles if empty
    if (storedRoles.length === 0) {
      storedRoles = defaultRoles;
      localStorage.setItem('systemRoles', JSON.stringify(storedRoles));
    }
    
    setRoles(storedRoles);
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

    // Validate email
    const emailValidation = validateEmail(userForm.email);
    if (!emailValidation.isValid) {
      toast({
        title: "Error",
        description: emailValidation.message,
        variant: "destructive",
      });
      return;
    }

    // Get role permissions
    const selectedRole = roles.find(r => r.id === userForm.role || r.name.toLowerCase() === userForm.role);
    const rolePermissions = selectedRole ? selectedRole.permissions : [];

    const newUser = {
      id: editingUser?.id || crypto.randomUUID(),
      ...userForm,
      permissions: [...new Set([...userForm.permissions, ...rolePermissions])],
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

  const saveRole = () => {
    if (!roleForm.name || !roleForm.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newRole = {
      id: editingRole?.id || crypto.randomUUID(),
      ...roleForm,
      isDefault: editingRole?.isDefault || false,
      createdAt: editingRole?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedRoles;
    if (editingRole) {
      updatedRoles = roles.map(role => role.id === editingRole.id ? newRole : role);
    } else {
      // Check if role already exists
      if (roles.find(r => r.name.toLowerCase() === roleForm.name.toLowerCase())) {
        toast({
          title: "Error",
          description: "A role with this name already exists",
          variant: "destructive",
        });
        return;
      }
      updatedRoles = [...roles, newRole];
    }

    setRoles(updatedRoles);
    localStorage.setItem('systemRoles', JSON.stringify(updatedRoles));

    toast({
      title: "Success",
      description: editingRole ? "Role updated successfully" : "Role created successfully",
    });

    resetRoleForm();
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

  const deleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isDefault) {
      toast({
        title: "Error",
        description: "Cannot delete default system roles",
        variant: "destructive",
      });
      return;
    }

    if (confirm('Are you sure you want to delete this role?')) {
      const updatedRoles = roles.filter(role => role.id !== roleId);
      setRoles(updatedRoles);
      localStorage.setItem('systemRoles', JSON.stringify(updatedRoles));
      
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    }
  };

  const unlockUser = (email: string) => {
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

  const resetRoleForm = () => {
    setRoleForm({
      name: '',
      description: '',
      permissions: []
    });
    setEditingRole(null);
    setIsRoleDialogOpen(false);
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

  const editRole = (role: any) => {
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions || []
    });
    setEditingRole(role);
    setIsRoleDialogOpen(true);
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

  const handleRolePermissionChange = (permission: string, checked: boolean) => {
    if (checked) {
      setRoleForm(prev => ({
        ...prev,
        permissions: [...prev.permissions, permission]
      }));
    } else {
      setRoleForm(prev => ({
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
      </div>

      {/* Security Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span>Security Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div>
                    <p className="font-medium text-destructive">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">
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

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {/* Users Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Users ({filteredUsers.length} of {users.length})</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={exportUsers} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
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
                                {roles.map(role => (
                                  <SelectItem key={role.id} value={role.id}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label>Additional Permissions</Label>
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
              
              {/* Search and Filter */}
              <div className="flex gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            
            <CardContent>
              {filteredUsers.length === 0 ? (
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
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted/50">
                          <td className="py-4 px-2 font-medium">{user.name}</td>
                          <td className="py-4 px-2">{user.email}</td>
                          <td className="py-4 px-2">
                            <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'finance' ? 'default' : user.role === 'hr' ? 'secondary' : 'outline'}>
                              {roles.find(r => r.id === user.role)?.name || user.role}
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
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          {/* Roles Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>System Roles ({roles.length})</CardTitle>
                <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetRoleForm()}>
                      <Shield className="h-4 w-4 mr-2" />
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Role Name</Label>
                        <Input
                          value={roleForm.name}
                          onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Sales Manager"
                        />
                      </div>
                      
                      <div>
                        <Label>Description</Label>
                        <Input
                          value={roleForm.description}
                          onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of the role"
                        />
                      </div>

                      <div>
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          {availablePermissions.map(permission => (
                            <div key={permission} className="flex items-center space-x-2">
                              <Checkbox
                                id={`role-${permission}`}
                                checked={roleForm.permissions.includes(permission)}
                                onCheckedChange={(checked) => handleRolePermissionChange(permission, !!checked)}
                              />
                              <Label htmlFor={`role-${permission}`} className="text-sm capitalize">
                                {permission.replace('-', ' ')}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button onClick={saveRole} className="w-full">
                        {editingRole ? 'Update Role' : 'Create Role'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid gap-4">
                {roles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{role.name}</h3>
                        {role.isDefault && (
                          <Badge variant="secondary">System</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editRole(role)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!role.isDefault && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteRole(role.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((permission: string) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;