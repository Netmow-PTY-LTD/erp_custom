// import { useFieldArray, useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormControl,
//   FormLabel,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from "@/components/ui/select";
// import { Link } from "react-router";
// import { ArrowLeft } from "lucide-react";

// interface OrderItem {
//   productId: string;
//   stock: number;
//   price: number;
//   qty: number;
//   discount: number;
// }

// interface OrderFormValues {
//   customerId: string;
//   orderDate: string;
//   dueDate: string;
//   notes: string;
//   items: OrderItem[];
//   taxPercent: number;
// }

// export default function CreateOrderPage() {
//   const form = useForm<OrderFormValues>({
//     defaultValues: {
//       customerId: "",
//       orderDate: new Date().toISOString().split("T")[0],
//       dueDate: "",
//       notes: "",
//       taxPercent: 0,
//       items: [
//         {
//           productId: "",
//           stock: 0,
//           price: 0,
//           qty: 1,
//           discount: 0,
//         },
//       ],
//     },
//   });

//   const { control, watch } = form;

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "items",
//   });

//   const items = watch("items");
//   const taxPercent = watch("taxPercent");

//   /* -------------------------------
//      CALCULATIONS
//   --------------------------------*/
//   const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);

//   const totalDiscount = items.reduce(
//     (sum, item) => sum + (item.qty * item.price * item.discount) / 100,
//     0
//   );

//   const taxAmount = ((subtotal - totalDiscount) * taxPercent) / 100;

//   const grandTotal = subtotal - totalDiscount + taxAmount;

//   const onSubmit = (values: OrderFormValues) => {
//     console.log("Order Submitted:", values);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-wrap items-center">
//         <h1 className="text-3xl font-bold">Create Order</h1>
//         <Link to="/dashboard/orders" className="ml-auto">
//           <Button variant="outline">
//             <ArrowLeft className="w-4 h-4" /> Back to Orders
//           </Button>
//         </Link>
//       </div>

//       <Form {...form}>
//         <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
//           {/* ---------------- CUSTOMER SECTION ---------------- */}
//           <div className="border rounded-md p-4">
//             <h2 className="font-semibold mb-4">Customer & Details</h2>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//               {/* Customer */}
//               <FormField
//                 name="customerId"
//                 control={control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Customer</FormLabel>
//                     <FormControl>
//                       <Select onValueChange={field.onChange}>
//                         <SelectTrigger className="w-full">
//                           <SelectValue placeholder="Select a customer..." />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="1">Customer A</SelectItem>
//                           <SelectItem value="2">Customer B</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               {/* Order Date */}
//               <FormField
//                 name="orderDate"
//                 control={control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Order Date</FormLabel>
//                     <Input type="date" {...field} />
//                   </FormItem>
//                 )}
//               />

//               {/* Due Date */}
//               <FormField
//                 name="dueDate"
//                 control={control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Due Date</FormLabel>
//                     <Input type="date" {...field} />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Notes */}
//             <FormField
//               name="notes"
//               control={control}
//               render={({ field }) => (
//                 <FormItem className="mt-4">
//                   <FormLabel>Notes</FormLabel>
//                   <Textarea placeholder="Optional notes..." {...field} />
//                 </FormItem>
//               )}
//             />
//           </div>

//           {/* ---------------- ITEMS SECTION ---------------- */}
//           <div className="border rounded-md p-4">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="font-semibold">Order Items</h2>
//               <Button
//                 type="button"
//                 onClick={() =>
//                   append({
//                     productId: "",
//                     stock: 0,
//                     price: 0,
//                     qty: 1,
//                     discount: 0,
//                   })
//                 }
//               >
//                 + Add Item
//               </Button>
//             </div>

//             <div className="space-y-3">
//               {fields.map((item, index) => (
//                 <div
//                   key={item.id}
//                   className="grid grid-cols-7 gap-3 items-center bg-gray-50 p-3 rounded"
//                 >
//                   {/* Product */}
//                   <FormField
//                     name={`items.${index}.productId`}
//                     control={control}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Product</FormLabel>
//                         <FormControl>
//                           <Select onValueChange={field.onChange}>
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Select product..." />
//                             </SelectTrigger>
//                             <SelectContent>
//                               <SelectItem value="p1">Product A</SelectItem>
//                               <SelectItem value="p2">Product B</SelectItem>
//                             </SelectContent>
//                           </Select>
//                         </FormControl>
//                       </FormItem>
//                     )}
//                   />

//                   {/* Stock */}
//                   <FormField
//                     name={`items.${index}.stock`}
//                     control={control}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Stock</FormLabel>
//                         <Input {...field} type="number" readOnly />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Unit Price */}
//                   <FormField
//                     name={`items.${index}.price`}
//                     control={control}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Unit Price</FormLabel>
//                         <Input type="number" step="0.01" {...field} />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Qty */}
//                   <FormField
//                     name={`items.${index}.qty`}
//                     control={control}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Quantity</FormLabel>
//                         <Input type="number" {...field} />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Discount */}
//                   <FormField
//                     name={`items.${index}.discount`}
//                     control={control}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Disc %</FormLabel>
//                         <Input type="number" {...field} />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Line Total */}
//                   <div>
//                     <FormLabel>Line Total</FormLabel>
//                     <div className="font-semibold">
//                       {(
//                         items[index].qty *
//                         items[index].price *
//                         (1 - items[index].discount / 100)
//                       ).toFixed(2)}
//                     </div>
//                   </div>

