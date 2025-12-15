
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link, useParams } from "react-router";
import { useGetPurchaseInvoiceByIdQuery, useUpdatePurchaseInvoiceMutation } from "@/store/features/purchaseOrder/purchaseOrderApiService";
import type { PurchasePayment } from "@/types/purchasePayment.types";


export default function PurchaseInvoicesDetails() {
    const { id } = useParams();
    const { data, isLoading } = useGetPurchaseInvoiceByIdQuery(id as string);
    const [markPaid, { isLoading: isMarkingPaid }] =
        useUpdatePurchaseInvoiceMutation();

    if (isLoading) return <p>Loading...</p>;

    const invoice = data?.data || {};
    const po = invoice.purchase_order;
    const supplier = po.supplier;
    const payments: PurchasePayment[] = invoice.payments || [];

    // Invoice Calculations
    const subtotal = po.total_amount;
    const tax = po.tax_amount ?? 0;
    const discount = po.discount_amount ?? 0;
    const total = subtotal + tax - discount;
    const paid = 0; // No payments yet
    const balance = total - paid;


    const handleMarkAsPaid = async () => {
        try {
            await markPaid({
                invoiceId: invoice.id,
                data: {
                    status: "paid",
                },
            }).unwrap();
        } catch (error) {
            console.error("Failed to mark invoice as paid", error);
        }
    };



    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-5">
                <h1 className="text-3xl font-bold">Invoice {invoice.invoice_number}</h1>

                <div className="flex items-center gap-2">
                    <Link to="/dashboard/purchase-invoices">
                        <Button variant="outline">← Back to Invoices</Button>
                    </Link>

                    <Link to={`/dashboard/purchase-payments/create?invoice_id=${invoice.id}`}>
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                            Record Payment
                        </Button>
                    </Link>

                    {
                        invoice.status !== "paid" && <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleMarkAsPaid}
                            disabled={isMarkingPaid}
                        >
                            {isMarkingPaid ? "Marking..." : "✔ Mark as Paid"}
                        </Button>
                    }


                </div>
            </div>

            {/* Invoice Details + Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Invoice Info */}
                <div className="col-span-2 space-y-5">
                    <div className="border rounded-md p-5">
                        <h2 className="font-semibold text-lg mb-5">Invoice Details</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* From Supplier */}
                            <div className="space-y-5">
                                <div className="space-y-1">
                                    <p className="font-semibold">From (Supplier):</p>
                                    <p>{supplier.name}</p>
                                    <p>{supplier.email} | {supplier.phone}</p>
                                    {supplier.contact_person && (
                                        <p>Contact Person: {supplier.contact_person}</p>
                                    )}
                                </div>

                                {/* To (Your Company) */}
                                <div>
                                    <p className="font-semibold">To:</p>
                                    <p>Your Company Name</p>
                                    <p>—</p>
                                </div>
                            </div>

                            {/* Invoice Numbers */}
                            <div className="space-y-2">
                                <p>
                                    <strong>Invoice #:</strong> {invoice.invoice_number}
                                </p>
                                <p>
                                    <strong>PO #:</strong> {po.po_number}
                                </p>
                                <p>
                                    <strong>Invoice Date:</strong>{" "}
                                    {invoice.invoice_date.split("T")[0]}
                                </p>
                                <p>
                                    <strong>Due Date:</strong> {invoice.due_date}
                                </p>
                                <p className="flex items-center gap-2">
                                    <strong>Status:</strong>
                                    <Badge className="bg-yellow-500 text-white capitalize">
                                        {invoice.status}
                                    </Badge>
                                </p>
                                <p>
                                    <strong>Created By:</strong> User #{invoice.created_by}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Items */}
                    <div className="border rounded-md">
                        <div className="p-4 font-semibold text-lg">Invoice Items</div>

                        <div className="p-4 text-gray-600">
                            No items table included in API yet.
                        </div>
                    </div>

                    {/* Payments */}

                    <div className="border rounded-md p-4">
                        <h2 className="font-semibold text-lg mb-2">Payments</h2>

                        {payments.length === 0 ? (
                            <p className="text-sm">No payments yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {payments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex justify-between items-center border rounded-md p-2"
                                    >
                                        <div className="space-y-1 text-sm">
                                            <p><strong>Payment #{payment.id}</strong></p>
                                            <p>Amount: RM {payment.amount.toFixed(2)}</p>
                                            <p>Method: {payment.payment_method}</p>
                                            <p>Reference: {payment.reference_number}</p>
                                            <p>Date: {new Date(payment.payment_date).toLocaleDateString()}</p>
                                        </div>
                                        <Badge
                                            className={`capitalize ${payment.status === "pending"
                                                ? "bg-yellow-500 text-white"
                                                : payment.status === "completed"
                                                    ? "bg-green-600 text-white"
                                                    : "bg-red-600 text-white"
                                                }`}
                                        >
                                            {payment.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>


                </div>

                {/* Summary */}
                <div className="space-y-5">
                    <div className="border rounded-md p-5 space-y-3">
                        <h2 className="font-semibold text-lg">Summary</h2>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-semibold">RM {subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span className="font-semibold">RM {tax.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span className="font-semibold">RM {discount.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Total</span>
                                <span className="font-semibold">RM {total.toFixed(2)}</span>
                            </div>

                            <Separator />

                            <div className="flex justify-between">
                                <span>Paid</span>
                                <span className="font-semibold">RM {paid.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-lg font-bold mt-1">
                                <span>Balance</span>
                                <span>RM {balance.toFixed(2)}</span>
                            </div>

                            <Badge className="bg-yellow-500 text-white capitalize mt-1">
                                {invoice.status}
                            </Badge>
                        </div>
                    </div>

                    {/* Supplier Box */}
                    <div className="border rounded-md p-5">
                        <h3 className="font-semibold text-lg">Supplier</h3>

                        <p className="mt-2 font-semibold">{supplier.name}</p>
                        <p className="text-sm">{supplier.email}</p>
                        <p className="text-sm">{supplier.phone}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
