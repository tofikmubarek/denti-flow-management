
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
  Plus, 
  Filter, 
  FileDown, 
  Search, 
  RefreshCcw,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock inventory data
const mockInventory = [
  {
    id: "INV-001",
    code: "DT-SL-4010",
    name: "Dentium SuperLine 4.0×10mm",
    category: "Implants",
    subcategory: "SuperLine",
    available: 18,
    threshold: 5,
    location: "Main Storage",
    lastUpdated: "2025-05-01T10:30:00"
  },
  {
    id: "INV-002",
    code: "DT-SL-3510",
    name: "Dentium SuperLine 3.5×10mm",
    category: "Implants",
    subcategory: "SuperLine",
    available: 12,
    threshold: 5,
    location: "Main Storage",
    lastUpdated: "2025-05-01T10:30:00"
  },
  {
    id: "INV-003",
    code: "DT-SL-4008",
    name: "Dentium SuperLine 4.0×8mm",
    category: "Implants",
    subcategory: "SuperLine",
    available: 3,
    threshold: 5,
    location: "Main Storage",
    lastUpdated: "2025-05-02T14:15:00"
  },
  {
    id: "INV-004",
    code: "DT-ID-001",
    name: "Dentium Implant Driver",
    category: "Tools",
    subcategory: "Drivers",
    available: 8,
    threshold: 3,
    location: "Tool Storage",
    lastUpdated: "2025-04-28T09:45:00"
  },
  {
    id: "INV-005",
    code: "DT-IC-001",
    name: "Impression Coping",
    category: "Components",
    subcategory: "Impressions",
    available: 4,
    threshold: 10,
    location: "Secondary Storage",
    lastUpdated: "2025-05-03T16:20:00"
  },
  {
    id: "INV-006",
    code: "DT-HB-001",
    name: "Healing Abutment",
    category: "Components",
    subcategory: "Abutments",
    available: 22,
    threshold: 15,
    location: "Secondary Storage",
    lastUpdated: "2025-04-30T11:10:00"
  },
  {
    id: "INV-007",
    code: "DT-ST-4010",
    name: "Dentium SlimLine 4.0×10mm",
    category: "Implants",
    subcategory: "SlimLine",
    available: 7,
    threshold: 5,
    location: "Main Storage",
    lastUpdated: "2025-05-01T10:30:00"
  },
  {
    id: "INV-008",
    code: "DT-ST-3508",
    name: "Dentium SlimLine 3.5×8mm",
    category: "Implants",
    subcategory: "SlimLine",
    available: 9,
    threshold: 5,
    location: "Main Storage",
    lastUpdated: "2025-04-29T15:45:00"
  }
];

const getStockStatus = (available: number, threshold: number) => {
  if (available <= 0) return "Out of Stock";
  if (available < threshold) return "Low Stock";
  if (available >= threshold && available < threshold * 2) return "Adequate";
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

const getProgressColor = (available: number, threshold: number) => {
  const ratio = available / threshold;
  if (ratio <= 0) return "bg-red-500";
  if (ratio < 1) return "bg-amber-500";
  if (ratio < 2) return "bg-blue-500";
  return "bg-green-500";
};

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [stockFilter, setStockFilter] = useState<string | undefined>();

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const status = getStockStatus(item.available, item.threshold);
    const matchesStock = !stockFilter || status === stockFilter;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-dark">Inventory</h1>
        <div className="space-x-2">
          <Button variant="outline">
            <RefreshCcw className="h-4 w-4 mr-2" />
            Sync with Mintsoft
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
            <div className="stats-value">{mockInventory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="stats-label">Low Stock Items</div>
            <div className="stats-value text-amber-500">
              {mockInventory.filter(item => item.available < item.threshold).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="stats-label">Out of Stock</div>
            <div className="stats-value text-red-500">
              {mockInventory.filter(item => item.available <= 0).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="stats-label">Last Synced</div>
            <div className="text-sm font-medium text-brand-dark">1 hour ago</div>
            <Button variant="link" className="p-0 h-auto text-xs text-brand-blue">
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
            <Tabs defaultValue="all" className="w-full md:w-auto">
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
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="Implants">Implants</SelectItem>
                  <SelectItem value="Tools">Tools</SelectItem>
                  <SelectItem value="Components">Components</SelectItem>
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Adequate">Adequate</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex-shrink-0" onClick={() => {
                setSearchTerm("");
                setCategoryFilter(undefined);
                setStockFilter(undefined);
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
                {filteredInventory.map((item) => {
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
                            value={(item.available / (item.threshold * 2)) * 100} 
                            max={100} 
                            className={getProgressColor(item.available, item.threshold)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`status-badge ${getStockStatusClass(status)} flex items-center w-fit`}>
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
                })}
                {filteredInventory.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No products found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {filteredInventory.length} of {mockInventory.length} products
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
