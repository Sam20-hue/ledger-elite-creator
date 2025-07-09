
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import { 
  Home, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  BarChart3, 
  Building2, 
  CreditCard, 
  Send, 
  Mail, 
  Banknote,
  Package,
  UserCog,
  Briefcase
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, userRole, currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    navigate('/');
  };

  const getUserName = () => {
    if (!currentUser) return '';
    
    // Get registered users from localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find((u: any) => u.email === currentUser);
    
    if (user) {
      return user.name;
    }
    
    // Fallback for admin user
    if (currentUser === 'amayamusamson@gmail.com') {
      return 'Admin User';
    }
    
    return currentUser.split('@')[0]; // Fallback to username part of email
  };

  const hasAccess = (page: string) => {
    if (!isLoggedIn) return false;
    if (userRole === 'admin') return true;
    
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find((u: any) => u.email === currentUser);
    
    if (!user || !user.permissions) return false;
    
    return user.permissions.includes(page);
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home, requiresAuth: false },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, requiresAuth: true, permission: 'dashboard' },
    { name: 'Invoices', href: '/invoices', icon: FileText, requiresAuth: true, permission: 'invoices' },
    { name: 'Clients', href: '/clients', icon: Users, requiresAuth: true, permission: 'clients' },
    { name: 'Inventory', href: '/inventory', icon: Package, requiresAuth: true, permission: 'inventory' },
    { name: 'Financial Reports', href: '/financial-reports', icon: BarChart3, requiresAuth: true, permission: 'financial-reports' },
    { name: 'Bank Accounts', href: '/bank-accounts', icon: Banknote, requiresAuth: true, permission: 'bank-accounts' },
    { name: 'Payments', href: '/payments', icon: CreditCard, requiresAuth: true, permission: 'payments' },
    { name: 'Payment Initiation', href: '/payment-initiation', icon: Send, requiresAuth: true, permission: 'payment-initiation' },
    { name: 'Email Service', href: '/email-service', icon: Mail, requiresAuth: true, permission: 'email-service' },
    { name: 'Company', href: '/company', icon: Building2, requiresAuth: true, permission: 'company' },
    { name: 'Integrations', href: '/integrations', icon: Briefcase, requiresAuth: true, permission: 'integrations' },
    { name: 'Settings', href: '/settings', icon: Settings, requiresAuth: true, permission: 'settings' },
  ];

  const adminNavigation = [
    { name: 'Admin Panel', href: '/admin', icon: UserCog },
  ];

  const AppSidebar = () => (
    <Sidebar className="w-64 border-r border-border bg-card">
      <SidebarHeader className="p-4 border-b border-border">
        <Link to="/" className="text-2xl font-bold text-primary">
          Numera
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                if (item.requiresAuth && !isLoggedIn) return null;
                if (item.requiresAuth && !hasAccess(item.permission)) return null;
                
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.href} className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              
              {userRole === 'admin' && adminNavigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.href} className="flex items-center gap-3">
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <ThemeToggle />
          
          {isLoggedIn ? (
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">
                User: <span className="font-medium text-foreground">{getUserName()}</span>
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-card border-b border-border p-4">
            <div className="flex items-center justify-between">
              <SidebarTrigger />
              <div className="flex items-center gap-4">
                <ThemeToggle />
                {isLoggedIn ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      User: <span className="font-medium text-foreground">{getUserName()}</span>
                    </span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link to="/login">
                    <Button size="sm">Login</Button>
                  </Link>
                )}
              </div>
            </div>
          </header>
          
          {/* Page Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
