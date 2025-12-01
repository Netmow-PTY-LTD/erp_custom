
import { useState } from "react";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ColumnDef } from "@tanstack/react-table";

/* ---------------------------------------------------------------------- */
/*                              SAMPLE DATA                               */
/* ---------------------------------------------------------------------- */

const salesByCustomer = [
  { customer: "Modern Enterprises", orders: 1, sales: 4300.0 },
  { customer: "Arif R.", orders: 1, sales: 487.5 },
  { customer: "Tech Solutions Sdn Bhd", orders: 0, sales: 0.0 },
  { customer: "Global Trading Co", orders: 0, sales: 0.0 },
  { customer: "Innovative Systems", orders: 0, sales: 0.0 },
  { customer: "Office Hub Malaysia", orders: 0, sales: 0.0 },
  { customer: "Digital Works Sdn Bhd", orders: 0, sales: 0.0 },
  { customer: "Smart Office Solutions", orders: 0, sales: 0.0 },
  { customer: "Premier Business Group", orders: 0, sales: 0.0 },
  { customer: "Muzahid Khan", orders: 0, sales: 0.0 },
];

const accountsReceivable = [
  {
    invoiceNumber: "INV-20251012-D72F5C",
    customer: "Modern Enterprises",
    date: "2025-10-12",
    due: "2025-10-19",
    total: 1325,
    paid: 0,
    balance: 1325,
  },
  {
    invoiceNumber: "INV2025003",
    customer: "Innovative Systems",
    date: "2025-10-03",
    due: "2025-11-02",
    total: 715.5,
    paid: 0,
    balance: 715.5,
  },
  {
    invoiceNumber: "INV2025004",
    customer: "Office Hub Malaysia",
    date: "2025-10-04",
    due: "2025-11-03",
    total: 918.4,
    paid: 0,
    balance: 918.4,
  },
  {
    invoiceNumber: "INV2025005",
    customer: "Modern Enterprises",
    date: "2025-10-05",
    due: "2025-11-04",
    total: 1325,
    paid: 0,
    balance: 1325,
  },
  {
    invoiceNumber: "INV-20251110-63F242",
    customer: "Tech Solutions Sdn Bhd",
    date: "2025-11-10",
    due: "2025-11-10",
    total: 836.5,
    paid: 0,
    balance: 836.5,
  },
];

/* ---------------------------------------------------------------------- */
/*                        SALES BY CUSTOMER COLUMNS                       */
/* ---------------------------------------------------------------------- */

interface SalesCustomer {
  customer: string;
  orders: number;
  sales: number;
}

const salesColumns: ColumnDef<SalesCustomer>[] = [
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => <span className="font-medium">{row.getValue("customer")}</span>,
  },
  {
    accessorKey: "orders",
    header: "Orders",
  },
  {
    accessorKey: "sales",
    header: "Sales (RM)",
    cell: ({ row }) => {
      const val = row.getValue("sales") as number;
      return <span>RM {val.toFixed(2)}</span>;
    },
  },
];

/* ---------------------------------------------------------------------- */
/*                         ACCOUNTS RECEIVABLE COLUMNS                    */
/* ---------------------------------------------------------------------- */

interface AR {
  invoiceNumber: string;
  customer: string;
  date: string;
  due: string;
  total: number;
  paid: number;
  balance: number;
}

const arColumns: ColumnDef<AR>[] = [
  {
    accessorKey: "invoiceNumber",
    header: "Invoice #",
    cell: ({ row }) => <span className="font-medium">{row.getValue("invoiceNumber")}</span>,
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "due",
    header: "Due",
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => <span>RM {(row.getValue("total") as number).toFixed(2)}</span>,
  },
  {
    accessorKey: "paid",
    header: "Paid",
    cell: ({ row }) => <span>RM {(row.getValue("paid") as number).toFixed(2)}</span>,
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const value = row.getValue("balance") as number;
      return (
        <Badge className={value > 0 ? "bg-red-500" : "bg-green-500"}>
          RM {value.toFixed(2)}
        </Badge>
      );
    },
  },
];

/* ---------------------------------------------------------------------- */
/*                                PAGE UI                                 */
/* ---------------------------------------------------------------------- */

export default function CustomerReports() {
  const [start, setStart] = useState("2025-11-01");
  const [end, setEnd] = useState("2025-11-26");

  return (
    <div className="w-full space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Customer Reports</h1>
      </div>

      {/* ---------------- FILTER BAR ---------------- */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <label className="text-sm font-medium">Start Date</label>
          <Input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium">End Date</label>
          <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>

        <Button color="info" className="mt-6">
          Apply Filter
        </Button>
      </div>

      {/* ---------------- SALES BY CUSTOMER ---------------- */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Sales by Customer</h2>
        <DataTable
          columns={salesColumns}
          data={salesByCustomer}
        />
      </div>

      {/* ---------------- ACCOUNTS RECEIVABLE ---------------- */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Accounts Receivable (Open Invoices)</h2>
        <DataTable
          columns={arColumns}
          data={accountsReceivable}
        />
      </div>
    </div>
  );
}


