"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

interface POItem {
  productId: string;
  stock: number;
  price: number;
  qty: number;
}

interface PurchaseOrderFormValues {
  supplierId: string;
  orderDate: string;
  expectedDate: string;
  notes: string;
  items: POItem[];
}

export default function CreatePurchaseOrderPage() {

  const form = useForm<PurchaseOrderFormValues>({
    defaultValues: {
      supplierId: "",
      orderDate: new Date().toISOString().split("T")[0],
      expectedDate: "",
      notes: "",
      items: [
        {
          productId: "",
          stock: 0,
          price: 0,
          qty: 1,
        },
      ],
    },
  });

  const { control, watch } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
  const total = subtotal; // No tax/discount in PO example, but you can extend

  const onSubmit = (values: PurchaseOrderFormValues) => {
    console.log("Purchase Order Submitted:", values);
    // Call API to save PO
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center">
        <h1 className="text-3xl font-bold">Create Purchase Order</h1>
        <Link to="/dashboard/suppliers/purchase-orders" className="ml-auto">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4" /> Back to POs
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* ---------------- SUPPLIER & DATES ---------------- */}
          <div className="border rounded-md p-4">
            <h2 className="font-semibold mb-4">Supplier & Details</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Supplier */}
              <FormField
                name="supplierId"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Supplier..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="s1">Supplier A</SelectItem>
                          <SelectItem value="s2">Supplier B</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Order Date */}
              <FormField
                name="orderDate"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Date</FormLabel>
                    <Input type="date" {...field} />
                  </FormItem>
                )}
              />

              {/* Expected Date */}
              <FormField
                name="expectedDate"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Date</FormLabel>
                    <Input type="date" {...field} />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              name="notes"
              control={control}
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Notes</FormLabel>
                  <Textarea placeholder="Optional notes..." {...field} />
                </FormItem>
              )}
            />
          </div>

          {/* ---------------- ITEMS ---------------- */}
          <div className="border rounded-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Order Items</h2>
              <Button
                type="button"
                onClick={() =>
                  append({
                    productId: "",
                    stock: 0,
                    price: 0,
                    qty: 1,
                  })
                }
              >
                + Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-5 gap-3 items-center bg-gray-50 p-3 rounded"
                >
                  {/* Product */}
                  <FormField
                    name={`items.${index}.productId`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Product..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="p1">Product A</SelectItem>
                              <SelectItem value="p2">Product B</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Stock */}
                  <FormField
                    name={`items.${index}.stock`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <Input {...field} type="number" readOnly />
                      </FormItem>
                    )}
                  />

                  {/* Unit Price */}
                  <FormField
                    name={`items.${index}.price`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Cost (RM)</FormLabel>
                        <Input type="number" step="0.01" {...field} />
                      </FormItem>
                    )}
                  />

                  {/* Quantity */}
                  <FormField
                    name={`items.${index}.qty`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <Input type="number" {...field} />
                      </FormItem>
                    )}
                  />

                  {/* Line Total */}
                  <div>
                    <FormLabel>Line Total (RM)</FormLabel>
                    <div className="font-semibold">
                      {(items[index].qty * items[index].price).toFixed(2)}
                    </div>
                  </div>

                  {/* Remove Item */}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline-destructive"
                    onClick={() => remove(index)}
                    className="w-10"
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 space-y-1 text-right pr-2">
              <div>Subtotal: RM {subtotal.toFixed(2)}</div>
              <div className="font-bold text-lg">Total: RM {total.toFixed(2)}</div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button className="px-6" type="submit">
              Create Purchase Order
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
