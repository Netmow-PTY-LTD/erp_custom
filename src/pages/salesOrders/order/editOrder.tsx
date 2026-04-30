"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowLeft, User, ShoppingCart, Plus, X, Package, Calendar as CalendarIcon, Loader2, AlertCircle, Edit } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  useAddSalesOrderItemMutation,
  useUpdateSalesOrderItemMutation,
  useDeleteSalesOrderItemMutation,
} from "@/store/features/salesOrder/salesOrder";
import { useLazyGetCustomerByIdQuery } from "@/store/features/customers/customersApi";
import type { SalesOrderFormValues } from "@/types/salesOrder.types";
import { Link, useNavigate, useParams, useLocation } from "react-router";
import { useAppSelector } from "@/store/store";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Product } from "@/types/types";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const orderSchema = z
  .object({
    customer_id: z.coerce.number().min(1, "Customer is required"),
    shipping_address: z.string().min(1, "Shipping address is required"),
    order_date: z.string().min(1, "Order date is required"),
    due_date: z.string().min(1, "Due date is required"),
    delivery_date: z.string().optional(),
    staff_id: z.coerce.number().optional(),
    notes: z.string().optional(),
    items: z.array(
      z.object({
        id: z.number().optional(),
        product_id: z.coerce.number().min(1, "Product is required"),
        product_name: z.string().optional(),
        sku: z.string().optional(),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
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

export default function EditOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isCreateAny = location.pathname.includes("/create-any");

  const { data: orderResponse, isLoading: isFetchingOrder } = useGetSalesOrderByIdQuery(orderId!);
  const [updateSalesOrder, { isLoading: isUpdating }] = useUpdateSalesOrderMutation();
  const [addSalesOrderItem, { isLoading: isAddingItem }] = useAddSalesOrderItemMutation();
  const [updateSalesOrderItem, { isLoading: isUpdatingItem }] = useUpdateSalesOrderItemMutation();
  const [deleteSalesOrderItem, { isLoading: isDeletingItem }] = useDeleteSalesOrderItemMutation();

  // Fetch products for Add Product modal
  const { data: productsData } = useGetAllProductsQuery({
    page: 1,
    limit: 100,
  });

  const currency = useAppSelector((state) => state.currency.value);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  const [isItemEditModalOpen, setIsItemEditModalOpen] = useState(false);
  const [tempItemData, setTempItemData] = useState<{
    quantity: number;
    unit_price: number;
    discount: number;
    sales_tax: number;
    remark: string;
  } | null>(null);

  // Add Product Modal State
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<Product | null>(null);
  const [newItemData, setNewItemData] = useState<{
    quantity: number;
    unit_price: number;
    discount: number;
    sales_tax: number;
    remark: string;
  }>({
    quantity: 1,
    unit_price: 0,
    discount: 0,
    sales_tax: 0,
    remark: "",
  });

  const order = orderResponse?.data;

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
      items: [{ id: undefined, product_id: 0, product_name: "", sku: "", specification: "", unit: "", quantity: 1, unit_price: 0, discount: 0, sales_tax: 0, stock_quantity: 0, remark: "" }],
    },
  });

  const { control, watch, setValue, reset, getValues } = form;

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
          id: it.id, // ← CRITICAL: Store the item ID!
          product_id: it.product_id,
          product_name: it.product?.name || "",
          sku: it.product?.sku || "",
          specification: it.specification || it.product?.specification || "",
          unit: it.product?.unit?.name || "",
          quantity: Number(it.quantity || 0),
          unit_price: Number(it.unit_price) || 0,
          discount: Number(it.discount) || 0,
          sales_tax: Number(it.sales_tax) || 0,
          stock_quantity: it.product?.stock_quantity || 0,
          remark: it.remark || "",
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
    console.log("=== Sales Order Update Submission ===");
    console.log("Form Values:", values);
    toast.info("Preparing update...");
    if (!orderId) return;
    if (values.customer_id === 0) return toast.error("Please select a customer");
    if (values.items.some((i) => i.product_id === 0)) return toast.error("Please select all products");

    try {
      const payload = {
        ...values,
        items: (values.items || []).map((i) => ({
          ...i,
          quantity: Number(i.quantity || 0),
          unit_price: Number(i.unit_price || 0),
          discount: Number(i.discount || 0),
          sales_tax: Number(i.sales_tax || 0),
        })),
      };

      console.log("Final Payload for API:", payload);
      toast.info("Sending update request...");

      const res = await updateSalesOrder({ id: orderId, data: payload }).unwrap();

      console.log("API Response:", res);

      if (res.status) {
        toast.success("Sales Order Updated Successfully!");
        navigate("/dashboard/sales/orders");
      } else {
        toast.error(res.message || "Failed to update order");
      }
    } catch (error: any) {
      console.error("Submission Error:", error);
      toast.error(error?.data?.message || error?.message || "Failed to update sales order");
    }
  };

  const handleDeleteItem = async (index: number) => {
    const currentItem = items[index];

    // If item has an ID, it's an existing item - call delete API
    if (currentItem.id && orderId) {
      try {
        const res = await deleteSalesOrderItem({
          orderId: orderId,
          itemId: currentItem.id,
        }).unwrap();

        if (res.status) {
          toast.success(`Item deleted and stock restored (${res.data.stockRestored} units)`);
          // Remove from form after successful API call
          remove(index);
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete item");
        console.error("Error deleting item:", error);
      }
    } else {
      // New item without ID - just remove from form
      remove(index);
      toast.info("Item removed from order");
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
  /* -------------------- Staff & Product Select Fields -------------------- */

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
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form Validation Errors:", errors);
          const firstError: any = Object.values(errors)[0];
          if (firstError) {
            toast.error(`Validation Error: ${firstError.message || "Invalid field"}`);
          }
        })}>
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
                {/* Customer - Read Only */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Customer</Label>
                  {order?.customer ? (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-200 dark:border-gray-800">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={order.customer.thumb_url} alt={order.customer.name} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{order.customer.company}</div>
                        {order.customer.name && (
                          <div className="text-xs text-muted-foreground truncate">{order.customer.name}</div>
                        )}
                        {order.customer.email && (
                          <div className="text-xs text-muted-foreground truncate">{order.customer.email}</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-200 dark:border-gray-800">
                      <span className="text-sm text-muted-foreground">Loading customer...</span>
                    </div>
                  )}
                </div>

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
                    onClick={() => {
                      setSelectedProductToAdd(null);
                      setNewItemData({
                        quantity: 1,
                        unit_price: 0,
                        discount: 0,
                        sales_tax: 0,
                        remark: "",
                      });
                      setIsAddProductModalOpen(true);
                    }}
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Row
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
                  <div className="w-28 text-center">Actions</div>
                </div>

                <div className="space-y-4">
                  {fields.map((item, index) => {
                    return (
                      <div
                        key={item.id}
                        className="flex flex-nowrap min-w-max gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100 dark:bg-gray-900/40 dark:border-gray-800 transition-all duration-200 hover:shadow-md"
                      >
                        {/* SKU */}
                        <div className="w-32 xl:sticky xl:left-0 bg-inherit xl:z-10">
                          <div className="font-mono text-[10px] text-gray-600 dark:text-gray-400">
                            {watch(`items.${index}.sku`) || '-'}
                          </div>
                        </div>

                        {/* Product */}
                        <div className="w-[350px] xl:sticky xl:left-[144px] bg-inherit xl:z-10">
                          <div className="font-medium text-sm">
                            {watch(`items.${index}.product_name`) || '-'}
                          </div>
                        </div>

                        {/* Spec */}
                        <div className="w-36">
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            {watch(`items.${index}.specification`) || '-'}
                          </div>
                        </div>

                        {/* Unit */}
                        <div className="w-24 text-left">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {watch(`items.${index}.unit`) || '-'}
                          </div>
                        </div>

                        {/* Stock */}
                        <div className="w-24 text-left">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {watch(`items.${index}.stock_quantity`) || 0}
                          </div>
                        </div>

                        {/* Price */}
                        <div className="w-32 text-left">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {currency} {Number(watch(`items.${index}.unit_price`) || 0).toFixed(2)}
                          </div>
                        </div>

                        {/* Qty */}
                        <div className="w-24 text-left">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {watch(`items.${index}.quantity`) || 0}
                          </div>
                        </div>

                        {/* Discount */}
                        <div className="w-24 text-left">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {currency} {Number(watch(`items.${index}.discount`) || 0).toFixed(2)}
                          </div>
                        </div>

                        {/* Pretax Amt */}
                        <div className="w-32 text-left">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {currency} {(calculatedItems[index]?.pretaxAmount ?? 0).toFixed(2)}
                          </div>
                        </div>

                        {/* Tax % */}
                        <div className="w-24 text-left">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {watch(`items.${index}.sales_tax`) || 0}%
                          </div>
                        </div>

                        {/* Total Tax */}
                        <div className="w-32 text-left">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {currency} {(calculatedItems[index]?.taxAmount ?? 0).toFixed(2)}
                          </div>
                        </div>

                        {/* Line Total */}
                        <div className="w-36 text-left">
                          <div className="font-bold text-blue-600 dark:text-blue-400">
                            {currency} {(calculatedItems[index]?.total ?? 0).toFixed(2)}
                          </div>
                        </div>

                        {/* Remark */}
                        <div className="flex-1 min-w-[200px]">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {watch(`items.${index}.remark`) || '-'}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="w-28 flex items-center justify-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingItemIndex(index);
                              // Initialize temp data with current values
                              setTempItemData({
                                quantity: Number(watch(`items.${index}.quantity`) || 0),
                                unit_price: Number(watch(`items.${index}.unit_price`) || 0),
                                discount: Number(watch(`items.${index}.discount`) || 0),
                                sales_tax: Number(watch(`items.${index}.sales_tax`) || 0),
                                remark: watch(`items.${index}.remark`) || '',
                              });
                              setIsItemEditModalOpen(true);
                            }}
                            className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                            title="Edit Item"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteItem(index)}
                            disabled={isDeletingItem}
                            className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                            title="Delete"
                          >
                            {isDeletingItem ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <X className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Section */}
              <div className="bg-gray-50/80 dark:bg-gray-900/80 border-t-2 border-dashed border-gray-200 dark:border-gray-800 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                  <div className="flex-1"></div>

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

      {/* Edit Item Modal */}
      <Dialog
        open={isItemEditModalOpen}
        onOpenChange={(open) => {
          if (!open && !isUpdatingItem) {
            setIsItemEditModalOpen(false);
            setTempItemData(null);
            setEditingItemIndex(null);
          }
        }}
      >
        <DialogContent
          className="max-w-2xl max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => {
            if (isUpdatingItem) e.preventDefault();
          }}
          onEscapeKeyDown={(e) => {
            if (isUpdatingItem) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit Order Item</DialogTitle>
            <DialogDescription>
              Update the details for this order item.
            </DialogDescription>
          </DialogHeader>

          {editingItemIndex !== null && tempItemData && (
            <div className="space-y-4 py-4">
              {/* Product Info (Read-only) */}
              <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Product</Label>
                    <div className="font-medium">{watch(`items.${editingItemIndex}.product_name`) || '-'}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">SKU</Label>
                    <div className="font-mono text-xs">{watch(`items.${editingItemIndex}.sku`) || '-'}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Unit</Label>
                    <div>{watch(`items.${editingItemIndex}.unit`) || '-'}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Stock</Label>
                    <div>{watch(`items.${editingItemIndex}.stock_quantity`) || 0}</div>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Specification</Label>
                    <div className="text-sm">{watch(`items.${editingItemIndex}.specification`) || '-'}</div>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`edit-quantity-${editingItemIndex}`}>Quantity *</Label>
                  <Input
                    id={`edit-quantity-${editingItemIndex}`}
                    type="number"
                    min="1"
                    value={tempItemData.quantity}
                    onChange={(e) => setTempItemData({ ...tempItemData, quantity: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-price-${editingItemIndex}`}>Unit Price ({currency}) *</Label>
                  <Input
                    id={`edit-price-${editingItemIndex}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={tempItemData.unit_price}
                    onChange={(e) => setTempItemData({ ...tempItemData, unit_price: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-discount-${editingItemIndex}`}>Discount ({currency})</Label>
                  <Input
                    id={`edit-discount-${editingItemIndex}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={tempItemData.discount}
                    onChange={(e) => setTempItemData({ ...tempItemData, discount: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`edit-tax-${editingItemIndex}`}>Sales Tax (%)</Label>
                  <Input
                    id={`edit-tax-${editingItemIndex}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={tempItemData.sales_tax}
                    onChange={(e) => setTempItemData({ ...tempItemData, sales_tax: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor={`edit-remark-${editingItemIndex}`}>Remark</Label>
                  <Textarea
                    id={`edit-remark-${editingItemIndex}`}
                    value={tempItemData.remark}
                    onChange={(e) => setTempItemData({ ...tempItemData, remark: e.target.value })}
                    placeholder="Enter any remarks for this item"
                    rows={2}
                  />
                </div>
              </div>

              {/* Calculated Totals */}
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">
                      {currency} {(tempItemData.unit_price * tempItemData.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Less Discount:</span>
                    <span className="font-medium text-rose-600">
                      -{currency} {tempItemData.discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax Amount:</span>
                    <span className="font-medium">
                      {currency} {(((tempItemData.unit_price * tempItemData.quantity) - tempItemData.discount) * (tempItemData.sales_tax / 100)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-900">
                    <span className="font-bold">Line Total:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {currency} {(((tempItemData.unit_price * tempItemData.quantity) - tempItemData.discount) * (1 + tempItemData.sales_tax / 100)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsItemEditModalOpen(false);
                setTempItemData(null);
                setEditingItemIndex(null);
              }}
              disabled={isUpdatingItem}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (editingItemIndex !== null && tempItemData && orderId) {
                  console.log('=== Save Changes Clicked ===');
                  console.log('editingItemIndex:', editingItemIndex);
                  console.log('orderId:', orderId);

                  try {
                    // Get the current item ID
                    const items = getValues().items;
                    const currentItem = items[editingItemIndex];

                    console.log('Current item:', currentItem);
                    console.log('Has ID:', !!currentItem.id);

                    // Prepare item update payload
                    const itemPayload = {
                      quantity: tempItemData.quantity,
                      unit_price: tempItemData.unit_price,
                      discount: tempItemData.discount,
                      sales_tax: tempItemData.sales_tax,
                      remark: tempItemData.remark,
                    };

                    console.log('Item payload:', itemPayload);

                    if (currentItem.id) {
                      console.log('Calling updateSalesOrderItem with:', {
                        orderId,
                        itemId: currentItem.id,
                        data: itemPayload,
                      });

                      // EXISTING ITEM: Use single-item API
                      const res = await updateSalesOrderItem({
                        orderId: orderId,
                        itemId: currentItem.id,
                        data: itemPayload,
                      }).unwrap();

                      console.log('API Response:', res);

                      if (res.status) {
                        toast.success("Item updated successfully");

                        // Update form with saved values
                        setValue(`items.${editingItemIndex}.quantity`, tempItemData.quantity);
                        setValue(`items.${editingItemIndex}.unit_price`, tempItemData.unit_price);
                        setValue(`items.${editingItemIndex}.discount`, tempItemData.discount);
                        setValue(`items.${editingItemIndex}.sales_tax`, tempItemData.sales_tax);
                        setValue(`items.${editingItemIndex}.remark`, tempItemData.remark);

                        setIsItemEditModalOpen(false);
                        setTempItemData(null);
                        setEditingItemIndex(null);
                      }
                    } else {
                      // NEW ITEM: Save entire order first
                      toast.info("Saving new item - updating entire order...");

                      // Create updated items array with the edited item
                      const updatedItems = items.map((item, index) =>
                        index === editingItemIndex
                          ? {
                            ...item,
                            quantity: tempItemData.quantity,
                            unit_price: tempItemData.unit_price,
                            discount: tempItemData.discount,
                            sales_tax: tempItemData.sales_tax,
                            remark: tempItemData.remark,
                          }
                          : item
                      );

                      // Prepare the full order payload
                      const orderData = getValues();
                      const payload = {
                        ...orderData,
                        items: updatedItems.map((item) => ({
                          ...item,
                          quantity: Number(item.quantity),
                          unit_price: Number(item.unit_price),
                          discount: Number(item.discount),
                          sales_tax: Number(item.sales_tax),
                        })),
                      };

                      // Save entire order to database
                      const res = await updateSalesOrder({
                        id: orderId,
                        data: payload,
                      }).unwrap();

                      if (res.status) {
                        toast.success("Order updated successfully");

                        // Update form with saved values
                        updatedItems.forEach((item, index) => {
                          setValue(`items.${index}`, item);
                        });

                        setIsItemEditModalOpen(false);
                        setTempItemData(null);
                        setEditingItemIndex(null);
                      }
                    }
                  } catch (error: any) {
                    toast.error(error?.data?.message || "Failed to update item");
                    console.error("Error updating item:", error);
                  }
                }
              }}
              disabled={isUpdatingItem || isUpdating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {(isUpdatingItem || isUpdating) ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Modal */}
      <Dialog
        open={isAddProductModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddProductModalOpen(false);
            setSelectedProductToAdd(null);
            setNewItemData({
              quantity: 1,
              unit_price: 0,
              discount: 0,
              sales_tax: 0,
              remark: "",
            });
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Product to Order</DialogTitle>
            <DialogDescription>
              Search and select a product to add to this order.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Product Search */}
            <div className="space-y-2">
              <Label htmlFor="product-search">Search Product *</Label>
              <ProductSelectField
                field={{
                  value: selectedProductToAdd?.id || 0,
                  onChange: (productId: number) => {
                    const product = productsData?.data?.find((p: Product) => p.id === productId);
                    if (product) {
                      setSelectedProductToAdd(product);
                      setNewItemData({
                        quantity: 1,
                        unit_price: Number(product.price) || 0,
                        discount: 0,
                        sales_tax: 0,
                        remark: "",
                      });
                    }
                  },
                }}
              />
            </div>

            {/* Product Info (Read-only) */}
            {selectedProductToAdd && (
              <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Product</Label>
                    <div className="font-medium">{selectedProductToAdd.name || '-'}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">SKU</Label>
                    <div className="font-mono text-xs">{selectedProductToAdd.sku || '-'}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Unit</Label>
                    <div>{selectedProductToAdd.unit?.name || '-'}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Stock</Label>
                    <div>{selectedProductToAdd.stock_quantity || 0}</div>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Specification</Label>
                    <div className="text-sm">{selectedProductToAdd.specification || '-'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Editable Fields */}
            {selectedProductToAdd && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-quantity">Quantity *</Label>
                  <Input
                    id="add-quantity"
                    type="number"
                    min="1"
                    max={selectedProductToAdd.stock_quantity || undefined}
                    value={newItemData.quantity}
                    onChange={(e) => setNewItemData({ ...newItemData, quantity: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-price">Unit Price ({currency}) *</Label>
                  <Input
                    id="add-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItemData.unit_price}
                    onChange={(e) => setNewItemData({ ...newItemData, unit_price: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-discount">Discount ({currency})</Label>
                  <Input
                    id="add-discount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItemData.discount}
                    onChange={(e) => setNewItemData({ ...newItemData, discount: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="add-tax">Sales Tax (%)</Label>
                  <Input
                    id="add-tax"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={newItemData.sales_tax}
                    onChange={(e) => setNewItemData({ ...newItemData, sales_tax: Number(e.target.value) })}
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <Label htmlFor="add-remark">Remark</Label>
                  <Input
                    id="add-remark"
                    type="text"
                    value={newItemData.remark}
                    onChange={(e) => setNewItemData({ ...newItemData, remark: e.target.value })}
                    placeholder="Add a note (optional)"
                  />
                </div>

                {/* Calculated Preview */}
                <div className="col-span-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Price:</span>
                      <span className="font-medium">
                        {currency} {(newItemData.quantity * newItemData.unit_price).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Less Discount:</span>
                      <span className="font-medium text-red-600">
                        -{currency} {newItemData.discount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxable Amount:</span>
                      <span className="font-medium">
                        {currency} {(newItemData.quantity * newItemData.unit_price - newItemData.discount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Tax ({newItemData.sales_tax}%):</span>
                      <span className="font-medium">
                        {currency} {((newItemData.quantity * newItemData.unit_price - newItemData.discount) * (newItemData.sales_tax / 100)).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-blue-200 dark:border-blue-800 pt-1 mt-1 flex justify-between font-bold">
                      <span>Line Total:</span>
                      <span className="text-blue-600">
                        {currency} {(
                          newItemData.quantity * newItemData.unit_price -
                          newItemData.discount +
                          (newItemData.quantity * newItemData.unit_price - newItemData.discount) * (newItemData.sales_tax / 100)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddProductModalOpen(false);
                setSelectedProductToAdd(null);
                setNewItemData({
                  quantity: 1,
                  unit_price: 0,
                  discount: 0,
                  sales_tax: 0,
                  remark: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (selectedProductToAdd && orderId) {
                  // Validate stock
                  if (newItemData.quantity > (selectedProductToAdd.stock_quantity || 0)) {
                    toast.error(`Insufficient stock. Available: ${selectedProductToAdd.stock_quantity}`);
                    return;
                  }

                  try {
                    console.log('=== Add to Order Clicked ===');
                    console.log('orderId:', orderId);
                    console.log('productId:', selectedProductToAdd.id);
                    console.log('Payload:', newItemData);

                    // Prepare API payload
                    const itemPayload = {
                      product_id: selectedProductToAdd.id,
                      quantity: newItemData.quantity,
                      unit_price: newItemData.unit_price,
                      discount: newItemData.discount,
                      sales_tax: newItemData.sales_tax,
                      remark: newItemData.remark,
                    };

                    console.log('Item payload:', itemPayload);

                    // Call API to add item to database
                    const res = await addSalesOrderItem({
                      orderId: orderId,
                      data: itemPayload,
                    }).unwrap();

                    console.log('API Response:', res);

                    if (res.status && res.data) {
                      toast.success("Product added to order");

                      // Add item to form with the returned ID from database
                      append({
                        id: res.data.id, // Use the ID returned from the database
                        product_id: res.data.product_id,
                        product_name: res.data.product?.name || selectedProductToAdd.name || "",
                        sku: res.data.product?.sku || selectedProductToAdd.sku || "",
                        specification: res.data.product?.specification || selectedProductToAdd.specification || "",
                        unit: res.data.product?.unit?.name || selectedProductToAdd.unit?.name || "",
                        quantity: res.data.quantity,
                        unit_price: Number(res.data.unit_price),
                        discount: Number(res.data.discount),
                        sales_tax: Number(res.data.sales_tax),
                        stock_quantity: res.data.product?.stock_quantity || selectedProductToAdd.stock_quantity || 0,
                        remark: res.data.remark || "",
                      });

                      // Close modal and reset
                      setIsAddProductModalOpen(false);
                      setSelectedProductToAdd(null);
                      setNewItemData({
                        quantity: 1,
                        unit_price: 0,
                        discount: 0,
                        sales_tax: 0,
                        remark: "",
                      });
                    }
                  } catch (error: any) {
                    toast.error(error?.data?.message || "Failed to add product to order");
                    console.error("Error adding item:", error);
                  }
                } else {
                  toast.error("Please select a product");
                }
              }}
              disabled={!selectedProductToAdd || isAddingItem}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAddingItem ? "Adding..." : "Add to Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
