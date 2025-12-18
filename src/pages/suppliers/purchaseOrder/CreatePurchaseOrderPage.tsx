
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
  FormMessage,
} from "@/components/ui/form";
// select import removed; using Popover+Command for searchable selects
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";

import { ArrowLeft } from "lucide-react";

import { toast } from "sonner";

import { useAddPurchaseOrderMutation } from "@/store/features/purchaseOrder/purchaseOrderApiService";
import { Link, useNavigate } from "react-router";
import { useGetAllSuppliersQuery } from "@/store/features/suppliers/supplierApiService";
import type { Supplier } from "@/types/supplier.types";
import { useGetAllProductsQuery } from "@/store/features/admin/productsApiService";
import { useState } from "react";
import { useAppSelector } from "@/store/store";

/* ---------------- TYPES ---------------- */
interface POItem {
  productId: string;
  quantity: number;
  unit_cost: number;
  discount: number;
}

interface PurchaseOrderFormValues {
  supplierId: string;
  order_date: string;
  expected_delivery_date: string;
  notes: string;
  items: POItem[];
}

/* ---------------------------------------- */

export default function CreatePurchaseOrderPage() {
  const navigate = useNavigate();

  const currency = useAppSelector((state) => state.currency.value);
  const [addPurchaseOrder, { isLoading }] = useAddPurchaseOrderMutation();


  const form = useForm<PurchaseOrderFormValues>({
    defaultValues: {
      supplierId: "",
      order_date: new Date().toISOString().split("T")[0],
      expected_delivery_date: "",
      notes: "",
      items: [
        {
          productId: "",
          quantity: 1,
          unit_cost: 0,
          discount: 0,
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

  /* ---------------- Searchable select components ---------------- */



  function SupplierSelectField({
    field,
  }: {
    field: { value?: string; onChange: (v: string) => void };
  }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    // Call API with search query
    const { data, isLoading } = useGetAllSuppliersQuery({
      page: 1,
      limit: 20,
      search: query,
    });

    const list = Array.isArray(data?.data) ? data.data : [];

    const selected = list.find(
      (s: Supplier) => String(s.id) === String(field.value)
    );

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {selected ? selected.name : "Select Supplier..."}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[320px] p-0">
          <Command>
            <CommandInput
              placeholder="Search suppliers..."
              onValueChange={(value) => setQuery(value)}
            />

            <CommandList>
              <CommandEmpty>No suppliers found.</CommandEmpty>

              <CommandGroup>
                {isLoading && (
                  <div className="py-2 px-3 text-sm text-gray-500">
                    Loading...
                  </div>
                )}

                {!isLoading &&
                  list.map((supplier) => (
                    <CommandItem
                      key={supplier.id}
                      onSelect={() => {
                        field.onChange(String(supplier.id));
                        setOpen(false);
                      }}
                    >
                      {supplier.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }






  function ProductSelectField({
    field,
  }: {
    field: { value?: string; onChange: (v: string) => void };
  }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const { data, isLoading } = useGetAllProductsQuery({
      page: 1,
      limit: 50,
      search: query,
    });

    const list = Array.isArray(data?.data) ? data.data : [];


    const selected = list.find(
      (p) => String(p.id) === String(field.value)
    );

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">

            {selected
              ? `${selected.name} (SKU: ${selected.sku}) (${selected.unit?.name || "-"})`
              : "Select Product..."}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[320px] p-0">
          <Command>
            <CommandInput
              placeholder="Search products..."
              onValueChange={(value) => setQuery(value)}
            />

            <CommandList>
              <CommandEmpty>No products found.</CommandEmpty>

              <CommandGroup>
                {isLoading && (
                  <div className="py-2 px-3 text-sm text-gray-500">
                    Loading...
                  </div>
                )}

                {!isLoading &&
                  list.map((product) => (
                    <CommandItem
                      key={product.id}
                      onSelect={() => {
                        field.onChange(String(product.id));
                        setOpen(false);
                      }}
                    >
                      {product.name} (SKU: {product.sku}) ( {product.unit?.name || "-"})
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }






  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity) * Number(item.unit_cost) -
      Number(item.discount || 0),
    0
  );

  const totalDiscount = items.reduce(
    (sum, item) => sum + Number(item.discount || 0),
    0
  );

  const TAX_RATE = 0; // 0%

  const taxAmount = (subtotal * TAX_RATE) / 100;

  const grandTotal = subtotal + taxAmount;



  /* ---------------- ON SUBMIT ---------------- */
  const onSubmit = async (values: PurchaseOrderFormValues) => {
    try {
      const payload = {
        supplier_id: Number(values.supplierId),
        order_date: values.order_date,
        expected_delivery_date: values.expected_delivery_date,
        notes: values.notes,
        items: values.items.map((item) => ({
          product_id: Number(item.productId),
          quantity: Number(item.quantity),
          unit_cost: Number(item.unit_cost),
          discount: Number(item.discount),
        })),
      };

      const response = await addPurchaseOrder(payload).unwrap();

      console.log("Purchase Order Created:", response);

      toast.success("Purchase Order Created Successfully");

      navigate("/dashboard/suppliers/purchase-orders");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create purchase order");
      console.error(error);
    }
  };

  /* ---------------------------------------- */
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
          {/* ---------------- SUPPLIER & DETAILS ---------------- */}
          <div className="border rounded-md p-4">
            <h2 className="font-semibold mb-4">Supplier & Details</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Supplier */}
              <FormField
                name="supplierId"
                control={control}
                rules={{ required: "Supplier is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <FormControl>
                      <SupplierSelectField field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Order Date */}
              <FormField
                name="order_date"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Expected Date */}
              <FormField
                name="expected_delivery_date"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
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
                  <FormControl>
                    <Textarea placeholder="Optional notes..." {...field} />
                  </FormControl>
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
                    quantity: 1,
                    unit_cost: 0,
                    discount: 0,
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
                  className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded"
                >
                  {/* Product */}
                  <FormField
                    name={`items.${index}.productId`}
                    control={control}
                    rules={{ required: "Product required" }}
                    render={({ field }) => (
                      <FormItem className="col-span-4">
                        <FormLabel>Product</FormLabel>
                        <FormControl>
                          <ProductSelectField field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />



                  {/* Unit Price */}
                  <FormField
                    name={`items.${index}.unit_cost`}
                    control={control}
                    rules={{ required: "Price required" }}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quantity */}
                  <FormField
                    name={`items.${index}.quantity`}
                    control={control}
                    rules={{ required: "Quantity required" }}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* discount */}
                  <FormField
                    name={`items.${index}.discount`}
                    control={control}
                    rules={{ required: "Discount required" }}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Discount</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Line Total */}
                  <div className="col-span-1">
                    <FormLabel>Total</FormLabel>
                    <div className="font-semibold">
                      {currency} {(
                        items[index].quantity * items[index].unit_cost -
                        items[index].discount
                      ).toFixed(2)}

                    </div>
                  </div>

                  {/* Remove */}
                  <div className="col-span-1 flex justify-end">
                    <Button
                      type="button"
                      variant="outline-destructive"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      X
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 text-right pr-2 space-y-1 text-sm">
              <div>
                Subtotal: {currency} {(subtotal + totalDiscount).toFixed(2)}
              </div>

              <div className="text-red-600">
                Discount: - {currency} {totalDiscount.toFixed(2)}
              </div>

              <div>
                Tax ({TAX_RATE}%): {currency} {taxAmount.toFixed(2)}
              </div>

              <div className="font-bold text-lg border-t pt-2">
                Total: {currency} {grandTotal.toFixed(2)}
              </div>
            </div>


          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button className="px-6" type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Purchase Order"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

