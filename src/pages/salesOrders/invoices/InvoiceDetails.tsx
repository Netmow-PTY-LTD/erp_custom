import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "react-router";
import { useGetInvoiceByIdQuery } from "@/store/features/salesOrder/salesOrder";
import { useAppSelector } from "@/store/store";
import { useGetSettingsInfoQuery } from "@/store/features/admin/settingsApiService";

export default function InvoiceDetailsPage() {
  // Example data (replace with your actual API response)

  const invoiceId = useParams().invoiceId;

  const { data: invoiceData } = useGetInvoiceByIdQuery(Number(invoiceId), {
    skip: !invoiceId,
  });
  console.log("invoice data", invoiceData);

  const invoice = invoiceData?.data;

  const currency = useAppSelector((state) => state.currency.value);

  const { data: fetchedSettingsInfo } = useGetSettingsInfoQuery();
  const from = fetchedSettingsInfo?.data;

  const to = invoice?.order?.customer;

  const total = (
    Number(invoice?.order?.total_amount) + Number(invoice?.order?.tax_amount)
  ).toFixed(2);

  const payableAmount = invoice?.payments
    ?.reduce((acc, cur) => acc + Number(cur.amount), 0)
    ?.toFixed(2);

  const balance = Number(total) - Number(payableAmount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-5">
        <h1 className="text-3xl font-bold">
          Invoice {invoice?.invoice_number}
        </h1>

        <div className="flex items-center gap-2">
          <Link to="/dashboard/sales/invoices">
            <Button variant="outline">← Back to Invoices</Button>
          </Link>
          <Link to={`/dashboard/sales/payments/create`}>
            <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
              Record Payment
            </Button>
          </Link>
          <Link to={`/dashboard/sales/invoices/${invoice?.id}/preview`}>
            <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
              Print Preview
            </Button>
          </Link>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            ✔ Mark as Paid
          </Button>
        </div>
      </div>

      {/* Invoice Details + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoice Info */}
        <div className="col-span-2 space-y-5">
          <div className="border rounded-md p-5">
            <h2 className="font-semibold text-lg mb-5">Invoice Details</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* From */}
              <div className="space-y-5">
                <div className="space-y-1">
                  <p className="font-semibold">From:</p>
                  <p>{from?.company_name}</p>
                  <p>{from?.address}</p>
                  <p>
                    {from?.email} | {from?.phone}
                  </p>
                </div>

                {/* To: */}
                <div>
                  <p className="font-semibold">To:</p>
                  <p>{to?.name}</p>
                  <p>{to?.address}</p>
                  <p>
                    {to?.email} | {to?.phone}
                  </p>
                </div>
              </div>

              {/* Invoice Numbers */}
              <div className="space-y-2">
                <p>
                  <strong>Invoice #:</strong> {invoice?.invoice_number}
                </p>
                <p>
                  <strong>Order #:</strong> {invoice?.order?.order_number}
                </p>
                <p>
                  <strong>Invoice Date:</strong> {invoice?.invoice_date}
                </p>
                <p>
                  <strong>Due Date:</strong> {invoice?.due_date}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge
                    variant="secondary"
                    className="bg-yellow-500 text-white"
                  >
                    {invoice?.status}
                  </Badge>
                </p>
                <p>
                  <strong>Created By:</strong> —
                </p>
              </div>
            </div>
          </div>
          {/* Invoice Items */}
          <div className="border rounded-md">
            <div className="p-4 font-semibold text-lg">Invoice Items</div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr className="text-left">
                    <th className="p-3">Product</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Unit Price ({currency})</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Discount %</th>
                    <th className="p-3">Line Total (RM)</th>
                  </tr>
                </thead>

                <tbody>
                  {invoice?.order?.items?.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-3">{item?.product?.name}</td>
                      <td className="p-3">{item?.product?.sku}</td>
                      <td className="p-3">
                        {item?.product?.price?.toFixed(2)}
                      </td>
                      <td className="p-3">{item?.quantity}</td>
                      <td className="p-3">{Number(item?.discount)}</td>
                      <td className="p-3">
                        {Number(item?.total_price)?.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payments */}
          <div className="border rounded-md p-4">
            <h2 className="font-semibold text-lg mb-2">Payments</h2>
            <p className="text-sm">No payments yet.</p>
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
                  {currency} {Number(invoice?.total_amount)?.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-semibold">
                  {currency} {Number(invoice?.order?.tax_amount)?.toFixed(2)}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-semibold">
                  {currency} {total}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Paid</span>
                <span className="font-semibold">
                  {currency} {payableAmount}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold mt-1">
                <span>Balance</span>
                <span>
                  {currency} {balance.toFixed(2)}
                </span>
              </div>

              <Badge
                variant="secondary"
                className="bg-yellow-500 text-white mt-1"
              >
                {invoice?.status}
              </Badge>
            </div>
          </div>
          <div className="border rounded-md p-5">
            {/* Customer */}
            <div className="">
              <h3 className="font-semibold text-lg">Customer</h3>
              <p className="mt-2 font-semibold">{to?.name}</p>
              <p className="text-sm">{to?.email}</p>
              <p className="text-sm">{to?.phone}</p>
              <p className="text-sm">{to?.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
