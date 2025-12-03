import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Users,
  UserCheck,
  DollarSign,
  UserPlus,
  PackagePlus,
  MapPin,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useGetCustomersQuery, useDeleteCustomerMutation } from "@/store/features/customers/customersApi";
import type { Customer } from "@/store/features/customers/types";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Customers() {
  const [pageIndex, setPageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const pageSize = 10;
  const currentPage = pageIndex + 1;

  // Fetch customers with pagination and search
  const { data, isLoading, error } = useGetCustomersQuery({
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
  });

  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCustomer(deleteId).unwrap();
      toast.success("Customer deleted successfully");
      setDeleteId(null);
    } catch (err) {
      toast.error("Failed to delete customer");
    }
  };

  const customers = data?.data || [];
  const totalPages = data?.pagination.totalPage || 1;
  const totalCustomers = data?.pagination.total || 0;

  // Calculate stats from customers
  const activeCustomers = customers.filter((c) => c.is_active).length;

  const stats = [
    {
      label: "Active Customers",
      value: activeCustomers,
      color: "bg-green-600",
      icon: <UserCheck className="w-10 h-10 opacity-80" />,
    },
    {
      label: "Total Customers",
      value: totalCustomers,
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

  const customerColumns: ColumnDef<Customer>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "customer_type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("customer_type") as string;
        return type === "business" ? "Business" : "Individual";
      },
    },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => {
        const customer = row.original;
        const parts = [customer.address, customer.city, customer.state].filter(Boolean);
        return parts.join(", ") || "-";
      },
    },
    {
      accessorKey: "credit_limit",
      header: "Credit Limit (RM)",
      cell: ({ row }) => {
        const limit = row.getValue("credit_limit") as number;
        return limit ? `RM ${limit.toLocaleString()}` : "-";
      },
    },
    {
      accessorKey: "outstanding_balance",
      header: "Balance (RM)",
      cell: ({ row }) => {
        const balance = row.getValue("outstanding_balance") as number;
        return balance ? `RM ${balance.toLocaleString()}` : "RM 0";
      },
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("is_active") as boolean;
        const variant = isActive ? "success" : "destructive";
        return <Badge variant={variant}>{isActive ? "Active" : "Inactive"}</Badge>;
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
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </Link>
            {/* VIEW BUTTON */}
            <Link to={`/dashboard/customers/${id}`}>
              <Button variant="outline" size="sm">
                View
              </Button>
            </Link>
            {/* DELETE BUTTON */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteId(id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  if (error) {
    return (
      <div className="w-full p-6">
        <div className="text-red-600">Error loading customers. Please try again.</div>
      </div>
    );
  }

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

      {/* Search Bar */}
      <div className="mb-4">
        <Input
          placeholder="Search customers by name, email, phone, or company..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPageIndex(0); // Reset to first page on search
          }}
          className="max-w-md"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading customers...</div>
          ) : (
            <DataTable
              columns={customerColumns}
              data={customers}
              pageIndex={pageIndex}
              pageSize={pageSize}
              pageCount={totalPages}
              onPageChange={setPageIndex}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer
              and remove their data from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
