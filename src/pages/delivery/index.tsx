

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { deliveryOrders } from "@/data/data";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import type { DeliveryOrder } from "@/types/types";

export default function DeliveryPage() {

   const deliveryOrdersColumns: ColumnDef<DeliveryOrder>[] = [
    {
      accessorKey: "orderNumber",
      header: "Order #",
      cell: ({ row }) => (
        <span className="">{row.getValue("orderNumber")}</span>
      ),
    },

    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold">{row.getValue("customer")}</div>
        </div>
      ),
    },

    {
      accessorKey: "total",
      header: "Total (RM)",
      cell: ({ row }) => row.getValue("total"),
    },

    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => row.getValue("date"),
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        const color =
          status === "confirmed"
            ? "bg-green-500"
            : status === "Sent"
            ? "bg-blue-500"
            : "bg-gray-500";

        return <Badge className={`${color} capitalize`}>{status}</Badge>;
      },
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="flex items-center gap-2">
            <Link to={`/dashboard/orders/${order.id}`}>
              <Button size="sm" variant="outline-info">View</Button>
            </Link>
          </div>
        );
      },
    },
  ]; 

  return (
    <div className="p-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Delivery - Ready to Dispatch</CardTitle>
        </CardHeader>

        <CardContent>
          <DataTable columns={deliveryOrdersColumns} data={deliveryOrders} />
        </CardContent>
      </Card>
    </div>
  );
}

