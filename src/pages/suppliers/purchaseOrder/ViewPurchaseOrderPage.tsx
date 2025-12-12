
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Check } from "lucide-react";
import { Link, useParams } from "react-router";
import { useGetPurchaseOrderByIdQuery } from "@/store/features/purchaseOrder/purchaseOrderApiService";

interface POItem {
  id: number;
  purchase_order_id: number;
  product_id: number;
  quantity: number;
  unit_cost: number;
  line_total: number;
  created_at: string;
  updated_at: string;
}

interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  order_date: string;
  expected_delivery_date: string | null;
  status: string;
  total_amount: number;
  notes?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  items: POItem[];
}

export default function PurchaseOrderView() {
  const { purchaseId } = useParams();

  // Fetch Purchase Order
  const { data: poResponse, isLoading } = useGetPurchaseOrderByIdQuery(Number(purchaseId));

  const [poData, setPoData] = useState<PurchaseOrder | null>(null);

  useEffect(() => {
    if (poResponse?.data) {
      const po = Array.isArray(poResponse.data) ? poResponse.data[0] : poResponse.data;

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPoData({
        id: po.id,
        po_number: po.po_number,
        supplier_id: po.supplier_id,
        order_date: po.order_date ? po.order_date.split("T")[0] : "",
        expected_delivery_date: po.expected_delivery_date ? po.expected_delivery_date.split("T")[0] : null,
        status: po.status,
        total_amount: Number(po.total_amount),
        notes: po.notes,
        created_by: po.created_by,
        created_at: po.created_at,
        updated_at: po.updated_at,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: (po.items ?? []).map((item: any) => ({
          id: item.id,
          purchase_order_id: item.purchase_order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_cost: Number(item.unit_cost),
          line_total: Number(item.line_total),
          created_at: item.created_at,
          updated_at: item.updated_at,
        })),
      });
    }
  }, [poResponse]);

  if (isLoading || !poData) {
    return <div>Loading Purchase Order...</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        {/* Title */}
        <h1 className="text-2xl font-bold">
          Purchase Order {poData?.po_number}
        </h1>

        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium border rounded-md">
            <Check className="w-4 h-4 mr-2" /> Approved
          </span>

          {/* Back Button */}
          <Link to="/dashboard/suppliers/purchase-orders">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      </div>


      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white rounded-lg shadow p-4">
        <div>
          <p className="text-sm text-muted-foreground">Supplier ID</p>
          <p className="font-semibold">{poData.supplier_id}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Order Date</p>
          <p className="font-semibold">{poData.order_date}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Expected Delivery</p>
          <p className="font-semibold">{poData.expected_delivery_date || "-"}</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge className="bg-yellow-400 text-black">{poData.status}</Badge>
          </div>
          <div className="text-right md:text-left">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-semibold">RM {poData.total_amount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
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
              {poData.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product_id}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unit_cost.toFixed(2)}</TableCell>
                  <TableCell>{item.line_total.toFixed(2)}</TableCell>
                  <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(item.updated_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notes */}
      {poData.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>{poData.notes}</CardContent>
        </Card>
      )}
    </div>
  );
}
