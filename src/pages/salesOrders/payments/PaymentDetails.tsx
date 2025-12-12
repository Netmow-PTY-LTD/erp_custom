
import { Button } from "@/components/ui/button";
import { useGetSalesPaymentByIdQuery } from "@/store/features/salesOrder/salesOrder";
import { Link, useParams } from "react-router";

export default function PaymentDetails() {
  const { paymentId } = useParams();
  const { data, isLoading, error } = useGetSalesPaymentByIdQuery(paymentId as string);

  console.log('payment data', data);

  if (isLoading) return <p>Loading...</p>;
  if (error || !data?.data) return <p>Payment not found.</p>;

  const paymentData = data.data;

  const payment = {
    number: `PAY-${paymentData.id.toString().padStart(6, "0")}`,
    date: new Date(paymentData.payment_date).toLocaleDateString(),
    method: paymentData.payment_method.replaceAll("_", " ").replace(/^\w/, c => c.toUpperCase()),
    reference: paymentData.reference_number || "-",
    notes: paymentData.notes || "-",
    amount: Number(paymentData.amount),
    recordedBy: paymentData.created_by || "-",
    invoice: paymentData.order
      ? {
          number: paymentData.order.order_number,
          total: Number(paymentData.order.total_amount),
        }
      : null,
  };

  const customer = paymentData.order?.customer
    ? {
        name: paymentData.order.customer.name,
        code: `CUST-${paymentData.order.customer.id.toString().padStart(3, "0")}`,
      }
    : null;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h1 className="text-2xl sm:text-3xl font-bold">Payment {payment?.number}</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Link to="/dashboard/sales/payments">
            <Button variant="outline">← Back to Payments</Button>
          </Link>
          {payment?.invoice && (
            <Link to={`/dashboard/sales/orders/${paymentData?.order?.id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                View Order {payment?.invoice.number}
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Details Section */}
        <div className="col-span-1 lg:col-span-2 border rounded-md p-5">
          <h2 className="font-semibold text-lg mb-4">Payment Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Payment Number</p>
                <p>{payment.number}</p>
              </div>

              <div>
                <p className="font-semibold">Recorded By</p>
                <p className="font-bold">{payment.recordedBy}</p>
              </div>

              <div>
                <p className="font-semibold">Method</p>
                <p className="font-bold">{payment.method}</p>
              </div>

              <div>
                <p className="font-semibold">Reference</p>
                <p>{payment.reference}</p>
              </div>

              <div>
                <p className="font-semibold">Notes</p>
                <p>{payment.notes}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Payment Date</p>
                <p className="font-bold">{payment.date}</p>
              </div>

              <div>
                <p className="font-semibold">Linked Invoice</p>
                {payment.invoice ? (
                  <Link
                    to={`/dashboard/sales/orders/${paymentData?.order?.id}`}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {payment.invoice.number}
                  </Link>
                ) : (
                  <p className="text-gray-400">No Invoice</p>
                )}
              </div>

              <div className="mt-8">
                <p className="font-semibold">Amount</p>
                <p className="text-xl font-bold">RM {payment.amount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Section */}
        <div className="space-y-4">
          <div className="border rounded-md p-5">
            <h3 className="font-semibold text-lg">Customer</h3>
            {customer ? (
              <>
                <p className="mt-2 font-semibold">{customer.name}</p>
                <p className="text-sm">{customer.code}</p>
              </>
            ) : (
              <p className="text-gray-400">No Customer Info</p>
            )}
          </div>

          {/* Invoice Summary */}
          {payment.invoice && (
            <div className="border rounded-md p-5 space-y-3">
              <h3 className="font-semibold text-lg">Invoice Summary</h3>

              <div className="flex justify-between text-sm">
                <span>Invoice #</span>
                <span className="font-semibold">{payment.invoice.number}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Invoice Total</span>
                <span className="font-semibold">
                  RM {payment.invoice.total.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
