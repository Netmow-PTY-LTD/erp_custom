"use client";

import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetExpensesQuery } from "@/store/features/accounting/accoutntingApiService";
import { useAppSelector } from "@/store/store";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export type Expense = {
  id: number;
  date: string;
  description: string;
  debit_head_id: number;
  debitHead: {
    id: number;
    name: string;
    code: string;
  };
  category: string;
  amount: number;
  paidVia: string;
  reference: string;
  status: string;
};

export default function ExpensesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data, isFetching, isError } = useGetExpensesQuery({
    page,
    limit,
    search,
  });
  const fetchedExpenses = data?.data || [];

  const currency = useAppSelector((state) => state.currency.value);

  const expenseColumns: ColumnDef<Expense>[] = [
    {
      accessorKey: "id",
      header: "ID",
      meta: { className: "md:sticky md:left-0 z-20 bg-background min-w-[60px]" } as any
    },
    {
      accessorKey: "title",
      header: "Title",
      meta: { className: "md:sticky md:left-[60px] z-20 bg-background md:shadow-[4px_0px_5px_-2px_rgba(0,0,0,0.1)]" } as any
    },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "debitHead",
      header: "Category",
      cell: ({ row }) => {
        const debitHead = row?.original?.debitHead?.name;
        return <span className="font-medium">{debitHead}</span>;
      },
    },
    {
      accessorKey: "amount",
      header: `Amount (${currency})`,
      cell: ({ row }) => `${currency} ${row.getValue("amount")}`,
    },
    { accessorKey: "expense_date", header: "Date" },
    { accessorKey: "payment_method", header: "Payment Method" },
    { accessorKey: "reference_number", header: "Reference" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = (row.getValue("status") as string) || "pending";
        const variant =
          status.toLowerCase() === "paid"
            ? "success"
            : status.toLowerCase() === "pending"
              ? "secondary"
              : "destructive";

        return <Badge variant={variant}>{status}</Badge>;
      },
    },
  ];

  if (isError) return <p>Error loading expenses</p>;

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-4">All Expenses</h2>
        <div className="flex gap-2">
          <Link to={"/dashboard/accounting/add-expanse"}>
            <Button variant="info">
              <Plus className="h-4 w-4" /> Add Expense
            </Button>
          </Link>
        </div>
      </div>
      <DataTable
        columns={expenseColumns}
        data={fetchedExpenses}
        pageIndex={page - 1}
        pageSize={limit}
        totalCount={data?.pagination?.total || 0}
        onPageChange={setPage}
        onSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        isFetching={isFetching}
      />
    </div>
  );
}
