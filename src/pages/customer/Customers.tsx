import { DataTable } from "@/components/dashboard/components/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  membership: string;
  status: string;
};

const customers: Customer[] = [
  { id: "C001", name: "John Doe", email: "john@example.com", phone: "+6012345678", membership: "Gold", status: "Active" },
  { id: "C002", name: "Jane Smith", email: "jane@example.com", phone: "+6019876543", membership: "Silver", status: "Active" },
  { id: "C003", name: "Michael Lee", email: "michael@example.com", phone: "+6011122334", membership: "Bronze", status: "Inactive" },
  { id: "C004", name: "Sara Khan", email: "sara@example.com", phone: "+6012233445", membership: "Gold", status: "Active" },
  { id: "C005", name: "Ali Rahman", email: "ali@example.com", phone: "+6019988776", membership: "Silver", status: "Inactive" },
];

export default function Customers() {
  const [pageIndex, setPageIndex] = useState(0);

  const customerColumns: ColumnDef<Customer>[] = [
    { accessorKey: "id", header: "Customer ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "membership",
      header: "Membership",
      cell: ({ row }) => {
        const level = row.getValue("membership") as string;
        const variant =
          level === "Gold" ? "success" : level === "Silver" ? "secondary" : "destructive";

        return <Badge variant={variant}>{level}</Badge>;
      },
    },
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
        const customer = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Customers</h2>
      <DataTable
        columns={customerColumns}
        data={customers}
        totalCount={customers.length}
        pageIndex={pageIndex}
        pageSize={10}
        onPageChange={setPageIndex}
      />
    </div>
  );
}
