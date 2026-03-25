import { Link, useParams } from "react-router";
import { ArrowLeft, Printer } from "lucide-react";
import { useGetSettingsInfoQuery } from "@/store/features/admin/settingsApiService";
import type { Settings } from "@/types/types";
import { useGetSalesReturnInvoiceByIdQuery } from "@/store/features/salesOrder/salesReturnApiService";
import type { SalesInvoice } from "@/types/salesInvoice.types";
import PrintableSalesReturnInvoice from "./PrintableSalesReturnInvoice";
import type { Customer } from "@/store/features/customers/types";
import { Button } from "@/components/ui/button";

export default function SalesReturnInvoicePrintPreview() {
    const invoiceId = useParams().id;

    const { data: salesInvoiceData } = useGetSalesReturnInvoiceByIdQuery(Number(invoiceId), {
        skip: !invoiceId,
    });

    const invoice: SalesInvoice | undefined = salesInvoiceData?.data;
    const salesReturn = (invoice as any)?.sales_return;

    const { data: fetchedSettingsInfo } = useGetSettingsInfoQuery();
    const from: Settings | undefined = fetchedSettingsInfo?.data;
    const to: Customer | undefined = salesReturn?.customer;

    return (
        <div className="pb-10">
            <div className="max-w-4xl mx-auto flex justify-between items-center print:hidden mb-2 bg-white">
                <Link
                    to={`/dashboard/sales-return-invoices/${invoiceId}`}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Return Invoice
                </Link>
                <Button onClick={() => window.print()} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                    <Printer className="h-4 w-4" /> Print Return Invoice
                </Button>
            </div>

            <div className="max-w-4xl mx-auto bg-white print:max-w-none">
                <PrintableSalesReturnInvoice from={from} to={to} invoice={invoice} />
            </div>
        </div>
    );
}
