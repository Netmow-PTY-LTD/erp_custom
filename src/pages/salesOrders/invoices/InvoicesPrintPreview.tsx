import { useLocation, useNavigate } from "react-router";
import { useEffect, useMemo } from "react";
import PrintableInvoice from "./PrintableInvoice";
import { useGetSettingsInfoQuery } from "@/store/features/admin/settingsApiService";
import type { SalesInvoice } from "@/types/salesInvoice.types";
import type { Settings } from "@/types/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";

export default function InvoicesPrintPreview() {
    const location = useLocation();
    const navigate = useNavigate();
    const selectedInvoices: SalesInvoice[] = location.state?.selectedInvoices || [];

    const { data: fetchedSettingsInfo } = useGetSettingsInfoQuery();
    const from: Settings | undefined = fetchedSettingsInfo?.data;

    useEffect(() => {
        if (!selectedInvoices || selectedInvoices.length === 0) {
            navigate("/dashboard/sales/invoices");
        }
    }, [selectedInvoices, navigate]);

    const consolidatedInvoice = useMemo(() => {
        if (!selectedInvoices || selectedInvoices.length === 0) return null;

        const itemsMap = new Map();
        let total_amount = 0;
        let discount_amount = 0;
        let tax_amount = 0;
        const invoiceNumbers: string[] = [];

        selectedInvoices.forEach(inv => {
            if (inv.invoice_number) invoiceNumbers.push(inv.invoice_number);
            total_amount += Number(inv.order?.total_amount || 0);
            discount_amount += Number(inv.order?.discount_amount || 0);
            tax_amount += Number(inv.order?.tax_amount || 0);

            inv.order?.items?.forEach(item => {
                const key = item.product?.id || item.product_id || item.id;
                if (itemsMap.has(key)) {
                    const existing = itemsMap.get(key);
                    existing.quantity = Number(existing.quantity) + Number(item.quantity || 0);
                    existing.discount = Number(existing.discount || 0) + Number(item.discount || 0);
                    existing.tax_amount = Number(existing.tax_amount || 0) + Number(item.tax_amount || 0);
                } else {
                    itemsMap.set(key, { ...item });
                }
            });
        });

        const consolidatedItems = Array.from(itemsMap.values());

        return {
            ...selectedInvoices[0],
            invoice_number: invoiceNumbers.join(", "),
            order: {
                ...selectedInvoices[0]?.order,
                items: consolidatedItems,
                total_amount: total_amount.toFixed(2),
                discount_amount: discount_amount.toFixed(2),
                tax_amount: tax_amount.toFixed(2),
            }
        } as unknown as SalesInvoice;
    }, [selectedInvoices]);

    if (!selectedInvoices || selectedInvoices.length === 0) {
        return null;
    }

    return (
        <div className="bg-gray-100 min-h-screen pb-10 print:bg-white print:min-h-0 print:pb-0">
            <div className="print:hidden flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-10 shadow-sm mb-6">
                <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Invoices
                </Button>
                <span className="font-semibold text-lg">Print Preview (Consolidated)</span>
                <Button onClick={() => window.print()} className="gap-2">
                    <Printer className="w-4 h-4" />
                    Print All
                </Button>
            </div>

            <div className="flex flex-col gap-8 print:gap-0 print:bg-white">
                {consolidatedInvoice && (
                    <div
                        className="print:break-after-page last:print:break-after-auto shadow-md mx-auto print:shadow-none bg-white w-full"
                        style={{ maxWidth: '850px' }}
                    >
                        <PrintableInvoice
                            invoice={consolidatedInvoice as SalesInvoice}
                            from={from}
                            to={consolidatedInvoice?.order?.customer}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
