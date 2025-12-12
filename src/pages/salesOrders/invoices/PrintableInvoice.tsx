import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function PrintableInvoice() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6">
      {/* INVOICE CONTENT */}
      <div
        id="invoice"
        className="bg-white p-6 max-w-4xl mx-auto print:w-[850px]"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">

            <div>
              <h1 className="text-3xl font-bold">INVOICE</h1>
              <p className="text-sm text-gray-500">#{invoice.invoiceNo}</p>
            </div>

          {/* Company Info */}
          <div className="text-right flex flex-col items-end">
            <img
              src="https://inleadsit.com.my/wp-content/uploads/2023/07/favicon-2.png" // <-- Replace with your logo
              alt="Company Logo"
              className="h-16 w-auto object-contain inline-block mb-2"
            />
            <p className="font-semibold">{from.name}</p>
            <p className="text-sm">{from.address}</p>
            <p className="text-sm">{from.email}</p>
            <p className="text-sm">{from.phone}</p>
          </div>
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-8 mb-10">
          <div>
            <h2 className="font-semibold text-lg mb-2">Bill To</h2>
            <p className="font-semibold">{to.name}</p>
            <p className="text-sm">{to.address}</p>
            <p className="text-sm">{to.email}</p>
            <p className="text-sm">{to.phone}</p>
          </div>

          <div className="text-sm space-y-1">
            <p>
              <strong>Invoice Date:</strong> {invoice.invoiceDate}
            </p>
            <p>
              <strong>Due Date:</strong> {invoice.dueDate}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Badge className="bg-yellow-500 text-white">
                {invoice.status}
              </Badge>
            </p>
            <p>
              <strong>Order #:</strong> {invoice.orderNo}
            </p>
          </div>
        </div>

        {/* Items */}
        <div className="border rounded-md overflow-hidden mb-10">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr className="text-left">
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Unit Price (RM)</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Discount %</th>
                <th className="p-3 text-right">Line Total (RM)</th>
              </tr>
            </thead>

            <tbody>
              {items?.map((item: any, idx: number) => (
                <tr key={idx} className="border-b">
                  <td className="p-3">{item.product}</td>
                  <td className="p-3">{item.sku}</td>
                  <td className="p-3">{item.price.toFixed(2)}</td>
                  <td className="p-3">{item.qty}</td>
                  <td className="p-3">{item.discount.toFixed(2)}</td>
                  <td className="p-3 text-right">{item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="w-64 ml-auto space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">
              RM {invoice.subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span className="font-semibold">RM {invoice.tax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Total</span>
            <span className="font-semibold">RM {invoice.total.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span>Paid</span>
            <span className="font-semibold">RM {invoice.paid.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-lg font-bold">
            <span>Balance</span>
            <span>RM {invoice.balance.toFixed(2)}</span>
          </div>

          {/* Print Button */}
          <div className="mt-10 print:hidden text-right">
            <Button
              onClick={handlePrint}
              variant="outline"
            >
              Print Invoice
            </Button>
          </div>
        </div>

        <div className="text-center text-xs mt-16 text-gray-500">
          Thank you for being with us.
        </div>
      </div>
    </div>
  );
}
