"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router";
import {  Check, Eye, FilePlus } from "lucide-react";
import {
  useAddPurchaseInvoiceMutation,
  useGetPurchaseOrderByIdQuery,
  useUpdatePurchaseOrderMutation,
} from "@/store/features/purchaseOrder/purchaseOrderApiService";
import { toast } from "sonner";
import type { POItem } from "@/types/purchaseOrder.types";
import { useAppSelector } from "@/store/store";
import { BackButton } from "@/components/BackButton";

/* ================= STATUS COLOR ================= */
const statusColorMap: Record<string, string> = {
  approved: "bg-green-600 text-white",
  pending: "bg-yellow-500 text-black",
  rejected: "bg-red-600 text-white",
  received: "bg-blue-600 text-white",
  delivered: "bg-purple-600 text-white",
};

export default function PurchaseOrderView() {
  const { purchaseId } = useParams();

  const currency = useAppSelector((state) => state.currency.value);

  const { data, isLoading } = useGetPurchaseOrderByIdQuery(Number(purchaseId));

  const purchase = Array.isArray(data?.data) ? data?.data[0] : data?.data;

  const [updatePurchaseOrder, { isLoading: isUpdating }] =
    useUpdatePurchaseOrderMutation();

  const [addInvoice, { isLoading: isCreating }] =
    useAddPurchaseInvoiceMutation();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-muted-foreground text-lg">Loading...</p>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-muted-foreground text-lg">No purchase order found</p>
      </div>
    );
  }

  /* ================= CALCULATIONS ================= */
  // const subtotal =
  //   purchase.total_amount +
  //   purchase.discount_amount -
  //   purchase.tax_amount;

  /* ================= ACTIONS ================= */
  const handleApprove = async () => {
    try {
      const res = await updatePurchaseOrder({
        id: purchase.id,
        body: { status: "approved" },
      }).unwrap();

      if (res.status) {
        toast.success(res.message || "Purchase Order Approved");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Approval failed");
    }
  };

  const handleCreateInvoice = async () => {
    try {
      const res = await addInvoice({
        purchase_order_id: purchase.id,
        due_date: new Date().toISOString().split("T")[0],
      }).unwrap();

      if (res.status) {
        toast.success(res.message || "Invoice created successfully");
      }
    } catch {
      toast.error("Failed to create invoice");
    }
  };

  return (
    <div className="space-y-10">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">
          Purchase Order #{purchase.po_number}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <BackButton/>

          {!["approved", "received", "delivered"].includes(purchase.status) && (
            <Button onClick={handleApprove} disabled={isUpdating}>
              <Check className="h-4 w-4 mr-1" />
              {isUpdating ? "Approving..." : "Approve"}
            </Button>
          )}

          {["approved", "received", "delivered"].includes(purchase.status) &&
            (purchase.invoice ? (
              <Link to={`/dashboard/purchase-invoices/${purchase.invoice.id}`}>
                <Button variant="secondary">
                  <Eye className="h-4 w-4 mr-1" />
                  View Invoice
                </Button>
              </Link>
            ) : (
              <Button onClick={handleCreateInvoice} disabled={isCreating}>
                <FilePlus className="h-4 w-4 mr-1" />
                {isCreating ? "Creating..." : "Create Invoice"}
              </Button>
            ))}
        </div>
      </div>

      {/* ================= 2 COLUMN LAYOUT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ================= LEFT — ITEMS ================= */}
        <div className="lg:col-span-8">
          <h2 className="text-lg font-semibold mb-3">Purchase Items</h2>

          <Card className="p-4">
            <div className="overflow-x-auto border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">SKU</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-center">Unit Cost ({currency})</th>
                    <th className="p-3 text-center">
                      Total Price ({currency})
                    </th>
                    <th className="p-3 text-center">Discount ({currency})</th>
                    {/* <th className="p-3 text-center">Purchase Tax ({currency})</th> */}
                    <th className="p-3 text-center">Line Total ({currency})</th>
                  </tr>
                </thead>

                <tbody>
                  {purchase.items.map((item: POItem) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{item.product.name}</td>
                      <td className="p-3">{item.product.sku}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-center">
                        {Number(item.unit_cost).toFixed(2)}
                      </td>

                      <td className="p-3 text-center">
                        {Number(item.total_price).toFixed(2)}
                      </td>
                      <td className="p-3 text-center">{item.discount ?? 0}</td>
                      {/* <td className="p-3 text-center">
                        {item.purchase_tax ?? 0}
                      </td> */}
                      <td className="p-3 text-center font-medium">
                        RM {Number(item.line_total).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* ================= RIGHT — INFO & SUMMARY ================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* ORDER INFO */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold">Purchase Info</h3>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Status: </span>
                <Badge
                  className={
                    statusColorMap[purchase.status] || "bg-gray-500 text-white"
                  }
                >
                  {purchase.status}
                </Badge>
              </p>

              <p>
                <span className="font-medium">Order Date: </span>
                {purchase.order_date.split("T")[0]}
              </p>

              <p>
                <span className="font-medium">Expected Delivery: </span>
                {purchase.expected_delivery_date?.split("T")[0] || "-"}
              </p>
            </div>
          </Card>

          {/* SUMMARY */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold">Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {currency} {Number(purchase.total_amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Total Discount</span>
                <span>RM {Number(purchase.discount_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span>Net Amount</span>
                <span>
                  {currency} {Number(purchase.net_amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Tax</span>
                <span>
                  {currency} {Number(purchase.tax_amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>Total</span>
                <span>RM {Number(purchase.total_payable_amount).toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* SUPPLIER INFO */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold">Supplier Details</h3>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Name: </span>
                {purchase.supplier.name}
              </p>
              <p>
                <span className="font-medium">Email: </span>
                {purchase.supplier.email}
              </p>
              <p>
                <span className="font-medium">Phone: </span>
                {purchase.supplier.phone}
              </p>
            </div>
          </Card>

          {/* NOTES */}
          {purchase.notes && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold">Notes</h3>
              <p className="text-sm">{purchase.notes}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

