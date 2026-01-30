
/* eslint-disable @typescript-eslint/no-explicit-any */

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
  Printer,
  ShoppingCart,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Link } from "react-router";
import UpdateDeliveryStatusModal from "../delivery/UpdateDeliveryStatusModal";

export default function DeliveredOrders() {
  const [isUpdateDeliveryStatusModalOpen, setIsUpdateDeliveryStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1); // backend starts from 1
  const [limit] = useState(10);

  const { data, isLoading } = useGetAllSalesOrdersQuery({
    page,
    limit,
    search,
    status: "delivered",
  });

  const orders = data?.data ?? [];

  const currency = useAppSelector((state) => state.currency.value);
  const userPermissions = useAppSelector((state) => state.auth.user?.role.permissions || []);

  // permissions

  const canRecordPayment =
    userPermissions.includes(SalesPermission.PAYMENTS) ||
    userPermissions.includes(SuperAdminPermission.ACCESS_ALL);
  const canUpdateDelivery =
    userPermissions.includes(SalesPermission.UPDATE_DELIVERY) ||
    userPermissions.includes(SuperAdminPermission.ACCESS_ALL);

  const handleOpenUpdateDeliveryStatusModal = (order: any) => {
    setSelectedOrder(order);
    setIsUpdateDeliveryStatusModalOpen(true);
  };

  const handleCloseUpdateDeliveryStatusModal = () => {
    setIsUpdateDeliveryStatusModalOpen(false);
    setSelectedOrder(null);
  };

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
      gradient: "from-blue-600 to-blue-400",
      shadow: "shadow-blue-500/30",
      icon: <ShoppingCart className="w-6 h-6 text-white" />,
    },
    {
      label: "Pending Orders",
      value: pendingOrdersCount,
      gradient: "from-amber-600 to-amber-400",
      shadow: "shadow-amber-500/30",
      icon: <Clock className="w-6 h-6 text-white" />,
    },
    {
      label: "Delivered Orders",
      value: deliveredOrdersCount,
      gradient: "from-emerald-600 to-emerald-400",
      shadow: "shadow-emerald-500/30",
      icon: <CheckCircle className="w-6 h-6 text-white" />,
    },
    {
      label: "Total Value",
      value: `${currency} ${totalOrdersValue}`,
      gradient: "from-violet-600 to-violet-400",
      shadow: "shadow-violet-500/30",
      icon: <DollarSign className="w-6 h-6 text-white" />,
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
      cell: ({ row }) => format(new Date(row.original.order_date), "dd/MM/yyyy"),
    },

    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) =>
        row.original.due_date
          ? format(new Date(row.original.due_date), "dd/MM/yyyy")
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
      id: "status_date",
      header: "Status Date",
      cell: ({ row }) => {
        const { status, delivery_date, updated_at } = row.original;
        let dateToDisplay = updated_at;

        if (status === "delivered" && delivery_date) {
          dateToDisplay = delivery_date as string;
        }

        return (
          <div className="text-sm">
            {format(new Date(dateToDisplay), "dd/MM/yyyy")}
          </div>
        )
      }
    },

    {
      accessorKey: "total_amount",
      header: () => <div className="text-right">Total Price ({currency})</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {Number(row.original.total_amount).toFixed(2)}
        </div>
      ),
    },

    {
      accessorKey: "discount_amount",
      header: () => (
        <div className="text-right">Total Discount ({currency})</div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          {Number(row.original.discount_amount).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "tax_amount",
      header: () => <div className="text-right">Total Tax ({currency})</div>,
      cell: ({ row }) => (
        <div className="text-right">
          {Number(row.original.tax_amount).toFixed(2)}
        </div>
      ),
    },
    {
      id: "total_payable", // 👈 use a custom id, not accessorKey
      header: () => <div className="text-right">Total Payable ({currency})</div>,
      cell: ({ row }) => {
        const totalAmount = Number(row.original.total_amount) || 0;
        const discountAmount = Number(row.original.discount_amount) || 0;
        const taxAmount = Number(row.original.tax_amount) || 0;

        const totalPayable = totalAmount - discountAmount + taxAmount;

        return <div className="text-right font-semibold">{totalPayable.toFixed(2)}</div>;
      },
    },
    {
      accessorKey: "total_paid_amount",
      header: () => <div className="text-right">Total Paid ({currency})</div>,
      cell: ({ row }) => (
        <div className="text-right text-green-600 font-medium">
          {Number(row.original.total_paid_amount || 0).toFixed(2)}
        </div>
      ),
    },
    {
      id: "total_due",
      header: () => <div className="text-right">Balance Due ({currency})</div>,
      cell: ({ row }) => {
        const totalAmount = Number(row.original.total_amount) || 0;
        const discountAmount = Number(row.original.discount_amount) || 0;
        const taxAmount = Number(row.original.tax_amount) || 0;
        const paidAmount = Number(row.original.total_paid_amount) || 0;

        const totalPayable = totalAmount - discountAmount + taxAmount;
        const dueAmount = totalPayable - paidAmount;

        return <div className={`text-right font-bold ${dueAmount > 0.01 ? 'text-red-600' : 'text-gray-500'}`}>
          {dueAmount.toFixed(2)}
        </div>;
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
            {canUpdateDelivery && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleOpenUpdateDeliveryStatusModal(item)}
              >
                Change Status
              </Button>
            )}
          </div>
        );
      },
    },
  ];



  const deliveredStatusOptions = [
    { value: "delivered", label: "Delivered" },
    { value: "returned", label: "Returned" },
  ] as const;




  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-5 mb-6 print:hidden">
        <h1 className="text-2xl font-bold tracking-tight">
          Delivered Orders
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-slate-600 to-slate-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-slate-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-slate-500/40 active:translate-y-0 active:shadow-none"
          >
            <Printer size={18} />
            Print
          </button>
          <Link to="/dashboard/sales/invoices">
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-2.5 font-medium text-white shadow-lg shadow-amber-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-amber-500/40 active:translate-y-0 active:shadow-none">
              <ClipboardList size={18} />
              Invoices
            </button>
          </Link>

          {
            canRecordPayment && (<Link to="/dashboard/sales/payments">
              <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-cyan-500/40 active:translate-y-0 active:shadow-none">
                <CreditCard size={18} />
                Payments
              </button>
            </Link>)
          }



          <Link to="/dashboard/sales/orders/create">
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-2.5 font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-blue-500/40 active:translate-y-0 active:shadow-none">
              <PlusCircle size={18} />
              Create Order
            </button>
          </Link>
        </div>
      </div>
      {/* Print Only Header */}
      <div className="hidden print:block text-center mb-[15px] pb-1">
        <h1 className="text-4xl font-extrabold uppercase tracking-tight">DELIVERED ORDERS REPORT</h1>
        <div className="mt-1 text-sm text-gray-700 font-semibold">
          <span>Report Generated On: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 print:hidden">
        {orderStats.map((item, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-6 shadow-lg ${item.shadow} transition-all duration-300 hover:scale-[1.02] hover:translate-y-[-2px]`}
          >
            {/* Background Pattern */}
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/10 blur-2xl" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-white/90">{item.label}</p>
                <h3 className="mt-2 text-3xl font-bold text-white">
                  {item.value}
                </h3>
              </div>
              <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur-sm">
                {item.icon}
              </div>
            </div>

            {/* Progress/Indicator line (optional visual flair) */}
            <div className="mt-4 h-1 w-full rounded-full bg-black/10">
              <div className="h-full w-2/3 rounded-full bg-white/40" />
            </div>
          </div>
        ))}
      </div>
      <Card className="py-6">
        <CardHeader className="print:hidden">
          <CardTitle>{status ? `${status.charAt(0).toUpperCase() + status.slice(1)} ` : "All "}Orders</CardTitle>
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
      <UpdateDeliveryStatusModal
        isOpen={isUpdateDeliveryStatusModalOpen}
        onClose={handleCloseUpdateDeliveryStatusModal}
        selectedOrder={selectedOrder}
        statusOptions={deliveredStatusOptions}
        defaultStatus="delivered"
      />

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: landscape;
              margin: 10mm;
            }
            .print\:hidden,
            header,
            nav,
            aside,
            button,
            .no-print {
              display: none !important;
            }
            html, body {
              background: white !important;
              overflow: visible !important;
              height: auto !important;
            }
            .md\:sticky {
              position: static !important;
            }
            table {
              width: 100% !important;
              border-collapse: collapse !important;
              page-break-inside: auto !important;
            }
            thead {
              display: table-header-group !important;
            }
            tr {
              page-break-inside: avoid !important;
              page-break-after: auto !important;
            }
            th, td {
              border: 1px solid #ddd !important;
              padding: 6px 8px !important;
              font-size: 9px !important;
              vertical-align: middle !important;
            }
            th {
              background-color: #f3f4f6 !important;
              font-weight: 600 !important;
              text-align: left !important;
              line-height: 1.2 !important;
              text-transform: uppercase !important;
            }
            th:nth-child(1), td:nth-child(1) {
              width: 10% !important;
              font-weight: 600 !important;
            }
            th:nth-child(2), td:nth-child(2) {
              width: 20% !important;
              font-weight: 600 !important;
            }
            th:nth-child(3), td:nth-child(3) {
              width: 12% !important;
            }
            th:nth-child(4), td:nth-child(4) {
              display: none !important;
            }
            th:nth-child(5), td:nth-child(5) {
              display: none !important;
            }
            th:nth-child(6), td:nth-child(6) {
              display: none !important;
            }
            th:nth-child(7), td:nth-child(7) {
              width: 14% !important;
              text-align: right !important;
            }
            th:nth-child(8), td:nth-child(8) {
              width: 12% !important;
              text-align: right !important;
            }
            th:nth-child(9), td:nth-child(9) {
              width: 12% !important;
              text-align: right !important;
            }
            th:nth-child(10), td:nth-child(10) {
              width: 14% !important;
              text-align: right !important;
              font-weight: 600 !important;
            }
            th:nth-child(11), td:nth-child(11) {
              width: 14% !important;
              text-align: right !important;
            }
            th:nth-child(12), td:nth-child(12) {
              width: 14% !important;
              text-align: right !important;
            }
            th:nth-child(13), td:nth-child(13) {
              display: none !important;
            }
            .text-4xl {
              font-size: 18px !important;
              margin-bottom: 4px !important;
              line-height: 1 !important;
            }
            .text-4xl + div {
              line-height: 1 !important;
              margin-top: 2px !important;
            }
            .hidden.print\:block.mb-\[15px\] {
              margin-bottom: 15px !important;
            }
            .border {
              border: none !important;
            }
            .shadow-sm, .shadow-md, .shadow-lg {
              box-shadow: none !important;
            }
            [role="navigation"],
            input,
            input[type="search"],
            input[type="text"],
            .flex.items-center.justify-between {
              display: none !important;
            }
          }
        `
      }} />
    </div>
  );
}
