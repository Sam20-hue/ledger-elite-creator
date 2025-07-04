import React, { useState } from 'react';
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
  Home,
  Banknote,
  Mail,
  Moon,
  Sun,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/ThemeProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import OnlineUsers from '@/components/OnlineUsers';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, userRole, currentUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getAllNavigation = () => [
    { name: 'Home', href: '/', icon: Home, id: 'home' },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, id: 'dashboard' },
    { name: 'Invoices', href: '/invoices', icon: FileText, id: 'invoices' },
    { name: 'Clients', href: '/clients', icon: Users, id: 'clients' },
    { 
      name: 'Accounts/Financial Reports', 
      href: '/financial-reports', 
      icon: Building2, 
      id: 'financial-reports',
      subItems: [
        { name: 'Bank Accounts', href: '/bank-accounts', icon: CreditCard, id: 'bank-accounts' },
        { name: 'Payments', href: '/payments', icon: Banknote, id: 'payments' },
        { name: 'Payment Initiation', href: '/payment-initiation', icon: Shield, id: 'payment-initiation' }
      ]
    },
    { name: 'Email Service', href: '/email-service', icon: Mail, id: 'email-service' },
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
        
        if (currentUserData.permissions.includes('admin')) {
          baseNavigation.push({ name: 'Admin', href: '/admin', icon: UserCheck, id: 'admin' });
        }
        
        return baseNavigation;
      }
    }
    
    return allNavigation;
  };

  const handleLogout = () => {
    // Remove user from online users
    const users = JSON.parse(localStorage.getItem('onlineUsers') || '[]');
    const filteredUsers = users.filter((u: any) => u.email !== currentUser);
    localStorage.setItem('onlineUsers', JSON.stringify(filteredUsers));
    
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  // Show login page layout for non-logged in users on login page
  if (!isLoggedIn && location.pathname === '/login') {
    return <>{children}</>;
  }

  // Redirect all other routes to login if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                Ledger Elite Creator
              </Link>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                >
                  {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
                <Link to="/login">
                  <Button size={isMobile ? "sm" : "default"}>Login</Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </div>
    );
  }

  const navigation = getFilteredNavigation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 h-16">
          <div className="flex items-center justify-between px-4 h-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-lg font-bold text-blue-600 dark:text-blue-400">
              Ledger Elite
            </h1>
            <Link to="/invoices/new">
              <Button size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
      } ${isMobile ? 'top-16' : 'top-0'}`}>
        {!isMobile && (
          <div className="flex h-16 items-center justify-center border-b dark:border-gray-700">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Ledger Elite Creator</h1>
          </div>
        )}
        
        <nav className={`px-3 flex-1 overflow-y-auto ${isMobile ? 'mt-4' : 'mt-6'} ${isMobile ? 'pb-20' : 'pb-32'}`}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const isParentActive = item.subItems?.some(subItem => location.pathname === subItem.href);
            
            return (
              <div key={item.name}>
                <Link
                  to={item.href}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors ${
                    isActive || isParentActive
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
                
                {item.subItems && (isActive || isParentActive) && (
                  <div className="ml-6 mb-2">
                    {item.subItems.map((subItem) => {
                      const isSubActive = location.pathname === subItem.href;
                      return (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          onClick={() => isMobile && setSidebarOpen(false)}
                          className={`group flex items-center px-3 py-1 text-sm rounded-md mb-1 transition-colors ${
                            isSubActive
                              ? 'bg-blue-50 dark:bg-blue-800 text-blue-600 dark:text-blue-200'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-white'
                          }`}
                        >
                          <subItem.icon className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{subItem.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-3 right-3 space-y-2">
          {userRole === 'admin' && (
            <div className="mb-4">
              <OnlineUsers />
            </div>
          )}
          
          <div className="text-xs text-gray-600 dark:text-gray-400 px-3 mb-2">
            <div className="truncate">Logged in as: {currentUser}</div>
            <div>Role: {userRole}</div>
          </div>
          
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="flex-1"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            {!isMobile && (
              <Link to="/invoices/new" className="flex-1">
                <Button className="w-full" size="sm">
                  <Plus className="mr-1 h-3 w-3" />
                  New
                </Button>
              </Link>
            )}
          </div>
          
          <Button variant="outline" className="w-full" onClick={handleLogout} size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 top-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`${isMobile ? 'pt-16' : 'pl-64'}`}>
        <main className={`${isMobile ? 'p-2' : 'p-6'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
