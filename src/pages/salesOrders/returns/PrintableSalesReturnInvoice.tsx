/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "@/store/store";
import type { RootState } from "@/store/store";
import type { SalesInvoice } from "@/types/salesInvoice.types";
import type { Customer } from "@/store/features/customers/types";
import type { Settings } from "@/types/types";
import { formatDateStandard } from "@/utils/dateUtils";

interface Props {
    invoice: SalesInvoice | undefined;
    from: Settings | undefined;
    to: Customer | undefined;
}

export default function PrintableSalesReturnInvoice({ invoice, from, to }: Props) {
    const currency = useAppSelector((state: RootState) => state.currency.value) || "RM";

    const salesReturn = (invoice as any)?.sales_return;

    // Calculations
    const subtotal = Number(salesReturn?.total_amount || 0);
    const discount = Number(salesReturn?.discount_amount || 0);
    const taxAmount = Number(salesReturn?.tax_amount || 0);
    const totalVal = Number(salesReturn?.total_payable_amount || (subtotal - discount + taxAmount));
    const total = totalVal.toFixed(2);

    const payments = invoice?.payments || [];
    const calculatedTotalPaid = payments.reduce((acc: number, p: any) => acc + Number(p.amount || 0), 0);

    const paid = Number(salesReturn?.total_refunded_amount || calculatedTotalPaid || 0);
    const balance = Number(salesReturn?.due_refund_amount ?? (totalVal - paid));

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-0 sm:p-6 print:p-0 font-sans text-[#333]">
            <style>{`
        @media print {
          @page { margin: 5mm; size: A4; }
          body { 
            -webkit-print-color-adjust: exact; 
            font-size: 11px !important;
          }
          .invoice-box {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            padding-top: 5px !important;
          }
          h1 { font-size: 11px !important; }
          h2 { font-size: 11px !important; }
          table { font-size: 11px !important; }
          .details-text, .table-text { 
            font-size: 11px !important; 
            line-height: 1.2 !important; 
          }
          .company-name {
            font-size: 18px !important;
            line-height: 1.2 !important;
          }
          .p-3 { padding: 4px !important; }
          .p-2 { padding: 3px !important; }
          .mb-6 { margin-bottom: 2px !important; }
          .mb-4 { margin-bottom: 1px !important; }
        }
        .invoice-box { max-width: 850px; margin: auto; background: white; }
        
        /* Standardizing screen sizes */
        .company-name { font-size: 18px !important; line-height: 1.2; }
        .details-text { font-size: 12px !important; line-height: 1.4; }
        .table-text { font-size: 12px !important; }
        
        .table-border th, .table-border td { border: 1px solid #ddd; padding: 8px; }
      `}</style>

            <div id="invoice" className="invoice-box print:border-0 print:p-0">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-1">
                    <div className="flex flex-col gap-2 mt-2 details-text text-left">
                        <h1 className="font-bold uppercase company-name">{from?.company_name || "F&Z Global Trade (M) Sdn Bhd"}</h1>
                        <p className="leading-tight max-w-[400px]">
                            {from?.address || "45, Jalan Industri USJ 1/10, TMN Perindustrian USJ 1, Subang Jaya"}
                        </p>
                        <p>T: {from?.phone || "0162759780"}{from?.email && `, E: ${from.email}`}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <div className="mb-1">
                            {from?.logo_url ? (
                                <img src={from.logo_url} alt="Logo" className="h-14 object-contain" />
                            ) : (
                                <div className="w-12 h-12 rounded-full border-2 border-[#4CAF50] flex items-center justify-center text-[#4CAF50] font-bold text-lg overflow-hidden">
                                    F&Z
                                </div>
                            )}
                        </div>
                        <h2 className="font-bold text-gray-800 mb-1 uppercase details-text">Sales Return Invoice</h2>
                        <div className="details-text space-y-1">
                            <p><strong>Date:</strong> {formatDateStandard(invoice?.invoice_date)}</p>
                            <p><strong>Invoice No.:</strong> {invoice?.invoice_number}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-1">
                    <div className="border border-gray-300">
                        <div className="bg-gray-100 px-3 py-1 font-bold details-text border-b border-gray-300 text-blue-700 text-left">Bill From</div>
                        <div className="p-3 details-text min-h-[80px] text-left">
                            <p className="font-bold">{from?.company_name}</p>
                            <p className="whitespace-pre-line">{from?.address}</p>
                        </div>
                    </div>
                    <div className="border border-gray-300">
                        <div className="bg-gray-100 px-3 py-1 font-bold details-text border-b border-gray-300 text-left">Bill To (Customer)</div>
                        <div className="p-3 details-text min-h-[80px] text-left">
                            <p className="font-bold">{to?.name}</p>
                            <p className="whitespace-pre-line">{to?.address}</p>
                            {to?.phone && <p>T: {to.phone}</p>}
                            {to?.email && <p>E: {to.email}</p>}
                        </div>
                    </div>
                </div>

                <div className="w-full mb-2">
                    <table className="w-full table-text border-collapse">
                        <thead><tr className="bg-gray-100 text-center font-bold">
                            <th className="w-1/4 border border-gray-300 p-1">Created By</th>
                            <th className="w-1/4 border border-gray-300 p-1">Return Ref.</th>
                            <th className="w-1/4 border border-gray-300 p-1">Original Date</th>
                            <th className="w-1/4 border border-gray-300 p-1">Due Date</th>
                        </tr></thead>
                        <tbody><tr className="text-center">
                            <td className="border border-gray-300 p-1">{invoice?.creator?.name || "-"}</td>
                            <td className="border border-gray-300 p-1">{salesReturn?.order_number || "-"}</td>
                            <td className="border border-gray-300 p-1">{formatDateStandard(salesReturn?.order_date)}</td>
                            <td className="border border-gray-300 p-1">{formatDateStandard(invoice?.due_date)}</td>
                        </tr></tbody>
                    </table>
                </div>

                <div className="w-full mb-2">
                    <table className="w-full table-text border-collapse">
                        <thead className="bg-blue-50 font-bold"><tr>
                            <th className="border border-gray-300 p-2 text-center w-12 text-blue-800">No</th>
                            <th className="border border-gray-300 p-2 text-left w-24 text-blue-800">Item Code</th>
                            <th className="border border-gray-300 p-2 text-left text-blue-800">Item Name</th>
                            <th className="border border-gray-300 p-2 text-center w-16 text-blue-800">Qty</th>
                            <th className="border border-gray-300 p-2 text-right w-20 text-blue-800">Price</th>
                            <th className="border border-gray-300 p-2 text-right w-24 text-blue-800">Discount</th>
                            <th className="border border-gray-300 p-2 text-right w-20 text-blue-800">Tax</th>
                            <th className="border border-gray-300 p-2 text-right w-24 text-blue-800">Total</th>
                        </tr></thead>
                        <tbody>{salesReturn?.items?.map((item: any, index: number) => (
                            <tr key={item.id} className="align-top">
                                <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                                <td className="border border-gray-300 p-2">{item.product?.sku}</td>
                                <td className="border border-gray-300 p-2 text-left">
                                    <div className="font-bold uppercase">{item.product?.name}</div>
                                    {item.product?.specification && <div className="text-[10px] text-gray-500 italic mt-1">{item.product.specification}</div>}
                                </td>
                                <td className="border border-gray-300 p-2 text-center">{Number(item.quantity).toFixed(2)}</td>
                                <td className="border border-gray-300 p-2 text-right">{Number(item.unit_price).toFixed(2)}</td>
                                <td className="border border-gray-300 p-2 text-right">{Number(item.discount || 0).toFixed(2)}</td>
                                <td className="border border-gray-300 p-2 text-right text-gray-600 font-medium">{Number(item.tax_amount || 0).toFixed(2)}</td>
                                <td className="border border-gray-300 p-2 text-right font-bold">{(Number(item.line_total || 0) + Number(item.tax_amount || 0)).toFixed(2)}</td>
                            </tr>
                        ))}
                            <tr className="bg-blue-50 font-bold">
                                <td colSpan={7} className="border border-gray-300 p-2 text-center uppercase tracking-wider text-blue-800">Total Refundable</td>
                                <td className="border border-gray-300 p-2 text-right text-blue-800">{currency} {total}</td>
                            </tr></tbody>
                    </table>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-2">
                        <div className="w-3/5 border border-gray-300 p-2 rounded-sm details-text text-left">
                            <p className="font-bold mb-1">Return Note:</p>
                            <p className="text-gray-600 italic">This is an acknowledgement of goods returned by the customer.</p>
                        </div>
                        <div className="w-2/5 font-bold details-text uppercase">
                            <table className="w-full border-collapse border border-gray-300"><tbody>
                                <tr className="border-b border-gray-300 text-red-600"><td className="p-1 px-4 text-left border-r border-gray-300">DISCOUNT</td><td className="p-1 px-4 text-right">- {currency} {discount.toFixed(2)}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-1 px-4 text-left border-r border-gray-300">SUBTOTAL</td><td className="p-1 px-4 text-right">{currency} {subtotal.toFixed(2)}</td></tr>
                                <tr className="border-b border-gray-300"><td className="p-1 px-4 text-left border-r border-gray-300">TAX</td><td className="p-1 px-4 text-right">{currency} {taxAmount.toFixed(2)}</td></tr>
                                <tr className="border-b border-gray-300 bg-blue-50 text-blue-800"><td className="p-1 px-4 text-left border-r border-gray-300">Total Refundable</td><td className="p-1 px-4 text-right underline decoration-double">{currency} {total}</td></tr>
                                <tr className="border-b border-gray-300 text-green-600"><td className="p-1 px-4 text-left border-r border-gray-300">Total Refunded</td><td className="p-1 px-4 text-right">{currency} {paid.toFixed(2)}</td></tr>
                                <tr className={`border-b border-gray-300 font-black ${balance > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}><td className="p-1 px-4 text-left border-r border-gray-300">Balance Due</td><td className="p-1 px-4 text-right">{currency} {balance.toFixed(2)}</td></tr>
                            </tbody></table>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end print:hidden">
                    <button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition-colors">Download / Print Return Invoice</button>
                </div>
            </div>
        </div>
    );
}
