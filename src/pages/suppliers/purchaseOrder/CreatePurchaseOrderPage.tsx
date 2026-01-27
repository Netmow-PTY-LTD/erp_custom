"use client";
import { useFieldArray, useForm, type UseFormSetValue } from "react-hook-form";
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

import { toast } from "sonner";

import { useAddPurchaseOrderMutation } from "@/store/features/purchaseOrder/purchaseOrderApiService";
import { useNavigate, useSearchParams } from "react-router";
import { useGetAllSuppliersQuery, useGetSupplierByIdQuery } from "@/store/features/suppliers/supplierApiService";
import type { Supplier } from "@/types/supplier.types";
import { useGetAllProductsQuery, useGetProductByIdQuery } from "@/store/features/admin/productsApiService";
import { useState } from "react";
import { useAppSelector } from "@/store/store";
import { BackButton } from "@/components/BackButton";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Package, ShoppingCart, User, X, Plus, CheckCircle2, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddProductsModal } from "@/components/products/AddProductsModal";

const orderSchema = z
  .object({
    supplierId: z.number().min(1, "Required"),
    notes: z.string().optional(),
    order_date: z.string().min(1, "Required"),
    expected_delivery_date: z.string().min(1, "Required"),
    items: z.array(
      z.object({
        productId: z.number().min(1, "Product is required"),
        sku: z.string().optional(),
        specification: z.string().optional(),
        unit: z.string().optional(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        unit_cost: z.number().min(1, "Unit price must be at least 1"),
        discount: z.number().min(0, "Discount must be 0 or more"),
        purchase_tax: z.number().min(0, "Purchase tax must be 0 or more"),
        stock_quantity: z.number().optional(),
      })
    ),
  })
  .refine(
    (data) => {
      const orderDate = new Date(data.order_date);
      const dueDate = new Date(data.expected_delivery_date);

      return dueDate >= orderDate;
    },
    {
      message: "Expected delivery date cannot be earlier than order date",
      path: ["expected_delivery_date"],
    }
  );

/* ---------------- TYPES ---------------- */

type PurchaseOrderFormValues = z.infer<typeof orderSchema>;

/* ---------------------------------------- */

export default function CreatePurchaseOrderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const supplierIdParam = searchParams.get("supplierId");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currency = useAppSelector((state) => state.currency.value);
  const [addPurchaseOrder, { isLoading }] = useAddPurchaseOrderMutation();

  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      supplierId: supplierIdParam ? Number(supplierIdParam) : 0,
      order_date: new Date().toISOString().split("T")[0],
      expected_delivery_date: "",
      notes: "",
      items: [
        {
          productId: 0,
          sku: "",
          specification: "",
          unit: "",
          quantity: 1,
          unit_cost: 0,
          discount: 0,
          purchase_tax: 0,
          stock_quantity: 0,
        },
      ],
    },
  });

  const { control, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items") ?? [];

  const calculatedItems = items.map((it) => {
    const unitPrice = Number(it.unit_cost || 0);
    const qty = Number(it.quantity || 0);
    const discount = Number(it.discount || 0);
    const taxRate = Number(it.purchase_tax || 0);

    const subtotal = unitPrice * qty;
    const taxableAmount = subtotal - discount; // Pretax amount
    const taxAmount = taxableAmount * (taxRate / 100);
    const total = taxableAmount + taxAmount;

    return {
      subtotal,
      discount,
      pretaxAmount: taxableAmount,
      taxAmount,
      total,
    };
  });

  const totalSubtotal = calculatedItems.reduce((sum, it) => sum + it.subtotal, 0);
  const totalDiscount = calculatedItems.reduce((sum, it) => sum + it.discount, 0);
  const totalTax = calculatedItems.reduce((sum, it) => sum + it.taxAmount, 0);
  const grandTotal = calculatedItems.reduce((sum, it) => sum + it.total, 0);


  /* ---------------- Searchable select components ---------------- */

  function SupplierSelectField({
    field,
  }: {
    field: { value?: number; onChange: (v: number) => void };
  }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    // Call API with search query
    const { data, isLoading } = useGetAllSuppliersQuery({
      page: 1,
      limit: 20,
      search: query,
    });

    // Fetch single supplier if we have a value (to ensure display name is available)
    const { data: singleData } = useGetSupplierByIdQuery(Number(field.value), {
      skip: !field.value,
    });

    const list = Array.isArray(data?.data) ? data.data : [];

    const selected =
      list.find((s: Supplier) => Number(s.id) === Number(field.value)) ||
      (singleData?.data?.id && Number(singleData.data.id) === Number(field.value)
        ? singleData.data
        : undefined);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-9 px-3">
            <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarImage src={selected?.thumb_url} />
                <AvatarFallback>
                  <User className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <span className="truncate text-sm">
                {selected ? selected.name : "Select Supplier..."}
              </span>
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[300px] p-0">
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
                        field.onChange(Number(supplier.id));
                        setOpen(false);
                      }}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={supplier.thumb_url} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span>{supplier.name}</span>
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
    index,
    setValue,
  }: {
    field: { value?: number; onChange: (v: number) => void };
    index: number;
    setValue: UseFormSetValue<PurchaseOrderFormValues>;
  }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const { data, isLoading } = useGetAllProductsQuery({
      page: 1,
      limit: 50,
      search: query,
    });

    // Fetch single product if we have a value (to ensure display name is available even if not in current search list)
    const { data: singleData } = useGetProductByIdQuery(Number(field.value), {
      skip: !field.value,
    });

    const list = Array.isArray(data?.data) ? data.data : [];

    // Prioritize finding in the list, fallback to the single fetched data
    const selected = list.find((p) => Number(p.id) === Number(field.value)) ||
      (singleData?.data?.id && Number(singleData.data.id) === Number(field.value) ? singleData.data : undefined);


    const handleSelect = (productId: number) => {
      // If the selected product is from the list, use it directly.
      const product = list.find((p) => p.id === productId);

      field.onChange(Number(productId));
      setOpen(false);

      if (product) {
        // Auto-set values for this row
        setValue(`items.${index}.purchase_tax`, product.purchase_tax || 0);
        setValue(`items.${index}.unit_cost`, Number(product.cost) || 0); // Using cost for PO
        setValue(`items.${index}.sku`, product.sku || "");
        setValue(`items.${index}.specification`, product.specification || "");
        setValue(`items.${index}.unit`, product.unit?.name || "");
        setValue(`items.${index}.stock_quantity`, product.stock_quantity || 0);
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between h-9 overflow-hidden">
            <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
              {selected && (
                <Avatar className="h-6 w-6 shrink-0">
                  <AvatarImage src={selected.thumb_url} />
                  <AvatarFallback>
                    <Package className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
              )}
              <span className="truncate text-left min-w-0 flex-1 text-sm">
                {selected
                  ? `${selected.name} (SKU: ${selected.sku}) (Unit: ${selected.unit?.name || 'N/A'})`
                  : "Select product..."}
              </span>
            </div>
            {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[300px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search products..."
              onValueChange={(value) => setQuery(value)}
            />

            <CommandList className="max-h-[300px]">
              <CommandEmpty>No products found.</CommandEmpty>

              <CommandGroup>
                {isLoading && (
                  <div className="py-2 px-3 text-sm text-muted-foreground">
                    Loading...
                  </div>
                )}

                {!isLoading &&
                  list.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={String(product.id)}
                      onSelect={() => handleSelect(Number(product.id))}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={product.thumb_url} />
                        <AvatarFallback>
                          <Package className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{product.name}</span>
                        <span className="text-xs text-muted-foreground">
                          SKU: {product.sku} | Unit: {product.unit?.name || "-"}
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
  }


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
          purchase_tax: Number(item.purchase_tax),
        })),
      };

      const response = await addPurchaseOrder(payload).unwrap();

      console.log("Purchase Order Created:", response);

      toast.success("Purchase Order Created Successfully");

      navigate("/dashboard/purchase-orders");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create purchase order");
      console.error(error);
    }
  };

  /* ---------------------------------------- */
  return (
    <div className="space-y-6 w-full pb-6">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Create Purchase Order
          </h1>
          <p className="text-muted-foreground mt-2">Create a new purchase order for your supplier</p>
        </div>
        <BackButton />
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* ---------------- SUPPLIER & DETAILS ---------------- */}
          <Card className="overflow-hidden border-2 transition-all duration-300 hover:border-blue-200 hover:shadow-lg max-w-5xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 border-b-1 border-blue-100 dark:border-blue-900 py-3 gap-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg shadow-blue-500/30">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">Supplier & Order Details</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Select supplier and set order dates</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-6">

              <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-4">
                {/* Supplier */}
                <FormField
                  name="supplierId"
                  control={control}
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
                  rules={{ required: "Order Date is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="block" />
                      </FormControl>
                      <FormMessage />
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
                        <Input type="date" {...field} className="block" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Notes */}
                <FormField
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Optional notes..." className="min-h-[80px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ---------------- ITEMS ---------------- */}
          <Card className="overflow-hidden border-2 transition-all duration-300 hover:border-blue-200 hover:shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 border-b-1 border-blue-100 dark:border-blue-900 py-3 gap-0">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl shadow-lg shadow-blue-500/30">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">Order Items</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Add products to this purchase order</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        productId: 0,
                        sku: "",
                        specification: "",
                        unit: "",
                        quantity: 1,
                        unit_cost: 0,
                        discount: 0,
                        purchase_tax: 0,
                        stock_quantity: 0,
                      })
                    }
                    className="flex items-center gap-2 rounded-xl border-2 border-gray-300 dark:border-gray-600 px-5 py-2.5 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Plus className="w-4 h-4" />
                    Add Row
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/40 active:translate-y-0 active:shadow-none"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add Items
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
                  <div className="w-24 text-right">Tax Amt</div>
                  <div className="w-28 text-right pr-4">Total ({currency})</div>
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
                          name={`items.${index}.productId`}
                          control={control}
                          rules={{ required: "Product required" }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Product</FormLabel>
                              <FormControl>
                                <ProductSelectField
                                  field={field}
                                  index={index}
                                  setValue={form.setValue}
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
                      <div className="w-20 xl:w-16">
                        <label className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold block mb-1">Stock</label>
                        <Input
                          type="number"
                          value={items[index].stock_quantity || 0}
                          readOnly
                          className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9 text-center"
                        />
                      </div>

                      {/* Unit Price */}
                      <FormField
                        name={`items.${index}.unit_cost`}
                        control={control}
                        rules={{ required: "Price required" }}
                        render={({ field }) => (
                          <FormItem className="w-full sm:w-28 xl:w-24">
                            <FormLabel className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 h-9"
                              />
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
                          <FormItem className="w-full sm:w-20 xl:w-16">
                            <FormLabel className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Qty</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 h-9"
                              />
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
                          <FormItem className="w-full sm:w-20">
                            <FormLabel className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Discount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 h-9"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Pretax Amount (Calculated) */}
                      <div className="w-full sm:w-24">
                        <label className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold block text-left mb-1">Pretax</label>
                        <Input
                          type="number"
                          value={(items[index].quantity * items[index].unit_cost - items[index].discount).toFixed(2)}
                          readOnly
                          className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9 text-right"
                        />
                      </div>

                      {/* Tax % */}
                      <FormField
                        name={`items.${index}.purchase_tax`}
                        control={control}
                        render={({ field }) => (
                          <FormItem className="w-full sm:w-16">
                            <FormLabel className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold">Tax %</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={0}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="bg-white border-gray-200 dark:bg-gray-950 dark:border-gray-800 h-9 text-center"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Tax Amount (Calculated) */}
                      <div className="w-full sm:w-24 text-right">
                        <label className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold block text-left mb-1">Tax Amt</label>
                        <Input
                          type="number"
                          value={
                            (((items[index].quantity * items[index].unit_cost -
                              items[index].discount) *
                              (items[index].purchase_tax || 0)) /
                              100).toFixed(2)
                          }
                          readOnly
                          className="bg-gray-100 cursor-not-allowed border-gray-200 dark:bg-gray-800 dark:border-gray-700 h-9 text-right"
                        />
                      </div>

                      {/* Line Total */}
                      <div className="w-full sm:w-28 text-right pr-4">
                        <label className="xl:hidden text-xs uppercase tracking-wider text-gray-500 font-bold block text-left mb-1">Total</label>
                        <div className="font-semibold h-9 flex items-center justify-end">
                          {currency}{" "}
                          {(
                            items[index].quantity * items[index].unit_cost -
                            items[index].discount +
                            ((items[index].quantity * items[index].unit_cost -
                              items[index].discount) *
                              (items[index].purchase_tax || 0)) /
                            100
                          ).toFixed(2)}
                        </div>
                      </div>

                      {/* Remove */}
                      <div className="w-10 flex justify-center">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                          onClick={() => remove(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 flex justify-end">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-xl border-2 border-blue-100 dark:border-blue-900 w-full max-w-[400px]">
                  <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b border-blue-200 dark:border-blue-800">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{currency} {totalSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-600 dark:text-red-400">
                      <span className="font-medium">Discount</span>
                      <span className="font-semibold">- {currency} {totalDiscount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-600 dark:text-gray-400">Tax</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{currency} {totalTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t-2 border-blue-200 dark:border-blue-800 pt-3 mt-2">
                      <span className="text-gray-800 dark:text-gray-100">Grand Total</span>
                      <span className="text-blue-600 dark:text-blue-400">{currency} {grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-4 pb-10">
            <button
              type="button"
              onClick={() => navigate('/dashboard/suppliers/purchase-orders')}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/50 active:translate-y-0 active:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            >
              {isLoading ? <span className="animate-spin mr-2">⏳</span> : <CheckCircle2 className="w-5 h-5" />}
              Create Purchase Order
            </button>
          </div>
        </form>
      </Form>

      <AddProductsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialSelectedIds={items.map((i) => i.productId).filter((id) => id !== 0)}
        onApply={(addedProducts, removedIds) => {
          // 1. Remove deselected items
          removedIds.forEach((id) => {
            const currentItems = form.getValues("items");
            const index = currentItems.findIndex((i) => i.productId === id);
            if (index !== -1) remove(index);
          });

          // 2. Handle the "single empty row" case
          const currentItemsAfterRemoval = form.getValues("items");
          if (
            currentItemsAfterRemoval.length === 1 &&
            currentItemsAfterRemoval[0].productId === 0 &&
            addedProducts.length > 0
          ) {
            remove(0);
          }

          // 3. Add new items
          addedProducts.forEach((product) => {
            append({
              productId: Number(product.id),
              sku: product.sku ?? "",
              specification: product.specification ?? "",
              unit: product.unit?.name ?? "",
              quantity: product.stock_quantity > 0 ? 1 : 1, // Default to 1 for PO even if 0 stock (buying stock)
              unit_cost: Number(product.cost) || 0,
              discount: 0,
              purchase_tax: product.purchase_tax ?? 0,
              stock_quantity: product.stock_quantity ?? 0,
            });
          });

          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
