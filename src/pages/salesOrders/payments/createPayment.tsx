
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
import { useState } from "react";
import { useGetCustomersQuery } from "@/store/features/customers/customersApi";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useAddSalesPaymentMutation, useGetSalesInvoicesQuery } from "@/store/features/salesOrder/salesOrder";
import { toast } from "sonner";

const paymentSchema = z.object({
  customer_id: z.number().min(1, "Customer is required"),
  invoice_id: z.number().optional(),
  amount: z.any().refine((value) => Number(value)),
  payment_method: z.string().min(1, "Payment method is required"),
  date: z.string().min(1, "Payment date is required"),
  reference: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;


export default function CreatePaymentPage() {


  const [addPayment] = useAddSalesPaymentMutation()


  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      customer_id: 0,
      invoice_id: 0,
      amount: undefined,
      payment_method: "",
      date: new Date().toISOString().split("T")[0],
      reference: "",
      notes: "",
    },
  });




  /* -------------------- Customer  Select Fields -------------------- */
  const CustomerSelectField = ({ field }: { field: { value: number; onChange: (v: number) => void } }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const { data, isLoading } = useGetCustomersQuery({ page: 1, limit: 20, search: query });
    const list = Array.isArray(data?.data) ? data.data : [];
    const selected = list.find((c) => c.id === field.value);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full justify-between" variant="outline">
            {selected ? selected.name : "Select Customer..."}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search customers..." onValueChange={setQuery} />
            <CommandList>
              <CommandEmpty>No customers found</CommandEmpty>
              <CommandGroup>
                {isLoading && <div className="py-2 px-3 text-sm text-gray-500">Loading...</div>}
                {!isLoading && list.map((customer) => (
                  <CommandItem key={customer.id} onSelect={() => { field.onChange(customer.id); setOpen(false); }}>
                    {customer.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };





  /* -------------------- Invoice Select Field -------------------- */
  const InvoiceSelectField = ({
    field,
  }: {
    field: { value: number | undefined | null; onChange: (v: number | null) => void };
  }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const { data, isLoading } = useGetSalesInvoicesQuery({
      page: 1,
      limit: 20,
      search: query,
    });

    const list = Array.isArray(data?.data) ? data.data : [];
    const selected = list.find((inv) => inv.id === field.value);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="w-full justify-between" variant="outline">
            {selected ? `INV-${selected.id}` : "Select Invoice..."}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search invoices..." onValueChange={setQuery} />

            <CommandList>
              <CommandEmpty>No invoices found</CommandEmpty>

              <CommandGroup>
                {isLoading && (
                  <div className="py-2 px-3 text-sm text-gray-500">Loading...</div>
                )}

                {!isLoading &&
                  list.map((invoice) => (
                    <CommandItem
                      key={invoice.id}
                      onSelect={() => {
                        field.onChange(invoice.id);
                        setOpen(false);
                      }}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">INV-{invoice.id}</span>
                        <span className="text-xs text-gray-500">
                          Amount: ৳ {Number(invoice.total_amount).toFixed(2)}
                        </span>
                      </div>
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

    // Construct payload dynamically
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: Record<string, any> = {
      order_id: values.invoice_id,                     // invoice_id → order_id
      amount: Number(values.amount),                   // ensure numeric
      payment_method: values.payment_method.toLowerCase(), // lowercase
    };



    // Optional fields: add only if they have values
    if (values.customer_id) payload.customer_id = values.customer_id;
    if (values.date) payload.date = values.date;
    if (values.reference) payload.reference = values.reference;
    if (values.notes) payload.notes = values.notes;




    console.log("FINAL API PAYLOAD:", payload);


    try {
      const res = await addPayment(payload).unwrap();

      if (res.status) {
        toast.success(res.message || "Payment Added Successfully!")
      }

    } catch (error) {
      console.error("Payment Error:", error);
    }
  }




  /* --------------------------------------------------- */
  /* DYNAMIC SUMMARY WATCH VALUES */
  /* --------------------------------------------------- */
  const watchCustomer = form.watch("customer_id");
  const watchInvoice = form.watch("invoice_id");
  const watchAmount = form.watch("amount");
  const watchMethod = form.watch("payment_method");
  const watchDate = form.watch("date");

  const { data: customerData } = useGetCustomersQuery({ page: 1, limit: 999, search: "" });
  const allCustomers = Array.isArray(customerData?.data) ? customerData.data : [];
  const customer = allCustomers.find((c) => c.id === watchCustomer);

  const { data: invoiceData } = useGetSalesInvoicesQuery({ page: 1, limit: 999, search: "" });
  const allInvoices = Array.isArray(invoiceData?.data) ? invoiceData.data : [];
  const invoice = allInvoices.find((inv) => inv.id === watchInvoice);




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
                  name="customer_id"
                  control={form.control}
                  rules={{ required: "Customer required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer</FormLabel>
                      <FormControl>
                        <CustomerSelectField field={field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* INVOICE OPTIONAL */}

                <FormField
                  name="invoice_id"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice </FormLabel>
                      <FormControl>
                        <InvoiceSelectField field={field} />
                      </FormControl>
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
                  name="payment_method"
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
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank_transfer">
                            Bank Transfer
                          </SelectItem>
                          <SelectItem value="credit_card">
                            Credit Card
                          </SelectItem>
                          <SelectItem value="cheque">Cheque</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
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
            <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>

            <div className="text-sm space-y-3 leading-relaxed">
              <p>
                <strong>Customer:</strong>{" "}
                {customer ? customer.name : <span className="text-gray-400">Not Selected</span>}
              </p>

              <p>
                <strong>Invoice:</strong>{" "}
                {invoice ? `INV-${invoice.id}` : <span className="text-gray-400">None Selected</span>}
              </p>

              {invoice && (
                <p>
                  <strong>Invoice Total:</strong> RM{" "}
                  {Number(invoice.total_amount).toFixed(2)}
                </p>
              )}

              <p>
                <strong>Payment Amount:</strong>{" "}
                {watchAmount ? (
                  <span>RM {Number(watchAmount).toFixed(2)}</span>
                ) : (
                  <span className="text-gray-400">Not Entered</span>
                )}
              </p>

              <p>
                <strong>Method:</strong>{" "}
                {watchMethod
                  ? watchMethod.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase())
                  : <span className="text-gray-400">Not Selected</span>}
              </p>

              <p>
                <strong>Date:</strong> {watchDate}
              </p>

              {invoice && watchAmount && (
                <p className="font-semibold text-blue-600">
                  Remaining Balance: RM{" "}
                  {(Number(invoice.total_amount) - Number(watchAmount)).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>







      </div>
    </div>
  );
}
