import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useGetSettingsInfoQuery } from "@/store/features/admin/settingsApiService";
import type { Settings } from "@/types/types";
import { useGetSalesReturnInvoiceByIdQuery } from "@/store/features/salesOrder/salesReturnApiService";
import type { SalesInvoice } from "@/types/salesInvoice.types";
import PrintableSalesReturnInvoice from "./PrintableSalesReturnInvoice";
import type { Customer } from "@/store/features/customers/types";

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
            <div className="max-w-4xl mx-auto p-4 flex justify-between items-center print:hidden mb-2 bg-white">
                <Link
                    to={`/dashboard/sales-return-invoices/${invoiceId}`}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Return Invoice
                </Link>

                <div className="text-xs text-gray-400 font-medium uppercase tracking-widest text-right">
                    Print Preview
                </div>
            </div>

            <div className="max-w-4xl mx-auto bg-white print:max-w-none">
                <PrintableSalesReturnInvoice from={from} to={to} invoice={invoice} />
            </div>
        </div>
    );
}
