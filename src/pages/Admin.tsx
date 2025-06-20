
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Users, Plus, Trash2, UserCheck, Settings } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  permissions: string[];
}

const availablePages = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'invoices', name: 'Invoices' },
  { id: 'clients', name: 'Clients' },
  { id: 'payments', name: 'Payments' },
  { id: 'company', name: 'Company Settings' },
  { id: 'integrations', name: 'Integrations' },
  { id: 'settings', name: 'Settings' }
];

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    permissions: [] as string[]
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    setUsers(savedUsers);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    if (existingUsers.find((u: User) => u.email === formData.email)) {
      toast({
        title: "Error",
        description: "User with this email already exists",
        variant: "destructive"
      });
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    toast({
      title: "Success",
      description: "User registered successfully",
    });

    setFormData({ name: '', email: '', password: '', permissions: [] });
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== id);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    }
  };

  const handlePermissionChange = (pageId: string, checked: boolean) => {
    if (selectedUser) {
      const updatedPermissions = checked 
        ? [...selectedUser.permissions, pageId]
        : selectedUser.permissions.filter(p => p !== pageId);
      
      setSelectedUser({ ...selectedUser, permissions: updatedPermissions });
    } else {
      const updatedPermissions = checked 
        ? [...formData.permissions, pageId]
        : formData.permissions.filter(p => p !== pageId);
      
      setFormData({ ...formData, permissions: updatedPermissions });
    }
  };

  const savePermissions = () => {
    if (selectedUser) {
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      );
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      toast({
        title: "Success",
        description: "Permissions updated successfully",
      });
      
      setIsPermissionDialogOpen(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserCheck className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">User Administration</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Register New User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Register New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  required
                />
              </div>
              <div>
                <Label>Page Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availablePages.map((page) => (
                    <div key={page.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={page.id}
                        checked={formData.permissions.includes(page.id)}
                        onCheckedChange={(checked) => handlePermissionChange(page.id, checked as boolean)}
                      />
                      <Label htmlFor={page.id} className="text-sm">{page.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Register User
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Users ({users.length})</CardTitle>
          <CardDescription>Manage all registered users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No users registered yet</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Register First User
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-left py-3 px-2">Email</th>
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
                        <span className="text-sm text-gray-600">
                          {user.permissions?.length || 0} pages
                        </span>
                      </td>
                      <td className="py-4 px-2">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsPermissionDialogOpen(true);
                            }}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-700"
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

      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Permissions for {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Page Access Permissions</Label>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {availablePages.map((page) => (
                  <div key={page.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`permission-${page.id}`}
                      checked={selectedUser?.permissions?.includes(page.id) || false}
                      onCheckedChange={(checked) => handlePermissionChange(page.id, checked as boolean)}
                    />
                    <Label htmlFor={`permission-${page.id}`}>{page.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={savePermissions}>
                Save Permissions
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
