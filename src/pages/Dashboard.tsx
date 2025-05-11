import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, AlertCircle, TrendingUp, Filter, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

const mockRecentOrders = [
  {
    id: "ORD-001",
    customer: "Dr. James Smith",
    items: 3,
    total: 249.99,
    source: "Website",
    status: "New",
    date: "2025-05-09T13:45:00",
  },
  {
    id: "ORD-002",
    customer: "Brightsmile Clinic",
    items: 1,
    total: 799.50,
    source: "WhatsApp",
    status: "Processing",
    date: "2025-05-09T10:30:00",
  },
  {
    id: "ORD-003",
    customer: "Dr. Sarah Johnson",
    items: 5,
    total: 1250.00,
    source: "Email",
    status: "Dispatched",
    date: "2025-05-08T16:15:00",
  },
  {
    id: "ORD-004",
    customer: "City Dental Practice",
    items: 2,
    total: 325.75,
    source: "Phone",
    status: "Completed",
    date: "2025-05-08T09:20:00",
  },
  {
    id: "ORD-005",
    customer: "Dr. Michael Wong",
    items: 1,
    total: 149.99,
    source: "Website",
    status: "On Hold",
    date: "2025-05-07T14:10:00",
  },
];

const mockLowStock = [
  { id: "INV-001", name: "Dentium SuperLine 4.0×10mm", category: "Implants", available: 3, threshold: 5 },
  { id: "INV-002", name: "Dentium Implant Driver", category: "Tools", available: 2, threshold: 5 },
  { id: "INV-003", name: "Impression Coping", category: "Components", available: 4, threshold: 10 },
];

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "new": return "status-new";
    case "processing": return "status-processing";
    case "dispatched": return "status-dispatched";
    case "completed": return "status-completed";
    case "on hold": return "status-onhold";
    case "cancelled": return "status-cancelled";
    default: return "bg-gray-100 text-gray-800";
  }
};

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-dark">Dashboard</h1>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button asChild>
            <Link to="/new-order">
              <ShoppingCart className="h-4 w-4 mr-2" />
              New Order
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div className="stats-label">Total Orders</div>
              <ShoppingCart className="h-4 w-4 text-brand-blue" />
            </div>
            <div className="stats-value">128</div>
            <div className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              12% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div className="stats-label">Pending Orders</div>
              <FileText className="h-4 w-4 text-amber-500" />
            </div>
            <div className="stats-value">42</div>
            <div className="text-xs text-brand-gray mt-1">Awaiting processing</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div className="stats-label">Products Shipped</div>
              <Package className="h-4 w-4 text-brand-teal" />
            </div>
            <div className="stats-value">267</div>
            <div className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              8% from last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div className="stats-label">Low Stock Items</div>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
            <div className="stats-value">8</div>
            <div className="text-xs text-red-600 mt-1">Requires attention</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders and Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Recent Orders</CardTitle>
                <Link to="/orders">
                  <Button variant="ghost" size="sm" className="text-brand-blue">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="website">Website</TabsTrigger>
                    <TabsTrigger value="manual">Manual</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="relative w-48">
                  <Input 
                    placeholder="Search orders..." 
                    className="pl-8"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead className="hidden md:table-cell">Items</TableHead>
                      <TableHead className="hidden md:table-cell">Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRecentOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <Link to={`/orders/${order.id}`} className="text-brand-blue hover:underline">
                            {order.id}
                          </Link>
                        </TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.source}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{order.items}</TableCell>
                        <TableCell className="hidden md:table-cell">£{order.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <span className={`status-badge ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Low Stock Alerts</CardTitle>
                <Link to="/inventory">
                  <Button variant="ghost" size="sm" className="text-brand-blue">
                    Manage Inventory
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLowStock.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center">
                        <span className="text-sm font-bold mr-2 text-red-600">{item.available}</span>
                        <span className="text-xs text-gray-500">/ {item.threshold}</span>
                      </div>
                      <Link to={`/inventory/${item.id}`} className="text-xs text-brand-blue hover:underline">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Create Manual Order
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Update Inventory Levels
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
