"use client";

import { useState } from "react";
import { Link } from "react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/dashboard/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useGetAllSalesOrdersQuery,
  useUpdateSalesOrderStatusMutation,
} from "@/store/features/salesOrder/salesOrder";
import type { SalesOrder } from "@/types/salesOrder.types";

// ================= ZOD SCHEMA =================

const deliverySchema = z
  .object({
    status: z.enum([
      "pending",
      "in_transit",
      "delivered",
      "failed",
      "returned",
      "confirmed",
    ]),
    delivery_date: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const requiredStatuses = [
        "pending",
        "in_transit",
        "delivered",
        "failed",
        "returned",
        "confirmed",
      ];
      if (requiredStatuses.includes(data.status)) {
        return !!data.delivery_date;
      }
      return true;
    },
    {
      path: ["delivery_date"],
      message: "Delivery date is required for this status",
    }
  );

type DeliveryFormValues = z.infer<typeof deliverySchema>;

// ================= COMPONENT =================

export default function DeliveryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  const { data, isLoading } = useGetAllSalesOrdersQuery({
    page,
    limit,
    search,
  });

  const [updateOrder] = useUpdateSalesOrderStatusMutation();

  const orders = data?.data ?? [];

  // ================= RHF =================

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      status: "pending",
      delivery_date: "",
      notes: "",
    },
  });

  // ================= HANDLERS =================

  const handleOpenModal = (order: SalesOrder) => {
    setSelectedOrder(order);

    const deliveryDateValue = order.delivery?.delivery_date
      ? new Date(order.delivery.delivery_date).toISOString().split("T")[0]
      : "";

    form.reset({
      status:
        order.delivery_status ?? ("pending" as DeliveryFormValues["status"]),
      delivery_date: deliveryDateValue,
      notes: order.delivery?.notes ?? "",
    });

    setOpenModal(true);
  };

  const handleUpdate = async (values: DeliveryFormValues) => {
    if (!selectedOrder) return;

    try {
      const payload = {
        status: values.status,
        delivery_date: values.delivery_date || undefined,
        notes: values.notes,
      };

      await updateOrder({
        orderId: selectedOrder.id,
        orderData: payload,
      }).unwrap();

      toast.success("Order updated successfully!");
      setOpenModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order.");
    }
  };

  // ================= TABLE COLUMNS =================

  const OrderColumns: ColumnDef<SalesOrder>[] = [
    {
      accessorKey: "order_number",
      header: "Order #",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.order_number}</span>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold">{row.original.customer?.name}</div>
          <div className="text-xs text-muted-foreground">
            ID: {row.original.customer_id}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "total_amount",
      header: "Total Amount",
      cell: ({ row }) =>
        `RM ${parseFloat(row.original.total_amount).toFixed(2)}`,
    },
    {
      accessorKey: "delivery.delivery_date",
      header: "Delivery Date",
      cell: ({ row }) => {
        const d = row.original.delivery?.delivery_date;
        return d ? new Date(d).toLocaleDateString() : "—";
      },
    },
    {
      accessorKey: "delivery_status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.delivery_status;

        const colors: Record<string, string> = {
          pending: "bg-yellow-600",
          confirmed: "bg-blue-600",
          in_transit: "bg-purple-600",
          delivered: "bg-green-600",
          failed: "bg-red-600",
          returned: "bg-gray-600",
        };

        return (
          <Badge className={`${colors[status]} text-white capitalize`}>
            {status}
          </Badge>
        );
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
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOpenModal(item)}
            >
              Delivery Action
            </Button>
          </div>
        );
      },
    },
  ];

  // ================= RENDER =================

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Delivery - Ready to Dispatch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={OrderColumns}
            data={orders}
            pageIndex={page - 1}
            pageSize={limit}
            totalCount={data?.pagination?.total ?? 0}
            onPageChange={(i) => setPage(i + 1)}
            onSearch={(v) => {
              setSearch(v);
              setPage(1);
            }}
            isFetching={isLoading}
          />
        </CardContent>
      </Card>

      {/* ===== MODAL ===== */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Delivery Status</DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleUpdate)}>
            <div className="space-y-4 mt-2">
              {/* Status */}
              <div>
                <label className="block font-semibold mb-1">Status</label>
                <Select
                  // eslint-disable-next-line react-hooks/incompatible-library
                  value={form.watch("status")}
                  onValueChange={(v) =>
                    form.setValue("status", v as DeliveryFormValues["status"])
                  }
                >
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

              {/* Delivery Date */}
              <div>
                <label className="block font-semibold mb-1">
                  Delivery Date
                  {["in_transit", "delivered", "confirmed"].includes(
                    form.watch("status")
                  ) && <span className="text-red-500 ml-1">*</span>}
                </label>

                <Input type="date" {...form.register("delivery_date")} />

                {form.formState.errors.delivery_date && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.delivery_date.message}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold mb-1">Notes</label>
                <Textarea {...form.register("notes")} />
              </div>
            </div>

            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={form.formState.isSubmitting}
              >
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
