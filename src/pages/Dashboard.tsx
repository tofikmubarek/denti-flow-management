import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; // Corrected import path
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";

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
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error);
        } else {
          setOrders(data);
        }
      } catch (err) {
        console.error("Unexpected error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-dark">Dashboard</h1>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button asChild>
            <Link to="/orders/new">
              <ShoppingCart className="h-4 w-4 mr-2" />
              New Order
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Total Orders</h2>
            <p className="text-2xl font-bold">128</p>
            <p className="text-sm text-green-600">↑ 12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Pending Orders</h2>
            <p className="text-2xl font-bold">42</p>
            <p className="text-sm text-yellow-600">Awaiting processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Products Shipped</h2>
            <p className="text-2xl font-bold">267</p>
            <p className="text-sm text-green-600">↑ 8% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Low Stock Items</h2>
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-red-600">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
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
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <Link to={`/orders/${order.id}`} className="text-brand-blue hover:underline">
                          {order.id}
                        </Link>
                      </TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.source}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{order.items_count}</TableCell>
                      <TableCell className="hidden md:table-cell">£{order.total_amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Low Stock Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            <li>Dentium SuperLine 4.0×10mm - 3/5</li>
            <li>Dentium Implant Driver - 2/5</li>
            <li>Impression Coping - 4/10</li>
          </ul>
        </CardContent>
      </Card>

      {/* Quick Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            <li>Create Manual Order</li>
            <li>Update Inventory Levels</li>
            <li>Generate Report</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
