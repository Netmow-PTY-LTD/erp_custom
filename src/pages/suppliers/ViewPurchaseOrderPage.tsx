"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

interface POItem {
  product: string;
  sku: string;
  ordered: number;
  received: number;
  unitCost: number;
  lineTotal: number;
}

interface PurchaseOrder {
  poNumber: string;
  supplier: string;
  supplierCode: string;
  orderDate: string;
  expectedDate: string;
  status: "Confirmed" | "Pending" | "Delivered";
  total: number;
  notes: string;
  items: POItem[];
}

const poData: PurchaseOrder = {
  poNumber: "PO-20251110-488371",
  supplier: "TechWare Distribution",
  supplierCode: "SUP001",
  orderDate: "2025-11-10",
  expectedDate: "2025-11-10",
  status: "Confirmed",
  total: 2925.0,
  notes: "T",
  items: [
    { product: "Desk Lamp", sku: "SKU007", ordered: 1, received: 0, unitCost: 45.0, lineTotal: 45.0 },
    { product: "Network Switch", sku: "SKU006", ordered: 1, received: 0, unitCost: 320.0, lineTotal: 320.0 },
    { product: "Office Chair", sku: "SKU002", ordered: 1, received: 0, unitCost: 180.0, lineTotal: 180.0 },
    { product: "Laptop Computer", sku: "SKU004", ordered: 1, received: 0, unitCost: 2200.0, lineTotal: 2200.0 },
    { product: "Office Chair", sku: "SKU002", ordered: 1, received: 0, unitCost: 180.0, lineTotal: 180.0 },
  ],
};

export default function PurchaseOrderView() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Purchase Order {poData.poNumber}</h1>
        <div className="flex gap-2">
          <Button variant="outline-success">Receive All</Button>
          <Link to="/dashboard/suppliers/purchase-orders">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white rounded-lg shadow p-4">
        <div>
          <p className="text-sm text-muted-foreground">Supplier</p>
          <p className="font-semibold">{poData.supplier} ({poData.supplierCode})</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Order Date</p>
          <p className="font-semibold">{poData.orderDate}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Expected</p>
          <p className="font-semibold">{poData.expectedDate}</p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge className="bg-yellow-400 text-black">{poData.status}</Badge>
          </div>
          <div className="text-right md:text-left">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-semibold">RM {poData.total.toLocaleString()}</p>
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
                <TableHead>Product</TableHead>
                <TableHead>Ordered</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Unit Cost</TableHead>
                <TableHead>Line Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {poData.items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>{item.product} ({item.sku})</TableCell>
                  <TableCell>{item.ordered}</TableCell>
                  <TableCell>{item.received}</TableCell>
                  <TableCell>{item.unitCost.toFixed(2)}</TableCell>
                  <TableCell>{item.lineTotal.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>{poData.notes}</CardContent>
      </Card>
    </div>
  );
}
