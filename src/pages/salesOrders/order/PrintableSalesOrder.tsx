import { useAppSelector } from "@/store/store";
import { format } from "date-fns";
import type { Customer } from "@/store/features/customers/types";
import type { SalesOrder } from "@/types/salesOrder.types";
import type { Settings } from "@/types/types";

interface Props {
    order: SalesOrder | undefined;
    to: Customer | undefined;
    from: Settings | undefined; // Settings usually contains company info
}

export default function PrintableSalesOrder({ order, to, from }: Props) {
    const currency = useAppSelector((state) => state.currency.value) || "RM";
    const formatDate = (dateStr: string | Date) => {
        if (!dateStr) return "-";
        try {
            return format(new Date(dateStr), "dd/MM/yyyy");
        } catch (e) {
            if (typeof dateStr === "string") {
                return dateStr.split("T")[0] || "-";
            }
            return "-";
        }
    };

    // Calculations
    const subtotal = Number(order?.total_amount || 0);
    const discount = Number(order?.discount_amount || 0);
    const gstAmount = Number(order?.tax_amount || 0);
    const total = order?.total_payable_amount
        ? Number(order.total_payable_amount).toFixed(2)
        : (subtotal - discount + gstAmount).toFixed(2);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-0 sm:p-6 print:p-0 font-sans text-[#333]">
            <style>{`
        @media print {
          @page {
            margin: 5mm;
            size: A4;
          }
          html, body {
            overflow: visible !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          ::-webkit-scrollbar {
            display: none !important;
          }
          body {
            -webkit-print-color-adjust: exact;
            font-size: 11px !important;
          }
          .invoice-box {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          .print:hidden {
            display: none !important;
          }
          .print-title {
            font-size: 28px !important;
            line-height: 1 !important;
          }
          table { font-size: 11px !important; }
          .text-sm { font-size: 11px !important; }
          .text-xs { font-size: 11px !important; }
          .details-text, .table-text { 
            font-size: 11px !important; 
            line-height: 1.2 !important; 
          }
          .company-name {
            font-size: 18px !important;
            line-height: 1.2 !important;
          }
          .mb-6 { margin-bottom: 24px !important; }
          .mb-4 { margin-bottom: 16px !important; }
        }
        .invoice-box {
          max-width: 850px;
          margin: auto;
          background: white;
        }
        /* Standardizing screen sizes */
        .company-name { font-size: 18px !important; line-height: 1.2; }
        .details-text { font-size: 12px !important; line-height: 1.4; }
        .table-text { font-size: 12px !important; }
        
        .table-border th, .table-border td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        .bg-grey {
          background-color: #f2f2f2 !important;
        }
      `}</style>

            <div id="invoice" className="invoice-box print:border-0 print:p-0">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-2 mt-2 details-text text-[13px] w-1/3">
                        <h1 className="font-bold company-name">{from?.company_name || "F&Z Global Trade (M) Sdn Bhd"}</h1>
                        <p className="leading-tight max-w-[400px] whitespace-pre-line">
                            {from?.address || "45, Jalan Industri USJ 1/10,\nTMN Perindustrian USJ 1, Subang Jaya"}
                        </p>
                        <p>T: {from?.phone || "0380112772"}{from?.email && `, E: ${from.email}`}</p>
                    </div>
                    <div className="w-1/3 flex justify-center items-center">
                        <div className="mb-1">
                            {from?.logo_url ? (
                                <img src={from.logo_url} alt="Logo" className="h-20 object-contain" />
                            ) : (
                                <div className="w-20 h-20 rounded-full border-2 border-[#4CAF50] flex items-center justify-center text-[#4CAF50] font-bold text-lg overflow-hidden">
                                    F&Z
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-right flex flex-col items-end w-1/3">
                        <h2 className="font-bold text-gray-800 mb-1 uppercase details-text text-xl">Sales Order</h2>
                        <div className="details-text space-y-1">
                            <p><strong>Date:</strong> {formatDate(order?.order_date || "")}</p>
                            <p><strong>Order No.:</strong> {order?.order_number}</p>
                            <p><strong>Status:</strong> {order?.status}</p>
                        </div>
                    </div>
                </div>

                {/* Recipient Section */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="border border-gray-300">
                        <div className="bg-gray-100 px-3 py-1 font-bold details-text border-b border-gray-300">Bill To</div>
                        <div className="p-3 details-text min-h-[80px]">
                            <p className="font-bold">{to?.company}</p>
                            <p className="font-medium">{to?.name}</p>
                            <p className="whitespace-pre-line">{to?.address}</p>
                            {to?.phone && <p>T: {to.phone}</p>}
                            {to?.email && <p>E: {to.email}</p>}
                        </div>
                    </div>
                    <div className="border border-gray-300">
                        <div className="bg-gray-100 px-3 py-1 font-bold details-text border-b border-gray-300">Ship To</div>
                        <div className="p-3 details-text min-h-[80px]">
                            <p className="font-bold">{to?.company}</p>
                            <p className="font-medium">{to?.name}</p>
                            <p className="whitespace-pre-line">{to?.address}</p>
                            {to?.phone && <p>T: {to.phone}</p>}
                            {to?.email && <p>E: {to.email}</p>}
                        </div>
                    </div>
                </div>

                {/* Info Bar */}
                <div className="w-full mb-6 text-xs table-border border-collapse overflow-x-auto">
                    <table className="w-full border-collapse min-w-[600px] sm:min-w-full">
                        <thead>
                            <tr className="bg-gray-100 text-center font-bold">
                                <th className="w-1/4 border border-gray-300 p-1">Sales Rep.</th>
                                <th className="w-1/4 border border-gray-300 p-1">Shipping Method</th>
                                <th className="w-1/4 border border-gray-300 p-1">Delivery Date</th>
                                <th className="w-1/4 border border-gray-300 p-1">Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="text-center">
                                <td className="border border-gray-300 p-1">{order?.creator?.name || "-"}</td>
                                <td className="border border-gray-300 p-1">-</td>
                                <td className="border border-gray-300 p-1">
                                    {order?.delivery_date ? formatDate(String(order.delivery_date)) : "-"}
                                </td>
                                <td className="border border-gray-300 p-1">{formatDate(order?.due_date || "")}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Main Items Table */}
                <div className="w-full mb-6 overflow-x-auto">
                    <table className="w-full table-text border-collapse min-w-[700px] sm:min-w-full">
                        <thead className="bg-gray-100 font-bold">
                            <tr>
                                <th className="border border-gray-300 p-2 text-center w-10">Seq No.</th>
                                <th className="border border-gray-300 p-2 text-left w-20">Item Code</th>
                                <th className="border border-gray-300 p-2 text-left">Item Name [Spec]</th>
                                <th className="border border-gray-300 p-2 text-center w-16">Qty</th>
                                <th className="border border-gray-300 p-2 text-right w-24">Price</th>
                                <th className="border border-gray-300 p-2 text-right w-24">Discount</th>
                                <th className="border border-gray-300 p-2 text-right w-28">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order?.items?.map((item, index) => {
                                const qty = Number(item.quantity || 0);
                                const unitPrice = Number(item.unit_price || 0);
                                const discount = Number(item.discount || 0);
                                const taxRate = Number(item.sales_tax_percent || item.sales_tax || 0);
                                const pretax = (unitPrice * qty) - discount;
                                const tax = Number(item.tax_amount) || (pretax * (taxRate / 100));
                                const rowTotal = pretax + tax;

                                return (
                                    <tr key={item.id} className="align-top">
                                        <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{item.product?.sku}</td>
                                        <td className="border border-gray-300 p-2">
                                            <span className="font-bold">{item.product?.name}</span>
                                            {(item.specification || item.product?.specification) && (
                                                <span className="text-gray-600 italic ml-1 lowercase">
                                                    ({(item.specification || item.product?.specification || "").toLowerCase()})
                                                </span>
                                            )}
                                        </td>
                                        <td className="border border-gray-300 p-2 text-center">{qty.toFixed(2)}</td>
                                        <td className="border border-gray-300 p-2 text-right">{unitPrice.toFixed(2)}</td>
                                        <td className="border border-gray-300 p-2 text-right">{discount.toFixed(2)}</td>
                                        <td className="border border-gray-300 p-2 text-right font-bold">{rowTotal.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                            {/* Grand Total Row inside Table */}
                            <tr className="bg-gray-50 font-bold tracking-wider">
                                <td colSpan={6} className="border border-gray-300 p-2 text-center">Grand Total</td>
                                <td className="border border-gray-300 p-2 text-right">{total}</td>
                            </tr>
                            {/* Fill rows */}
                            {[...Array(Math.max(0, 3 - (order?.items?.length || 0)))].map((_, i) => (
                                <tr key={`empty-${i}`} className="h-8">
                                    <td className="border border-gray-300 p-2"></td>
                                    <td className="border border-gray-300 p-2"></td>
                                    <td className="border border-gray-300 p-2"></td>
                                    <td className="border border-gray-300 p-2"></td>
                                    <td className="border border-gray-300 p-2"></td>
                                    <td className="border border-gray-300 p-2"></td>
                                    <td className="border border-gray-300 p-2 text-right"></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Summary Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-2 w-full">
                    {/* Note section */}
                    <div className="w-full sm:w-[38%] border border-gray-300 p-2 rounded-sm details-text">
                        <p className="font-bold mb-1 border-b-[1px] border-gray-200 pb-1">Note:</p>
                        <p className="mb-2 whitespace-pre-wrap">{order?.notes || "No notes."}</p>
                        <p>All Cheques should be crossed and made payable to</p>
                        <p className="font-bold text-sm">{from?.company_name || "F&Z GLOBAL TRADE (M) SDN BHD"}</p>
                        <p className="mt-1">Account Number: <span className="font-bold">564230815279</span> (Maybank Berhad)</p>
                    </div>

                    {/* QR Code (Centered) */}
                    {from?.qr_code && (
                        <div className="flex flex-col items-center justify-center min-w-[100px] self-center">
                            <div className="flex flex-col items-center justify-center rounded-sm bg-white">
                                <img
                                    src={from?.qr_code}
                                    alt="QR Code"
                                    className="w-25 h-25"
                                />
                            </div>
                        </div>
                    )}

                    {/* Totals Table */}
                    <div className="w-full sm:w-[35%] overflow-x-auto">
                        <table className="w-full details-text font-bold border-collapse min-w-[200px] sm:min-w-full">
                            <tbody>
                                <tr className="border border-gray-300">
                                    <td className="p-1 px-4 text-left border-r border-gray-300 w-1/2">Subtotal</td>
                                    <td className="p-1 px-4 text-right">{currency} {subtotal.toFixed(2)}</td>
                                </tr>
                                <tr className="border border-gray-300">
                                    <td className="p-1 px-4 text-left border-r border-gray-300 w-1/2">Discount</td>
                                    <td className="p-1 px-4 text-right"> - {currency} {discount.toFixed(2)}</td>
                                </tr>
                                <tr className="border border-gray-300">
                                    <td className="p-1 px-4 text-left border-r border-gray-300 w-1/2 text-[10px]">Tax</td>
                                    <td className="p-1 px-4 text-right">{currency} {gstAmount.toFixed(2)}</td>
                                </tr>
                                <tr className="border border-gray-300 bg-gray-50 text-base">
                                    <td className="p-1 px-4 text-left border-r border-gray-300 w-1/2 tracking-wider">Total</td>
                                    <td className="p-1 px-4 text-right underline underline-offset-4 decoration-double">{currency} {total}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Print Button Wrapper */}
                <div className="mt-8 flex justify-end print:hidden">
                    <button
                        onClick={handlePrint}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition-colors"
                    >
                        Download / Print Order
                    </button>
                </div>
            </div>
        </div>
    );
}
