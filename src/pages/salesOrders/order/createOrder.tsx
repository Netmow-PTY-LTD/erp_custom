"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowLeft, User, ShoppingCart, Receipt, Plus, X, Package, Calendar as CalendarIcon } from "lucide-react";
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
    customer_id: z.coerce.number().min(1, "Customer is required"),
    shipping_address: z.string().min(5, "Shipping address is required"),
    order_date: z.string().min(1, "Order date is required"),
    due_date: z.string().min(1, "Due date is required"),
    delivery_date: z.string().optional(),
    staff_id: z.coerce.number().optional(),
    notes: z.string().optional(),
    items: z.array(
      z.object({
        product_id: z.coerce.number().min(1, "Product is required"),
        sku: z.string().optional(),
        quantity: z.coerce.number().min(0.01, "Quantity must be at least 0.01"),
        unit_price: z.coerce.number(),
        discount: z.coerce.number().min(0, "Discount must be 0 or more"),
        sales_tax: z.coerce.number().min(0, "Sales tax must be 0 or more"),
        specification: z.string().optional(),
        unit: z.string().optional(),
        stock_quantity: z.coerce.number().optional(),
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

/* -------------------- Sub Components -------------------- */

const CustomerSelectField = ({
  field,
  onCustomerSelect,
  customerIdFromParam,
}: {
  field: { value: number; onChange: (v: number) => void };
  onCustomerSelect?: (customer: Customer) => void;
  customerIdFromParam?: string | null;
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
                <span className="truncate text-left font-medium min-w-0 flex-1">{selected.company}</span>
              </>
            ) : (
              <span className="text-muted-foreground">Select customer...</span>
            )}
          </div>
          <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command shouldFilter={false}>
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
                      <span className="truncate font-medium text-sm">{customer.company}</span>
                      {customer.name && (
                        <span className="truncate text-xs text-muted-foreground">{customer.name}</span>
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
        <Command shouldFilter={false}>
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
  onProductSelect }: {
    field: {
      value: number;
      onChange: (v: number) => void;
    };
    onProductSelect?: (product: Product) => void;
  }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { data, isLoading } = useGetAllProductsQuery({
    page: 1,
    limit: 100,
    search: query,
  });
  const list = Array.isArray(data?.data) ? data.data : [];

  // Try to find selected product in search results first, otherwise use stored product
  const selected = list.find((p) => p.id === field.value) || selectedProduct;

  // Update selectedProduct when field value changes externally
  useEffect(() => {
    if (field.value && (!selectedProduct || selectedProduct.id !== field.value)) {
      const found = list.find((p) => p.id === field.value);
      if (found) {
        setSelectedProduct(found);
      }
    }
  }, [field.value, list]);

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
        <Command shouldFilter={false}>
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
                      setSelectedProduct(product);
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
                      {product.specification && (
                        <span className="text-[10px] text-muted-foreground italic">
                          Spec: {product.specification}
                        </span>
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
    resolver: zodResolver(orderSchema) as any,
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

  const items = watch("items") ?? [];
  const selectedCustomerId = watch("customer_id");
  const [triggerGetCustomer, { data: customerDetails }] = useLazyGetCustomerByIdQuery();

  useEffect(() => {
    if (selectedCustomerId > 0) {
      triggerGetCustomer(selectedCustomerId);
    }
  }, [selectedCustomerId, triggerGetCustomer]);

  const onCustomerSelect = useCallback((customer: Customer) => {
    if (customer.address) {
      form.setValue("shipping_address", customer.address);
    }
  }, [form]);

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

      const orderRes = await addSalesOrder(payload).unwrap();

      if (orderRes.status && orderRes?.data?.id) {
        toast.success("Sales Order Created! Creating Invoice...");

        const invoicePayload = {
          order_id: orderRes.data.id,
          due_date: values.due_date,
        };

        const invoiceRes = await createInvoice(invoicePayload).unwrap();

        if (invoiceRes.status) {
          toast.success("Invoice Created Successfully!");
        } else {
          toast.error("Order created but invoice failed to generate.");
        }

        navigate("/dashboard/sales/orders");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create sales order");
      console.error(error);
    }
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
                          onCustomerSelect={onCustomerSelect}
                          customerIdFromParam={customerIdFromParam}
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
                  {fields.map((fieldItem, index) => (
                    <div
                      key={fieldItem.id}
                      className="flex flex-nowrap min-w-max gap-4 items-str bg-gray-50 p-4 rounded-xl border border-gray-100 dark:bg-gray-900/40 dark:border-gray-800 transition-all duration-200 hover:shadow-md"
                    >
                      <FormField
                        name={`items.${index}.sku`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-32 xl:sticky xl:left-0 bg-inherit xl:z-10">
                            <FormControl>
                              <Input
                                {...field}
                                readOnly
                                className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 font-mono text-[10px] h-9"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="w-[350px] xl:sticky xl:left-[144px] bg-inherit xl:z-10">
                        <FormField
                          name={`items.${index}.product_id`}
                          control={control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <ProductSelectField
                                  field={field}
                                  onProductSelect={(product) => {
                                    const isDuplicate = items.some((it, idx) => it.product_id === product.id && idx !== index);
                                    if (isDuplicate) {
                                      toast.error(`"${product.name}" is already in the list`);
                                      return;
                                    }
                                    setValue(`items.${index}.sales_tax`, product.sales_tax ?? 0);
                                    setValue(`items.${index}.stock_quantity`, product.stock_quantity ?? 0);
                                    setValue(`items.${index}.unit_price`, Number(product.price) || 0);
                                    setValue(`items.${index}.sku`, product.sku ?? "");
                                    setValue(`items.${index}.specification`, product.specification ?? "");
                                    setValue(`items.${index}.unit`, product.unit?.name ?? "");
                                    setValue(`items.${index}.quantity`, (product.stock_quantity ?? 0) === 0 ? 0 : 1);
                                    field.onChange(product.id);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        name={`items.${index}.specification`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-36">
                            <FormControl>
                              <Input {...field} className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 h-9" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name={`items.${index}.unit`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormControl>
                              <Input {...field} readOnly className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9 text-center" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name={`items.${index}.stock_quantity`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormControl>
                              <Input type="number" {...field} readOnly className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9 text-right" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name={`items.${index}.unit_price`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-32">
                            <FormControl>
                              <Input type="number" step="any" {...field} onChange={(e) => field.onChange(Number(e.target.value))} className="bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9 text-right" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name={`items.${index}.quantity`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormControl>
                              <Input
                                type="number"
                                step="any"
                                {...field}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  const stock = watch(`items.${index}.stock_quantity`) ?? 0;
                                  field.onChange(val > stock ? stock : val);
                                }}
                                className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 h-9 text-right"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        name={`items.${index}.discount`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormControl>
                              <Input type="number" step="any" {...field} onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))} className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 h-9 text-right" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="w-32">
                        <Input readOnly value={calculatedItems[index]?.pretaxAmount.toFixed(2) ?? "0.00"} className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9 text-right" />
                      </div>

                      <FormField
                        name={`items.${index}.sales_tax`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormControl>
                              <Input type="number" step="any" {...field} onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))} className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 text-right h-9" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="w-32">
                        <Input readOnly value={calculatedItems[index]?.taxAmount.toFixed(2) ?? "0.00"} className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9 text-right" />
                      </div>

                      <div className="w-36 text-right">
                        <div className="h-9 flex items-center justify-end px-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md font-bold text-blue-700 dark:text-blue-400 text-xs text-right">
                          {calculatedItems[index]?.total.toFixed(2)}
                        </div>
                      </div>

                      <FormField
                        name={`items.${index}.remark`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="flex-1 min-w-[200px]">
                            <FormControl>
                              <Input {...field} className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 h-9" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-700 uppercase">
                        <X className="w-4 h-4" />
                      </Button>
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
                <Receipt className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-3 max-w-[300px] ml-auto">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Subtotal:</span>
                  <span className="text-lg font-medium">{currency} {totalSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b text-red-600 font-bold">
                  <span>Total Discount:</span>
                  <span className="text-lg font-medium">- {currency} {totalDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Total Tax:</span>
                  <span className="text-lg font-medium">{currency} {totalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg px-4 mt-4">
                  <span className="text-xl font-bold">Grand Total:</span>
                  <span className="text-2xl font-bold text-blue-600">{currency} {grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]">
              {isLoading ? "Creating..." : "Create Sales Order"}
            </Button>
          </div>
        </form>
      </Form>

      <AddProductsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialSelectedIds={items.map((i) => i.product_id).filter((id) => id !== 0)}
        onApply={(addedProducts, removedIds) => {
          removedIds.forEach((id) => {
            const currentItems = form.getValues("items");
            const index = currentItems.findIndex((i) => i.product_id === id);
            if (index !== -1) remove(index);
          });

          const currentAfter = form.getValues("items");
          if (currentAfter.length === 1 && currentAfter[0].product_id === 0 && addedProducts.length > 0) {
            remove(0);
          }

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
