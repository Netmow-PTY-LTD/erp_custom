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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router";

const paymentSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  invoiceId: z.string().optional(),
  amount: z.any().refine((value) => Number(value)),
  method: z.string().min(1, "Payment method is required"),
  date: z.string().min(1, "Payment date is required"),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

 type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function CreatePaymentPage() {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      customerId: "",
      invoiceId: "",
      amount: undefined,
      method: "",
      date: new Date().toISOString().split("T")[0],
      reference: "",
      notes: "",
    },
  });

  function onSubmit(values: PaymentFormValues) {
    const payload = {
      paymentId: `PAY-1`, // auto ID
      ...values,
    };

    console.log("Final Payload:", payload);
    alert("Payment Ready to Send:\n" + JSON.stringify(payload, null, 2));
  }

  return (
    <div className="w-full">
      {/* BACK BUTTON */}
      <div className="flex items-center gap-2 mb-6">
        <Link to="/dashboard/payments">
          <Button variant="outline" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Back to Payments
          </Button>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Record Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT FORM */}
        <div className="lg:col-span-2 rounded-lg border p-6 bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Payment Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* CUSTOMER */}
                <FormField
                  control={form.control}
                  name="customerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Customer <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CUST001">
                              Tech Solutions
                            </SelectItem>
                            <SelectItem value="CUST002">
                              Global Trading
                            </SelectItem>
                            <SelectItem value="CUST005">
                              Modern Enterprises
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* INVOICE OPTIONAL */}
                <FormField
                  control={form.control}
                  name="invoiceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Invoice" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="INV-20251012-FBB652">
                            INV-20251012-FBB652
                          </SelectItem>
                          <SelectItem value="INV2025001">INV2025001</SelectItem>
                        </SelectContent>
                      </Select>

                      <p className="text-xs text-muted-foreground">
                        Link this payment to a specific invoice
                      </p>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* AMOUNT */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Amount (RM) <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* METHOD */}
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Payment Method <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Bank Transfer">
                            Bank Transfer
                          </SelectItem>
                          <SelectItem value="Credit Card">
                            Credit Card
                          </SelectItem>
                          <SelectItem value="Cheque">Cheque</SelectItem>
                          <SelectItem value="Online">Online</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PAYMENT DATE */}
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Payment Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type="date" className="block" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* REFERENCE */}
                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Cheque #, Transaction ID"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* NOTES */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional payment notes..."
                        className="h-28"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* BUTTONS */}
              <div className="flex items-center gap-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Record Payment
                </Button>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* RIGHT SIDE INFO */}
        <div>
          <div className="rounded-lg border p-6 bg-white">
            <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>

            <div className="text-sm leading-relaxed">
              <p>
                <strong>Cash:</strong> Physical cash payment
              </p>
              <p>
                <strong>Bank Transfer:</strong> Direct bank transfer
              </p>
              <p>
                <strong>Credit Card:</strong> Credit/debit card payment
              </p>
              <p>
                <strong>Cheque:</strong> Bank cheque payment
              </p>
              <p>
                <strong>Online:</strong> Online payment gateway
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
