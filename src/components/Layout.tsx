import React from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, User } from 'lucide-react';
import { CollapsibleSidebar } from './CollapsibleSidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useRealtimePresence } from '@/hooks/useRealtimePresence';
import { RealtimeDataSync } from './RealtimeDataSync';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Layout: React.FC = () => {
  const { user, signOut } = useSupabaseAuth();
  const location = useLocation();
  const { toast } = useToast();
  const { onlineUsers } = useRealtimePresence(location.pathname);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  const refreshData = () => {
    // This will trigger a page reload to refresh all data
    window.location.reload();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RealtimeDataSync table="invoices" onDataChange={refreshData}>
          <RealtimeDataSync table="clients" onDataChange={refreshData}>
            <RealtimeDataSync table="bank_accounts" onDataChange={refreshData}>
              <CollapsibleSidebar />
              
              <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 border-b bg-card flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger />
                    <h1 className="text-xl font-bold">Numera</h1>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {onlineUsers.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="animate-pulse">
                          {onlineUsers.length} user{onlineUsers.length > 1 ? 's' : ''} online
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{user?.email}</span>
                    </div>
                    
                    <ThemeToggle />
                    
                    <Button variant="ghost" size="sm" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </header>

                {/* Main content */}
                <main className="flex-1 overflow-auto p-6">
                  <Outlet />
                </main>
              </div>
            </RealtimeDataSync>
          </RealtimeDataSync>
        </RealtimeDataSync>
      </div>
    </SidebarProvider>
  );
};

export default Layout;