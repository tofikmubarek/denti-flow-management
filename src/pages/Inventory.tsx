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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Open the modal and set the selected product
  const handleUpdateClick = (product: InventoryItem) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handle form submission to update the product
  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;

    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({
          name: selectedProduct.name,
          category: selectedProduct.category,
          subcategory: selectedProduct.subcategory,
          available: selectedProduct.available,
          threshold: selectedProduct.threshold,
          location: selectedProduct.location,
        })
        .eq('id', selectedProduct.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error updating product",
          description: error.message,
        });
      } else {
        toast({
          title: "Product updated",
          description: "The product details have been successfully updated.",
        });
        fetchInventory(); // Refresh the inventory list
        setIsModalOpen(false); // Close the modal
      }
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Error updating product",
        description: e.message,
      });
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Total Products</h2>
            <p className="text-2xl font-bold">{inventory.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Low Stock Items</h2>
            <p className="text-2xl font-bold">
              {inventory.filter((item) => item.available !== null && item.available < (item.threshold || 0)).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Out of Stock</h2>
            <p className="text-2xl font-bold">
              {inventory.filter((item) => item.available === 0).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold">Last Synced</h2>
            <p className="text-2xl font-bold">01:32:35</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline">All Products</Button>
          <Button variant="outline">Implants</Button>
          <Button variant="outline">Components</Button>
          <Button variant="outline">Tools</Button>
        </div>
        <div className="flex space-x-2">
          <Input placeholder="Search inventory..." />
          <Button variant="outline">All Categories</Button>
          <Button variant="outline">All Status</Button>
          <Button variant="outline">Reset</Button>
        </div>
      </div>

      {/* Product Inventory Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Loading inventory...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-red-500">
                      Error loading inventory: {error}
                    </TableCell>
                  </TableRow>
                ) : inventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.available}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleUpdateClick(item)}>
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Update Product Modal */}
      {isModalOpen && selectedProduct && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                label="Product Name"
                value={selectedProduct.name}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
              />
              <Input
                label="Category"
                value={selectedProduct.category || ""}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
              />
              <Input
                label="Stock Level"
                type="number"
                value={selectedProduct.available || ""}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, available: parseInt(e.target.value) })}
              />
              <Input
                label="Threshold"
                type="number"
                value={selectedProduct.threshold || ""}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, threshold: parseInt(e.target.value) })}
              />
              <Input
                label="Location"
                value={selectedProduct.location || ""}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, location: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateProduct}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Inventory;
