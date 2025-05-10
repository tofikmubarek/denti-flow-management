
import React from "react";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  FileText,
  Users,
  Settings,
  PieChart
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-xl font-bold text-brand-dark">Elexadent Operations Suite</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-brand-blue text-white px-3 py-1 rounded-full text-xs">Admin</span>
              <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center">
                <span className="text-sm">EL</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar() {
  const location = useLocation();
  
  const menuItems = [
    { title: "Dashboard", path: "/", icon: LayoutDashboard },
    { title: "Orders", path: "/orders", icon: ShoppingCart },
    { title: "Inventory", path: "/inventory", icon: Package },
    { title: "Reports", path: "/reports", icon: PieChart },
    { title: "Customers", path: "/customers", icon: Users },
    { title: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <Sidebar className="border-r bg-sidebar">
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border">
        <h2 className="text-lg font-bold text-white">Elexadent OMS</h2>
      </div>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild className={cn(
                location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}>
                <Link to={item.path} className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <div className="text-xs text-gray-400">
          <p>Elexadent Ltd.</p>
          <p>v1.0.0</p>
        </div>
      </div>
    </Sidebar>
  );
}

export default MainLayout;
