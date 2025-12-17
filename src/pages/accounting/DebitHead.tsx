"use client";

import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import {
  useDeleteDebitHeadMutation,
  useGetAllDebitHeadsQuery,
} from "@/store/features/accounting/accoutntingApiService";
import type { CreditHead, DebitHead } from "@/types/accounting.types";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AddDebitHeadForm from "./AddDebitHead";
import EditDebitHeadForm from "./EditDebitHead";
export default function DebitHead() {
  const [openEditForm, setOpenEditForm] = useState<boolean>(false);
  const [debitHeadId, setDebitHeadId] = useState<number>(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data, isFetching, isError } = useGetAllDebitHeadsQuery({
    page,
    limit: 10,
    search,
});
  const debitHeads: DebitHead[] = data?.data || [];

  console.log("Debit Heads", data);

  const [deleteDebitHead] = useDeleteDebitHeadMutation();

 const handleDeleteDebitHead = async (id: number) => {
  const confirmed = await new Promise<boolean>((resolve) => {
    const toastId = toast.custom(() => (
      <div className="flex flex-col items-center gap-4 rounded-md border bg-white p-4 shadow">
        <p className="text-sm font-semibold">
          Are you sure you want to delete this credit head?
        </p>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => {
              toast.dismiss(toastId);
              resolve(false);
            }}
            className="px-3 py-1 text-sm rounded border"
          >
            No
          </button>

          <button
            onClick={() => {
              toast.dismiss(toastId);
              resolve(true);
            }}
            className="px-3 py-1 text-sm rounded bg-red-600 text-white"
          >
            Yes
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
    });
  });

  if (!confirmed) return;

  try {
    const res = await deleteDebitHead(id).unwrap();
    if (res.status) {
      toast.success("Debit head deleted successfully");
    } else {
      toast.error("Failed to delete debit head");
    }
  } catch (error) {
    toast.error(
      "Failed to delete debit head" +
        (error instanceof Error ? ": " + error.message : "")
    );
  }
};


  const debitHeadColumns: ColumnDef<CreditHead>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("is_active") as boolean;
        return (
          <Badge className={`${status ? "bg-green-600" : "bg-red-600"}`}>{status ? "Active" : "Inactive"}</Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const debitHeadId = row.original.id;

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDebitHeadId(debitHeadId);
                setOpenEditForm(true);
              }}
            >
              Edit
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteDebitHead(debitHeadId)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  if (isError) return <p>Error loading incomes</p>;

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-4">List of Debit Heads</h2>
        <AddDebitHeadForm />
      </div>
      <DataTable
        columns={debitHeadColumns}
        data={debitHeads}
        pageIndex={page}
        pageSize={limit}
        totalCount={data?.pagination?.total || 0}
        onPageChange={setPage}
        onSearch={(val)=>{
            setSearch(val);
            setPage(1);
        }}
        isFetching={isFetching}
      />
      <EditDebitHeadForm
        open={openEditForm}
        setOpen={setOpenEditForm}
        debitHeadId={debitHeadId}
      />
    </div>
  );
}
