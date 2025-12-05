
// "use client";

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
// import { useAddPurchaseOrderMutation } from "@/store/features/purchaseOrder/purchaseOrderApiService";

// interface POItem {
//   productId: string;
//   stock: number;
//   price: number;
//   qty: number;
// }

// interface PurchaseOrderFormValues {
//   supplierId: string;
//   orderDate: string;
//   expectedDate: string;
//   notes: string;
//   items: POItem[];
// }

// export default function CreatePurchaseOrderPage() {


//   const form = useForm<PurchaseOrderFormValues>({
//     defaultValues: {
//       supplierId: "",
//       orderDate: new Date().toISOString().split("T")[0],
//       expectedDate: "",
//       notes: "",
//       items: [
//         {
//           productId: "",
//           stock: 0,
//           price: 0,
//           qty: 1,
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

//   const subtotal = items.reduce((sum, item) => sum + item.qty * item.price, 0);
//   const total = subtotal; // No tax/discount in PO example, but you can extend

//   const onSubmit = (values: PurchaseOrderFormValues) => {
//     console.log("Purchase Order Submitted:", values);
//     // Call API to save PO
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-wrap items-center">
//         <h1 className="text-3xl font-bold">Create Purchase Order</h1>
//         <Link to="/dashboard/suppliers/purchase-orders" className="ml-auto">
//           <Button variant="outline">
//             <ArrowLeft className="w-4 h-4" /> Back to POs
//           </Button>
//         </Link>
//       </div>

//       <Form {...form}>
//         <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
//           {/* ---------------- SUPPLIER & DATES ---------------- */}
//           <div className="border rounded-md p-4">
//             <h2 className="font-semibold mb-4">Supplier & Details</h2>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//               {/* Supplier */}
//               <FormField
//                 name="supplierId"
//                 control={control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Supplier</FormLabel>
//                     <FormControl>
//                       <Select onValueChange={field.onChange}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select Supplier..." />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="s1">Supplier A</SelectItem>
//                           <SelectItem value="s2">Supplier B</SelectItem>
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

//               {/* Expected Date */}
//               <FormField
//                 name="expectedDate"
//                 control={control}
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Expected Date</FormLabel>
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

//           {/* ---------------- ITEMS ---------------- */}
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
//                   className="grid grid-cols-5 gap-3 items-center bg-gray-50 p-3 rounded"
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
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select Product..." />
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
//                         <FormLabel>Unit Cost (RM)</FormLabel>
//                         <Input type="number" step="0.01" {...field} />
//                       </FormItem>
//                     )}
//                   />

//                   {/* Quantity */}
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

//                   {/* Line Total */}
//                   <div>
//                     <FormLabel>Line Total (RM)</FormLabel>
//                     <div className="font-semibold">
//                       {(items[index].qty * items[index].price).toFixed(2)}
//                     </div>
//                   </div>

//                   {/* Remove Item */}
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
//               <div>Subtotal: RM {subtotal.toFixed(2)}</div>
//               <div className="font-bold text-lg">Total: RM {total.toFixed(2)}</div>
//             </div>
//           </div>

//           {/* Submit */}
//           <div className="flex justify-end">
//             <Button className="px-6" type="submit">
//               Create Purchase Order
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }





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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { ArrowLeft } from "lucide-react";

import { toast } from "sonner";

import { useAddPurchaseOrderMutation } from "@/store/features/purchaseOrder/purchaseOrderApiService";
import { Link, useNavigate } from "react-router";
import { useGetAllSuppliersQuery } from "@/store/features/suppliers/supplierApiService";
import type { Supplier } from "@/types/supplier.types";

/* ---------------- TYPES ---------------- */
interface POItem {
  productId: string;
  stock: number;
  quantity: number;
  unit_cost: number;
}

interface PurchaseOrderFormValues {
  supplierId: string;
  orderDate: string;
  expectedDate: string;
  notes: string;
  items: POItem[];
}

/* ---------------------------------------- */

export default function CreatePurchaseOrderPage() {
  const navigate = useNavigate();

  const [addPurchaseOrder, { isLoading }] = useAddPurchaseOrderMutation();
  const { data: suppliersData, isLoading: suppliersLoading } = useGetAllSuppliersQuery();

  console.log("Suppliers Data:", suppliersData?.data);

  const form = useForm<PurchaseOrderFormValues>({
    defaultValues: {
      supplierId: "",
      orderDate: new Date().toISOString().split("T")[0],
      expectedDate: "",
      notes: "",
      items: [
        {
          productId: "",
          stock: 0,
          quantity: 1,
          unit_cost: 0,
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

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unit_cost),
    0
  );

  /* ---------------- ON SUBMIT ---------------- */
  const onSubmit = async (values: PurchaseOrderFormValues) => {
    try {
      const payload = {
        supplier_id: Number(values.supplierId),
        order_date: values.orderDate,
        expected_date: values.expectedDate,
        notes: values.notes,
        items: values.items.map((item) => ({
          product_id: Number(item.productId),
          quantity: Number(item.quantity),
          unit_cost: Number(item.unit_cost),
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
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Supplier..." />
                        </SelectTrigger>
                  
                        <SelectContent>
                          {suppliersLoading && (
                            <div className="py-2 px-3 text-sm text-gray-500">Loading suppliers...</div>
                          )}

                          {!suppliersLoading && Array.isArray(suppliersData?.data) && suppliersData.data.length === 0 && (
                            <div className="py-2 px-3 text-sm text-gray-500">No suppliers found</div>
                          )}

                          {Array.isArray(suppliersData?.data) && suppliersData.data.map((supplier: Supplier) => (
                            <SelectItem key={supplier.id} value={String(supplier.id)}>
                              {supplier.name}
                            </SelectItem>
                          ))}
                        </SelectContent>

                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Order Date */}
              <FormField
                name="orderDate"
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
                name="expectedDate"
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
                    stock: 0,
                    quantity: 1,
                    unit_cost: 0,
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
                  className="grid grid-cols-6 gap-3 items-center bg-gray-50 p-3 rounded"
                >
                  {/* Product */}
                  <FormField
                    name={`items.${index}.productId`}
                    control={control}
                    rules={{ required: "Product required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Product..." />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Later: Map from API */}
                              <SelectItem value="1">Product A</SelectItem>
                              <SelectItem value="2">Product B</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Stock */}
                  <FormField
                    name={`items.${index}.stock`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock</FormLabel>
                        <FormControl>
                          <Input type="number"  {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* Unit Price */}
                  <FormField
                    name={`items.${index}.unit_cost`}
                    control={control}
                    rules={{ required: "Price required" }}
                    render={({ field }) => (
                      <FormItem>
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
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Line Total */}
                  <div>
                    <FormLabel>Total</FormLabel>
                    <div className="font-semibold">
                      RM {(items[index].quantity * items[index].unit_cost).toFixed(2)}
                    </div>
                  </div>

                  {/* Remove */}
                  <Button
                    type="button"
                    variant="outline-destructive"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 text-right pr-2">
              <div>Subtotal: RM {subtotal.toFixed(2)}</div>
              <div className="font-bold text-lg">
                Total: RM {subtotal.toFixed(2)}
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

