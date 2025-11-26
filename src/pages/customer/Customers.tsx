import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

export type Customer = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude: string;
  longitude: string;
  creditLimit: number;
  status: string;
  route: string;
};

const customers: Customer[] = [
  {
    id: "C001",
    name: "John Doe",
    company: "Company A",
    email: "john@example.com",
    phone: "+6012345678",
    address: "123 Street, Kuala Lumpur",
    city: "Kuala Lumpur",
    state: "Kuala Lumpur",
    postalCode: "50000",
    country: "Malaysia",
    latitude: "3.1390",
    longitude: "101.6869",
    creditLimit: 1000,
    status: "Active",
    route: "Route A",
  },
  {
    id: "C002",
    name: "Jane Smith",
    company: "Company B",
    email: "jane@example.com",
    phone: "+6019876543",
    address: "456 Street, Selangor",
    city: "Shah Alam",
    state: "Selangor",
    postalCode: "40000",
    country: "Malaysia",
    latitude: "3.0738",
    longitude: "101.5183",
    creditLimit: 500,
    status: "Inactive",
    route: "Route B",
  },
];

export default function Customers() {
  const [pageIndex, setPageIndex] = useState(0);

  const customerColumns: ColumnDef<Customer>[] = [
    { accessorKey: "id", header: "Customer ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "company", header: "Company" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "city", header: "City" },
    { accessorKey: "state", header: "State" },
    { accessorKey: "postalCode", header: "Postal Code" },
    { accessorKey: "country", header: "Country" },
    { accessorKey: "latitude", header: "Latitude" },
    { accessorKey: "longitude", header: "Longitude" },
    { accessorKey: "creditLimit", header: "Credit Limit (RM)" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant = status === "Active" ? "success" : "destructive";
        return <Badge variant={variant}>{status}</Badge>;
      },
    },
    { accessorKey: "route", header: "Route" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Customers</h2>
      <DataTable
        columns={customerColumns}
        data={customers}
        pageIndex={pageIndex}
        pageSize={10}
        onPageChange={setPageIndex}
      />
    </div>
  );
}
