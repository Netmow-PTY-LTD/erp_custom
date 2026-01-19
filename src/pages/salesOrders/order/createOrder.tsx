"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, User, ShoppingCart, Receipt, CheckCircle2, Plus, X, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { useGetAllProductsQuery } from "@/store/features/admin/productsApiService";
import {
  useAddSalesInvoiceMutation,
  useAddSalesOrderMutation,
} from "@/store/features/salesOrder/salesOrder";
import { useGetActiveCustomersQuery } from "@/store/features/customers/customersApi";
import type { SalesOrderFormValues } from "@/types/salesOrder.types";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useAppSelector } from "@/store/store";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Product } from "@/types/types";
import { AddProductsModal } from "@/components/products/AddProductsModal";
import type { Customer } from "@/store/features/customers/types";

const orderSchema = z
  .object({
    customer_id: z.number().min(1, "Customer is required"),
    shipping_address: z.string().min(5, "Shipping address is required"),
    order_date: z.string().min(1, "Order date is required"),
    due_date: z.string().min(1, "Due date is required"),
    delivery_date: z.string().optional(),
    notes: z.string().optional(),
    items: z.array(
      z.object({
        product_id: z.number().min(1, "Product is required"),
        sku: z.string().optional(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unit_price: z.number().min(1, "Unit price must be at least 1"),
        discount: z.number().min(0, "Discount must be 0 or more"),
        sales_tax: z.number().min(0, "Sales tax must be 0 or more"),
        specification: z.string().optional(),
        unit: z.string().optional(),
        stock_quantity: z.number().optional(),
        remark: z.string().optional(),
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
      path: ["due_date"],
    }
  )
  .refine(
    (data) => {
      if (!data.delivery_date) return true;
      const orderDate = new Date(data.order_date);
      const deliveryDate = new Date(data.delivery_date);

      return deliveryDate >= orderDate;
    },
    {
      message: "Delivery date cannot be earlier than order date",
      path: ["delivery_date"],
    }
  );

export default function CreateSalesOrderPage() {
  const [searchParam] = useSearchParams();
  const customerIdFromParam = searchParam.get("customerId");
  const navigate = useNavigate();
  const [addSalesOrder, { isLoading }] = useAddSalesOrderMutation();
  const [createInvoice] = useAddSalesInvoiceMutation();

  const currency = useAppSelector((state) => state.currency.value);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const form = useForm<SalesOrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer_id: 0,
      shipping_address: "",
      order_date: "",
      due_date: "",
      delivery_date: "",
      notes: "",
      items: [{ product_id: 0, sku: "", specification: "", unit: "", quantity: 1, unit_price: 0, discount: 0, sales_tax: 0, stock_quantity: 0, remark: "" }],
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
      pretaxAmount: taxableAmount,
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
        delivery_date: values.delivery_date,
        customer_id: values.customer_id,
        shipping_address: values.shipping_address,
        notes: values.notes,
        items: values.items.map((i) => ({
          product_id: i.product_id,
          quantity: Number(i.quantity),
          unit_price: Number(i.unit_price),
          discount: Number(i.discount),
          sales_tax: Number(i.sales_tax),
          remark: i.remark,
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
    onCustomerSelect,
  }: {
    field: { value: number; onChange: (v: number) => void };
    onCustomerSelect?: (customer: Customer) => void;
  }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const { data, isLoading } = useGetActiveCustomersQuery({
      page: 1,
      limit: 20,
      search: query,
    });
    const list = Array.isArray(data?.data) ? data.data : [];
    const selected = list.find((c) => c.id === field.value);

    const [hasPreselected, setHasPreselected] = useState(false);

    useEffect(() => {
      if (customerIdFromParam && !hasPreselected && list.length > 0) {
        const preselected = list.find(
          (c) => c.id === Number(customerIdFromParam)
        );
        if (preselected) {
          field.onChange(preselected.id);
          if (onCustomerSelect) onCustomerSelect(preselected);
          setHasPreselected(true);
        }
      }
    }, [customerIdFromParam, list, field, onCustomerSelect, hasPreselected]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between h-9 overflow-hidden">
            <div className="flex items-center gap-2 min-w-0">
              {selected ? (
                <>
                  <Avatar className="h-6 w-6 shrink-0">
                    <AvatarImage src={selected.thumb_url} alt={selected.name} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-left font-medium min-w-0 flex-1">{selected.name}</span>
                </>
              ) : (
                <span className="text-muted-foreground">Select customer...</span>
              )}
            </div>
            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
                        if (onCustomerSelect) onCustomerSelect(customer);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={customer.thumb_url} alt={customer.name} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{customer.name}</span>
                        {customer.company && (
                          <span className="text-xs text-muted-foreground">{customer.company}</span>
                        )}
                      </div>
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
    onProductSelect,
  }: {
    field: {
      value: number;
      onChange: (v: number) => void;
    };
    onProductSelect?: (product: Product) => void;
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
          <Button className="w-full justify-between overflow-hidden h-9" variant="outline">
            <div className="flex items-center gap-2 min-w-0">
              {selected && (
                <Avatar className="h-6 w-6 shrink-0">
                  <AvatarImage src={selected.thumb_url} alt={selected.name} />
                  <AvatarFallback>
                    <Package className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="truncate text-left min-w-0 flex-1">
                {selected
                  ? `${selected.name} (SKU: ${selected.sku}) (Unit: ${selected.unit.name})`
                  : "Select product..."}
              </span>
            </div>
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
                        if (onProductSelect) {
                          onProductSelect(product);
                        } else {
                          field.onChange(product.id);
                        }
                        setOpen(false);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={product.thumb_url} alt={product.name} />
                        <AvatarFallback>
                          <Package className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{product.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-tight">
                          SKU: {product.sku} | Unit: {product.unit.name}
                        </span>
                      </div>
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
    <div className="space-y-6 w-full pb-6">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Create Sales Order
          </h1>
          <p className="text-muted-foreground mt-2">Create a new sales order with customer and product details</p>
        </div>
        <Link to="/dashboard/sales/orders">
          <button className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </button>
        </Link>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Customer & Shipping */}
          <Card className="overflow-hidden border-2 transition-all duration-300 hover:border-blue-200 hover:shadow-lg max-w-5xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 border-b-1 border-blue-100 dark:border-blue-900 py-3 gap-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg shadow-blue-500/30">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">Customer & Shipping</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Select customer and shipping details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <FormField
                  name="customer_id"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <FormControl>
                        <CustomerSelectField
                          field={field}
                          onCustomerSelect={(customer) => {
                            if (customer.address) {
                              form.setValue("shipping_address", customer.address);
                            }
                          }}
                        />
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
                  name="delivery_date"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Date</FormLabel>
                      <Input type="date" {...field} className="block" />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Order Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Special instructions, delivery notes, etc..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="shipping_address"
                  control={control}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Shipping Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Enter full address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="overflow-hidden border-2 transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 border-b-1 border-blue-100 dark:border-blue-900 py-3 gap-0">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg shadow-blue-500/30">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">Order Items</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Add products to the order</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        product_id: 0,
                        sku: "",
                        quantity: 1,
                        unit_price: 0,
                        discount: 0,
                        sales_tax: 0,
                        stock_quantity: 0,
                        remark: "",
                      })
                    }
                    className="flex items-center gap-2 rounded-xl border-2 border-gray-300 dark:border-gray-600 px-5 py-2.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Plus className="w-4 h-4" /> Add Row
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/40 active:translate-y-0 active:shadow-none"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add Items
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-6">

              <div className="space-y-4 overflow-x-auto min-w-full">
                {/* Header for Desktop */}
                <div className="hidden xl:flex gap-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 items-center font-bold text-[12px] capitalize tracking-wider text-gray-500">
                  <div className="w-20">SKU</div>
                  <div className="flex-1 min-w-[150px]">Product</div>
                  <div className="w-28">Spec.</div>
                  <div className="w-16">Unit</div>
                  <div className="w-16 text-center">Stock</div>
                  <div className="w-24">Price</div>
                  <div className="w-16">Qty</div>
                  <div className="w-20">Discount</div>
                  <div className="w-24">Pretax</div>
                  <div className="w-16 text-center">Tax %</div>
                  <div className="w-24 text-right">Tax Amt </div>
                  <div className="w-24 text-right pr-4">Total ({currency})</div>
                  <div className="flex-1 min-w-[120px]">Remark</div>
                  <div className="w-10"></div>
                </div>

                <div className="space-y-4">
                  {fields.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap xl:flex-nowrap gap-4 items-start xl:items-center bg-gray-50 p-4 rounded-xl border border-gray-100 dark:bg-gray-900/40 dark:border-gray-800 transition-all duration-200 hover:shadow-md"
                    >
                      {/* SKU */}
                      <FormField
                        name={`items.${index}.sku`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-full sm:w-28 xl:w-20">
                            <FormLabel className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold">SKU</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                readOnly
                                placeholder="SKU"
                                className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 font-mono text-[10px] h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Product */}
                      <div className="flex-1 min-w-[250px] xl:min-w-[150px]">
                        <FormField
                          name={`items.${index}.product_id`}
                          control={control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Product</FormLabel>
                              <FormControl>
                                <ProductSelectField
                                  field={field}
                                  onProductSelect={(product) => {
                                    const isDuplicate = items.some(
                                      (item, idx) => item.product_id === product.id && idx !== index
                                    );
                                    if (isDuplicate) {
                                      toast.error(`"${product.name}" is already in the list`);
                                      return;
                                    }
                                    setValue(`items.${index}.sales_tax`, product.sales_tax ?? 0);
                                    setValue(`items.${index}.stock_quantity`, product.stock_quantity ?? 0);
                                    setValue(`items.${index}.unit_price`, Number(product.price) ?? 0);
                                    setValue(`items.${index}.sku`, product.sku ?? "");
                                    setValue(`items.${index}.specification`, product.specification ?? "");
                                    setValue(`items.${index}.unit`, product.unit?.name ?? "");
                                    if ((product.stock_quantity ?? 0) === 0) {
                                      setValue(`items.${index}.quantity`, 0);
                                    } else {
                                      setValue(`items.${index}.quantity`, 1);
                                    }
                                    field.onChange(product.id);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Spec */}
                      <FormField
                        name={`items.${index}.specification`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-full sm:w-32 xl:w-28">
                            <FormLabel className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Spec.</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                readOnly
                                placeholder="Spec."
                                className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Unit */}
                      <FormField
                        name={`items.${index}.unit`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-20 xl:w-16">
                            <FormLabel className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Unit</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                readOnly
                                placeholder="Unit"
                                className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9 text-center"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Stock */}
                      <FormField
                        name={`items.${index}.stock_quantity`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-20 xl:w-16">
                            <FormLabel className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Stock</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                readOnly
                                className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9 text-center"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Price */}
                      <FormField
                        name={`items.${index}.unit_price`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-28 xl:w-24">
                            <FormLabel className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 h-9"
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Qty */}
                      <FormField
                        name={`items.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-20 xl:w-16">
                            <FormLabel className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Qty</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  const stock = watch(`items.${index}.stock_quantity`) ?? 0;
                                  if (val > stock) {
                                    field.onChange(stock);
                                  } else {
                                    field.onChange(val);
                                  }
                                }}
                                className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 h-9"
                                disabled={(watch(`items.${index}.stock_quantity`) ?? 0) === 0}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Discount */}
                      <FormField
                        name={`items.${index}.discount`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-28 xl:w-20">
                            <FormLabel className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Discount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Pretax Amt */}
                      <div className="w-32 xl:w-24">
                        <label className="xl:hidden block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Pretax Amt</label>
                        <Input
                          type="number"
                          value={calculatedItems[index]?.pretaxAmount.toFixed(2) ?? "0.00"}
                          readOnly
                          className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9"
                        />
                      </div>

                      {/* Tax % */}
                      <FormField
                        name={`items.${index}.sales_tax`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-20 xl:w-16">
                            <FormLabel className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Tax %</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                readOnly
                                className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-center h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Total Tax */}
                      <div className="w-24 xl:w-24">
                        <label className="xl:hidden block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Tax Amt</label>
                        <Input
                          type="number"
                          value={calculatedItems[index]?.taxAmount.toFixed(2) ?? "0.00"}
                          readOnly
                          className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9 text-right"
                        />
                      </div>

                      {/* Line Total */}
                      <div className="w-28 xl:w-20 text-right">
                        <label className="xl:hidden block text-xs uppercase tracking-wider text-blue-600 font-bold mb-2">Total</label>
                        <div className="h-9 flex items-center justify-end px-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md font-bold text-blue-700 dark:text-blue-400 text-xs text-right">
                          {calculatedItems[index]?.total.toFixed(2)}
                        </div>
                      </div>

                      {/* Remark */}
                      <FormField
                        name={`items.${index}.remark`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="flex-1 min-w-[100px] xl:min-w-[80px]">
                            <FormLabel className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Remark</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Add remark..."
                                className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Remove */}
                      <div className="xl:pt-0 pt-6">
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition-all duration-200 dark:border-red-900/50 dark:hover:bg-red-950/30 h-9 w-9 flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="overflow-hidden border-2 transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 border-b-2 border-blue-100 dark:border-blue-900 py-3 gap-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg shadow-blue-500/30">
                  <Receipt className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">Order Summary</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Total calculations</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-3 max-w-[300px] ml-auto">
                <div className="flex justify-between items-center py-2 border-b">
                  <div className="font-semibold text-gray-700 dark:text-gray-300">Subtotal:</div>
                  <div className="text-lg font-medium">{currency} {totalSubtotal.toFixed(2)}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div className="font-semibold text-gray-700 dark:text-gray-300">Total Discount:</div>
                  <div className="text-lg font-medium text-red-600">- {currency} {totalDiscount.toFixed(2)}</div>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <div className="font-semibold text-gray-700 dark:text-gray-300">Total Tax:</div>
                  <div className="text-lg font-medium">{currency} {totalTax.toFixed(2)}</div>
                </div>
                <div className="flex justify-between items-center py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg px-4 mt-4">
                  <div className="text-xl font-bold text-gray-900 dark:text-gray-100">Grand Total:</div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currency} {grandTotal.toFixed(2)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/50 active:translate-y-0 active:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Create Sales Order</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Form>

      <AddProductsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialSelectedIds={items.map((i) => i.product_id).filter((id) => id !== 0)}
        onApply={(addedProducts, removedIds) => {
          // 1. Remove deselected items
          removedIds.forEach((id) => {
            const currentItems = form.getValues("items");
            const index = currentItems.findIndex((i) => i.product_id === id);
            if (index !== -1) remove(index);
          });

          // 2. Handle the "single empty row" case
          const currentItemsAfterRemoval = form.getValues("items");
          if (
            currentItemsAfterRemoval.length === 1 &&
            currentItemsAfterRemoval[0].product_id === 0 &&
            addedProducts.length > 0
          ) {
            remove(0);
          }

          // 3. Add new items
          addedProducts.forEach((product) => {
            append({
              product_id: product.id,
              sku: product.sku ?? "",
              specification: product.specification ?? "",
              unit: product.unit?.name ?? "",
              quantity: product.stock_quantity > 0 ? 1 : 0,
              unit_price: Number(product.price),
              discount: 0,
              sales_tax: product.sales_tax ?? 0,
              stock_quantity: product.stock_quantity ?? 0,
              remark: "",
            });
          });
        }}
      />
    </div>
  );
}
