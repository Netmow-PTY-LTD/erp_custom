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
          .print\:hidden {
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
        <div className="flex flex-col mb-6">
          {/* Top Row: Logo & Title */}
          <div className="flex justify-between items-center border-b-[1px] border-gray-300 pb-1 mb-2">
            <div>
              {from?.logo_url ? (
                <img src={from.logo_url} alt="Logo" className="h-16 object-contain" />
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-[#4CAF50] flex items-center justify-center text-[#4CAF50] font-bold text-sm overflow-hidden">
                  F&Z
                </div>
              )}
            </div>
            <div className="self-end">
              <h2 className="font-bold text-black text-xl md:text-3xl tracking-wide print-title">Sales Return Invoice</h2>
            </div>
          </div>

          {/* Bottom Row: Company Info & Return Details */}
          <div className="flex flex-col sm:flex-row justify-start items-start gap-4 sm:gap-10 mt-2">
            {/* Left Box: Company Info */}
            <div className="flex flex-col gap-1 text-[13px] w-full sm:w-1/2">
              <h1 className="font-bold company-name">{from?.company_name || "F&Z Global Trade (M) Sdn Bhd"}</h1>
              <p className="leading-tight max-w-[400px] whitespace-pre-line">
                {from?.address || "45, Jalan Industri USJ 1/10,\nTMN Perindustrian USJ 1, Subang Jaya"}
              </p>
              <p>T: {from?.phone || "0380112772"}{from?.email && `, E: ${from.email}`}</p>
            </div>

            {/* Right Box: Return Details */}
            <div className="flex flex-col w-full sm:w-1/2 details-text sm:text-left sm:items-start">
              <div className="flex w-full sm:w-auto text-left">
                <span className="font-bold">Date</span>
                <span className="w-4 text-center">:</span>
                <span className="flex-1 sm:flex-none">{formatDateStandard(invoice?.invoice_date)}</span>
              </div>
              <div className="flex w-full sm:w-auto text-left mt-1">
                <span className="font-bold">Return No.</span>
                <span className="w-4 text-center">:</span>
                <span className="flex-1 sm:flex-none uppercase">{invoice?.invoice_number}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recipient Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-5 mb-6">
          <div className="border border-gray-300 break-inside-avoid">
            <div className="bg-gray-100 px-3 py-1 font-bold details-text border-b border-gray-300">Bill From</div>
            <div className="p-3 details-text min-h-[80px]">
              <p className="font-bold">{from?.company_name}</p>
              <p className="whitespace-pre-line">{from?.address}</p>
            </div>
          </div>
          <div className="border border-gray-300 break-inside-avoid">
            <div className="bg-gray-100 px-3 py-1 font-bold details-text border-b border-gray-300">Bill To (Customer)</div>
            <div className="p-3 details-text min-h-[80px]">
              <p className="font-bold">{to?.name}</p>
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
                <th className="border border-gray-300 p-1">Created By</th>
                <th className="border border-gray-300 p-1">Return Ref.</th>
                <th className="border border-gray-300 p-1">Original Date</th>
                <th className="border border-gray-300 p-1">Due Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="border border-gray-300 p-1">{invoice?.creator?.name || "-"}</td>
                <td className="border border-gray-300 p-1">{salesReturn?.order_number || "-"}</td>
                <td className="border border-gray-300 p-1">{formatDateStandard(salesReturn?.order_date)}</td>
                <td className="border border-gray-300 p-1">{formatDateStandard(invoice?.due_date)}</td>
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
                <th className="border border-gray-300 p-2 text-left w-24">Item Code</th>
                <th className="border border-gray-300 p-2 text-left">Item Name [Spec]</th>
                <th className="border border-gray-300 p-2 text-center w-16">Qty</th>
                <th className="border border-gray-300 p-2 text-right w-24">Price</th>
                <th className="border border-gray-300 p-2 text-right w-24">Discount</th>
                <th className="border border-gray-300 p-2 text-right w-28">Total</th>
              </tr>
            </thead>
            <tbody>
              {salesReturn?.items?.map((item: any, index: number) => {
                const price = Number(item.unit_price || 0);
                const qty = Number(item.quantity || 0);
                const discount = Number(item.discount || 0);
                const rowTotal = (price * qty) - discount;

                return (
                  <tr key={item.id} className="align-top">
                    <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{item.product?.sku}</td>
                    <td className="border border-gray-300 p-2 text-left">
                      <span className="font-bold uppercase">{item.product?.name}</span>
                      {item.product?.specification && (
                        <span className="text-gray-600 italic ml-1 lowercase">
                          ({item.product.specification.toLowerCase()})
                        </span>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">{qty.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right">{price.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right">{discount.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right font-bold">{rowTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
              {/* Grand Total Row inside Table */}
              <tr className="bg-gray-50 font-bold">
                <td colSpan={6} className="border border-gray-300 p-2 text-center uppercase tracking-wider">Total Refundable</td>
                <td className="border border-gray-300 p-2 text-right">{(subtotal - discount).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Summary Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 w-full">
          {/* Note section */}
          <div className="w-full sm:w-[38%] border border-gray-300 p-2 rounded-sm details-text">
            <p className="font-bold mb-1 border-b-[1px] border-gray-200 pb-1">Return Note:</p>
            <p className="text-gray-600 italic">This is an acknowledgement of goods returned by the customer.</p>
            <p className="whitespace-pre-line mt-2">{salesReturn?.notes || ""}</p>
          </div>

          {/* QR Code (Centered) */}
          {from?.qr_code && (
            <div className="flex flex-col items-center justify-center min-w-[100px] self-center">
              <div className="flex flex-col items-center justify-center rounded-sm bg-white">
                <img
                  src={from?.qr_code}
                  alt="QR Code"
                  className="w-16 h-16"
                />
              </div>
            </div>
          )}

          {/* Totals Table */}
          <div className="w-full sm:w-[35%] overflow-x-auto">
            <table className="w-full details-text font-bold border-collapse min-w-[200px] sm:min-w-full">
              <tbody>
                <tr className="border border-gray-300">
                  <td className="p-1 px-4 text-left border-r border-gray-300 w-1/2 uppercase">Subtotal</td>
                  <td className="p-1 px-4 text-right">{currency} {subtotal.toFixed(2)}</td>
                </tr>
                <tr className="border border-gray-300 text-red-600">
                  <td className="p-1 px-4 text-left border-r border-gray-300 w-1/2 uppercase">Discount</td>
                  <td className="p-1 px-4 text-right"> - {currency} {discount.toFixed(2)}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="p-1 px-4 text-left border-r border-gray-300 w-1/2 uppercase">Tax</td>
                  <td className="p-1 px-4 text-right">{currency} {taxAmount.toFixed(2)}</td>
                </tr>
                <tr className="border border-gray-300 bg-gray-50 text-base">
                  <td className="p-1 px-4 text-left border-r border-gray-300 w-1/2 uppercase tracking-wider">Total Refundable</td>
                  <td className="p-1 px-4 text-right underline underline-offset-4 decoration-double">{currency} {total}</td>
                </tr>
                <tr className="border border-gray-300 text-green-600">
                  <td className="p-1 px-4 text-left border-r border-gray-300 w-1/2 uppercase">Total Paid</td>
                  <td className="p-1 px-4 text-right">{currency} {paid.toFixed(2)}</td>
                </tr>
                <tr className={`border border-gray-300 font-black ${balance > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                  <td className="p-1 px-4 text-left border-r border-gray-300 w-1/2 uppercase">Balance Due</td>
                  <td className="p-1 px-4 text-right">{currency} {balance.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Print Button Wrapper */}
        <div className="mt-8 flex justify-center sm:justify-end print:hidden">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition-colors text-sm sm:text-base w-full sm:w-auto"
          >
            Download / Print Return Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
