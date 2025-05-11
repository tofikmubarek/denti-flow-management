
import React, { useState, useEffect } from "react";
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
  Plus, 
  Filter, 
  FileDown, 
  Search, 
  RefreshCcw,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Define inventory item type to match the database schema
type InventoryItem = {
  id: string;
  code: string;
  name: string;
  category: string | null;
  subcategory: string | null;
  available: number | null;
  threshold: number | null;
  location: string | null;
  last_updated: string | null;
};

const getStockStatus = (available: number | null, threshold: number | null) => {
  if (!available || available <= 0) return "Out of Stock";
  if (!threshold || available < threshold) return "Low Stock";
  if (available >= threshold && available < (threshold * 2)) return "Adequate";
  return "Good";
};

const getStockStatusClass = (status: string) => {
  switch (status) {
    case "Out of Stock": return "bg-red-100 text-red-800";
    case "Low Stock": return "bg-amber-100 text-amber-800";
    case "Adequate": return "bg-blue-100 text-blue-800";
    case "Good": return "bg-green-100 text-green-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getStockIcon = (status: string) => {
  switch (status) {
    case "Out of Stock": 
    case "Low Stock": 
      return <AlertTriangle className="h-4 w-4 mr-1" />;
    case "Adequate": 
    case "Good": 
      return <CheckCircle className="h-4 w-4 mr-1" />;
    default: 
      return null;
  }
};

const getProgressColor = (available: number | null, threshold: number | null) => {
  if (!available || !threshold) return "bg-red-500";
  const ratio = available / threshold;
  if (ratio <= 0) return "bg-red-500";
  if (ratio < 1) return "bg-amber-500";
  if (ratio < 2) return "bg-blue-500";
  return "bg-green-500";
};

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all_categories");
  const [stockFilter, setStockFilter] = useState<string>("all_statuses");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch inventory items from Supabase
  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      
      if (error) {
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Error loading inventory",
          description: error.message,
        });
      } else if (data) {
        setInventory(data as InventoryItem[]);
        
        // Extract unique categories for the filter
        const uniqueCategories = Array.from(new Set(data.map(item => item.category).filter(Boolean))) as string[];
        setCategories(uniqueCategories);
      }
    } catch (e: any) {
      setError(e.message);
      toast({
        variant: "destructive",
        title: "Error loading inventory",
        description: e.message,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load inventory data when component mounts
  useEffect(() => {
    fetchInventory();
  }, []);
  
  // Filter inventory based on search term and filters
  const filteredInventory = inventory.filter(item => {
    // Filter by search term
    const matchesSearch = !searchTerm || 
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filter by category
    const matchesCategory = 
      categoryFilter === "all_categories" || 
      item.category === categoryFilter;
    
    // Filter by tab selection
    const matchesTab = 
      activeTab === "all" || 
      (item.category && item.category.toLowerCase() === activeTab.toLowerCase());
    
    // Filter by stock status
    const status = getStockStatus(item.available, item.threshold);
    const matchesStock = stockFilter === "all_statuses" || status === stockFilter;
    
    return matchesSearch && matchesCategory && matchesStock && matchesTab;
  });

  // Calculate statistics
  const lowStockCount = inventory.filter(item => {
    if (item.available === null || item.threshold === null) return false;
    return item.available < item.threshold;
  }).length;
  
  const outOfStockCount = inventory.filter(item => {
    return item.available === null || item.available <= 0;
  }).length;
  
  // Handle refresh/sync button
  const handleRefresh = () => {
    fetchInventory();
    toast({
      title: "Inventory refreshed",
      description: "The inventory data has been updated from the database",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-dark">Inventory</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="stats-label">Total Products</div>
            <div className="stats-value">{inventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="stats-label">Low Stock Items</div>
            <div className="stats-value text-amber-500">
              {lowStockCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="stats-label">Out of Stock</div>
            <div className="stats-value text-red-500">
              {outOfStockCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="stats-label">Last Synced</div>
            <div className="text-sm font-medium text-brand-dark">
              {new Date().toLocaleTimeString()}
            </div>
            <Button variant="link" className="p-0 h-auto text-xs text-brand-blue" onClick={handleRefresh}>
              Sync Now
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0 md:space-x-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="implants">Implants</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_categories">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_statuses">All Status</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Adequate">Adequate</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex-shrink-0" onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all_categories");
                setStockFilter("all_statuses");
                setActiveTab("all");
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
                  <TableHead>Code</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Loading inventory...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-red-500">
                      Error loading inventory: {error}
                    </TableCell>
                  </TableRow>
                ) : filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No products found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => {
                    const status = getStockStatus(item.available, item.threshold);
                    return (
                      <TableRow key={item.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{item.code}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.subcategory}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{item.location}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{item.available} units</span>
                              <span className="text-gray-500">Min: {item.threshold}</span>
                            </div>
                            <Progress 
                              value={item.available && item.threshold ? (item.available / (item.threshold * 2)) * 100 : 0} 
                              max={100} 
                              className={getProgressColor(item.available, item.threshold)}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`status-badge ${getStockStatusClass(status)} flex items-center w-fit px-2 py-1 rounded text-xs`}>
                            {getStockIcon(status)}
                            {status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {filteredInventory.length} of {inventory.length} products
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
