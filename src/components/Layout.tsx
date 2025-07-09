
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-2xl font-bold text-primary">
                Numera
              </Link>
              
              {/* Navigation */}
              <nav className="hidden md:flex space-x-6">
                {navigation.map((item) => {
                  if (item.requiresAuth && !isLoggedIn) return null;
                  if (item.requiresAuth && !hasAccess(item.permission)) return null;
                  
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                {userRole === 'admin' && adminNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === item.href
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
