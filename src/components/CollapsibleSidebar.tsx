import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Users, 
  CreditCard, 
  Settings, 
  UserCheck,
  BarChart3,
  PiggyBank,
  Shield,
  Briefcase
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Bank Accounts", url: "/bank-accounts", icon: CreditCard },
  { title: "Reports", url: "/reports", icon: BarChart3 },
];

const managementItems = [
  { title: "HR Management", url: "/hr", icon: UserCheck, newTab: true },
  { title: "User Management", url: "/admin", icon: Briefcase },
  { title: "Inventory", url: "/inventory", icon: PiggyBank },
  { title: "Integrations", url: "/integrations", icon: Shield },
];

const settingsItems = [
  { title: "Settings", url: "/settings", icon: Settings },
];

export function CollapsibleSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50";

  const handleNavigation = (item: any, e: React.MouseEvent) => {
    if (item.newTab) {
      e.preventDefault();
      window.open(item.url, '_blank');
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                      onClick={(e) => handleNavigation(item, e)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                      onClick={(e) => handleNavigation(item, e)}
                      target={item.newTab ? "_blank" : undefined}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={getNavCls}
                      onClick={(e) => handleNavigation(item, e)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}