
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
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Lock
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
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

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
    
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find((u: any) => u.email === currentUser);
    
    if (user) {
      return user.name;
    }
    
    if (currentUser === 'amayamusamson@gmail.com') {
      return 'Admin User';
    }
    
    return currentUser.split('@')[0];
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
    { name: 'Freeze', href: '/freeze', icon: Lock, requiresAuth: true, permission: 'freeze' },
    { name: 'Settings', href: '/settings', icon: Settings, requiresAuth: true, permission: 'settings' },
  ];

  const adminNavigation = [
    { name: 'Admin Panel', href: '/admin', icon: UserCog },
  ];

  const AppSidebar = () => (
    <Sidebar className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-sidebar border-r border-sidebar-border`}>
      <SidebarHeader className="p-4 border-b border-sidebar-border bg-sidebar">
        {!sidebarCollapsed && (
          <Link to="/" className="text-2xl font-bold text-sidebar-foreground">
            Numera
          </Link>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-4 right-2 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </SidebarHeader>
      
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          {!sidebarCollapsed && <SidebarGroupLabel className="text-sidebar-foreground/70">Navigation</SidebarGroupLabel>}
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
                      <Link 
                        to={item.href} 
                        className="flex items-center gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground p-2 rounded" 
                        title={sidebarCollapsed ? item.name : ''}
                      >
                        <Icon className="h-4 w-4" />
                        {!sidebarCollapsed && <span className="text-sm">{item.name}</span>}
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
                      <Link 
                        to={item.href} 
                        className="flex items-center gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground p-2 rounded text-sm" 
                        title={sidebarCollapsed ? item.name : ''}
                      >
                        <Icon className="h-4 w-4" />
                        {!sidebarCollapsed && <span>{item.name}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-sidebar-border bg-sidebar">
        <div className="flex flex-col gap-2">
          <ThemeToggle />
          
          {isLoggedIn ? (
            <div className="flex flex-col gap-2">
              {!sidebarCollapsed && (
                <span className="text-xs text-sidebar-foreground/70">
                  User: <span className="font-medium text-sidebar-foreground">{getUserName()}</span>
                </span>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout} 
                className="bg-transparent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {!sidebarCollapsed && 'Logout'}
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {!sidebarCollapsed ? 'Login' : <Home className="h-4 w-4" />}
              </Button>
            </Link>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="border-b border-border p-4 bg-sidebar">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="text-sidebar-foreground" />
              <div className="text-sidebar-foreground font-semibold">Numera Business System</div>
            </div>
          </header>
          
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
