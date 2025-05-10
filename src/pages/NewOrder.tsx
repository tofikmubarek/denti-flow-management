import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Plus, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const formSchema = z.object({
  customerName: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  customerEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  customerPhone: z.string().min(5, {
    message: "Please enter a valid phone number.",
  }),
  customerCompany: z.string().optional(),
  orderSource: z.string({
    required_error: "Please select an order source.",
  }),
  notes: z.string().optional(),
  items: z.array(
    z.object({
      code: z.string().min(1, { message: "Product code is required" }),
      description: z.string().min(1, { message: "Description is required" }),
      quantity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Quantity must be a positive number",
      }),
      unitPrice: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Unit price must be a positive number",
      }),
    })
  ).min(1, { message: "At least one item is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const NewOrder = () => {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerCompany: "",
      orderSource: "",
      notes: "",
      items: [
        { code: "", description: "", quantity: "1", unitPrice: "0.00" }
      ],
    },
  });

  // Use useFieldArray to handle the dynamic form array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (values: FormValues) => {
    toast({
      title: "Order Created",
      description: `New order for ${values.customerName} created successfully.`,
    });
    console.log(values);
    // Would handle actual submission to API here
  };

  const addItem = () => {
    append({ code: "", description: "", quantity: "1", unitPrice: "0.00" });
  };

  const calculateTotal = () => {
    const items = form.watch("items");
    return items.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      return sum + (quantity * price);
    }, 0).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-brand-dark">New Order</h1>
        <div className="space-x-2">
          <Button variant="outline" asChild>
            <Link to="/orders">Cancel</Link>
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>
                Enter the customer details for this order.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Dr. John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Bright Smile Dental" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+44 123 456 7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="orderSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Source</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the order source" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                        <SelectItem value="Phone">Phone</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="In Person">In Person</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Where did this order come from?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>
                Add the products for this order.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col space-y-4 p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Item #{index + 1}</h4>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => remove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.code`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Code</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. DENT-001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Dentium SuperLine Implant" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" placeholder="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Price (£)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
              
              <Button type="button" variant="outline" onClick={addItem} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Another Item
              </Button>
              
              <div className="flex justify-end mt-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Order Total</p>
                  <p className="text-xl font-bold text-brand-dark">£{calculateTotal()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter any additional information such as delivery instructions or special requests" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" asChild>
              <Link to="/orders">Cancel</Link>
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewOrder;
