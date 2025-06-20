
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

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
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');
    const user = localStorage.getItem('currentUser');
    
    setIsLoggedIn(loggedIn);
    setUserRole(role);
    setCurrentUser(user);
  }, []);

  const login = (email: string, password: string): boolean => {
    // Check for admin login
    if (password === '1029384756') {
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', email);
      setIsLoggedIn(true);
      setUserRole('admin');
      setCurrentUser(email);
      return true;
    }

    // Check for regular user login
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const user = registeredUsers.find((u: any) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('userRole', 'user');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', email);
      setIsLoggedIn(true);
      setUserRole('user');
      setCurrentUser(email);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
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
