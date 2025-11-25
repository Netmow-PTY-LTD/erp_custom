import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function OrderDetails() {
  const { orderId } = useParams();
  console.log(orderId);

  // --- Mock Data (replace with API later) ---
  const order = {
    orderNumber: "ORD-20251121-7E2E87",
    status: "Confirmed",
    createdAt: "2025-11-21 13:12:25",
    updatedAt: "2025-11-21 13:14:06",
    createdBy: "—",
    dueDate: "2025-11-22",
    items: [
      {
        product: "Desk Lamp",
        sku: "SKU007",
        price: 75,
        qty: 2,
        discount: 0,
        total: 150,
      },
      {
        product: "Office Chair",
        sku: "SKU002",
        price: 299,
        qty: 5,
        discount: 0,
        total: 1495,
      },
      {
        product: "Wireless Mouse",
        sku: "SKU001",
        price: 45,
        qty: 10,
        discount: 10,
        total: 405,
      },
      {
        product: "Wireless Mouse",
        sku: "SKU001",
        price: 45,
        qty: 10,
        discount: 10,
        total: 405,
      },
    ],
    summary: {
      subtotal: 4345,
      discount: 45,
      tax: 0,
      total: 4300,
    },
    customer: {
      name: "Modern Enterprises",
      code: "CUST005",
      email: "sales@modern.com.my",
      phone: "+60334567890",
      address: "67 Persiaran Gurney, Georgetown",
    },
  };

  const statusColor =
    order.status === "Confirmed"
      ? "bg-blue-600"
      : order.status === "Pending"
      ? "bg-yellow-500"
      : "bg-gray-500";

  return (
    <div className="space-y-8">
      {/* ------------------ PAGE HEADER ------------------ */}
      <div className="flex flex-wrap justify-between items-center gap-5">
        <h1 className="text-2xl font-bold">Order {order.orderNumber}</h1>
        <div className="flex items-center gap-2">
          <Link to={`/dashboard/orders`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" /> Back to Orders
            </Button>
          </Link>
          <Link to={`/dashboard/invoices/${order.orderNumber}`} className="flex gap-2">
            <Button variant="info">View Invoice</Button>
          </Link>
          <Button variant="outline-info">Print</Button>
        </div>
      </div>

      {/* ------------------ ORDER ITEMS ------------------ */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold">Order Items</h2>

        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">Product</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Unit Price (RM)</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Discount %</th>
              <th className="p-3">Line Total (RM)</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3">{item.product}</td>
                <td className="p-3 text-center">{item.sku}</td>
                <td className="p-3 text-center">{item.price.toFixed(2)}</td>
                <td className="p-3 text-center">{item.qty}</td>
                <td className="p-3 text-center">{item.discount.toFixed(2)}</td>
                <td className="p-3 text-center font-medium">
                  {item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>

      {/* ------------------ GRID: ORDER INFO + SUMMARY + CUSTOMER ------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* -------- ORDER INFO -------- */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Order Info</h3>

          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Status:</span>{" "}
              <Badge className={statusColor}>{order.status}</Badge>
            </p>
            <p>
              <span className="font-medium">Created At:</span> {order.createdAt}
            </p>
            <p>
              <span className="font-medium">Updated At:</span> {order.updatedAt}
            </p>
            <p>
              <span className="font-medium">Created By:</span> {order.createdBy}
            </p>
            <p>
              <span className="font-medium">Due Date:</span> {order.dueDate}
            </p>
          </div>
        </Card>

        {/* -------- SUMMARY -------- */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Summary</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">
                RM {order.summary.subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span className="font-medium text-red-600">
                - RM {order.summary.discount.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-medium">
                RM {order.summary.tax.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span>RM {order.summary.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* -------- CUSTOMER INFO -------- */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold">Customer</h3>

          <div className="space-y-2 text-sm">
            <p className="font-semibold">{order.customer.name}</p>
            <p className="text-muted-foreground">{order.customer.code}</p>

            <p>{order.customer.email}</p>
            <p>{order.customer.phone}</p>
            <p className="text-muted-foreground">{order.customer.address}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
