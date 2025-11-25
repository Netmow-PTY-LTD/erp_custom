import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router";

export default function InvoiceDetailsPage() {
  // Example data (replace with your actual API response)
  const invoice = {
    invoiceNo: "INV-20251121-36A05F",
    orderNo: "ORD-20251121-7E2E87",
    invoiceDate: "2025-11-21",
    dueDate: "2025-11-22",
    status: "Sent",
    subtotal: 4345,
    tax: 0,
    total: 4300,
    paid: 0,
    balance: 4300,
  };

  const from = {
    name: "Frank Fruit Sdn. Bhd.",
    address: "ABC Address Cyberjaya, Selangor 6800, Malaysia",
    email: "frank@gmail.com",
    phone: "+6023432432",
  };

  const to = {
    name: "Modern Enterprises",
    address: "67 Persiaran Gurney, Georgetown",
    email: "sales@modern.com.my",
    phone: "+60334567890",
    code: "CUST005",
  };

  const items = [
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
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-5">
        <h1 className="text-3xl font-bold">Invoice {invoice.invoiceNo}</h1>

        <div className="flex items-center gap-2">
          <Link to="/dashboard/invoices">
            <Button variant="outline">← Back</Button>
          </Link>
          <Link to={`/dashboard/invoices/${invoice.invoiceNo}/payment`}>
            <Button variant="default" className="bg-blue-500 hover:bg-blue-600">
              Record Payment
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
                  <p>{from.name}</p>
                  <p>{from.address}</p>
                  <p>
                    {from.email} | {from.phone}
                  </p>
                </div>

                {/* To: */}
                <div>
                  <p className="font-semibold">To:</p>
                  <p>{to.name}</p>
                  <p>{to.address}</p>
                  <p>
                    {to.email} | {to.phone}
                  </p>
                </div>
              </div>

              {/* Invoice Numbers */}
              <div className="space-y-2">
                <p>
                  <strong>Invoice #:</strong> {invoice.invoiceNo}
                </p>
                <p>
                  <strong>Order #:</strong> {invoice.orderNo}
                </p>
                <p>
                  <strong>Invoice Date:</strong> {invoice.invoiceDate}
                </p>
                <p>
                  <strong>Due Date:</strong> {invoice.dueDate}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <Badge
                    variant="secondary"
                    className="bg-yellow-500 text-white"
                  >
                    {invoice.status}
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
                  <th className="p-3">Unit Price (RM)</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Discount %</th>
                  <th className="p-3">Line Total (RM)</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-3">{item.product}</td>
                    <td className="p-3">{item.sku}</td>
                    <td className="p-3">{item.price.toFixed(2)}</td>
                    <td className="p-3">{item.qty}</td>
                    <td className="p-3">{item.discount.toFixed(2)}</td>
                    <td className="p-3">{item.total.toFixed(2)}</td>
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
                  RM {invoice.subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-semibold">
                  RM {invoice.tax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-semibold">
                  RM {invoice.total.toFixed(2)}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span>Paid</span>
                <span className="font-semibold">
                  RM {invoice.paid.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-lg font-bold mt-1">
                <span>Balance</span>
                <span>RM {invoice.balance.toFixed(2)}</span>
              </div>

              <Badge
                variant="secondary"
                className="bg-yellow-500 text-white mt-1"
              >
                {invoice.status}
              </Badge>
            </div>
          </div>
          <div className="border rounded-md p-5">
            {/* Customer */}
            <div className="mt-5">
              <h3 className="font-semibold text-lg">Customer</h3>
              <p className="mt-2 font-semibold">{to.name}</p>
              <p className="text-sm">{to.code}</p>
              <p className="text-sm">{to.email}</p>
              <p className="text-sm">{to.phone}</p>
              <p className="text-sm">{to.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
