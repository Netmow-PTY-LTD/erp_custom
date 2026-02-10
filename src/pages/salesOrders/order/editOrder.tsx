"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowLeft, User, ShoppingCart, Receipt, Plus, Package, Calendar as CalendarIcon, Loader2, AlertCircle } from "lucide-react";
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
  useGetSalesOrderByIdQuery,
  useUpdateSalesOrderMutation,
} from "@/store/features/salesOrder/salesOrder";
import { useGetActiveCustomersQuery, useLazyGetCustomerByIdQuery } from "@/store/features/customers/customersApi";
import type { SalesOrderFormValues } from "@/types/salesOrder.types";
import { Link, useNavigate, useParams, useLocation } from "react-router";
import { useAppSelector } from "@/store/store";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Product } from "@/types/types";
import { AddProductsModal } from "@/components/products/AddProductsModal";
import type { Customer } from "@/store/features/customers/types";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  );

export default function EditOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isCreateAny = location.pathname.includes("/create-any");

  const { data: orderResponse, isLoading: isFetchingOrder } = useGetSalesOrderByIdQuery(orderId!);
  const [updateSalesOrder, { isLoading: isUpdating }] = useUpdateSalesOrderMutation();

  const currency = useAppSelector((state) => state.currency.value);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const order = orderResponse?.data;

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

  const { control, watch, setValue, reset } = form;

  useEffect(() => {
    if (order) {
      reset({
        customer_id: order.customer_id,
        staff_id: order.created_by,
        shipping_address: order.shipping_address || "",
        order_date: order.order_date ? new Date(order.order_date).toISOString().split("T")[0] : "",
        due_date: order.due_date ? new Date(order.due_date).toISOString().split("T")[0] : "",
        delivery_date: order.delivery_date ? new Date(order.delivery_date).toISOString().split("T")[0] : "",
        notes: order.notes || "",
        items: order.items.map((it) => ({
          product_id: it.product_id,
          sku: it.product?.sku || "",
          specification: it.specification || "",
          unit: it.product?.unit?.name || "",
          quantity: it.quantity,
          unit_price: Number(it.unit_price),
          discount: Number(it.discount),
          sales_tax: Number(it.sales_tax),
          stock_quantity: it.product?.stock_quantity || 0,
          remark: "",
        })),
      });
    }
  }, [order, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

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

    const subtotal = unitPrice * qty;
    const taxableAmount = subtotal - discount;
    const taxAmount = taxableAmount * (taxRate / 100);
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

  const totalSubtotal = calculatedItems.reduce((sum, it) => sum + it.subtotal, 0);
  const totalDiscount = calculatedItems.reduce((sum, it) => sum + it.discount, 0);
  const totalTax = calculatedItems.reduce((sum, it) => sum + it.taxAmount, 0);
  const grandTotal = calculatedItems.reduce((sum, it) => sum + it.total, 0);

  const onSubmit = async (values: SalesOrderFormValues) => {
    if (!orderId) return;
    if (values.customer_id === 0) return toast.error("Please select a customer");
    if (values.items.some((i) => i.product_id === 0)) return toast.error("Please select all products");

    try {
      const payload = {
        ...values,
        items: values.items.map((i) => ({
          ...i,
          quantity: Number(i.quantity),
          unit_price: Number(i.unit_price),
          discount: Number(i.discount),
          sales_tax: Number(i.sales_tax),
        })),
      };

      const res = await updateSalesOrder({ id: orderId, data: payload }).unwrap();

      if (res.status) {
        toast.success("Sales Order Updated Successfully!");
        navigate("/dashboard/sales/orders");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update sales order");
      console.error(error);
    }
  };

  if (isFetchingOrder) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (order && order.status !== "pending") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/sales/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Order #{order.order_number}</h1>
        </div>
        <Alert variant="destructive" className="max-w-2xl bg-rose-50 border-rose-200">
          <AlertCircle className="h-5 w-5 text-rose-600" />
          <AlertTitle className="text-rose-800 font-bold">Editing Restricted</AlertTitle>
          <AlertDescription className="text-rose-700">
            This order is currently <strong>{order.status}</strong>. Orders can only be edited when they are in <strong>pending</strong> status.
          </AlertDescription>
        </Alert>
        <div className="flex gap-4">
          <Link to="/dashboard/sales/orders">
            <Button variant="outline">Back to Orders</Button>
          </Link>
          <Link to={`/dashboard/sales/orders/${orderId}`}>
            <Button>View Order Details</Button>
          </Link>
        </div>
      </div>
    );
  }

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
    field: { value: number | undefined; onChange: (v: number) => void };
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
                    <AvatarImage src={selected.thumb_url} alt={`${selected.first_name} ${selected.last_name}`} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-left font-medium min-w-0 flex-1">{selected.first_name} {selected.last_name}</span>
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
                        <AvatarImage src={staff.thumb_url} alt={`${staff.first_name} ${staff.last_name}`} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden flex-1">
                        <span className="truncate font-medium text-sm">{staff.first_name} {staff.last_name}</span>
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
                          SKU: {product.sku} | Stock: {product.stock_quantity || 0}
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
            Edit Sales Order
          </h1>
          <p className="text-muted-foreground mt-2">Update order details for #{order?.order_number}</p>
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Update customer and shipping details</p>
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
                          value={field.value || ""}
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
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Manage products in the order</p>
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
                        specification: "",
                        unit: "",
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
                    <Package className="w-4 h-4" /> Browse Products
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {/* Product Table Headers */}
              <div className="min-w-[1200px] bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-[minmax(250px,1.5fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(100px,0.8fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px] gap-2 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <div className="sticky left-0 bg-gray-50/50 dark:bg-gray-900/50 z-10">SKU & Product Name</div>
                  <div>Specification</div>
                  <div>Remark</div>
                  <div>Stock</div>
                  <div className="text-right">Quantity</div>
                  <div className="text-right">Unit Price</div>
                  <div className="text-right">Line Total</div>
                  <div className="text-center">Action</div>
                </div>
              </div>

              {/* Items List */}
              <div className="min-w-[1200px] divide-y divide-gray-100 dark:divide-gray-800">
                {fields.map((field, index) => {
                  const lineTotal = calculatedItems[index]?.total || 0;

                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-[minmax(250px,1.5fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(100px,0.8fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)_80px] gap-2 px-4 py-3 items-center transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-900/50 group"
                    >
                      {/* Product Selector */}
                      <div className="sticky left-0 bg-white dark:bg-black z-10 group-hover:bg-gray-50/50 dark:group-hover:bg-gray-900/50">
                        <FormField
                          control={control}
                          name={`items.${index}.product_id`}
                          render={({ field: productField }) => (
                            <ProductSelectField
                              field={productField}
                              onProductSelect={(p) => {
                                setValue(`items.${index}.product_id`, p.id);
                                setValue(`items.${index}.sku`, p.sku);
                                setValue(`items.${index}.unit_price`, Number(p.price));
                                setValue(`items.${index}.stock_quantity`, p.stock_quantity);
                                setValue(`items.${index}.unit`, p.unit?.name || '');
                              }}
                            />
                          )}
                        />
                      </div>

                      {/* Specification */}
                      <FormField
                        control={control}
                        name={`items.${index}.specification`}
                        render={({ field: specField }) => (
                          <Input {...specField} value={specField.value || ""} placeholder="Spec..." className="h-9 text-sm" />
                        )}
                      />

                      {/* Remark */}
                      <FormField
                        control={control}
                        name={`items.${index}.remark`}
                        render={({ field: remarkField }) => (
                          <Input {...remarkField} value={remarkField.value || ""} placeholder="Remark..." className="h-9 text-sm" />
                        )}
                      />

                      {/* Stock Info */}
                      <div className="flex flex-col">
                        <span className="text-xs font-medium">{watch(`items.${index}.stock_quantity`) || 0}</span>
                        <span className="text-[10px] text-muted-foreground">{watch(`items.${index}.unit`) || 'Units'}</span>
                      </div>

                      {/* Quantity */}
                      <FormField
                        control={control}
                        name={`items.${index}.quantity`}
                        render={({ field: qtyField }) => (
                          <Input
                            type="number"
                            {...qtyField}
                            onChange={(e) => qtyField.onChange(Number(e.target.value))}
                            className="h-9 text-right font-medium"
                          />
                        )}
                      />

                      {/* Unit Price */}
                      <FormField
                        control={control}
                        name={`items.${index}.unit_price`}
                        render={({ field: priceField }) => (
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">{currency}</span>
                            <Input
                              type="number"
                              {...priceField}
                              onChange={(e) => priceField.onChange(Number(e.target.value))}
                              className="h-9 pl-6 text-right font-medium"
                            />
                          </div>
                        )}
                      />

                      {/* Line Total */}
                      <div className="text-right font-bold text-blue-600 dark:text-blue-400">
                        {currency} {lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>

                      {/* Delete Action */}
                      <div className="flex justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <Plus className="w-4 h-4 rotate-45" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Summary Section */}
              <div className="bg-gray-50/80 dark:bg-gray-900/80 border-t-2 border-dashed border-gray-200 dark:border-gray-800 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                  <div className="flex-1 space-y-4 max-w-md">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                          <Receipt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight text-xs">Tax & Discount</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase text-muted-foreground">Default Sales Tax (%)</FormLabel>
                          <Input
                            type="number"
                            placeholder="0"
                            className="h-9"
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              fields.forEach((_, idx) => setValue(`items.${idx}.sales_tax`, val));
                            }}
                          />
                        </FormItem>
                        <FormItem>
                          <FormLabel className="text-[10px] uppercase text-muted-foreground">Default Discount ({currency})</FormLabel>
                          <Input
                            type="number"
                            placeholder="0"
                            className="h-9"
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              fields.forEach((_, idx) => setValue(`items.${idx}.discount`, val));
                            }}
                          />
                        </FormItem>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-80 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{currency} {totalSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Total Discount</span>
                      <span className="font-medium text-rose-500">-{currency} {totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Tax Amount</span>
                      <span className="font-medium">{currency} {totalTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent my-2" />
                    <div className="flex justify-between items-center py-2 px-4 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                      <span className="text-white font-bold">Grand Total</span>
                      <span className="text-white text-xl font-black">{currency} {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Action */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isUpdating}
              className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Sales Order"
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Product Browser Modal */}
      <AddProductsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApply={(selectedProducts: Product[]) => {
          selectedProducts.forEach((p) => {
            append({
              product_id: p.id,
              sku: p.sku,
              quantity: 1,
              unit_price: Number(p.price),
              discount: 0,
              sales_tax: 0,
              stock_quantity: p.stock_quantity,
              unit: p.unit?.name || "",
              specification: "",
              remark: "",
            });
          });
        }}
        orderType="sales"
        initialSelectedIds={items.map((it) => it.product_id)}
      />
    </div>
  );
}
