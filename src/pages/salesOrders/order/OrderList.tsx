
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
import { SalesPermission, SuperAdminPermission } from "@/config/permissions";
import {
  useGetAllSalesOrdersQuery,
  useGetSalesOrdersStatsQuery,
} from "@/store/features/salesOrder/salesOrder";
import { useAppSelector } from "@/store/store";
import type { SalesOrder } from "@/types/salesOrder.types";
import type { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  ClipboardList,
  Clock,
  CreditCard,
  DollarSign,
  PlusCircle,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function Orders() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); // backend starts from 1
  const [limit] = useState(10);

  const { data, isLoading } = useGetAllSalesOrdersQuery({
    page,
    limit,
    search,
  });

  const orders = data?.data ?? [];

  const currency = useAppSelector((state) => state.currency.value);
  const userPermissions = useAppSelector((state) => state.auth.user?.role.permissions || []);

  // permissions

  const canRecordPayment = userPermissions.includes(SalesPermission.PAYMENTS) || userPermissions.includes(SuperAdminPermission.ACCESS_ALL);

  const { data: fetchedOrdersStats } = useGetSalesOrdersStatsQuery(undefined);
  console.log("fetchedOrdersStats", fetchedOrdersStats);

  const totalOrdersCount = fetchedOrdersStats?.data?.total_orders || 0;
  const pendingOrdersCount = fetchedOrdersStats?.data?.pending_orders || 0;
  const deliveredOrdersCount = fetchedOrdersStats?.data?.delivered_orders || 0;
  const totalOrdersValue = fetchedOrdersStats?.data?.total_value || "RM 0";

  const orderStats = [
    {
      label: "Total Orders",
      value: totalOrdersCount,
      color: "bg-blue-600",
      icon: <ShoppingCart className="w-10 h-10 opacity-80" />,
    },
    {
      label: "Pending Orders",
      value: pendingOrdersCount,
      color: "bg-yellow-500",
      icon: <Clock className="w-10 h-10 opacity-80" />,
    },
    {
      label: "Delivered Orders",
      value: deliveredOrdersCount,
      color: "bg-green-600",
      icon: <CheckCircle className="w-10 h-10 opacity-80" />,
    },
    {
      label: "Total Value",
      value: `${currency} ${totalOrdersValue}`,
      color: "bg-cyan-400",
      icon: <DollarSign className="w-10 h-10 opacity-80" />,
    },
  ];

  const OrderColumns: ColumnDef<SalesOrder>[] = [
    {
      accessorKey: "order_number",
      header: "Order #",
      meta: { className: "md:sticky md:left-0 z-20 bg-background min-w-[120px]" } as any,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.order_number}</span>
      ),
    },

    {
      accessorKey: "customer",
      header: "Customer",
      meta: { className: "md:sticky md:left-[120px] z-20 bg-background md:shadow-[4px_0px_5px_-2px_rgba(0,0,0,0.1)]" } as any,
      cell: ({ row }) => (
        <div className="font-semibold">{row.original.customer?.name}</div>
      ),
    },

    {
      accessorKey: "order_date",
      header: "Date",
      cell: ({ row }) => new Date(row.original.order_date).toLocaleDateString(),
    },

    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) =>
        row.original.due_date
          ? new Date(row.original.due_date).toLocaleDateString()
          : "-",
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        const color =
          status === "delivered"
            ? "bg-green-600"
            : status === "pending"
              ? "bg-yellow-600"
              : status === "confirmed"
                ? "bg-blue-600"
                : "bg-gray-500";

        return (
          <Badge className={`${color} text-white capitalize`}>{status}</Badge>
        );
      },
    },

    {
      accessorKey: "total_amount",
      header: `Total Price (${currency})`,
      cell: ({ row }) =>
        `${currency} ${parseFloat(row.original.total_amount).toFixed(2)}`,
    },

    {
      accessorKey: "discount_amount",
      header: `Total Discount (${currency})`,
      cell: ({ row }) =>
        `${currency} ${parseFloat(row.original.discount_amount).toFixed(2)}`,
    },
    {
      accessorKey: "tax_amount",
      header: `Total Tax (${currency})`,
      cell: ({ row }) =>
        `${currency} ${parseFloat(row.original.tax_amount).toFixed(2)}`,
    },
    {
      id: "total_payable", // 👈 use a custom id, not accessorKey
      header: `Total Payable (${currency})`,
      cell: ({ row }) => {
        const totalAmount = parseFloat(row.original.total_amount) || 0;
        const discountAmount = parseFloat(row.original.discount_amount) || 0;
        const taxAmount = parseFloat(row.original.tax_amount) || 0;

        const totalPayable = totalAmount - discountAmount + taxAmount;

        return `${currency} ${totalPayable.toFixed(2)}`;
      },
    },
    // {
    //   accessorKey: "created_by",
    //   header: "Staff",
    //   cell: ({ row }) => `User #${row.original.created_by}`,
    // },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex gap-2">
            <Link to={`/dashboard/sales/orders/${item.id}`}>
              <Button size="sm" variant="outline-info">
                View
              </Button>
            </Link>
            {/* <Link to={`/dashboard/orders/${item.id}/edit`}>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </Link> */}
          </div>
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-5 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Sales Orders Management
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/dashboard/sales/invoices">
            <button className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-sm hover:bg-yellow-300">
              <ClipboardList size={18} />
              Invoices
            </button>
          </Link>

          {
            canRecordPayment && (<Link to="/dashboard/sales/payments">
              <button className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-cyan-500">
                <CreditCard size={18} />
                Payments
              </button>
            </Link>)
          }



          <Link to="/dashboard/sales/orders/create">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-500">
              <PlusCircle size={18} />
              Create Order
            </button>
          </Link>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {orderStats.map((item, idx) => (
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
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Manage your orders</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={OrderColumns}
            data={orders}
            pageIndex={page - 1} // DataTable expects 0-based
            pageSize={limit}
            totalCount={data?.pagination?.total ?? 0}
            onPageChange={(newPageIndex) => setPage(newPageIndex + 1)}
            onSearch={(value) => {
              setSearch(value);
              setPage(1);
            }}
            isFetching={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
