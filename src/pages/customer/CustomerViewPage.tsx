
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Pencil,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

// ----------------------------
// TypeScript Types
// ----------------------------
type TOrder = {
  id: string;
  code: string;
  date: string;
  status: string;
  amount: number;
};

type TInvoice = {
  id: string;
  code: string;
  date: string;
  status: string;
  amount: number;
};

type TPayment = {
  id: string;
  detail: string;
};

type TCustomer = {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;

  creditLimit: number;
  invoiceTotal: number;
  paidAmount: number;
  unpaidAmount: number;
  status: "Active" | "Inactive";

  orders: TOrder[];
  invoices: TInvoice[];
  payments: TPayment[];
};

export default function CustomerViewPage() {
  const { id } = useParams();

  const [customer, setCustomer] = useState<TCustomer | null>(null);

  useEffect(() => {
    // --------------------------------
    // Dummy data for UI testing
    // --------------------------------
    const dummyCustomer: TCustomer = {
      id: id || "1",
      name: "Arif R.",
      code: "CUST010",
      email: "sdfds@gmail.com",
      phone: "23423423423",
      addressLine: "Menara Paragon",
      city: "Cyberjaya",
      state: "Selangor",
      postalCode: "63000",
      country: "Malaysia",

      creditLimit: 0,
      invoiceTotal: 487.5,
      paidAmount: 0,
      unpaidAmount: 487.5,
      status: "Active",

      orders: [
        {
          id: "ord1",
          code: "ORD-20251121-2E44EB",
          date: "2025-11-21",
          status: "Confirmed",
          amount: 487.5,
        },
      ],

      invoices: [
        {
          id: "inv1",
          code: "INV-20251121-13BE5E",
          date: "2025-11-21",
          status: "Sent",
          amount: 487.5,
        },
      ],

      payments: [],
    };

    setCustomer(dummyCustomer);
  }, [id]);

  if (!customer) return <div className="p-6">Loading...</div>;

  return (
    <div className="w-full p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer: {customer.name}</h1>
        <div className="flex gap-3">
          <Button className="flex items-center gap-2">
            <ShoppingCart size={18} /> Create Order
          </Button>

          <Link to={`/dashboard/customers/${customer.id}/edit`}>
            <Button variant="secondary" className="flex items-center gap-2">
              <Pencil size={16} /> Edit
            </Button>
          </Link>

          <Link to="/dashboard/customers">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft size={16} /> Back
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PROFILE */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="font-semibold text-lg">{customer.name}</p>
            <p className="text-sm text-muted-foreground">Code: {customer.code}</p>

            <div className="pt-2 space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={16} /> {customer.addressLine || "-"}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} /> {customer.email || "-"}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} /> {customer.phone || "-"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ORDERS */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.orders.length ? (
              <table className="w-full text-sm">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="text-left py-2">Order #</th>
                    <th className="text-left">Date</th>
                    <th className="text-left">Status</th>
                    <th className="text-right">Amount (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.map((order) => (
                    <tr key={order.id} className="border-t">
                      <td className="py-2">
                        <Link
                          className="text-blue-600 hover:underline"
                          to={`/dashboard/orders/${order.id}`}
                        >
                          {order.code}
                        </Link>
                      </td>
                      <td>{order.date}</td>
                      <td>
                        <Badge>{order.status}</Badge>
                      </td>
                      <td className="text-right">{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground">No orders found.</p>
            )}
          </CardContent>
        </Card>

        {/* ADDRESS */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>{customer.addressLine}</p>
            <p>
              {customer.city}, {customer.state}, {customer.postalCode}
            </p>
            <p>{customer.country}</p>
          </CardContent>
        </Card>

        {/* INVOICES */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.invoices.length ? (
              <table className="w-full text-sm">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="text-left py-2">Invoice #</th>
                    <th className="text-left">Date</th>
                    <th className="text-left">Status</th>
                    <th className="text-right">Amount (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.invoices.map((inv) => (
                    <tr key={inv.id} className="border-t">
                      <td className="py-2">{inv.code}</td>
                      <td>{inv.date}</td>
                      <td>
                        <Badge variant="outline">{inv.status}</Badge>
                      </td>
                      <td className="text-right">{inv.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted-foreground">
                No invoices available.
              </p>
            )}
          </CardContent>
        </Card>

        {/* ACCOUNT */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Credit Limit:</strong> RM {customer.creditLimit}
            </p>
            <p>
              <strong>Invoices Total:</strong> RM {customer.invoiceTotal}
            </p>
            <p>
              <strong>Paid:</strong> RM {customer.paidAmount}
            </p>
            <p>
              <strong>Unpaid:</strong> RM {customer.unpaidAmount}
            </p>
            <p className="flex items-center gap-2">
              <strong>Status:</strong>{" "}
              <Badge
                variant={
                  customer.status === "Active" ? "success" : "destructive"
                }
              >
                {customer.status}
              </Badge>
            </p>
          </CardContent>
        </Card>

        {/* RECENT PAYMENTS */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.payments.length ? (
              <ul className="text-sm space-y-1">
                {customer.payments.map((p) => (
                  <li key={p.id}>{p.detail}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent payments.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
