"use client";

import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { Link } from "react-router";


interface Supplier {
  id: string;
  code: string;
  name: string;
  contact: string;
  city: string;
  pos: number;
  status: "Active" | "Inactive";
}

const suppliersData: Supplier[] = [
  { id: "1", code: "SUP001", name: "ABC Ltd.", contact: "abc@example.com", city: "Dhaka", pos: 5, status: "Active" },
  { id: "2", code: "SUP002", name: "XYZ Corp.", contact: "xyz@example.com", city: "Chittagong", pos: 2, status: "Inactive" },
  { id: "3", code: "SUP003", name: "Mega Supplies", contact: "mega@example.com", city: "Khulna", pos: 10, status: "Active" },
];

export default function SuppliersList() {
  const supplierColumns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "contact",
      header: "Contact",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "pos",
      header: "POs",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const color = status === "Active" ? "bg-green-600" : "bg-red-600";
        return <Badge className={`${color} text-white`}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const supplier = row.original;
        return (
          <div className="flex gap-2">
            <Link to={`/dashboard/suppliers/${supplier.id}/edit`}>
              <Button size="sm" variant="outline">
                <Edit className="w-4 h-4 mr-1" /> Edit
              </Button>
            </Link>
            <Button size="sm" variant="destructive">
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Suppliers Management</h1>
        <Link to="/dashboard/suppliers/create">
          <Button className="flex items-center gap-2" size="sm">
            <PlusCircle className="w-5 h-5" />
            Add Supplier
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Suppliers</CardTitle>
          <CardDescription>Manage your supplier list</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={supplierColumns} data={suppliersData} />
        </CardContent>
      </Card>
    </div>
  );
}
