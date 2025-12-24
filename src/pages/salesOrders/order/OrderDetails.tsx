"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useGetSalesOrderByIdQuery } from "@/store/features/salesOrder/salesOrder";
import { useAppSelector } from "@/store/store";

export default function OrderDetails() {
  const currency = useAppSelector((state) => state.currency.value);

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
  // const subtotal = order.items.reduce(
  //   (sum, item) => sum + Number(item.total_price),
  //   0
  // );

  return (
    <div className="space-y-10">
      {/* PAGE HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">Order #{order.order_number}</h1>

        <div className="flex flex-wrap items-center gap-3">
          <Link to="/dashboard/sales/orders">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" /> Back to Orders
            </Button>
          </Link>

          {order.invoice && (
            <Link to={`/dashboard/sales/invoices/${order.invoice?.id}`}>
              <Button variant="info">View Invoice</Button>
            </Link>
          )}
        </div>
      </div>

      {/* 2 COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN — ORDER ITEMS */}
        <div className="lg:col-span-8">
          <h2 className="text-lg font-semibold mb-3">Order Items</h2>

          <Card className="p-4">
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b">
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-left">SKU</th>
                    <th className="p-3 text-center">Quantity</th>
                    <th className="p-3 text-center">Unit Price ({currency})</th>
                    <th className="p-3 text-center">
                      Total Price ({currency})
                    </th>
                    <th className="p-3 text-center">Discount ({currency})</th>
                    <th className="p-3 text-center">Line Total ({currency})</th>
                  </tr>
                </thead>

                <tbody>
                  {order?.items?.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3">{item.product.name}</td>
                      <td className="p-3">{item.product.sku}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-center">
                        {Number(item.unit_price).toFixed(2)}
                      </td>
                      <td className="p-3 text-center font-medium">
                        {Number(item.total_price).toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        {Number(item?.discount).toFixed(2)}
                      </td>
                      <td className="p-3 text-center font-medium">
                        {Number(item.line_total).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN — ORDER INFO, SUMMARY, CUSTOMER */}
        <div className="lg:col-span-4 space-y-5">
          {/* ORDER INFO */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold">Order Info</h3>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Status: </span>
                <Badge className={statusColor}>{order.status}</Badge>
              </p>

              <p>
                <span className="font-medium">Order Date: </span>
                {new Date(order.order_date).toLocaleString()}
              </p>

              <p>
                <span className="font-medium">Shipping Address: </span>
                {order.shipping_address}
              </p>

              <p>
                <span className="font-medium">Payment Status: </span>
                <span
                  className={`${
                    order.payment_status === "paid"
                      ? "bg-green-600"
                      : "bg-red-500"
                  } px-2 py-0.5 rounded-full text-white`}
                >
                  {order.payment_status}
                </span>
              </p>
            </div>
          </Card>

          {/* SUMMARY */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold">Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">
                  {currency} {Number(order?.total_amount)?.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Total Discount</span>
                <span className="font-medium text-red-600">
                  {currency} {Number(order?.discount_amount).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-sm border-t pt-3">
                <span>Net Amount</span>
                <span className="font-medium">
                  {currency} {Number(order?.net_amount).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Total Tax</span>
                <span className="font-medium">
                  {currency} {Number(order?.tax_amount).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>Total</span>
                <span>
                  {currency} {Number(order?.total_payable_amount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-md">
                <span>Paid</span>
                <span className="font-medium">
                  {currency} {Number(order?.total_paid_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          {/* CUSTOMER INFO */}
          <Card className="p-6 shadow-sm rounded-xl">
            <h3 className="text-lg font-semibold">Customer Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Customer ID</p>
                <p className="font-medium">{order.customer_id}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Name</p>
                <p className="font-medium">{order.customer.name}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Email</p>
                <p className="font-medium">{order.customer.email}</p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs">Company</p>
                <p className="font-medium">{order.customer.company}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
