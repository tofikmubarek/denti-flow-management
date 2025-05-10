
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Filter, 
  FileDown, 
  Search,
  CheckCircle2,
  Clock,
  Ban,
  Truck,
  PackageOpen,
  RefreshCcw
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    customer: "Dr. James Smith",
    email: "james.smith@brightsmile.com",
    items: 3,
    total: 249.99,
    source: "Website",
    status: "New",
    date: "2025-05-09T13:45:00",
    company: "Brightsmile Dental"
  },
  {
    id: "ORD-002",
    customer: "Brightsmile Clinic",
    email: "orders@brightsmile.com",
    items: 1,
    total: 799.50,
    source: "WhatsApp",
    status: "Processing",
    date: "2025-05-09T10:30:00",
    company: "Brightsmile Clinic"
  },
  {
    id: "ORD-003",
    customer: "Dr. Sarah Johnson",
    email: "sarah@citysmiles.co.uk",
    items: 5,
    total: 1250.00,
    source: "Email",
    status: "Dispatched",
    date: "2025-05-08T16:15:00",
    company: "City Smiles"
  },
  {
    id: "ORD-004",
    customer: "City Dental Practice",
    email: "orders@citydental.com",
    items: 2,
    total: 325.75,
    source: "Phone",
    status: "Completed",
    date: "2025-05-08T09:20:00",
    company: "City Dental Practice"
  },
  {
    id: "ORD-005",
    customer: "Dr. Michael Wong",
    email: "m.wong@dentalcare.org",
    items: 1,
    total: 149.99,
    source: "Website",
    status: "On Hold",
    date: "2025-05-07T14:10:00",
    company: "Dental Care Associates"
  },
  {
    id: "ORD-006",
    customer: "Smile Bright Clinic",
    email: "reception@smilebright.dental",
    items: 4,
    total: 580.25,
    source: "Website",
    status: "New",
    date: "2025-05-07T11:05:00",
    company: "Smile Bright Clinic"
  },
  {
    id: "ORD-007",
    customer: "Dr. Emma Williams",
    email: "emma@premiumdental.co.uk",
    items: 2,
    total: 420.00,
    source: "Email",
    status: "Processing",
    date: "2025-05-06T15:30:00",
    company: "Premium Dental"
  },
  {
    id: "ORD-008",
    customer: "Perfect Smile Ltd",
    email: "info@perfectsmile.com",
    items: 3,
    total: 675.50,
    source: "WhatsApp",
    status: "Awaiting Confirmation",
    date: "2025-05-06T09:45:00",
    company: "Perfect Smile Ltd"
  },
  {
    id: "ORD-009",
    customer: "Dr. Robert Chen",
    email: "r.chen@dentalexperts.com",
    items: 1,
    total: 899.99,
    source: "Phone",
    status: "Cancelled",
    date: "2025-05-05T13:20:00",
    company: "Dental Experts"
  },
  {
    id: "ORD-010",
    customer: "Elite Dentistry",
    email: "orders@elitedentistry.co.uk",
    items: 6,
    total: 1725.75,
    source: "Website",
    status: "Completed",
    date: "2025-05-05T10:15:00",
    company: "Elite Dentistry"
  }
];

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "new": return "status-new";
    case "processing": return "status-processing";
    case "dispatched": return "status-dispatched";
    case "completed": return "status-completed";
    case "on hold": return "status-onhold";
    case "cancelled": return "status-cancelled";
    case "awaiting confirmation": return "bg-violet-100 text-violet-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "new": return <Clock className="h-4 w-4 mr-1" />;
    case "processing": return <RefreshCcw className="h-4 w-4 mr-1" />;
    case "dispatched": return <Truck className="h-4 w-4 mr-1" />;
    case "completed": return <CheckCircle2 className="h-4 w-4 mr-1" />;
    case "on hold": return <PackageOpen className="h-4 w-4 mr-1" />;
    case "cancelled": return <Ban className="h-4 w-4 mr-1" />;
    case "awaiting confirmation": return <Clock className="h-4 w-4 mr-1" />;
    default: return <Clock className="h-4 w-4 mr-1" />;
  }
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [sourceFilter, setSourceFilter] = useState<string | undefined>();

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesSource = !sourceFilter || order.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-dark">Orders</h1>
        <div className="space-x-2">
          <Button variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <ShoppingCart className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 md:space-x-2">
            <Tabs defaultValue="all" className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search orders..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Awaiting Confirmation">Awaiting Confirmation</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Dispatched">Dispatched</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sources</SelectItem>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex-shrink-0" onClick={() => {
                setSearchTerm("");
                setStatusFilter(undefined);
                setSourceFilter(undefined);
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Company</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="hidden md:table-cell">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <Link to={`/orders/${order.id}`} className="text-brand-blue hover:underline">
                        {order.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{order.company}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(order.date).toLocaleString('en-GB', { 
                        day: 'numeric', 
                        month: 'short', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.source}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">£{order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className={`status-badge ${getStatusClass(order.status)} flex items-center w-fit`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/orders/${order.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No orders found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {filteredOrders.length} of {mockOrders.length} orders
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
