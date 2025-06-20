
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  Plus,
  Building2,
  CreditCard,
  Link as LinkIcon,
  UserCheck,
  LogOut,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, userRole, currentUser, logout } = useAuth();

  const getAllNavigation = () => [
    { name: 'Home', href: '/', icon: Home, id: 'home' },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, id: 'dashboard' },
    { name: 'Invoices', href: '/invoices', icon: FileText, id: 'invoices' },
    { name: 'Clients', href: '/clients', icon: Users, id: 'clients' },
    { name: 'Payments', href: '/payments', icon: CreditCard, id: 'payments' },
    { name: 'Company', href: '/company', icon: Building2, id: 'company' },
    { name: 'Integrations', href: '/integrations', icon: LinkIcon, id: 'integrations' },
    { name: 'Settings', href: '/settings', icon: Settings, id: 'settings' },
  ];

  const getFilteredNavigation = () => {
    const allNavigation = getAllNavigation();
    
    if (userRole === 'admin') {
      return [...allNavigation, { name: 'Admin', href: '/admin', icon: UserCheck, id: 'admin' }];
    }
    
    if (userRole === 'sub-admin' || userRole === 'user') {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const currentUserData = registeredUsers.find((u: any) => u.email === currentUser);
      
      if (currentUserData?.permissions) {
        const baseNavigation = allNavigation.filter(nav => 
          nav.id === 'home' || currentUserData.permissions.includes(nav.id)
        );
        
        // Add admin access if user has admin permission
        if (currentUserData.permissions.includes('admin')) {
          baseNavigation.push({ name: 'Admin', href: '/admin', icon: UserCheck, id: 'admin' });
        }
        
        return baseNavigation;
      }
    }
    
    return allNavigation;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Show login page layout for non-logged in users on login page
  if (!isLoggedIn && location.pathname === '/login') {
    return <>{children}</>;
  }

  // Show home page layout for non-logged in users
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                Numera
              </Link>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </div>
    );
  }

  const navigation = getFilteredNavigation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-16 items-center justify-center border-b">
          <h1 className="text-xl font-bold text-blue-600">Numera</h1>
        </div>
        
        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-3 right-3 space-y-2">
          <div className="text-sm text-gray-600 px-3 mb-2">
            Logged in as: {currentUser}
            <br />
            Role: {userRole}
          </div>
          <Link to="/invoices/new">
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </Link>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
