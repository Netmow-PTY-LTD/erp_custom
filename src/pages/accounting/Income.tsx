"use client";

import { DataTable } from "@/components/dashboard/components/DataTable";
import { Button } from "@/components/ui/button";
import { useGetIncomesQuery } from "@/store/features/accounting/accoutntingApiService";
import { useAppSelector } from "@/store/store";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

// Map API response to this type
export type Income = {
  id: number;
  date: string;
  description: string;
  //  category: string;
  credit_head_id: number;
  creditHead: {
    id: number;
    name: string;
    code: string;
  };
  amount: number;
  receivedVia: string | null;
  reference: string | null;
  status: string;
};

export default function IncomePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const {
    data: fetchedIncomes,
    isFetching,
    isError,
  } = useGetIncomesQuery({
    page,
    limit,
    search,
  });

  const incomes: Income[] = fetchedIncomes?.data || [];

  const currency = useAppSelector((state) => state.currency.value);

  const incomeColumns: ColumnDef<Income>[] = [
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
      accessorKey: "creditHead",
      header: "Credit Head",
      cell: ({ row }) => {
        const creditHead = row?.original?.creditHead?.name;
        return <span className="font-medium">{creditHead}</span>;
      },
    },
    {
      accessorKey: "amount",
      header: `Amount (${currency})`,
      cell: ({ row }) => `${currency} ${row.getValue("amount")}`,
    },
    { accessorKey: "income_date", header: "Date" },

    { accessorKey: "payment_method", header: "Payment Method" },
    { accessorKey: "reference_number", header: "Reference" },
  ];

  if (isError) return <p>Error loading incomes</p>;

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold mb-4">All Income</h2>

        <div className="flex gap-2">
          <Link to={"/dashboard/accounting/add-income"}>
            <Button variant="outline-info">
              <Plus className="h-4 w-4" /> Add Income
            </Button>
          </Link>
        </div>
      </div>
      <DataTable
        columns={incomeColumns}
        data={incomes}
        pageIndex={page - 1}
        pageSize={limit}
        totalCount={fetchedIncomes?.pagination?.total || 0}
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
