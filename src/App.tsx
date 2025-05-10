
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import NewOrder from "./pages/NewOrder";
import NotFound from "./pages/NotFound";
import SetupDatabase from "./pages/SetupDatabase";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path="/orders" element={<MainLayout><Orders /></MainLayout>} />
          <Route path="/orders/new" element={<MainLayout><NewOrder /></MainLayout>} />
          <Route path="/inventory" element={<MainLayout><Inventory /></MainLayout>} />
          <Route path="/setup-database" element={<MainLayout><SetupDatabase /></MainLayout>} />
          {/* Placeholder routes - these would be implemented in future iterations */}
          <Route path="/reports" element={<MainLayout><div className="p-4">Reports page coming soon</div></MainLayout>} />
          <Route path="/customers" element={<MainLayout><div className="p-4">Customers page coming soon</div></MainLayout>} />
          <Route path="/settings" element={<MainLayout><div className="p-4">Settings page coming soon</div></MainLayout>} />
          {/* These would be implemented as needed */}
          <Route path="/orders/:id" element={<MainLayout><div className="p-4">Order detail view coming soon</div></MainLayout>} />
          <Route path="/inventory/:id" element={<MainLayout><div className="p-4">Inventory detail view coming soon</div></MainLayout>} />
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
