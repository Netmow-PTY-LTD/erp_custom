/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "@/store/store";
import type { SalesInvoice } from "@/types/salesInvoice.types";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import type { Settings } from "@/types/types";

interface Props {
    invoices: SalesInvoice[];
    from: Settings | undefined;
    itemsOnly?: boolean;
}

export default function PrintableInvoicesSummary({ invoices, from, itemsOnly = false }: Props) {
    const currency = useAppSelector((state) => state.currency.value) || "RM";
    const navigate = useNavigate();

    const totals = invoices.reduce((acc, inv) => {
        acc.amount += parseFloat(inv.total_payable || "0");
        acc.paid += inv.paid_amount || 0;
        acc.balance += inv.remaining_balance || 0;
        return acc;
    }, { amount: 0, paid: 0, balance: 0 });

    const allItems = invoices.flatMap(inv => inv.order?.items || []).reduce((acc: any[], item) => {
        const qty = Number(item.quantity || 0);
        const unitPrice = Number(item.unit_price || 0);
        const discount = Number(item.discount || 0);
        const taxRate = Number(item.sales_tax_percent || item.sales_tax || 0);

        const subtotal = unitPrice * qty;
        const taxableAmount = subtotal - discount;
        const taxAmount = Number(item.tax_amount) || (taxableAmount * (taxRate / 100));
        const lineTotal = taxableAmount + taxAmount;

        const existing = acc.find(i =>
            i.product_id === item.product_id &&
            i.unit_price === item.unit_price &&
            (i.sales_tax_percent || i.sales_tax || 0) === taxRate
        );
        if (existing) {
            existing.quantity = Number(existing.quantity) + qty;
            existing.total_price_sum = (existing.total_price_sum || 0) + subtotal;
            existing.discount_sum = (existing.discount_sum || 0) + discount;
            existing.tax_amount = (existing.tax_amount || 0) + taxAmount;
            existing.payable_amount = (existing.payable_amount || 0) + lineTotal;
            existing.line_total = Number(existing.line_total) + lineTotal;
        } else {
            acc.push({
                ...item,
                total_price_sum: subtotal,
                discount_sum: discount,
                tax_amount: taxAmount,
                payable_amount: lineTotal,
                line_total: lineTotal,
                sales_tax_percent: taxRate // ensure we store it for the next consolidate check
            });
        }
        return acc;
    }, []);

    const tableTotals = allItems.reduce((acc, item) => {
        acc.qty += Number(item.quantity);
        acc.total_price += Number(item.total_price_sum);
        acc.discount += Number(item.discount_sum);
        acc.tax += Number(item.tax_amount);
        acc.payable += Number(item.payable_amount);
        return acc;
    }, { qty: 0, total_price: 0, discount: 0, tax: 0, payable: 0 });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-0 sm:p-6 print:p-0 font-sans text-[#333]">
            <style>{`
        @media print {
          @page {
            margin: 2mm;
            size: A4;
          }
          body {
            -webkit-print-color-adjust: exact;
          }
          .summary-box {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
        .summary-box {
          max-width: 1000px;
          margin: auto;
          background: white;
        }
        .table-border th, .table-border td {
          border: 1px solid #ddd;
          padding: 8px;
        }
      `}</style>

            <div className="summary-box print:border-0 print:p-0">
                {/* Back Button Link */}
                <div className="mb-4 print:hidden">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors font-medium text-sm"
                    >
                        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                        Back
                    </button>
                </div>
                {/* Header Section */}
                <div className="flex flex-wrap justify-between items-start mb-6 border-b pb-4 text-left gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="w-16 h-16 rounded-full border-2 border-[#4CAF50] flex items-center justify-center text-[#4CAF50] font-bold text-xl overflow-hidden">
                            {from?.logo_url ? <img src={from.logo_url} alt="Logo" className="w-full h-full object-contain" /> : "F&Z"}
                        </div>
                        <div className="mt-2 text-[13px]">
                            <h1 className="text-xl font-bold uppercase">{from?.company_name || "F&Z Global Trade (M) Sdn Bhd"}</h1>
                            <p className="leading-tight max-w-[400px]">
                                {from?.address || "45, Jalan Industri USJ 1/10, TMN Perindustrian USJ 1, Subang Jaya"}
                            </p>
                            <p>T: {from?.phone || "0162759780"}</p>
                        </div>
                    </div>
                    <div className="md:text-right">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{itemsOnly ? "Order Items Summary" : "Invoices Summary"}</h2>
                        <p className="text-sm font-bold text-blue-600 tracking-wider font-mono uppercase">{itemsOnly ? "Picking / Items List" : "BATCH REPORT"}</p>
                        <p className="text-sm mt-1">Date: {new Date().toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">Total Invoices: {invoices.length}</p>
                    </div>
                </div>

                {/* Items Table Consolidated */}
                <div className="space-y-4 overflow-x-auto print:overflow-x-visible">
                    <table className="w-full text-[11px] border-collapse mb-4 shadow-sm min-w-[700px] print:min-w-0">
                        <thead className="bg-gray-50 font-bold text-gray-700 uppercase tracking-tighter">
                            <tr>
                                <th className="border border-gray-200 p-2 text-center w-8">Seq</th>
                                <th className="border border-gray-200 p-2 text-left w-20">SKU</th>
                                <th className="border border-gray-200 p-2 text-left">Product Name</th>
                                <th className="border border-gray-200 p-2 text-left">Specification</th>
                                <th className="border border-gray-200 p-2 text-center w-12">Qty</th>
                                <th className="border border-gray-200 p-2 text-right w-20">Price</th>
                                <th className="border border-gray-200 p-2 text-right w-20">Total Price</th>
                                <th className="border border-gray-200 p-2 text-right w-20">Discount</th>
                                <th className="border border-gray-200 p-2 text-right w-24">Pretax Amt</th>
                                <th className="border border-gray-200 p-2 text-right w-20 text-blue-600">Tax</th>
                                <th className="border border-gray-200 p-2 text-right w-24 text-emerald-600">Payable</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allItems.map((item, itemIdx) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="border border-gray-200 p-2 text-center text-gray-400 font-mono">{itemIdx + 1}</td>
                                    <td className="border border-gray-200 p-2 font-mono text-gray-600">{item.product?.sku}</td>
                                    <td className="border border-gray-200 p-2 font-medium text-left">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 uppercase">{item.product?.name}</span>
                                        </div>
                                    </td>
                                    <td className="border border-gray-200 p-2 text-left italic text-gray-500">
                                        {item.specification || item.product?.specification || "-"}
                                    </td>
                                    <td className="border border-gray-200 p-2 text-center font-bold text-blue-600">{Number(item.quantity).toFixed(0)}</td>
                                    <td className="border border-gray-200 p-2 text-right">{currency} {Number(item.unit_price).toFixed(2)}</td>
                                    <td className="border border-gray-200 p-2 text-right">{currency} {Number(item.total_price_sum).toFixed(2)}</td>
                                    <td className="border border-gray-200 p-2 text-right text-rose-500 font-medium">{currency} {Number(item.discount_sum).toFixed(2)}</td>
                                    <td className="border border-gray-200 p-2 text-right font-bold text-gray-700">{currency} {(Number(item.total_price_sum) - Number(item.discount_sum)).toFixed(2)}</td>
                                    <td className="border border-gray-200 p-2 text-right font-medium text-blue-600">{currency} {Number(item.tax_amount).toFixed(2)}</td>
                                    <td className="border border-gray-200 p-2 text-right font-black text-emerald-700 bg-emerald-50/30">{currency} {Number(item.payable_amount).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold text-gray-900 border-t-2 border-gray-300">
                            <tr>
                                <td colSpan={4} className="border border-gray-200 p-3 text-right uppercase tracking-widest text-xs">Grand Total</td>
                                <td className="border border-gray-200 p-3 text-center text-blue-600 font-black">{tableTotals.qty.toFixed(0)}</td>
                                <td className="border border-gray-200 p-3"></td>
                                <td className="border border-gray-200 p-3 text-right font-mono">{currency} {tableTotals.total_price.toFixed(2)}</td>
                                <td className="border border-gray-200 p-3 text-right text-rose-600 font-mono">{currency} {tableTotals.discount.toFixed(2)}</td>
                                <td className="border border-gray-200 p-3 text-right text-gray-800 font-mono">{currency} {(tableTotals.total_price - tableTotals.discount).toFixed(2)}</td>
                                <td className="border border-gray-200 p-3 text-right text-blue-600 font-mono">{currency} {tableTotals.tax.toFixed(2)}</td>
                                <td className="border border-gray-200 p-3 text-right text-emerald-700 text-sm font-black underline decoration-double underline-offset-4">{currency} {tableTotals.payable.toFixed(2)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Grand Totals at Bottom Right */}
                <div className="mt-12 flex justify-end">
                    <div className="w-full sm:w-1/2 md:w-1/3">
                        <table className="w-full text-xs font-bold border-collapse">
                            <tbody>
                                <tr className="border border-gray-300">
                                    <td className="p-2 px-4 text-left border-r border-gray-300 bg-gray-50 uppercase tracking-wider">Total Payable</td>
                                    <td className="p-2 px-4 text-right">{currency} {totals.amount.toFixed(2)}</td>
                                </tr>
                                <tr className="border border-gray-300">
                                    <td className="p-2 px-4 text-left border-r border-gray-300 bg-gray-50 uppercase tracking-wider text-emerald-600">Total Paid</td>
                                    <td className="p-2 px-4 text-right text-emerald-600">{currency} {totals.paid.toFixed(2)}</td>
                                </tr>
                                <tr className="border border-gray-300 bg-gray-100 text-sm">
                                    <td className="p-2 px-4 text-left border-r border-gray-300 uppercase tracking-widest text-rose-600">Total Due</td>
                                    <td className="p-2 px-4 text-right text-rose-600 underline underline-offset-4 decoration-double">{currency} {totals.balance.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Actions Wrapper */}
                <div className="mt-8 flex justify-end gap-4 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition-colors flex items-center gap-2"
                    >
                        Download / Print Summary
                    </button>
                </div>
            </div>
        </div>
    );
}
