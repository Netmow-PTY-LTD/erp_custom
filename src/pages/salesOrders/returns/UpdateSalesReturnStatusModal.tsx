/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useUpdateSalesReturnStatusMutation } from "@/store/features/salesOrder/salesReturnApiService";

/* ---------------- TYPES ---------------- */

interface UpdateSalesReturnStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedReturn: any;
}

/* ---------------- SCHEMA ---------------- */

const statusSchema = z.object({
    status: z.string().min(1, "Status is required"),
    notes: z.string().optional(),
});

type StatusFormValues = z.infer<typeof statusSchema>;

/* ---------------- COMPONENT ---------------- */

export default function UpdateSalesReturnStatusModal({
    isOpen,
    onClose,
    selectedReturn,
}: UpdateSalesReturnStatusModalProps) {
    const form = useForm<StatusFormValues>({
        resolver: zodResolver(statusSchema),
        defaultValues: {
            status: "pending",
            notes: "",
        },
    });

    useEffect(() => {
        if (selectedReturn) {
            form.reset({
                status: selectedReturn.status || "pending",
                notes: selectedReturn.notes || "",
            });
        }
    }, [selectedReturn, form]);

    const [updateStatus, { isLoading }] = useUpdateSalesReturnStatusMutation();

    const handleUpdate = async (values: StatusFormValues) => {
        if (!selectedReturn) return;

        try {
            const res = await updateStatus({
                id: selectedReturn.id,
                status: values.status,
            }).unwrap();

            if (res.status) {
                toast.success("Sales return status updated successfully!");
                onClose();
            } else {
                toast.error(res?.message || "Failed to update status.");
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err?.data?.message || "Failed to update status.");
        }
    };

    const statusOptions = [
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Update Sales Return Status</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(handleUpdate)}>
                    <div className="space-y-4 mt-2">
                        {/* Status */}
                        <div>
                            <label className="block font-semibold mb-1">Status</label>
                            <Select
                                value={form.watch("status")}
                                onValueChange={(v) => form.setValue("status", v)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {form.formState.errors.status && (
                                <p className="text-sm text-red-500 mt-1">
                                    {form.formState.errors.status.message}
                                </p>
                            )}
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block font-semibold mb-1">Notes</label>
                            <Textarea
                                {...form.register("notes")}
                                placeholder="Add any internal notes..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Updating..." : "Update Status"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