//                   {/* Remove */}
//                   <Button
//                     type="button"
//                     size="sm"
//                     variant="outline-destructive"
//                     onClick={() => remove(index)}
//                     className="w-10"
//                   >
//                     X
//                   </Button>
//                 </div>
//               ))}
//             </div>

//             {/* Summary */}
//             <div className="mt-4 space-y-1 text-right pr-2">
//               <div>Subtotal: {subtotal.toFixed(2)}</div>
//               <div>Discount: {totalDiscount.toFixed(2)}</div>
//               <div>
//                 Tax ({taxPercent}%): {taxAmount.toFixed(2)}
//               </div>
//               <div className="font-bold text-lg">
//                 Total: {grandTotal.toFixed(2)}
//               </div>
//             </div>
//           </div>

//           {/* Submit */}
//           <div className="flex justify-end">
//             <Button className="px-6" type="submit">
//               Create Order
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }



//  second ui with functionality



"use client";
import { useForm, useFieldArray } from "react-hook-form";
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

import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router";
import { useState } from "react";

import { useGetAllProductsQuery } from "@/store/features/admin/productsApiService";
import { useAddSalesOrderMutation } from "@/store/features/salesOrder/salesOrder";
import { useGetCustomersQuery } from "@/store/features/customers/customersApi";
import type { SalesOrderFormValues } from "@/types/salesOrder.types";

export default function CreateSalesOrderPage() {
  const navigate = useNavigate();
  const [addSalesOrder, { isLoading }] = useAddSalesOrderMutation();

  const form = useForm<SalesOrderFormValues>({
    defaultValues: {
      customer_id: 0,
      shipping_address: "",
      items: [
        {
          product_id: 0,
          quantity: 1,
          unit_price: 0,
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

  /* -------------------- Customer Select -------------------- */
  function CustomerSelectField({
    field,
  }: {
    field: { value: number; onChange: (v: number) => void };
  }) {
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

        <PopoverContent className="w-[320px] p-0">
          <Command>
            <CommandInput
              placeholder="Search customers..."
              onValueChange={(v) => setQuery(v)}
            />
            <CommandList>
              <CommandEmpty>No customers found</CommandEmpty>
              <CommandGroup>
                {isLoading && (
                  <div className="py-2 px-3 text-sm text-gray-500">Loading...</div>
                )}
                {!isLoading &&
                  list.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      onSelect={() => {
                        field.onChange(customer.id); // number
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
  }

  /* -------------------- Product Select -------------------- */
  function ProductSelectField({
    field,
  }: {
    field: { value: number; onChange: (v: number) => void };
  }) {
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
            {selected ? `${selected.name} (SKU: ${selected.sku})` : "Select product..."}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[320px] p-0">
          <Command>
            <CommandInput
              placeholder="Search products..."
              onValueChange={(v) => setQuery(v)}
            />
            <CommandList>
              <CommandEmpty>No products found</CommandEmpty>
              <CommandGroup>
                {isLoading && (
                  <div className="py-2 px-3 text-sm text-gray-500">Loading...</div>
                )}
                {!isLoading &&
                  list.map((product) => (
                    <CommandItem
                      key={product.id}
                      onSelect={() => {
                        field.onChange(product.id); // number
                        setOpen(false);
                      }}
                    >
                      {product.name} (SKU: {product.sku})
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  /* -------------------- Subtotal -------------------- */
  const subtotal = items.reduce(
    (sum, it) => sum + it.quantity * it.unit_price,
    0
  );

  /* -------------------- Submit Handler -------------------- */
  const onSubmit = async (values: SalesOrderFormValues) => {
    if (values.customer_id === 0) {
      toast.error("Please select a customer");
      return;
    }

    if (values.items.some((i) => i.product_id === 0)) {
      toast.error("Please select all products");
      return;
    }

    try {
      const payload = {
        customer_id: values.customer_id,
        shipping_address: values.shipping_address,
        items: values.items.map((i) => ({
          product_id: i.product_id,
          quantity: Number(i.quantity),
          unit_price: Number(i.unit_price),
        })),
      };

      const res = await addSalesOrder(payload).unwrap();
      if (res.status) {

        toast.success("Sales Order Created Successfully!");
        navigate("/dashboard/orders");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create sales order");
      console.error(error);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h1 className="text-3xl font-bold">Create Sales Order</h1>
        <Link to="/dashboard/sales/orders" className="ml-auto">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          {/* Customer & Shipping */}
          <div className="border rounded-md p-4">
            <h2 className="font-semibold mb-4">Customer & Shipping</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          <div className="border rounded-md p-4">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Order Items</h2>
              <Button
                type="button"
                onClick={() =>
                  append({ product_id: 0, quantity: 1, unit_price: 0 })
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
                  <FormField
                    name={`items.${index}.product_id`}
                    control={control}
                    rules={{ required: "Product required" }}
                    render={({ field }) => (
                      <FormItem className="col-span-6">
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
                      <FormItem className="col-span-2">
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name={`items.${index}.quantity`}
                    control={control}
                    rules={{ required: "Quantity required" }}
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Qty</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="col-span-1 font-semibold">
                    RM {(items[index].quantity * items[index].unit_price).toFixed(2)}
                  </div>

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
            <div className="text-right mt-4 pr-2">
              <div className="font-bold text-lg">Total: RM {subtotal.toFixed(2)}</div>
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
