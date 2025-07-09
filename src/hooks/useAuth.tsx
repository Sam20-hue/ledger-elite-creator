
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string | null;
  currentUser: string | null;
  logout: () => void;
  login: (email: string, password: string) => boolean;
  checkPasswordStrength: (password: string) => { isStrong: boolean; message: string; };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Check password strength
  const checkPasswordStrength = (password: string): { isStrong: boolean; message: string; } => {
    if (password.length < 8) {
      return { isStrong: false, message: 'Password must be at least 8 characters long' };
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (!hasUpperCase) {
      return { isStrong: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!hasLowerCase) {
      return { isStrong: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!hasNumbers) {
      return { isStrong: false, message: 'Password must contain at least one number' };
    }
    if (!hasSpecialChar) {
      return { isStrong: false, message: 'Password must contain at least one special character' };
    }
    
    return { isStrong: true, message: 'Password is strong' };
  };

  // Auto-logout after 24 hours for non-admin users
  useEffect(() => {
    const checkLoginExpiry = () => {
      const loginTime = sessionStorage.getItem('loginTime');
      const userRole = sessionStorage.getItem('userRole');
      
      if (loginTime && userRole !== 'admin') {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursDiff >= 24) {
          logout();
        }
      }
    };

    // Check immediately and then every hour
    checkLoginExpiry();
    const interval = setInterval(checkLoginExpiry, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(interval);
  }, []);

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

    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const role = sessionStorage.getItem('userRole');
    const user = sessionStorage.getItem('currentUser');
    
    if (loggedIn && user) {
      const currentUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userExists = currentUsers.find((u: any) => u.email === user);
      
      if (!userExists) {
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
    if (email === 'amayamusamson@gmail.com' && password === '1029384756') {
      sessionStorage.setItem('userRole', 'admin');
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('currentUser', email);
      sessionStorage.setItem('loginTime', new Date().toISOString());
      setIsLoggedIn(true);
      setUserRole('admin');
      setCurrentUser(email);
      
      const onlineUsers = JSON.parse(localStorage.getItem('onlineUsers') || '[]');
      const existingUser = onlineUsers.find((u: any) => u.email === email);
      if (!existingUser) {
        onlineUsers.push({ email, name: 'Admin User', loginTime: new Date().toISOString() });
        localStorage.setItem('onlineUsers', JSON.stringify(onlineUsers));
      }
      
      return true;
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find((u: any) => u.email === email && u.password === password);

    if (user) {
      const role = user.role || 'user';
      sessionStorage.setItem('userRole', role);
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('currentUser', email);
      sessionStorage.setItem('loginTime', new Date().toISOString());
      setIsLoggedIn(true);
      setUserRole(role);
      setCurrentUser(email);
      
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
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem('onlineUsers') || '[]');
      const filteredUsers = users.filter((u: any) => u.email !== currentUser);
      localStorage.setItem('onlineUsers', JSON.stringify(filteredUsers));
    }
    
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('loginTime');
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, currentUser, logout, login, checkPasswordStrength }}>
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
