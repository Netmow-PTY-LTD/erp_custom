
"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/components/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useGetAllSalesOrdersQuery, useUpdateSalesOrderStatusMutation, } from "@/store/features/salesOrder/salesOrder";
import { useState } from "react";
import type { SalesOrder } from "@/types/salesOrder.types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function DeliveryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading } = useGetAllSalesOrdersQuery({ page, limit, search });
  const [updateOrder] = useUpdateSalesOrderStatusMutation();

  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [status, setStatus] = useState<"pending" | "in_transit" | "delivered" | "failed" | "returned" | "confirmed">("pending");

  const [deliveryDate, setDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");

  const orders = data?.data ?? [];


  const handleOpenModal = (order: SalesOrder) => {
    setSelectedOrder(order);
    setStatus(order.status as "pending" | "in_transit" | "delivered" | "failed" | "returned" | "confirmed");
    const deliveryDateValue = order.delivery?.delivery_date;

    setDeliveryDate(
      deliveryDateValue
        ? new Date(deliveryDateValue).toISOString().split("T")[0]
        : ""
    );

    setNotes(order.notes || "");
    setOpenModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedOrder) return;

    try {
      const payload = {
        status,
        delivery_date: deliveryDate,
        notes,
      };
      await updateOrder({ orderId: selectedOrder.id, orderData: payload }).unwrap();
      toast.success("Order updated successfully!");
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order.");
    }
  };

  const OrderColumns: ColumnDef<SalesOrder>[] = [
    {
      accessorKey: "order_number",
      header: "Order #",
      cell: ({ row }) => <span className="font-medium">{row.original.order_number}</span>,
    },
    {
      accessorKey: "customer_id",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold">Customer #{row.original.customer_id}</div>
          <div className="text-xs text-muted-foreground">ID: {row.original.customer_id}</div>
        </div>
      ),
    },
    {
      accessorKey: "total_amount",
      header: "Total Amount",
      cell: ({ row }) => `RM ${parseFloat(row.original.total_amount).toFixed(2)}`,
    },
    {
      accessorKey: "delivery.delivery_date",
      header: "Delivery Date",
      cell: ({ row }) => {
        const deliveryDate = row.original.delivery?.delivery_date;

        return deliveryDate
          ? new Date(deliveryDate).toLocaleDateString()
          : "—";
      },
    }
    ,
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
        return <Badge className={`${color} text-white capitalize`}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex gap-2 flex-wrap">
            <Link to={`/dashboard/sales/orders/${item.id}`}>
              <Button size="sm" variant="outline-info">
                View
              </Button>
            </Link>
            <Button size="sm" variant="outline" onClick={() => handleOpenModal(item)}>
              Delivary Action
            </Button>
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
          <DataTable
            columns={OrderColumns}
            data={orders}
            pageIndex={page - 1}
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

      {/* Update Status Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Delivery Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <label className="block font-semibold mb-1">Status</label>
              <Select onValueChange={(v) => setStatus(v as "pending" | "in_transit" | "delivered" | "failed" | "returned" | "confirmed")} defaultValue={status}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                </SelectContent>

              </Select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Delivery Date</label>
              <Input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
            </div>

            <div>
              <label className="block font-semibold mb-1">Notes</label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleUpdate}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
