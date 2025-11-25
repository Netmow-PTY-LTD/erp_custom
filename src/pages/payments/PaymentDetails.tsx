
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function PaymentDetails() {
  // Temporary mock data — replace with real API response
  const payment = {
    number: "PAY-20251012-09E0E3",
    date: "2025-10-12",
    method: "Cash",
    reference: "-",
    notes: "-",
    amount: 59800.0,
    recordedBy: "Admin User",
    invoice: {
      number: "INV-20251012-FBB652",
      total: 59800.0,
    },
  };

  const customer = {
    name: "Digital Works Sdn Bhd",
    code: "CUST006",
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Payment {payment.number}
        </h1>

        <div className="flex items-center gap-2">
          <Link to="/dashboard/payments">
            <Button variant="outline">← Back to Payments</Button>
          </Link>
          <Link to={`/dashboard/invoices/${payment.invoice.number}`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            View Invoice {payment.invoice.number}
          </Button>
          </Link>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Details Section */}
        <div className="col-span-2 border rounded-md p-5">
          <h2 className="font-semibold text-lg mb-4">Payment Details</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6">
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
                <a
                  href="#"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {payment.invoice.number}
                </a>
              </div>

              <div className="mt-8">
                <p className="font-semibold">Amount</p>
                <p className="text-xl font-bold">
                  RM {payment.amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Section */}
        <div className="space-y-4">
          <div className="border rounded-md p-5">
            <h3 className="font-semibold text-lg">Customer</h3>
            <p className="mt-2 font-semibold">{customer.name}</p>
            <p className="text-sm">{customer.code}</p>
          </div>

          {/* Invoice Summary */}
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
        </div>
      </div>
    </div>
  );
}

