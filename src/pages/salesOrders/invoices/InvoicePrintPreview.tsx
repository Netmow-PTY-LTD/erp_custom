import PrintableInvoice from "./PrintableInvoice";

export default function InvoicePrintPreview() {
  const from = {
    name: "Tech Supply Sdn Bhd",
    address: "12, Jalan Teknologi 1, Cyberjaya, Selangor",
    email: "support@techsupply.com",
    phone: "+60 12-345 6789",
  };

  const to = {
    name: "Apex Retail Enterprise",
    address: "55, Jalan Sentral, Kuala Lumpur",
    email: "info@apexretail.com",
    phone: "+60 19-876 5432",
    code: "CUST-00123",
  };

  const invoice = {
    invoiceNo: "INV-2024-0012",
    orderNo: "ORD-88421",
    invoiceDate: "2024-02-12",
    dueDate: "2024-02-19",
    status: "Pending",
    subtotal: 1680.0,
    tax: 100.8,
    total: 1780.8,
    paid: 0.0,
    balance: 1780.8,
  };

  const items = [
    {
      product: "Logitech MX Master 3S Mouse",
      sku: "LGMX-3S",
      price: 450.0,
      qty: 2,
      discount: 0,
      total: 900.0,
    },
    {
      product: "Dell 27” IPS Monitor",
      sku: "DELL-27IPS",
      price: 780.0,
      qty: 1,
      discount: 0,
      total: 780.0,
    },
  ];

  return (
    <div className="">
      <PrintableInvoice from={from} to={to} invoice={invoice} items={items} />
    </div>
  );
}
