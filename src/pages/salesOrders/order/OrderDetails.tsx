"use client";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Calendar,
  FileText,
  Mail,
  CreditCard,
  History,
} from "lucide-react";
import { useGetSalesOrderByIdQuery } from "@/store/features/salesOrder/salesOrder";
import { useAppSelector } from "@/store/store";

export default function OrderDetails() {
  const currency = useAppSelector((state) => state.currency.value);

  const { orderId } = useParams();
  const { data, isLoading } = useGetSalesOrderByIdQuery(orderId as string);

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading order details...</div>;

  const order = data?.data;

  if (!order) return <div className="p-8 text-center text-red-500">No order found</div>;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-blue-600';
      case 'delivered':
      case 'completed': return 'bg-green-600';
      case 'pending': return 'bg-yellow-500 text-black';
      case 'in_transit': return 'bg-indigo-600';
      case 'returned': return 'bg-orange-600';
      case 'cancelled':
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200';
      case 'unpaid': return 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200';
      case 'partial': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in-50 duration-500 pb-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link to="/dashboard/sales/orders" className="hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Orders
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Order #{order.order_number}
            </h1>
            <Badge className={`${getStatusColor(order.status)} text-white capitalize px-3 py-1 shadow-sm`}>
              {order.status}
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {order.invoice && (
            <Link to={`/dashboard/sales/invoices/${order.invoice?.id}`}>
              <Button variant="outline" className="gap-2 shadow-sm">
                <FileText className="w-4 h-4" /> View Invoice
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN: Main Info */}
        <div className="lg:col-span-8 space-y-6">

          {/* Meta Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="shadow-sm border-border/60">
              <CardContent className="p-4 flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase font-medium">Order Date</span>
                <span className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 opacity-50" /> {format(new Date(order.order_date), "dd/MM/yyyy")}
                </span>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border/60">
              <CardContent className="p-4 flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase font-medium">Payment Status</span>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 opacity-50" />
                  <Badge variant="outline" className={`${getPaymentStatusColor(order.payment_status)} px-2 py-0.5 capitalize`}>
                    {order.payment_status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border/60 md:col-span-2 lg:col-span-1">
              <CardContent className="p-4 flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase font-medium">Shipping Address</span>
                <span className="text-sm font-semibold flex items-start gap-2" title={order.shipping_address}>
                  <MapPin className="w-4 h-4 opacity-50 shrink-0 mt-0.5" /> {order.shipping_address}
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card className="shadow-sm border-border/60 overflow-hidden gap-2">
            <CardHeader className="bg-muted/30 py-4 border-b-1 gap-0">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Package className="w-4 h-4" /> Order Items
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b">
                  <tr className="text-left text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Specification</th>
                    <th className="px-6 py-4 font-medium text-right">Unit Price</th>
                    <th className="px-6 py-4 font-medium text-center">Qty</th>
                    <th className="px-6 py-4 font-medium text-right">Discount</th>
                    <th className="px-6 py-4 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order?.items?.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {item.product.sku}</p>
                      </td>
                      <td className="px-6 py-4 text-xs italic text-muted-foreground">
                        {item.specification || item.product?.specification || "-"}
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        {Number(item.unit_price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge variant="outline" className="font-mono text-xs">{item.quantity}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground">
                        {Number(item?.discount) > 0 ? `- ${currency} ${Number(item.discount).toFixed(2)}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-gray-100">
                        {currency} {Number(item.line_total).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Status History */}
          <Card className="shadow-sm border-border/60 mt-6">
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-blue-500" />
                Status Tracking History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {order.status_history && order.status_history.length > 0 ? (
                <div className="relative px-6 pb-6 pl-10">
                  <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                  <div className="space-y-8">
                    {[...order.status_history].reverse().map((history, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[1.35rem] top-1.5 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900 bg-blue-500 z-10 shadow-sm"></div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-semibold uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                              {history.status.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {format(new Date(history.created_at), "dd/MM/yyyy HH:mm")}
                            </span>
                          </div>
                          {history.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-1">"{history.notes}"</p>
                          )}
                          {history.delivery_date && (
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              Tracking Date: {format(new Date(history.delivery_date), "dd/MM/yyyy")}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                  <History className="w-8 h-8 opacity-20" />
                  No tracking history recorded yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Summary & Customer */}
        <div className="lg:col-span-4 space-y-6">

          {/* Customer Snapshot - MOVED TO TOP */}
          <Card className="shadow-sm border-border/60 gap-2">
            <CardHeader className="py-4 gap-0">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{order.customer.name}</p>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">ID: {order.customer_id}</span>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{order.customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <p className="font-medium text-xs text-gray-500 uppercase">Company:</p>
                  <span>{order.customer.company || 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card className="shadow-md border-border/60 bg-slate-50 dark:bg-slate-900 overflow-hidden gap-4">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <CardHeader className="gap-0">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{currency} {Number(order?.total_amount)?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Discount</span>
                  <span className="text-red-500">- {currency} {Number(order?.discount_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm items-center text-muted-foreground border-t pt-2 mt-2">
                  <span>Net Amount</span>
                  <span>{currency} {Number(order?.net_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Tax</span>
                  <span>+ {currency} {Number(order?.tax_amount).toFixed(2)}</span>
                </div>

                <Separator className="my-2" />

                <div className="flex justify-between items-center font-bold text-lg text-gray-900 dark:text-gray-100">
                  <span>Grand Total</span>
                  <span>{currency} {Number(order?.total_payable_amount).toFixed(2)}</span>
                </div>
                {Number(order?.refunded_amount) > 0 ? (
                  <div className="flex flex-col items-end">
                    <span className="text-green-600 font-medium flex justify-between w-full">
                      <span>Paid</span>
                      <span>{currency} {Number(order?.gross_paid_amount || 0).toFixed(2)}</span>
                    </span>
                    <span className="text-red-500 font-medium flex justify-between w-full text-xs mt-1">
                      <span>Refunded</span>
                      <span>- {currency} {Number(order?.refunded_amount || 0).toFixed(2)}</span>
                    </span>
                    <Separator className="my-1" />
                    <span className="text-green-700 font-bold flex justify-between w-full">
                      <span>Net Paid</span>
                      <span>{currency} {Number(order?.total_paid_amount || 0).toFixed(2)}</span>
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-sm font-medium text-green-600 pt-2">
                    <span>Total Paid</span>
                    <span>{currency} {Number(order?.total_paid_amount).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
