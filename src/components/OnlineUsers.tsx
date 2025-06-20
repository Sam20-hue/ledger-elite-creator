
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Circle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface OnlineUser {
  id: string;
  email: string;
  name: string;
  role: string;
  lastActivity: string;
  isOnline: boolean;
}

const OnlineUsers = () => {
  const { currentUser, userRole } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    // Update current user's activity
    const updateActivity = () => {
      if (!currentUser) return;

      const users = JSON.parse(localStorage.getItem('onlineUsers') || '[]');
      const existingUserIndex = users.findIndex((u: OnlineUser) => u.email === currentUser);
      
      const userActivity: OnlineUser = {
        id: existingUserIndex >= 0 ? users[existingUserIndex].id : crypto.randomUUID(),
        email: currentUser,
        name: currentUser.split('@')[0],
        role: userRole || 'user',
        lastActivity: new Date().toISOString(),
        isOnline: true
      };

      if (existingUserIndex >= 0) {
        users[existingUserIndex] = userActivity;
      } else {
        users.push(userActivity);
      }

      localStorage.setItem('onlineUsers', JSON.stringify(users));
      setOnlineUsers(users.filter((u: OnlineUser) => isUserOnline(u.lastActivity)));
    };

    // Update activity on mount and every 30 seconds
    updateActivity();
    const interval = setInterval(updateActivity, 30000);

    // Update activity on user interaction
    const handleActivity = () => updateActivity();
    
    document.addEventListener('click', handleActivity);
    document.addEventListener('keypress', handleActivity);
    document.addEventListener('mousemove', handleActivity);

    return () => {
      clearInterval(interval);
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('keypress', handleActivity);
      document.removeEventListener('mousemove', handleActivity);
    };
  }, [currentUser, userRole]);

  const isUserOnline = (lastActivity: string) => {
    const now = new Date().getTime();
    const lastActiveTime = new Date(lastActivity).getTime();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    return (now - lastActiveTime) < fiveMinutes;
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'sub-admin': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (userRole !== 'admin') {
    return null; // Only admins can see online users
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Online Users ({onlineUsers.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {onlineUsers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No users currently online</p>
        ) : (
          <div className="space-y-3">
            {onlineUsers.map(user => (
              <div key={user.id} className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Badge className={getRoleColor(user.role)}>
                  {user.role}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OnlineUsers;
