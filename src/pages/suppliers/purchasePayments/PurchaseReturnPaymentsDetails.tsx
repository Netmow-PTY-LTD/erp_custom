import { Button } from "@/components/ui/button";
import { useGetPurchaseReturnPaymentByIdQuery } from "@/store/features/purchaseOrder/purchaseReturnApiService";
import { useAppSelector } from "@/store/store";

import { Link, useParams } from "react-router";

export default function PurchaseReturnPaymentsDetails() {
    const currency = useAppSelector((state) => state.currency.value);

    const { id } = useParams();
    const { data, isLoading, error } = useGetPurchaseReturnPaymentByIdQuery(id as string);

    if (isLoading) return <p className="p-6">Loading...</p>;
    if (error || !data?.data) return <p className="p-6 text-red-500">Refund details not found.</p>;

    const payment = data.data;

    // --------------------------
    // Payment Core Info
    // --------------------------
    const formattedPayment = {
        number: `RRFD-${payment.id.toString().padStart(6, "0")}`,
        date: new Date(payment.payment_date).toLocaleDateString(),
        method:
            payment.payment_method.replaceAll("_", " ").replace(/^\w/, (c: string) => c.toUpperCase()),
        reference: payment.reference_number || "-",
        amount: Number(payment.amount),
        recordedBy: payment.created_by,
        status: payment.status,
    };

    // --------------------------
    // Purchase Return Info
    // --------------------------
    const purchaseReturn = (payment as any).purchase_return;
    const po = purchaseReturn
        ? {
            number: purchaseReturn.return_number || purchaseReturn.po_number || `RET-${purchaseReturn.id}`,
            total: purchaseReturn.total_amount,
            total_payable_amount: purchaseReturn.total_payable_amount,
            supplier: purchaseReturn.supplier,
        }
        : null;

    // --------------------------
    // Invoice Info
    // --------------------------
    const invoice = payment.invoice
        ? {
            invoice_id: payment.invoice_id,
            number: payment.invoice.invoice_number,
            total: payment.invoice.total_amount,
            total_payable_amount: payment.invoice.total_payable_amount,
            dueDate: payment.invoice.due_date,
        }
        : null;

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-orange-700">
                    Purchase Return Refund {formattedPayment.number}
                </h1>

                <div className="flex flex-col sm:flex-row gap-2">
                    <Link to="/dashboard/purchase-returns/payments">
                        <Button variant="outline">← Back to Refunds</Button>
                    </Link>

                    {invoice && (
                        <Link to={`/dashboard/purchase-return-invoices/${invoice.invoice_id}`}>
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-md">
                                View Return Invoice {invoice.number}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Payment Details */}
                <div className="col-span-1 lg:col-span-2 border rounded-xl p-6 bg-white shadow-sm">
                    <h2 className="font-semibold text-lg mb-4 border-b pb-2">Refund Details</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Refund Number</p>
                                <p className="font-semibold text-gray-900">{formattedPayment.number}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 font-medium">Recorded By</p>
                                <p className="font-semibold text-gray-900">{formattedPayment.recordedBy}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 font-medium">Method</p>
                                <p className="font-semibold text-gray-900">{formattedPayment.method}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 font-medium">Reference Number</p>
                                <p className="font-semibold text-gray-900">{formattedPayment.reference}</p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Refund Date</p>
                                <p className="font-semibold text-gray-900">{formattedPayment.date}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 font-medium">Status</p>
                                <p className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${formattedPayment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {formattedPayment.status}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500 font-medium">Refund Amount</p>
                                <p className="text-2xl font-bold text-orange-600">{currency} {Number(formattedPayment.amount || 0).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="space-y-6">
                    {/* Supplier */}
                    {po?.supplier && (
                        <div className="border rounded-xl p-6 bg-white shadow-sm">
                            <h3 className="font-semibold text-lg mb-3 border-b pb-2">Supplier</h3>

                            <p className="font-bold text-gray-900">{po.supplier.name}</p>
                            <p className="text-sm text-gray-600">{po.supplier.email}</p>
                            <p className="text-sm text-gray-600">{po.supplier.phone}</p>
                            <div className="mt-2 text-xs font-medium text-gray-500 uppercase">Contact Person</div>
                            <p className="text-sm font-medium">{po.supplier.contact_person}</p>
                        </div>
                    )}

                    {/* Purchase Return Summary */}
                    {po && (
                        <div className="border rounded-xl p-6 bg-white shadow-sm space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Purchase Return</h3>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Return Number</span>
                                <span className="font-bold text-gray-900">{po.number}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Total Refundable</span>
                                <span className="font-bold text-orange-600">{currency} {Number(po.total_payable_amount || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    {/* Invoice Summary */}
                    {invoice && (
                        <div className="border rounded-xl p-6 bg-white shadow-sm space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Return Invoice</h3>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Invoice #</span>
                                <span className="font-bold text-gray-900">{invoice.number}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Total</span>
                                <span className="font-bold text-gray-900">{currency} {Number(invoice.total_payable_amount || 0).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Due Date</span>
                                <span className="font-bold text-gray-900">{invoice.dueDate}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
