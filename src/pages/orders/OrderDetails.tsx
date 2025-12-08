
"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useGetSalesOrderByIdQuery } from "@/store/features/salesOrder/salesOrder";

export default function OrderDetails() {
  const { orderId } = useParams();
  const { data, isLoading } = useGetSalesOrderByIdQuery(orderId as string);

  if (isLoading) return <div>Loading...</div>;

  const order = data?.data;

  if (!order) return <div>No order found</div>;

  // Map status to colors
  const statusColor =
    order.status === "confirmed"
      ? "bg-blue-600 text-white"
      : order.status === "pending"
      ? "bg-yellow-500 text-black"
      : "bg-gray-500 text-white";

  // Calculate subtotal if needed
  const subtotal = order.items.reduce(
    (sum, item) => sum + Number(item.total_price),
    0
  );

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-5">
        <h1 className="text-2xl font-bold">Order {order.order_number}</h1>
        <div className="flex items-center gap-2">
          <Link to={`/dashboard/orders`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" /> Back to Orders
            </Button>
          </Link>
          {order.invoice && (
            <Link to={`/dashboard/invoices/${order.invoice}`} className="flex gap-2">
              <Button variant="info">View Invoice</Button>
            </Link>
          )}
          <Button variant="outline-info">Print</Button>
        </div>
      </div>

      {/* ORDER ITEMS */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 text-left">Product ID</th>
                <th className="p-3 text-center">Quantity</th>
                <th className="p-3 text-center">Unit Price (RM)</th>
                <th className="p-3 text-center">Total Price (RM)</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.product_id}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-center">{Number(item.unit_price).toFixed(2)}</td>
                  <td className="p-3 text-center font-medium">
                    {Number(item.total_price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ORDER INFO + SUMMARY + CUSTOMER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ORDER INFO */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Order Info</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Status:</span>{" "}
              <Badge className={statusColor}>{order.status}</Badge>
            </p>
            <p>
              <span className="font-medium">Order Date:</span>{" "}
              {new Date(order.order_date).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Shipping Address:</span>{" "}
              {order.shipping_address}
            </p>
            <p>
              <span className="font-medium">Payment Status:</span>{" "}
              {order.payment_status}
            </p>
          </div>
        </Card>

        {/* SUMMARY */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">RM {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-medium">RM {Number(order.tax_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="font-medium text-red-600">
                RM {Number(order.discount_amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total</span>
              <span>RM {Number(order.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* CUSTOMER INFO */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Customer</h3>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Customer ID: {order.customer_id}</p>
            <p className="text-muted-foreground">Created By: {order.created_by}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
