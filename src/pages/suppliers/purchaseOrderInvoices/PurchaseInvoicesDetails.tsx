/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "react-router";
import {
  useGetPurchaseInvoiceByIdQuery,
  useUpdatePurchaseInvoiceMutation,
} from "@/store/features/purchaseOrder/purchaseOrderApiService";
import type { PurchasePayment } from "@/types/purchasePayment.types";
import { useGetSettingsInfoQuery } from "@/store/features/admin/settingsApiService";
import { useAppSelector } from "@/store/store";
import type { PurchaseInvoice } from "@/types/PurchaseInvoice.types";
import { toast } from "sonner";

export default function PurchaseInvoicesDetails() {
  const { id } = useParams();
  const currency = useAppSelector((state) => state.currency.value);
  const { data, isLoading } = useGetPurchaseInvoiceByIdQuery(id as string);
  const [markPaid, { isLoading: isMarkingPaid }] =
    useUpdatePurchaseInvoiceMutation();

  const { data: fetchedSettingsInfo } = useGetSettingsInfoQuery();
  const settingsInfo = fetchedSettingsInfo?.data;

  if (isLoading) return <p>Loading...</p>;

  if (!data?.data) return;

  const invoice: PurchaseInvoice = data?.data;
  const po = invoice?.purchase_order;
  const supplier = po?.supplier;
  const payments: PurchasePayment[] = invoice?.payments || [];

  // Invoice Calculations
  const subtotal = po?.total_amount;
  const tax = po?.tax_amount ?? 0;
  const discount = po?.discount_amount ?? 0;
  const netAmount = subtotal - discount;
  const total = subtotal + tax - discount;
  const paid = invoice?.paid_amount ?? 0; // No payments yet
  const balance = total - paid;
  const isFullyPaid = balance <= 0;
  const showMarkAsPaidButton = isFullyPaid && invoice?.status !== "paid";

  const handleMarkAsPaid = async () => {
    if (!isFullyPaid || invoice?.status === "paid") return;
    try {
      const res = await markPaid({
        invoiceId: invoice?.id.toString() as string,
        data: {
          status: "paid",
        },
      }).unwrap();
      if (res) {
        toast.success(res.message || "Invoice marked as paid successfully");
      }
    } catch (error) {
      console.error("Failed to mark invoice as paid", error);
      toast.error("Failed to mark invoice as paid");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-5">
        <h1 className="text-3xl font-bold">
          Invoice {invoice?.invoice_number}
        </h1>

        <div className="flex items-center gap-2">
          <Link to="/dashboard/purchase-invoices">
            <Button variant="outline">← Back to Invoices</Button>
          </Link>

          <Link
            to={`/dashboard/purchase-payments/create?pon=${invoice?.purchase_order.po_number}`}
          >
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Record Payment
            </Button>
          </Link>

          <Link to={`/dashboard/purchase-invoices/${invoice?.id}/preview`}>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Print Preview
            </Button>
          </Link>
          {showMarkAsPaidButton && (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleMarkAsPaid}
              disabled={isMarkingPaid}
            >
              {isMarkingPaid ? "Marking..." : "✔ Mark as Paid"}
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Details + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Info */}
        <div className="col-span-2 space-y-5">
          <div className="border rounded-md p-5">
            <h2 className="font-semibold text-lg mb-5">Invoice Details</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* From Supplier */}
              <div className="space-y-5">
                <div className="space-y-1">
                  <p className="font-semibold">From (Supplier):</p>
                  <p>{supplier?.name}</p>
                  <p>
                    {supplier?.email} | {supplier?.phone}
                  </p>
                  {supplier?.contact_person && (
                    <p>Contact Person: {supplier?.contact_person}</p>
                  )}
                </div>

                {/* To (Your Company) */}
                <div>
                  <p className="font-semibold">To:</p>
                  <p>{settingsInfo?.company_name}</p>
                  <p>{settingsInfo?.address}</p>
                  <p>
                    {settingsInfo?.email} | {settingsInfo?.phone}
                  </p>
                </div>
              </div>

              {/* Invoice Numbers */}
              <div className="space-y-2">
                <p>
                  <strong>Invoice #:</strong> {invoice?.invoice_number}
                </p>
                <p>
                  <strong>PO #:</strong> {po?.po_number}
                </p>
                <p>
                  <strong>Invoice Date:</strong>{" "}
                  {invoice?.invoice_date.split("T")[0]}
                </p>
                <p>
                  <strong>Due Date:</strong> {invoice?.due_date}
                </p>
                <p className="flex items-center gap-2">
                  <strong>Status:</strong>
                  <Badge
                    className={`${invoice?.status === "paid"
                        ? "bg-green-600"
                        : "bg-yellow-600"
                      } text-white capitalize`}
                  >
                    {invoice?.status}
                  </Badge>
                </p>
                <p>
                  <strong>Created By:</strong> {invoice?.creator?.name}
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="border rounded-md">
            <div className="p-4 font-semibold text-lg">Invoice Items</div>

            {po?.items.length === 0 ? (
              <div className="p-4 text-gray-600">No items found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-3 text-left">Product</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">Unit Cost ({currency})</th>
                      <th className="p-3 text-right">
                        Total Price ({currency})
                      </th>
                      <th className="p-3 text-right">Discount ({currency})</th>
                      <th className="p-3 text-right">
                        Line Total ({currency})
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {po?.items.map((item: any) => (
                      <tr key={item.id} className="border-b">
                        {/* Product */}
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            {item.product.image_url && (
                              <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                className="h-10 w-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-xs text-gray-500">
                                SKU: {item.product.sku}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Quantity */}
                        <td className="p-3 text-right">{item.quantity}</td>

                        {/* Unit Cost */}
                        <td className="p-3 text-right">
                          {item.unit_cost.toFixed(2)}
                        </td>
                        <td className="p-3 text-right">
                          {item.total_price.toFixed(2)}
                        </td>
                        {/* Discount */}
                        <td className="p-3 text-right">
                          {item.discount.toFixed(2)}
                        </td>

                        {/* Line Total */}
                        <td className="p-3 text-right font-semibold">
                          {item.line_total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payments */}

          {/* <div className="border rounded-md p-4">
                        <h2 className="font-semibold text-lg mb-2">Payments</h2>

                        {payments.length === 0 ? (
                            <p className="text-sm">No payments yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {payments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex justify-between items-center border rounded-md p-2"
                                    >
                                        <div className="space-y-1 text-sm">
                                            <p>
                                                <strong>Payment #{payment.id}</strong>
                                            </p>
                                            <p>Amount: RM {payment.amount.toFixed(2)}</p>
                                            <p>Method: {payment.payment_method}</p>
                                            <p>Reference: {payment.reference_number}</p>
                                            <p>
                                                Date:{" "}
                                                {new Date(payment.payment_date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <Badge
                                            className={`capitalize ${payment.status === "pending"
                                                ? "bg-yellow-500 text-white"
                                                : payment.status === "completed"
                                                    ? "bg-green-600 text-white"
                                                    : "bg-red-600 text-white"
                                                }`}
                                        >
                                            {payment.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div> */}
          {/* Payments */}
          <div className="border rounded-md p-4">
            <h2 className="font-semibold text-lg mb-2">Payments</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="p-3">Date</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Amount ({currency})</th>
                    <th className="p-3">Due Amount ({currency})</th>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Collected By</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.length > 0 ? (
                    payments?.map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-3">
                          {item?.payment_date
                            ? new Date(item.payment_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )
                            : "-"}
                        </td>

                        <td className="p-3">{item?.payment_method}</td>
                        <td className="p-3">
                          {Number(item?.amount || 0).toFixed(2)}
                        </td>
                        <td className="p-3">
                          {(
                            Number(invoice?.total_payable_amount || 0) -
                            Number(item?.amount || 0)
                          ).toFixed(2)}
                        </td>
                        <td className="p-3">{item?.reference_number || "-"}</td>
                        <td className="p-3">{item?.creator?.name || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-3 text-center text-sm text-gray-500"
                      >
                        No payments yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-5">
          <div className="border rounded-md p-5 space-y-3">
            <h2 className="font-semibold text-lg">Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">
                  {currency} {subtotal?.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Total Discount</span>
                <span className="font-semibold">
                  {currency} {discount.toFixed(2)}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span>Net Amount</span>
                <span className="font-semibold">
                  {currency} {netAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-semibold">
                  {currency} {tax.toFixed(2)}
                </span>
              </div>
              <Separator />

              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-semibold">
                  {currency} {total.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Paid</span>
                <span className="font-semibold">
                  {currency} {paid.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold mt-1">
                <span>Balance</span>
                <span>{currency} {balance.toFixed(2)}</span>
              </div>

              <Badge
                className={`${invoice?.status === "paid" ? "bg-green-600" : "bg-yellow-600"
                  } text-white capitalize mt-1`}
              >
                {invoice?.status}
              </Badge>
            </div>
          </div>

          {/* Supplier Box */}
          <div className="border rounded-md p-5">
            <h3 className="font-semibold text-lg">Supplier</h3>

            <p className="mt-2 font-semibold">{supplier?.name}</p>
            <p className="text-sm">{supplier?.email}</p>
            <p className="text-sm">{supplier?.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
