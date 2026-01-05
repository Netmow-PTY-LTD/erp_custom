"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import { useGetAllProductsQuery } from "@/store/features/admin/productsApiService";
import {
  useAddSalesInvoiceMutation,
  useAddSalesOrderMutation,
} from "@/store/features/salesOrder/salesOrder";
import { useGetCustomersQuery } from "@/store/features/customers/customersApi";
import type { SalesOrderFormValues } from "@/types/salesOrder.types";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAppSelector } from "@/store/store";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const orderSchema = z
  .object({
    customer_id: z.number().min(1, "Customer is required"),
    shipping_address: z.string().min(5, "Shipping address is required"),
    order_date: z.string().min(1, "Order date is required"),
    due_date: z.string().min(1, "Due date is required"),
    items: z.array(
      z.object({
        product_id: z.number().min(1, "Product is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unit_price: z.number().min(1, "Unit price must be at least 1"),
        discount: z.number().min(0, "Discount must be 0 or more"),
        sales_tax: z.number().min(0, "Sales tax must be 0 or more"),
      })
    ),
  })
  .refine(
    (data) => {
      const orderDate = new Date(data.order_date);
      const dueDate = new Date(data.due_date);

      return dueDate >= orderDate;
    },
    {
      message: "Due date cannot be earlier than order date",
      path: ["due_date"], // 👈 error shows under Due Date field
    }
  );

export default function CreateSalesOrderPage() {
  const [searchParam] = useSearchParams();
  const customerIdFromParam = searchParam.get("customerId");
  const navigate = useNavigate();
  const [addSalesOrder, { isLoading }] = useAddSalesOrderMutation();
  const [createInvoice] = useAddSalesInvoiceMutation();

  const currency = useAppSelector((state) => state.currency.value);
  

  const form = useForm<SalesOrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer_id: 0,
      shipping_address: "",
      order_date: "",
      due_date: "",
      items: [{ product_id: 0, quantity: 1, unit_price: 0, discount: 0 }],
    },
  });

  const { control, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // const items = watch("items");

  // const subtotal = items.reduce(
  //   (sum, it) => sum + Number(it.unit_price || 0) * Number(it.quantity || 0),
  //   0
  // );

  // const totalDiscount = items.reduce(
  //   (sum, it) => sum + Number(it.discount || 0),
  //   0
  // );

  // //console.log("totalDiscount", totalDiscount);

  // const total = subtotal - totalDiscount;

  // const taxedAmount = total * items[0].sales_tax / 100;

  // const grandTotal = total + taxedAmount;

  const items = watch("items") ?? [];

  const calculatedItems = items.map((it) => {
    const unitPrice = Number(it.unit_price || 0);
    const qty = Number(it.quantity || 0);
    const discount = Number(it.discount || 0);
    const taxRate = Number(it.sales_tax || 0);

    // 1️⃣ Subtotal (before discount & tax)
    const subtotal = unitPrice * qty;

    // 2️⃣ Amount after discount
    const taxableAmount = subtotal - discount;

    // 3️⃣ Tax amount
    const taxAmount = taxableAmount * (taxRate / 100);

    // 4️⃣ Line total (final)
    const total = taxableAmount + taxAmount;

    return {
      subtotal,
      discount,
      taxableAmount,
      taxAmount,
      total,
    };
  });

  // 🔢 Totals across all products
  const totalSubtotal = calculatedItems.reduce(
    (sum, it) => sum + it.subtotal,
    0
  );

  const totalDiscount = calculatedItems.reduce(
    (sum, it) => sum + it.discount,
    0
  );

  // const totalTaxableAmount = calculatedItems.reduce(
  //   (sum, it) => sum + it.taxableAmount,
  //   0
  // );

  const totalTax = calculatedItems.reduce((sum, it) => sum + it.taxAmount, 0);

  const grandTotal = calculatedItems.reduce((sum, it) => sum + it.total, 0);

  const onSubmit = async (values: SalesOrderFormValues) => {
    if (values.customer_id === 0)
      return toast.error("Please select a customer");
    if (values.items.some((i) => i.product_id === 0))
      return toast.error("Please select all products");

    try {
      const payload = {
        order_date: values.order_date,
        due_date: values.due_date,
        customer_id: values.customer_id,
        shipping_address: values.shipping_address,
        items: values.items.map((i) => ({
          product_id: i.product_id,
          quantity: Number(i.quantity),
          unit_price: Number(i.unit_price),
          discount: Number(i.discount),
          sales_tax: Number(i.sales_tax),
        })),
      };

      // ➤ STEP 1: Create Sales Order
      const orderRes = await addSalesOrder(payload).unwrap();

      if (orderRes.status && orderRes?.data?.id) {
        toast.success("Sales Order Created! Creating Invoice...");

        // ➤ STEP 2: Create Invoice Automatically
        const invoicePayload = {
          order_id: orderRes.data.id,
          due_date: values.due_date, // same due date as order
        };

        const invoiceRes = await createInvoice(invoicePayload).unwrap();

        if (invoiceRes.status) {
          toast.success("Invoice Created Successfully!");
        } else {
          toast.error("Order created but invoice failed to generate.");
        }

        // ➤ Redirect
        navigate("/dashboard/sales/orders");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create sales order");
      console.error(error);
    }
  };

  /* -------------------- Customer & Product Select Fields -------------------- */
  const CustomerSelectField = ({
    field,
  }: {
    field: { value: number; onChange: (v: number) => void };
  }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const { data, isLoading } = useGetCustomersQuery({
      page: 1,
      limit: 20,
      search: query,
    });
    const list = Array.isArray(data?.data) ? data.data : [];
    const selected = list.find((c) => c.id === field.value);
    
    if (customerIdFromParam) {
      const preselected = list.find(
        (c) => c.id === Number(customerIdFromParam)
      );
      if (preselected) field.onChange(preselected.id);
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full justify-between" variant="outline">
            {selected ? selected.name : "Select Customer..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder="Search customers..."
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>No customers found</CommandEmpty>
              <CommandGroup>
                {isLoading && (
                  <div className="py-2 px-3 text-sm text-gray-500">
                    Loading...
                  </div>
                )}
                {!isLoading &&
                  list.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      onSelect={() => {
                        field.onChange(customer.id);
                        setOpen(false);
                      }}
                    >
                      {customer.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  const ProductSelectField = ({
    field,
    onSelectTax,
  }: {
    field: {
      value: number;
      onChange: (v: number) => void;
    };
    onSelectTax?: (v: number) => void;
  }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const { data, isLoading } = useGetAllProductsQuery({
      page: 1,
      limit: 50,
      search: query,
    });
    const list = Array.isArray(data?.data) ? data.data : [];
    const selected = list.find((p) => p.id === field.value);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full justify-between" variant="outline">
            {selected
              ? `${selected.name} (SKU: ${selected.sku}) (Unit: ${selected.unit.name})`
              : "Select product..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder="Search products..."
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>No products found</CommandEmpty>
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
                        field.onChange(product.id);
                        onSelectTax?.(product.sales_tax ?? 0);
                        setOpen(false);
                      }}
                    >
                      {product.name} (SKU: {product.sku}) (Unit:{" "}
                      {product.unit.name})
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center flex-wrap gap-2">
        <h1 className="text-3xl font-bold">Create Sales Order</h1>
        <Link to="/dashboard/sales/orders" className="ml-auto">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Customer & Shipping */}
          <div className="border rounded-md p-4 space-y-4">
            <h2 className="font-semibold mb-4">Customer & Shipping</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <FormField
                name="customer_id"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <FormControl>
                      <CustomerSelectField field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="order_date"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Date</FormLabel>
                    <Input type="date" {...field} className="block" />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="due_date"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <Input type="date" {...field} className="block" />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="shipping_address"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter shipping address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Order Items */}
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">Order Items</h2>
              <Button
                type="button"
                onClick={() =>
                  append({
                    product_id: 0,
                    quantity: 1,
                    unit_price: 0,
                    discount: 0,
                    sales_tax: 0,
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
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start bg-gray-50 p-3 rounded"
                >
                  <FormField
                    name={`items.${index}.product_id`}
                    control={control}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-4">
                        <FormLabel>Product</FormLabel>
                        <FormControl>
                          <ProductSelectField
                            field={field}
                            onSelectTax={(tax) => {
                              setValue(`items.${index}.sales_tax`, tax);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name={`items.${index}.unit_price`}
                    control={control}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Unit Price ({currency})</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            className="bg-white"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name={`items.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>Qty</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            className="bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name={`items.${index}.discount`}
                    control={control}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>Discount</FormLabel>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          className="bg-white"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`items.${index}.sales_tax`}
                    control={control}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>Tax %</FormLabel>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          className="bg-white"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          readOnly
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="sm:col-span-1">
                    <label className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 data-[error=true]:text-destructive mb-2">
                      Tax Amount
                    </label>
                    <Input
                      type="number"
                      value={
                        calculatedItems[index]?.taxAmount.toFixed(2) ?? "0.00"
                      }
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div className="sm:col-span-1 font-semibold text-right self-center">
                    {currency} {calculatedItems[index]?.total.toFixed(2)}
                  </div>

                  <div className="sm:flex sm:justify-end mt-2 sm:mt-0">
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

            {/* Order Summary */}
            <div className="border-t mt-4 pt-4 space-y-2 text-right">
              <div className="flex justify-end gap-4">
                <div className="font-semibold">Subtotal:</div>
                <div>
                  {currency} {totalSubtotal.toFixed(2)}
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <div className="font-semibold">Total Discount:</div>
                <div>
                  {currency} {totalDiscount.toFixed(2)}
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <div className="font-semibold">Total Tax:</div>
                <div>
                  {currency} {totalTax.toFixed(2)}
                </div>
              </div>
              <div className="flex justify-end gap-4 text-lg font-bold">
                <div>Total:</div>
                <div>
                  {currency} {grandTotal.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="px-6">
              {isLoading ? "Creating..." : "Create Sales Order"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
