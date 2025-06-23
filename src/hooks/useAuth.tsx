
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string | null;
  currentUser: string | null;
  logout: () => void;
  login: (email: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Create default admin user if not exists
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const adminExists = registeredUsers.find((u: any) => u.email === 'amayamusamson@gmail.com');
    
    if (!adminExists) {
      const adminUser = {
        id: 'admin-1',
        name: 'Admin User',
        email: 'amayamusamson@gmail.com',
        password: '1029384756',
        createdAt: new Date().toISOString(),
        permissions: ['dashboard', 'invoices', 'clients', 'financial-reports', 'bank-accounts', 'payments', 'payment-initiation', 'email-service', 'company', 'integrations', 'settings', 'admin'],
        role: 'admin'
      };
      registeredUsers.push(adminUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }

    // Use sessionStorage instead of localStorage for login state
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const role = sessionStorage.getItem('userRole');
    const user = sessionStorage.getItem('currentUser');
    
    // Check if current user still exists in registered users
    if (loggedIn && user) {
      const currentUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userExists = currentUsers.find((u: any) => u.email === user);
      
      if (!userExists) {
        // User was deleted, automatically log out
        logout();
        return;
      }
    }
    
    setIsLoggedIn(loggedIn);
    setUserRole(role);
    setCurrentUser(user);
  }, []);

  // Check for user deletion every 30 seconds
  useEffect(() => {
    const checkUserExists = () => {
      if (isLoggedIn && currentUser) {
        const currentUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userExists = currentUsers.find((u: any) => u.email === currentUser);
        
        if (!userExists) {
          logout();
        }
      }
    };

    const interval = setInterval(checkUserExists, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn, currentUser]);

  // Auto-logout on browser close
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Remove online user status
      if (currentUser) {
        const users = JSON.parse(localStorage.getItem('onlineUsers') || '[]');
        const filteredUsers = users.filter((u: any) => u.email !== currentUser);
        localStorage.setItem('onlineUsers', JSON.stringify(filteredUsers));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentUser]);

  const login = (email: string, password: string): boolean => {
    // Check for admin login first
    if (email === 'amayamusamson@gmail.com' && password === '1029384756') {
      sessionStorage.setItem('userRole', 'admin');
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('currentUser', email);
      setIsLoggedIn(true);
      setUserRole('admin');
      setCurrentUser(email);
      
      // Add to online users
      const onlineUsers = JSON.parse(localStorage.getItem('onlineUsers') || '[]');
      const existingUser = onlineUsers.find((u: any) => u.email === email);
      if (!existingUser) {
        onlineUsers.push({ email, name: 'Admin User', loginTime: new Date().toISOString() });
        localStorage.setItem('onlineUsers', JSON.stringify(onlineUsers));
      }
      
      return true;
    }

    // Check for regular user login from registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find((u: any) => u.email === email && u.password === password);

    if (user) {
      const role = user.role || 'user';
      sessionStorage.setItem('userRole', role);
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('currentUser', email);
      setIsLoggedIn(true);
      setUserRole(role);
      setCurrentUser(email);
      
      // Add to online users
      const onlineUsers = JSON.parse(localStorage.getItem('onlineUsers') || '[]');
      const existingUser = onlineUsers.find((u: any) => u.email === email);
      if (!existingUser) {
        onlineUsers.push({ email, name: user.name, loginTime: new Date().toISOString() });
        localStorage.setItem('onlineUsers', JSON.stringify(onlineUsers));
      }
      
      return true;
    }

    return false;
  };

  const logout = () => {
    // Remove online user status
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem('onlineUsers') || '[]');
      const filteredUsers = users.filter((u: any) => u.email !== currentUser);
      localStorage.setItem('onlineUsers', JSON.stringify(filteredUsers));
    }
    
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, currentUser, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
