
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Check, Eye, FilePlus } from "lucide-react";
import { Link, useParams } from "react-router";
import {
  useAddPurchaseInvoiceMutation,
  useGetPurchaseOrderByIdQuery,
  useUpdatePurchaseOrderMutation,
} from "@/store/features/purchaseOrder/purchaseOrderApiService";
import { toast } from "sonner";
import type { POItem } from "@/types/purchaseOrder.types";


// === STATUS BADGE ===
const renderStatusBadge = (status: string) => {
  const classes: Record<string, string> = {
    approved: "bg-green-500 text-white",
    pending: "bg-yellow-400 text-black",
    rejected: "bg-red-500 text-white",
  };

  return <Badge className={classes[status] || "bg-gray-500 text-white"}>{status}</Badge>;
};



export default function PurchaseOrderView() {
  const { purchaseId } = useParams();

  // FETCH Purchase Order by ID
  const { data: poResponse, isLoading } = useGetPurchaseOrderByIdQuery(Number(purchaseId));

  const purchase = Array.isArray(poResponse?.data)
    ? poResponse?.data[0]
    : poResponse?.data;

  const [updatePurchaseOrder, { isLoading: isUpdating }] = useUpdatePurchaseOrderMutation();
  const [addInvoice, { isLoading: isCreating }] = useAddPurchaseInvoiceMutation();


  if (isLoading || !purchase) {
    return <div>Loading Purchase Order...</div>;
  }


  // === CREATE INVOICE ===
  const handleCreateInvoice = async () => {
    try {
      await addInvoice({
        purchase_order_id: purchase.id,
        due_date: new Date().toISOString().split("T")[0],
      }).unwrap();

      toast.success("Invoice Created Successfully!");
    } catch (error) {
      console.error("Invoice creation failed:", error);
      toast.error("Failed to create invoice");
    }
  };


  // === APPROVE PURCHASE ORDER ===
  const handleApprove = async () => {
    try {
      const res = await updatePurchaseOrder({
        id: Number(purchaseId),
        body: { status: "approved" },
      }).unwrap();

      if (res.success) {
        toast.success("Purchase Order Approved");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to approve");
    }
  };



  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Purchase Order {purchase.po_number}</h1>

        <div className="flex items-center gap-3">


          {/* ==== INVOICE BUTTON ==== */}
          {purchase.invoice ? (
            <Link to={`/dashboard/purchase-invoices/${purchase.invoice.id}`}>
              <Button variant="secondary" className="flex gap-2 items-center">
                <Eye className="w-4 h-4" />
                View Invoice
              </Button>
            </Link>
          ) : (
            <Button
              variant="default"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={handleCreateInvoice}
              disabled={isCreating}
            >
              <FilePlus className="w-4 h-4" />
              {isCreating ? "Creating..." : "Create Invoice"}
            </Button>
          )}


          {/* ==== APPROVE BUTTON ==== */}
          {purchase.status !== "approved" && (
            <Button
              variant="default"
              className="flex items-center gap-2"
              onClick={handleApprove}
              disabled={isUpdating}
            >
              <Check className="w-4 h-4" />
              {isUpdating ? "Approving..." : "Approve"}
            </Button>
          )}


          {/* BACK */}
          <Link to="/dashboard/suppliers/purchase-orders">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </div>



      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white rounded-lg shadow p-4">
        <div>
          <p className="text-sm text-muted-foreground">Supplier ID</p>
          <p className="font-semibold">{purchase.supplier_id}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Order Date</p>
          <p className="font-semibold">{purchase.order_date?.split("T")[0]}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Expected Delivery</p>
          <p className="font-semibold">
            {purchase.expected_delivery_date?.split("T")[0] || "-"}
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            {renderStatusBadge(purchase.status)}
          </div>
          <div className="text-right md:text-left">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-semibold">RM {purchase.total_amount.toFixed(2)}</p>
          </div>
        </div>
      </div>



      {/* ITEMS TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Line Total</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {purchase.items?.map((item: POItem) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product_id}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{Number(item.unit_cost).toFixed(2)}</TableCell>
                  <TableCell>{Number(item.line_total).toFixed(2)}</TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(item.updated_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>



      {/* NOTES */}
      {purchase.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>{purchase.notes}</CardContent>
        </Card>
      )}
    </div>
  );
}
