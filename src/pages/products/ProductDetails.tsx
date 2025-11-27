import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";

export default function ProductDetailsPage() {
  // Dummy Product Data
  const [product] = useState({
    id: 1,
    name: "Pran Chini Gura Chal",
    sku: "abc01",
    category: "Office Supplies",
    status: "Inactive",
    unitPrice: 100,
    costPrice: 80,
    stock: 120,
    min: 10,
    max: 100,
  });

  const [movements] = useState([
    {
      id: 1,
      date: "2025-11-10 09:27",
      type: "Adjustment",
      qty: 10,
      reference: "adjustment",
      notes: "-",
    },
    {
      id: 2,
      date: "2025-11-10 09:26",
      type: "Adjustment",
      qty: 10,
      reference: "adjustment",
      notes: "-",
    },
    {
      id: 3,
      date: "2025-10-11 19:59",
      type: "Adjustment",
      qty: 100,
      reference: "adjustment",
      notes: "Initial stock on product creation",
    },
  ]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Product: {product.name}</h1>

        <div className="flex gap-3">
          <Link to={`/dashboard/products/${product.id}/edit`}>
            <Button variant="outline-info">✏️ Edit</Button>
          </Link>
          <Link to="/dashboard/products">
            <Button variant="outline">← Back to Product List</Button>
          </Link>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="col-span-1 space-y-6">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>SKU:</strong> {product.sku}
              </p>
              <p>
                <strong>Category:</strong> {product.category}
              </p>
              <p className="flex items-center gap-2">
                <strong>Status:</strong>
                <Badge variant="outline" className="bg-gray-200 text-gray-700">
                  {product.status}
                </Badge>
              </p>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p>
                <strong>Unit Price:</strong> RM {product.unitPrice.toFixed(2)}
              </p>
              <p>
                <strong>Cost Price:</strong> RM {product.costPrice.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          {/* Stock */}
          <Card>
            <CardHeader>
              <CardTitle>Stock</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <p>
                <strong>Stock:</strong> {product.stock} pcs
              </p>
              <p>
                <strong>Min:</strong> {product.min} &nbsp; | &nbsp;
                <strong>Max:</strong> {product.max}
              </p>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">Adjust Stock</h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>Quantity (+/-)</Label>
                    <Input placeholder="e.g. 10 or -5" />
                  </div>

                  <div className="space-y-2">
                    <Label>Reason</Label>
                    <Input placeholder="e.g. stock count correction" />
                  </div>

                  <Button className="w-full">Apply</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Image */}
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label>Upload Image (JPG/PNG/WEBP)</Label>
                <div className="flex items-center gap-3">
                  <Input type="file" className="mt-2" />
                  <Button variant="secondary">Upload</Button>
                </div>
              </div>

              <Button variant="outline" className="w-full border-green-600 text-green-700">
                🔄 Unarchive Product
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Recent Stock Movements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {movements.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{m.date}</TableCell>
                      <TableCell>{m.type}</TableCell>
                      <TableCell>{m.qty}</TableCell>
                      <TableCell>{m.reference}</TableCell>
                      <TableCell>{m.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders Containing This Product</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              No recent orders for this product.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
