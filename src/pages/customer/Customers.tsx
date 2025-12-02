import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Users,
  UserCheck,
  DollarSign,
  UserPlus,
  PackagePlus,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export type Customer = {
  id: string;
  name: string;
  group: string;
  email: string;
  phone: string;
  address: string;
  creditLimit: number;
  balance: number;
  risk: string;
  status: string;
};

const customers: Customer[] = [
  {
    id: "CUST-001",
    name: "ABC Trading",
    group: "Wholesale",
    email: "accounts@abctrading.com",
    phone: "+6012345678",
    address: "123 Street, Kuala Lumpur, 50000, Malaysia",
    creditLimit: 10000,
    balance: 1250,
    risk: "Low",
    status: "Active",
  },
  {
    id: "CUST-002",
    name: "Global Industries",
    group: "Key Account",
    email: "finance@globalind.com",
    phone: "+6019876543",
    address: "456 Street, Shah Alam, 40000, Malaysia",
    creditLimit: 25000,
    balance: 0,
    risk: "Medium",
    status: "Inactive",
  },
];

const stats = [
  {
    label: "Active Customers",
    value: 32,
    color: "bg-green-600",
    icon: <UserCheck className="w-10 h-10 opacity-80" />,
  },
  {
    label: "Total Customers",
    value: 145,
    color: "bg-blue-600",
    icon: <Users className="w-10 h-10 opacity-80" />,
  },
  {
    label: "Total Revenue",
    value: "RM 82,400",
    color: "bg-yellow-600",
    icon: <DollarSign className="w-10 h-10 opacity-80" />,
  },
  {
    label: "New Customers",
    value: 12,
    color: "bg-purple-600",
    icon: <UserPlus className="w-10 h-10 opacity-80" />,
  },
];

export default function Customers() {
  const [pageIndex, setPageIndex] = useState(0);

  const customerColumns: ColumnDef<Customer>[] = [
    { accessorKey: "id", header: "Customer ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "group", header: "Group" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "creditLimit", header: "Credit Limit (RM)" },
    { accessorKey: "balance", header: "Balance (RM)" },
    { accessorKey: "risk", header: "Risk" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant = status === "Active" ? "success" : "destructive";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className="flex items-center gap-2">
               {/* EDIT BUTTON */}
            <Link to={`/dashboard/customers/${id}/edit`}>
              <Button variant="secondary">
                Edit
              </Button>
            </Link>
            {/* VIEW BUTTON */}
            <Link to={`/dashboard/customers/${id}`}>
              <Button variant="outline">
                Ledger
              </Button>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">All Customers</h2>

        <div className="flex flex-wrap items-center gap-4">
          <Link to="/dashboard/customers/create">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-500">
              <PackagePlus size={18} />
              Add Customer
            </button>
          </Link>

          <Link to="/dashboard/customers/map">
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-500">
              <MapPin size={18} />
              Customer Map
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {stats?.map((item, idx) => (
          <div
            key={idx}
            className={`${item.color} text-white rounded-xl p-5 flex justify-between items-center shadow`}
          >
            <div>
              <h3 className="text-3xl font-bold">{item.value}</h3>
              <p className="text-sm mt-1 opacity-90">{item.label}</p>
            </div>
            {item.icon}
          </div>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={customerColumns}
            data={customers}
            pageIndex={pageIndex}
            pageSize={10}
            onPageChange={setPageIndex}
          />
        </CardContent>
      </Card>
    </div>
  );
}
