
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { toast } from "sonner";
import { useAddPurchasePaymentMutation, useGetAllPurchasesQuery } from "@/store/features/purchaseOrder/purchaseOrderApiService";
import { useAppSelector } from "@/store/store";

const paymentSchema = z.object({
  purchase_order_id: z.number().min(1, "Purchase Order is required"),
  amount: z.number().min(0.01, "Amount is required"),
  payment_method: z.string().min(1, "Payment method is required"),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function CreatePurchasePayments() {
  const navigate = useNavigate();
  const [addPayment] = useAddPurchasePaymentMutation();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      purchase_order_id: 0,
      amount: undefined,
      payment_method: "",
      reference: "",
      notes: "",
    },
  });



  const currency = useAppSelector((state) => state.currency.value);


  /* -------------------- Purchase Order Select -------------------- */
  const PurchaseOrderSelectField = ({ field }: { field: { value: number; onChange: (v: number) => void } }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const { data, isLoading } = useGetAllPurchasesQuery({ page: 1, limit: 20, search: query });

    const list = Array.isArray(data?.data) ? data.data : [];
    const selected = list.find((po) => po.id === field.value);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full justify-between" variant="outline">
            {selected ? selected.po_number : "Select Purchase Order..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search Purchase Orders..." onValueChange={setQuery} />
            <CommandList>
              <CommandEmpty>No Purchase Orders found</CommandEmpty>
              <CommandGroup>
                {isLoading && <div className="py-2 px-3 text-sm text-gray-500">Loading...</div>}
                {!isLoading &&
                  list.map((po) => (
                    <CommandItem key={po.id} onSelect={() => { field.onChange(po.id); setOpen(false); }}>
                      {po.po_number} - {currency} {po.total_amount}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  async function onSubmit(values: PaymentFormValues) {
    const payload = {
      purchase_order_id: values.purchase_order_id,
      amount: Number(values.amount),
      payment_method: values.payment_method.toLowerCase(),
      reference: values.reference || undefined,
      notes: values.notes || undefined,
    };

    console.log("FINAL PAYLOAD:", payload);

    try {
      const res = await addPayment(payload).unwrap();
      if (res.status) {
        toast.success(res.message || "Payment Added Successfully!");
        navigate("/dashboard/purchase-payments");
      }
    } catch (err) {
      console.error("Payment submission error:", err);
      toast.error("Failed to add payment.");
    }
  }

  const watchPO = form.watch("purchase_order_id");
  const watchAmount = form.watch("amount");
  const watchMethod = form.watch("payment_method");

  return (
    <div className="w-full">
      {/* BACK BUTTON */}
      <div className="flex items-center gap-2 mb-6">
        <Link to="/dashboard/purchase-payments">
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronLeft size={16} /> Back to Payments
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Record Purchase Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM */}
        <div className="lg:col-span-2 rounded-lg border p-6 bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Payment Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PURCHASE ORDER */}
                <FormField
                  name="purchase_order_id"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Order</FormLabel>
                      <FormControl>
                        <PurchaseOrderSelectField field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* AMOUNT */}
                <FormField
                  name="amount"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (৳)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter amount"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.value === "" ? "" : Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                {/* PAYMENT METHOD */}
                <FormField
                  name="payment_method"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* REFERENCE */}
                <FormField
                  name="reference"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference</FormLabel>
                      <FormControl>
                        <Input placeholder="Transaction ID or Cheque #" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* NOTES */}
                <FormField
                  name="notes"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Additional notes..." className="h-28" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Record Payment
                </Button>
                <Button type="button" variant="secondary" onClick={() => form.reset()}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* SUMMARY */}
        <div className="rounded-lg border p-6 bg-white">
          <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Purchase Order:</strong> {watchPO ? `PO-${watchPO}` : "Not Selected"}
            </p>
            <p>
              <strong>Amount:</strong> {watchAmount ? `৳ ${Number(watchAmount).toFixed(2)}` : "Not Entered"}
            </p>
            <p>
              <strong>Method:</strong>{" "}
              {watchMethod ? watchMethod.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase()) : "Not Selected"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
