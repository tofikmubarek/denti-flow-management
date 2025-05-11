
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
import Contacts from "./pages/Contacts";
import Auth from "./pages/Auth";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout><Dashboard /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <MainLayout><Orders /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/orders/new" element={
              <ProtectedRoute>
                <MainLayout><NewOrder /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <MainLayout><Inventory /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/setup-database" element={
              <ProtectedRoute>
                <MainLayout><SetupDatabase /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/contacts" element={
              <ProtectedRoute>
                <MainLayout><Contacts /></MainLayout>
              </ProtectedRoute>
            } />
            {/* Placeholder routes - these would be implemented in future iterations */}
            <Route path="/reports" element={
              <ProtectedRoute>
                <MainLayout><div className="p-4">Reports page coming soon</div></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute>
                <MainLayout><div className="p-4">Customers page coming soon</div></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <MainLayout><div className="p-4">Settings page coming soon</div></MainLayout>
              </ProtectedRoute>
            } />
            {/* These would be implemented as needed */}
            <Route path="/orders/:id" element={
              <ProtectedRoute>
                <MainLayout><div className="p-4">Order detail view coming soon</div></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/inventory/:id" element={
              <ProtectedRoute>
                <MainLayout><div className="p-4">Inventory detail view coming soon</div></MainLayout>
              </ProtectedRoute>
            } />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
