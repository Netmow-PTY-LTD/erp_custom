import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ColumnDef } from "@tanstack/react-table";
import { Users, UserCheck, DollarSign, UserPlus, Eye, PackagePlus, Pencil, Tags, MapPin } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";



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


    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className="flex items-center gap-2">
            {/* VIEW BUTTON */}
            <Link to={`/dashboard/customers/${id}`}>
              <Button variant="outline" size="icon">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>

            {/* EDIT BUTTON */}
            <Link to={`/dashboard/customers/${id}/edit`}>
              <Button variant="secondary" size="icon">
                <Pencil className="h-4 w-4" />
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
          <CardTitle>All Products</CardTitle>
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





