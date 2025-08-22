import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Edit, 
  Trash2, 
  Plus,
  Users,
  Settings
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

const Roles = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });
  
  const { toast } = useToast();

  const availablePermissions = [
    'dashboard', 'invoices', 'clients', 'inventory', 'financial-reports', 
    'bank-accounts', 'payments', 'payment-initiation', 'email-service', 
    'company', 'integrations', 'settings', 'users', 'hr', 'admin'
  ];

  const defaultRoles = [
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Full system access with all permissions',
      permissions: availablePermissions,
      isDefault: true,
      userCount: 0
    },
    {
      id: 'finance',
      name: 'Finance Manager',
      description: 'Access to financial operations and reports',
      permissions: ['dashboard', 'invoices', 'clients', 'financial-reports', 'bank-accounts', 'payments', 'payment-initiation'],
      isDefault: true,
      userCount: 0
    },
    {
      id: 'hr',
      name: 'HR Manager',
      description: 'Human resources and employee management access',
      permissions: ['dashboard', 'clients', 'users', 'hr', 'company'],
      isDefault: true,
      userCount: 0
    },
    {
      id: 'user',
      name: 'Standard User',
      description: 'Basic system access for regular operations',
      permissions: ['dashboard', 'invoices', 'clients'],
      isDefault: true,
      userCount: 0
    }
  ];

  useEffect(() => {
    loadRoles();
    loadUsers();
  }, []);

  const loadRoles = () => {
    let storedRoles = JSON.parse(localStorage.getItem('systemRoles') || '[]');
    
    if (storedRoles.length === 0) {
      storedRoles = defaultRoles;
      localStorage.setItem('systemRoles', JSON.stringify(storedRoles));
    }
    
    setRoles(storedRoles);
  };

  const loadUsers = () => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    setUsers(registeredUsers);
  };

  const getUserCountForRole = (roleId: string) => {
    return users.filter(user => user.role === roleId).length;
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
      id: editingRole?.id || roleForm.name.toLowerCase().replace(/\s+/g, '-'),
      ...roleForm,
      isDefault: editingRole?.isDefault || false,
      userCount: editingRole?.userCount || 0,
      createdAt: editingRole?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedRoles;
    if (editingRole) {
      updatedRoles = roles.map(role => role.id === editingRole.id ? newRole : role);
    } else {
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

    const userCount = getUserCountForRole(roleId);
    if (userCount > 0) {
      toast({
        title: "Error",
        description: `Cannot delete role. ${userCount} user(s) are assigned to this role.`,
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

  const resetRoleForm = () => {
    setRoleForm({
      name: '',
      description: '',
      permissions: []
    });
    setEditingRole(null);
    setIsRoleDialogOpen(false);
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

  const getPermissionLabel = (permission: string) => {
    return permission.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Role Management</h1>
        </div>
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetRoleForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Role Name</Label>
                <Input
                  value={roleForm.name}
                  onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Manager, Supervisor, etc."
                />
              </div>
              
              <div>
                <Label>Description</Label>
                <Textarea
                  value={roleForm.description}
                  onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the role and its responsibilities..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-3 mt-2 max-h-64 overflow-y-auto">
                  {availablePermissions.map(permission => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={roleForm.permissions.includes(permission)}
                        onCheckedChange={(checked) => handlePermissionChange(permission, !!checked)}
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {getPermissionLabel(permission)}
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

      {/* Roles List */}
      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {role.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{getUserCountForRole(role.id)} users</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Permissions ({role.permissions?.length || 0})</h4>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions?.map((permission: string) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {getPermissionLabel(permission)}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => editRole(role)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {!role.isDefault && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteRole(role.id)}
                      disabled={getUserCountForRole(role.id) > 0}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {roles.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No roles found</p>
            <Button onClick={() => setIsRoleDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Role
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Roles;