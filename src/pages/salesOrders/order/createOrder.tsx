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
import { Link, useNavigate } from "react-router";
import { useAppSelector } from "@/store/store";

export default function CreateSalesOrderPage() {
  const navigate = useNavigate();
  const [addSalesOrder, { isLoading }] = useAddSalesOrderMutation();
  const [createInvoice] = useAddSalesInvoiceMutation();

  const currency = useAppSelector((state) => state.currency.value);

  const form = useForm<SalesOrderFormValues>({
    defaultValues: {
      customer_id: 0,
      shipping_address: "",
      order_date: "",
      due_date: "",
      items: [{ product_id: 0, quantity: 1, unit_price: 0, discount: 0 }],
    },
  });

  const { control, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const subtotal = items.reduce(
    (sum, it) => sum + it.unit_price * it.quantity,
    0
  );
  const totalDiscount = items.reduce(
    (sum, it) => sum + (it.unit_price * it.quantity * it.discount) / 100,
    0
  );
  const total = subtotal - totalDiscount;

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
        navigate("/dashboard/orders");
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
  }: {
    field: { value: number; onChange: (v: number) => void };
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
                        setOpen(false);
                      }}
                    >
                      {product.name} (SKU: {product.sku}) (Unit: {product.unit.name})
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
        <Link to="/dashboard/orders" className="ml-auto">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Customer & Shipping */}
          <div className="border rounded-md p-4 space-y-4">
            <h2 className="font-semibold mb-4">Customer & Shipping</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="customer_id"
                control={control}
                rules={{ required: "Customer required" }}
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
                  </FormItem>
                )}
              />

              <FormField
                name="shipping_address"
                control={control}
                rules={{ required: "Shipping address required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipping Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter shipping address" {...field} />
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
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded"
                >
                  <FormField
                    name={`items.${index}.product_id`}
                    control={control}
                    rules={{ required: "Product required" }}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-4">
                        <FormLabel>Product</FormLabel>
                        <FormControl>
                          <ProductSelectField field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name={`items.${index}.unit_price`}
                    control={control}
                    rules={{ required: "Price required" }}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Unit Price ({currency})</FormLabel>
                        <FormControl>
                          <Input type="number" min={0} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name={`items.${index}.quantity`}
                    control={control}
                    rules={{ required: "Quantity required" }}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Qty</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name={`items.${index}.discount`}
                    control={control}
                    render={({ field }) => (
                      <FormItem className="sm:col-span-1">
                        <FormLabel>Disc %</FormLabel>
                        <Input type="number" min={0} max={100} {...field} />
                      </FormItem>
                    )}
                  />

                  <div className="sm:col-span-1 font-semibold text-right">
                    {currency}{" "}
                    {(
                      items[index].quantity *
                      items[index].unit_price *
                      (1 - items[index].discount / 100)
                    ).toFixed(2)}
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
                <div>{currency} {subtotal.toFixed(2)}</div>
              </div>
              <div className="flex justify-end gap-4">
                <div className="font-semibold">Total Discount:</div>
                <div>{currency} {totalDiscount.toFixed(2)}</div>
              </div>
              <div className="flex justify-end gap-4 text-lg font-bold">
                <div>Total:</div>
                <div>{currency} {total.toFixed(2)}</div>
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
