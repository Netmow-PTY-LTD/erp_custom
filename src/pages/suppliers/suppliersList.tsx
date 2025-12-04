// "use client";

// import { DataTable } from "@/components/dashboard/components/DataTable";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import type { ColumnDef } from "@tanstack/react-table";
// import { Edit, PlusCircle, Trash2 } from "lucide-react";
// import { Link } from "react-router";


// interface Supplier {
//   id: string;
//   code: string;
//   name: string;
//   contact: string;
//   city: string;
//   pos: number;
//   status: "Active" | "Inactive";
// }

// const suppliersData: Supplier[] = [
//   { id: "1", code: "SUP001", name: "ABC Ltd.", contact: "abc@example.com", city: "Dhaka", pos: 5, status: "Active" },
//   { id: "2", code: "SUP002", name: "XYZ Corp.", contact: "xyz@example.com", city: "Chittagong", pos: 2, status: "Inactive" },
//   { id: "3", code: "SUP003", name: "Mega Supplies", contact: "mega@example.com", city: "Khulna", pos: 10, status: "Active" },
// ];


// export default function SuppliersList() {

//   const supplierColumns: ColumnDef<Supplier>[] = [
//     {
//       accessorKey: "code",
//       header: "Code",
//     },
//     {
//       accessorKey: "name",
//       header: "Name",
//     },
//     {
//       accessorKey: "contact",
//       header: "Contact",
//     },
//     {
//       accessorKey: "city",
//       header: "City",
//     },
//     {
//       accessorKey: "pos",
//       header: "POs",
//     },
//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ row }) => {
//         const status = row.getValue("status") as string;
//         const color = status === "Active" ? "bg-green-600" : "bg-red-600";
//         return <Badge className={`${color} text-white`}>{status}</Badge>;
//       },
//     },
//     {
//       id: "actions",
//       header: "Actions",
//       cell: ({ row }) => {
//         const supplier = row.original;
//         return (
//           <div className="flex gap-2">
//             <Link to={`/dashboard/suppliers/${supplier.id}/edit`}>
//               <Button size="sm" variant="outline">
//                 <Edit className="w-4 h-4 mr-1" /> Edit
//               </Button>
//             </Link>
//             <Button size="sm" variant="destructive">
//               <Trash2 className="w-4 h-4 mr-1" /> Delete
//             </Button>
//           </div>
//         );
//       },
//     },
//   ];

//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold tracking-tight">Suppliers Management</h1>
//         <Link to="/dashboard/suppliers/create">
//           <Button className="flex items-center gap-2" size="sm">
//             <PlusCircle className="w-5 h-5" />
//             Add Supplier
//           </Button>
//         </Link>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>All Suppliers</CardTitle>
//           <CardDescription>Manage your supplier list</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <DataTable columns={supplierColumns} data={suppliersData} />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
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
import {
  useDeleteSupplierMutation,
  useGetAllSuppliersQuery,
} from "@/store/features/suppliers/supplierApiService";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";


interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  city: string;
  is_active: boolean;
}

// Simple confirmation modal
function ConfirmModal({
  open,
  onClose,
  onConfirm,
  message,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-xl w-96">
        <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuppliersList() {
  const { data: suppliersData, isLoading } = useGetAllSuppliersQuery();
  const [deleteSupplier, { isLoading: isDeleting }] = useDeleteSupplierMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSelectedSupplierId(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSupplierId) return;

    try {
      await deleteSupplier(selectedSupplierId).unwrap();
      toast.success("Supplier deleted successfully");
    } catch (error) {
      toast.error("Failed to delete supplier");
      console.error(error);
    } finally {
      setModalOpen(false);
      setSelectedSupplierId(null);
    }
  };

  const supplierColumns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "contact_person",
      header: "Contact Person",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("is_active") as boolean;
        const color = status ? "bg-green-600" : "bg-red-600";
        return <Badge className={`${color} text-white`}>{status ? "Active" : "Inactive"}</Badge>;
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
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDeleteClick(supplier.id)}
              disabled={isDeleting}
            >
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
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <DataTable
              columns={supplierColumns}
              data={
                Array.isArray(suppliersData?.data)
                  ? suppliersData.data.map((supplier) => ({
                      ...supplier,
                      id: supplier.id !== undefined ? String(supplier.id) : "",
                    }))
                  : []
              }
            />
          )}
        </CardContent>
      </Card>

      {/* Delete confirmation modal */}
      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this supplier? This action cannot be undone."
      />
    </div>
  );
}
