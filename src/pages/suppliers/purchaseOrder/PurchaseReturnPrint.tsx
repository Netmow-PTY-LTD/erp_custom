import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useGetSettingsInfoQuery } from "@/store/features/admin/settingsApiService";
import type { Settings } from "@/types/types";
import { useGetPurchaseReturnByIdQuery } from "@/store/features/purchaseOrder/purchaseReturnApiService";
import PrintablePurchaseReturnInvoice from "../purchaseReturnInvoices/PrintablePurchaseReturnInvoice";
import type { PurchaseReturn } from "@/types/purchaseOrder.types";
import type { Supplier } from "@/types/supplier.types";
import { Button } from "@/components/ui/button";

export default function PurchaseReturnPrint() {
    const { returnId } = useParams();

    const { data: purchaseReturnData, isLoading: isReturnLoading } = useGetPurchaseReturnByIdQuery(Number(returnId), {
        skip: !returnId,
    });

    const { data: fetchedSettingsInfo, isLoading: isSettingsLoading } = useGetSettingsInfoQuery();
    const to: Settings | undefined = fetchedSettingsInfo?.data;
    const purchaseReturn: PurchaseReturn | undefined = purchaseReturnData?.data;
    const from: Supplier | undefined = purchaseReturn?.supplier;

    if (isReturnLoading || isSettingsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg text-gray-500">Loading return...</p>
            </div>
        );
    }

    if (!purchaseReturn) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-lg text-red-500 mb-4">Purchase return not found</p>
                    <Link to="/dashboard/purchase-orders/returned">
                        <Button variant="outline">Back to Returns</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Create a mock invoice structure from purchase return data
    const mockInvoice = {
        invoice_number: purchaseReturn.return_number,
        invoice_date: purchaseReturn.return_date,
        due_date: purchaseReturn.return_date,
        total_amount: purchaseReturn.total_amount,
        discount_amount: purchaseReturn.discount_amount,
        tax_amount: purchaseReturn.tax_amount,
        grand_total: purchaseReturn.grand_total || purchaseReturn.total_payable_amount,
        items: purchaseReturn.items,
        notes: purchaseReturn.notes,
        purchase_return: purchaseReturn,
    };

    return (
        <div className="bg-white min-h-screen py-10 print:bg-white print:py-0">
            <div className="max-w-[850px] mx-auto mb-6 px-4 print:hidden">
                <Link to="/dashboard/purchase-orders/returned">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Returns
                    </Button>
                </Link>
            </div>
            <PrintablePurchaseReturnInvoice
                from={from}
                to={to}
                invoice={mockInvoice as any}
            />
        </div>
    );
}
