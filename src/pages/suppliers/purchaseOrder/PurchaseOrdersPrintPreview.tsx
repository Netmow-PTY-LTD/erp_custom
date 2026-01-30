
"use client";

import { useGetAllPurchasesQuery } from "@/store/features/purchaseOrder/purchaseOrderApiService";
import { useSearchParams } from "react-router";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useAppSelector } from "@/store/store";
import { useReactToPrint } from "react-to-print";

export default function PurchaseOrdersPrintPreview() {
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";

    // Fetch all matching records (limit 1000 to hopefully get all)
    const { data, isLoading } = useGetAllPurchasesQuery({
        page: 1,
        limit: 1000,
        search,
        status: status === "all" ? undefined : status,
    });

    const currency = useAppSelector((state) => state.currency.value);
    const purchaseOrders = data?.data || [];
    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: "Purchase Orders Report",
    });

    // Auto print when loaded
    // useEffect(() => {
    //   if (!isLoading && purchaseOrders.length > 0) {
    //     // Small timeout to ensure render
    //     setTimeout(() => handlePrint(), 1000);
    //   }
    // }, [isLoading, purchaseOrders]);

    if (isLoading) {
        return <div className="p-8 text-center">Loading report...</div>;
    }

    const currentDate = new Date().toLocaleDateString();

    return (
        <div className="min-h-screen bg-white p-8">
            {/* NO PRINT CONTROLS */}
            <div className="print:hidden flex justify-between items-center mb-8 max-w-[210mm] mx-auto">
                <Link to="/dashboard/purchase-orders">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                </Link>
                <Button onClick={() => handlePrint()} className="gap-2">
                    <Printer className="w-4 h-4" /> Print Report
                </Button>
            </div>

            {/* PRINTABLE CONTENT */}
            <div
                ref={contentRef}
                className="max-w-[210mm] mx-auto bg-white p-8 print:p-0"
                style={{ fontSize: "12px" }}
            >
                <div className="mb-8 border-b pb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold uppercase tracking-tight text-gray-900">Purchase Orders Report</h1>
                            <p className="text-gray-500 mt-1">Generated on {currentDate}</p>
                        </div>
                        <div className="text-right">
                            {status !== 'all' && <div className="mt-1"><span className="font-semibold">Filter:</span> Status = {status}</div>}
                        </div>
                    </div>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-gray-800">
                            <th className="py-2 font-bold uppercase text-gray-700">PO Number</th>
                            <th className="py-2 font-bold uppercase text-gray-700">Date</th>
                            <th className="py-2 font-bold uppercase text-gray-700">Supplier</th>
                            <th className="py-2 font-bold uppercase text-gray-700">Status</th>
                            <th className="py-2 text-right font-bold uppercase text-gray-700">Total ({currency})</th>
                            {/* <th className="py-2 text-right font-bold uppercase text-gray-700">Paid</th>
              <th className="py-2 text-right font-bold uppercase text-gray-700">Due</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseOrders.length > 0 ? (
                            purchaseOrders.map((po, index) => (
                                <tr key={po.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50/50' : ''}`}>
                                    <td className="py-3 font-medium">{po.po_number}</td>
                                    <td className="py-3">{new Date(po.order_date).toLocaleDateString()}</td>
                                    <td className="py-3">{po.supplier?.name}</td>
                                    <td className="py-3 capitalize">{po.status}</td>
                                    <td className="py-3 text-right font-medium">{Number(po.total_payable_amount).toFixed(2)}</td>
                                    {/* <td className="py-3 text-right text-green-600">{Number(po.total_paid_amount || 0).toFixed(2)}</td>
                  <td className="py-3 text-right text-red-600">{Number(po.total_due_amount || 0).toFixed(2)}</td> */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                    {purchaseOrders.length > 0 && (
                        <tfoot className="border-t-2 border-gray-800">
                            <tr>
                                <td className="py-3 font-bold text-gray-900" colSpan={3}>TOTALS</td>
                                <td className="py-3 text-right font-bold text-gray-900" colSpan={2}>
                                    {Number(purchaseOrders.reduce((acc, curr) => acc + Number(curr.total_payable_amount), 0)).toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
}
