"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowLeft, User, ShoppingCart, Receipt, CheckCircle2, Plus, X, Package, Calendar as CalendarIcon } from "lucide-react";
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
import { useGetAllStaffsQuery } from "@/store/features/staffs/staffApiService";
import {
  useAddSalesInvoiceMutation,
  useAddSalesOrderMutation,
} from "@/store/features/salesOrder/salesOrder";
import { useGetActiveCustomersQuery, useLazyGetCustomerByIdQuery } from "@/store/features/customers/customersApi";
import type { SalesOrderFormValues } from "@/types/salesOrder.types";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router";
import { useAppSelector } from "@/store/store";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Product } from "@/types/types";
import { AddProductsModal } from "@/components/products/AddProductsModal";
import type { Customer } from "@/store/features/customers/types";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

const orderSchema = z
  .object({
    customer_id: z.number().min(1, "Customer is required"),
    shipping_address: z.string().min(5, "Shipping address is required"),
    order_date: z.string().min(1, "Order date is required"),
    due_date: z.string().min(1, "Due date is required"),
    delivery_date: z.string().optional(),
    staff_id: z.number().optional(),
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
  const location = useLocation();
  const isCreateAny = location.pathname.includes("/create-any");
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
      staff_id: 0,
      shipping_address: "",
      order_date: new Date().toISOString().split("T")[0],
      due_date: new Date().toISOString().split("T")[0],
      delivery_date: new Date().toISOString().split("T")[0],
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
  const selectedCustomerId = watch("customer_id");
  const [triggerGetCustomer, { data: customerDetails }] = useLazyGetCustomerByIdQuery();

  useEffect(() => {
    if (selectedCustomerId > 0) {
      triggerGetCustomer(selectedCustomerId);
    }
  }, [selectedCustomerId, triggerGetCustomer]);

  const customerStats = customerDetails?.data;

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
        staff_id: values.staff_id,
        shipping_address: values.shipping_address,
        notes: values.notes,
        items: values.items.map((i) => ({
          product_id: i.product_id,
          specification: i.specification,
          quantity: Number(i.quantity),
          unit_price: Number(i.unit_price),
          discount: Number(i.discount),
          sales_tax: Number(i.sales_tax),
          remark: i.remark,
        })),
      };

      console.log('create order payload', payload);

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
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={customer.thumb_url} alt={customer.name} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden flex-1">
                        <span className="truncate font-medium text-sm">{customer.name}</span>
                        {customer.company && (
                          <span className="truncate text-xs text-muted-foreground">{customer.company}</span>
                        )}
                        {customer.address && (
                          <span className="truncate text-xs text-muted-foreground/80">{customer.address}</span>
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

  const StaffSelectField = ({
    field,
  }: {
    field: { value: number; onChange: (v: number) => void };
  }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const { data, isLoading } = useGetAllStaffsQuery({
      page: 1,
      limit: 20,
      search: query,
      status: "active",
    });
    const list = Array.isArray(data?.data) ? data.data : [];
    const selected = list.find((s) => s.id === field.value);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between h-9 overflow-hidden font-normal text-left",
              !field.value && "text-muted-foreground"
            )}
            type="button"
          >
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
                <span className="text-muted-foreground">Select staff...</span>
              )}
            </div>
            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput
              placeholder="Search staff..."
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>No staff found</CommandEmpty>
              <CommandGroup>
                {isLoading && (
                  <div className="py-2 px-3 text-sm text-gray-500">
                    Loading...
                  </div>
                )}
                {!isLoading &&
                  list.map((staff) => (
                    <CommandItem
                      key={staff.id}
                      onSelect={() => {
                        field.onChange(staff.id);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={staff.thumb_url} alt={staff.name} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden flex-1">
                        <span className="truncate font-medium text-sm">{staff.name}</span>
                        {staff.email && (
                          <span className="truncate text-xs text-muted-foreground">{staff.email}</span>
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
                {selected ? selected.name : "Select product..."}
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
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={product.thumb_url} alt={product.name} />
                        <AvatarFallback>
                          <Package className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{product.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-tight">
                          SKU: {product.sku} | Unit: {product.unit?.name || 'N/A'} | Stock: {product.stock_quantity || 0}
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

  const DatePickerField = ({
    field,
    label,
  }: {
    field: any;
    label: string;
  }) => {
    const [open, setOpen] = useState(false);
    return (
      <FormItem className="flex flex-col">
        <FormLabel>{label}</FormLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full pl-3 text-left font-normal border-gray-200 dark:border-gray-800",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value ? (
                  format(new Date(field.value), "dd/MM/yyyy")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value ? new Date(field.value) : undefined}
              onSelect={(date) => {
                if (date) {
                  field.onChange(format(date, "yyyy-MM-dd"));
                  setOpen(false);
                }
              }}
              disabled={(date) => date < new Date("1900-01-01")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
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
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Orders
          </Button>
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
                    <DatePickerField field={field} label="Order Date" />
                  )}
                />

                {/* Customer Financial Summary Row */}
                {selectedCustomerId > 0 && customerStats && (
                  <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 px-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900 my-2 shadow-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">Total Purchase</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {currency} {(Number(customerStats.purchase_amount ?? customerStats.total_sales ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 xl:border-l border-blue-100 dark:border-blue-800 xl:pl-4">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Total Paid</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {currency} {(Number(customerStats.paid_amount ?? (customerStats.total_sales || 0) - (customerStats.outstanding_balance || 0))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 xl:border-l border-blue-100 dark:border-blue-800 xl:pl-4">
                      <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider">Due Amount</span>
                      <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                        {currency} {(Number(customerStats.due_amount ?? customerStats.outstanding_balance ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                )}

                <FormField
                  name="due_date"
                  control={control}
                  render={({ field }) => (
                    <DatePickerField field={field} label="Due Date" />
                  )}
                />

                <FormField
                  name="delivery_date"
                  control={control}
                  render={({ field }) => (
                    <DatePickerField field={field} label="Delivery Date" />
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

                {isCreateAny && (
                  <FormField
                    name="staff_id"
                    control={control}
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Assigned Staff</FormLabel>
                        <FormControl>
                          <StaffSelectField field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
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
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Row
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/20 text-white"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add Items
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-6">

              <div className="space-y-4 overflow-x-auto min-w-full">
                {/* Header for Desktop and Mobile (Horizontal Scroll) */}
                <div className="flex min-w-max gap-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 items-center font-bold text-[12px] capitalize tracking-wider text-gray-500">
                  <div className="w-32 xl:sticky xl:left-0 bg-gray-100 dark:bg-gray-800 xl:z-20 text-left">SKU</div>
                  <div className="w-[350px] xl:sticky xl:left-[144px] bg-gray-100 dark:bg-gray-800 xl:z-20 text-left">Product</div>
                  <div className="w-36 text-left">Spec.</div>
                  <div className="w-24 text-left">Unit</div>
                  <div className="w-24 text-left">Stock</div>
                  <div className="w-32 text-left">Price</div>
                  <div className="w-24 text-left">Qty</div>
                  <div className="w-24 text-left">Discount</div>
                  <div className="w-32 text-left">Pretax</div>
                  <div className="w-24 text-left">Tax %</div>
                  <div className="w-32 text-left">Tax Amt </div>
                  <div className="w-36 text-left pr-4">Total ({currency})</div>
                  <div className="flex-1 min-w-[200px]">Remark</div>
                  <div className="w-12"></div>
                </div>

                <div className="space-y-4">
                  {fields.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex flex-nowrap min-w-max gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100 dark:bg-gray-900/40 dark:border-gray-800 transition-all duration-200 hover:shadow-md"
                    >
                      {/* SKU */}
                      <FormField
                        name={`items.${index}.sku`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-32 xl:sticky xl:left-0 bg-inherit xl:z-10">
                            <FormLabel className="hidden text-xs uppercase tracking-wider text-gray-500 font-bold">SKU</FormLabel>
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
                      <div className="w-[350px] xl:sticky xl:left-[144px] bg-inherit xl:z-10">
                        <FormField
                          name={`items.${index}.product_id`}
                          control={control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Product</FormLabel>
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
                          <FormItem className="w-36">
                            <FormLabel className="hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Spec.</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Spec."
                                className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 h-9"
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
                          <FormItem className="w-24">
                            <FormLabel className="hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Unit</FormLabel>
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
                          <FormItem className="w-24">
                            <FormLabel className="hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Stock</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                readOnly
                                className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9 text-right"
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
                          <FormItem className="w-32">
                            <FormLabel className="hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                readOnly
                                className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9 text-right"
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
                          <FormItem className="w-24">
                            <FormLabel className="hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Qty</FormLabel>
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
                                className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 h-9 text-right"
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
                          <FormItem className="w-24">
                            <FormLabel className="hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Discount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 h-9 text-right"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Pretax Amt */}
                      <div className="w-32">
                        <label className="hidden block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Pretax Amt</label>
                        <Input
                          type="number"
                          value={calculatedItems[index]?.pretaxAmount.toFixed(2) ?? "0.00"}
                          readOnly
                          className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9 text-right"
                        />
                      </div>

                      {/* Tax % */}
                      <FormField
                        name={`items.${index}.sales_tax`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormLabel className="hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Tax %</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 text-right h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Total Tax */}
                      <div className="w-32">
                        <label className="hidden block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Tax Amt</label>
                        <Input
                          type="number"
                          value={calculatedItems[index]?.taxAmount.toFixed(2) ?? "0.00"}
                          readOnly
                          className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9 text-right"
                        />
                      </div>

                      {/* Line Total */}
                      <div className="w-36 text-right">
                        <label className="hidden block text-xs uppercase tracking-wider text-blue-600 font-bold mb-2">Total</label>
                        <div className="h-9 flex items-center justify-end px-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md font-bold text-blue-700 dark:text-blue-400 text-xs text-right">
                          {calculatedItems[index]?.total.toFixed(2)}
                        </div>
                      </div>

                      {/* Remark */}
                      <FormField
                        name={`items.${index}.remark`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="flex-1 min-w-[200px]">
                            <FormLabel className="hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Remark</FormLabel>
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
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                        >
                          <X className="w-4 h-4" />
                        </Button>
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
            <Button
              type="submit"
              disabled={isLoading}
              className="gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/40 text-white min-w-[200px]"
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
            </Button>
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
              product_id: Number(product.id),
              sku: product.sku ?? "",
              specification: product.specification ?? "",
              unit: product.unit?.name ?? "",
              quantity: 1,
              unit_price: Number(product.price) || 0,
              discount: 0,
              sales_tax: product.sales_tax ?? 0,
              stock_quantity: product.stock_quantity ?? 0,
              remark: "",
            });
          });

          setIsModalOpen(false);
        }}
        orderType="sales"
      />
    </div>
  );
}
