/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "@/store/store";
import type { RootState } from "@/store/store";
import type { PurchaseInvoice } from "@/types/PurchaseInvoice.types";
import type { Supplier } from "@/types/supplier.types";
import type { Settings } from "@/types/types";
import { formatDateStandard } from "@/utils/dateUtils";

interface Props {
    invoice: PurchaseInvoice | undefined;
    from: Supplier | undefined;
    to: Settings | undefined;
}

export default function PrintablePurchaseReturnInvoice({ invoice, from, to }: Props) {
    const currency = useAppSelector((state: RootState) => state.currency.value) || "RM";

    const purchaseReturn = (invoice as any)?.purchase_return;

    // Calculations
    const subtotal = Number(purchaseReturn?.total_amount || 0);
    const discount = Number(purchaseReturn?.discount_amount || 0);
    const taxAmount = Number(purchaseReturn?.tax_amount || 0);
    const totalVal = Number(purchaseReturn?.total_payable_amount || (subtotal - discount + taxAmount));
    const total = totalVal.toFixed(2);

    const payments = invoice?.payments || [];
    const calculatedTotalPaid = payments.reduce((acc: number, p: any) => acc + Number(p.amount || 0), 0);

    const paid = Number(purchaseReturn?.total_refunded_amount || calculatedTotalPaid || 0);
    const balance = Number(purchaseReturn?.due_refund_amount ?? (totalVal - paid));

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="sm:p-6 print:p-0 font-sans text-[#333]">
            <style>{`
        @media print {
          @page { margin: 10mm; size: A4; }
          body { -webkit-print-color-adjust: exact; }
        }
        .invoice-box { max-width: 850px; margin: auto; background: white; }
        .table-border th, .table-border td { border: 1px solid #ddd; padding: 8px; }
      `}</style>

            <div id="invoice" className="invoice-box print:border-0 print:p-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 pb-1 border-b border-gray-200 gap-2">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-blue-500 font-bold text-xl overflow-hidden order-1 sm:order-[-1]">
                        {to?.logo_url ? <img src={to.logo_url} alt="Logo" className="w-full h-full object-contain" /> : "F&Z"}
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 text-center">Purchase Return Invoice</h2>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                    <div className="flex flex-col gap-2 text-left w-full sm:w-auto">
                        <div className="text-xs sm:text-[13px] text-left">
                            <h1 className="text-base sm:text-lg md:text-xl font-bold uppercase">{to?.company_name}</h1>
                            <p className="leading-tight max-w-full sm:max-w-[300px]">{to?.address}</p>
                            <p>T: {to?.phone}</p>
                            {to?.email && <p>E: {to.email}</p>}
                        </div>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                        <div className="text-xs sm:text-sm space-y-1">
                            <p><strong>Date:</strong> {formatDateStandard(invoice?.invoice_date)}</p>
                            <p><strong>Invoice No.:</strong> {invoice?.invoice_number}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-4">
                    <div className="border border-gray-300">
                        <div className="bg-gray-100 px-3 py-1 font-bold text-xs sm:text-sm border-b border-gray-300 text-blue-700 text-left">Bill From (Supplier)</div>
                        <div className="p-2 sm:p-3 text-xs sm:text-sm min-h-[80px] text-left">
                            <p className="font-bold">{from?.name}</p>
                            <p className="whitespace-pre-line">{from?.address}</p>
                            {from?.phone && <p>T: {from.phone}</p>}
                            {from?.email && <p>E: {from.email}</p>}
                        </div>
                    </div>
                    <div className="border border-gray-300">
                        <div className="bg-gray-100 px-3 py-1 font-bold text-xs sm:text-sm border-b border-gray-300 text-blue-700 text-left">Bill To</div>
                        <div className="p-2 sm:p-3 text-xs sm:text-sm min-h-[80px] text-left">
                            <p className="font-bold">{to?.company_name}</p>
                            <p className="whitespace-pre-line">{to?.address}</p>
                            {to?.phone && <p>T: {to.phone}</p>}
                            {to?.email && <p>E: {to.email}</p>}
                        </div>
                    </div>
                </div>

                <div className="w-full mb-4 sm:mb-6 overflow-x-auto">
                    <table className="w-full border-collapse text-[10px] sm:text-xs">
                        <thead><tr className="bg-gray-100 text-center font-bold">
                            <th className="border border-gray-300 p-1">Created By</th>
                            <th className="border border-gray-300 p-1">Return Ref.</th>
                            <th className="border border-gray-300 p-1">Original Date</th>
                            <th className="border border-gray-300 p-1">Due Date</th>
                        </tr></thead>
                        <tbody><tr className="text-center">
                            <td className="border border-gray-300 p-1">{invoice?.creator?.name || "-"}</td>
                            <td className="border border-gray-300 p-1">{(purchaseReturn as any)?.purchase_order?.po_number || purchaseReturn?.po_number || "-"}</td>
                            <td className="border border-gray-300 p-1">{formatDateStandard(purchaseReturn?.return_date || purchaseReturn?.order_date)}</td>
                            <td className="border border-gray-300 p-1">{formatDateStandard(invoice?.due_date)}</td>
                        </tr></tbody>
                    </table>
                </div>

                <div className="w-full mb-4 sm:mb-6 overflow-x-auto">
                    <table className="w-full text-[10px] sm:text-xs border-collapse min-w-[600px]">
                        <thead className="bg-blue-50 font-bold"><tr>
                            <th className="border border-gray-300 p-1 sm:p-2 text-center w-8 sm:w-12 text-blue-800">Seq.</th>
                            <th className="border border-gray-300 p-1 sm:p-2 text-left w-16 sm:w-24 text-blue-800">Item Code</th>
                            <th className="border border-gray-300 p-1 sm:p-2 text-left text-blue-800">Item Name</th>
                            <th className="border border-gray-300 p-1 sm:p-2 text-center w-12 sm:w-16 text-blue-800">Qty</th>
                            <th className="border border-gray-300 p-1 sm:p-2 text-right w-16 sm:w-20 text-blue-800">Price</th>
                            <th className="border border-gray-300 p-1 sm:p-2 text-right w-16 sm:w-24 text-blue-800">Discount</th>
                            <th className="border border-gray-300 p-1 sm:p-2 text-right w-12 sm:w-20 text-blue-800">Tax</th>
                            <th className="border border-gray-300 p-1 sm:p-2 text-right w-16 sm:w-24 text-blue-800">Total</th>
                        </tr></thead>
                        <tbody>{purchaseReturn?.items?.map((item: any, index: number) => (
                            <tr key={item.id} className="align-top">
                                <td className="border border-gray-300 p-1 sm:p-2 text-center">{index + 1}</td>
                                <td className="border border-gray-300 p-1 sm:p-2">{item.product?.sku}</td>
                                <td className="border border-gray-300 p-1 sm:p-2 text-left">
                                    <div className="font-bold uppercase">{item.product?.name}</div>
                                    {item.product?.specification && <div className="text-[9px] sm:text-[10px] text-gray-500 italic mt-1">{item.product.specification}</div>}
                                </td>
                                <td className="border border-gray-300 p-1 sm:p-2 text-center">{Number(item.quantity).toFixed(2)}</td>
                                <td className="border border-gray-300 p-1 sm:p-2 text-right">{Number(item.unit_cost).toFixed(2)}</td>
                                <td className="border border-gray-300 p-1 sm:p-2 text-right">{Number(item.discount || 0).toFixed(2)}</td>
                                <td className="border border-gray-300 p-1 sm:p-2 text-right text-gray-600 font-medium">{Number(item.tax_amount || 0).toFixed(2)}</td>
                                <td className="border border-gray-300 p-1 sm:p-2 text-right font-bold">{(Number(item.line_total || 0) + Number(item.tax_amount || 0)).toFixed(2)}</td>
                            </tr>
                        ))}
                            <tr className="bg-blue-50 font-bold">
                                <td colSpan={7} className="border border-gray-300 p-1 sm:p-2 text-center uppercase tracking-wider text-blue-800">Total Refundable</td>
                                <td className="border border-gray-300 p-1 sm:p-2 text-right text-blue-800">{currency} {total}</td>
                            </tr></tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-8">
                        <div className="w-full md:w-3/5 border border-gray-300 p-2 rounded-sm text-[11px] sm:text-[12px] text-left print:hidden">
                            <p className="font-bold mb-1">Return Note:</p>
                            <p className="text-gray-600 italic">This is an acknowledgement of goods returned to the supplier.</p>
                        </div>
                        <div className="w-full print:w-2/5 md:w-2/5 font-bold text-[10px] sm:text-xs uppercase print:ml-auto">
                            <table className="w-full border-collapse border border-gray-300"><tbody>
                                <tr className="border-b border-gray-300"><td className="p-1 px-2 sm:px-4 text-left border-r border-gray-300">SUBTOTAL</td><td className="p-1 px-2 sm:px-4 text-right">{currency} {subtotal.toFixed(2)}</td></tr>
                                <tr className="border-b border-gray-300 text-red-600"><td className="p-1 px-2 sm:px-4 text-left border-r border-gray-300">DISCOUNT</td><td className="p-1 px-2 sm:px-4 text-right">- {currency} {discount.toFixed(2)}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-1 px-2 sm:px-4 text-left border-r border-gray-300">TAX</td><td className="p-1 px-2 sm:px-4 text-right">{currency} {taxAmount.toFixed(2)}</td></tr>
                                <tr className="border-b border-gray-300 bg-blue-50 text-blue-800"><td className="p-1 px-2 sm:px-4 text-left border-r border-gray-300">Total Refundable</td><td className="p-1 px-2 sm:px-4 text-right underline decoration-double">{currency} {total}</td></tr>
                                <tr className="border-b border-gray-300 text-green-600"><td className="p-1 px-2 sm:px-4 text-left border-r border-gray-300">Total Paid</td><td className="p-1 px-2 sm:px-4 text-right">{currency} {paid.toFixed(2)}</td></tr>
                                <tr className={`border-b border-gray-300 font-black ${balance > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}><td className="p-1 px-2 sm:px-4 text-left border-r border-gray-300">Balance Due</td><td className="p-1 px-2 sm:px-4 text-right">{currency} {balance.toFixed(2)}</td></tr>
                            </tbody></table>
                        </div>
                    </div>
                </div>

                <div className="mt-6 sm:mt-8 flex justify-center sm:justify-end print:hidden">
                    <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:px-6 rounded shadow transition-colors text-sm sm:text-base w-full sm:w-auto">Download / Print Return Invoice</button>
                </div>
            </div>
        </div>
    );
}
