import { useAppSelector } from "@/store/store";
import type { Customer } from "@/store/features/customers/types";
import type { SalesInvoice } from "@/types/salesInvoice.types";
import type { Settings } from "@/types/types";

interface Props {
  invoice: SalesInvoice | undefined;
  from: Settings | undefined;
  to: Customer | undefined;
}

export default function PrintableInvoice({ invoice, from, to }: Props) {
  const currency = useAppSelector((state) => state.currency.value) || "RM";
  const formatDate = (dateStr: string) => dateStr?.split("T")[0];

  // Calculations
  const subtotal = Number(invoice?.order?.total_amount || 0);
  const discount = Number(invoice?.order?.discount_amount || 0);
  const gstRate = 0.06; // Based on PDF showing 6%
  const gstAmount = Number(invoice?.order?.tax_amount || (subtotal - discount) * gstRate);
  const total = (subtotal - discount + gstAmount).toFixed(2);

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
          body {
            -webkit-print-color-adjust: exact;
          }
          .invoice-box {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
        .invoice-box {
          max-width: 850px;
          margin: auto;
          // padding: 30px;
          // border: 1px solid #eee;
          background: white;
        }
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
          <div className="flex flex-col gap-2">
            <div className="w-16 h-16 rounded-full border-2 border-[#4CAF50] flex items-center justify-center text-[#4CAF50] font-bold text-xl overflow-hidden">
              {from?.logo_url ? <img src={from.logo_url} alt="Logo" className="w-full h-full object-contain" /> : "F&Z"}
            </div>
            <div className="mt-2 text-[13px]">
              <h1 className="text-xl font-bold uppercase">{from?.company_name || "F&Z Global Trade (M) Sdn Bhd"}</h1>
              <p className="leading-tight max-w-[300px]">
                {from?.address || "45, Jalan Industri USJ 1/10, TMN Perindustrian USJ 1, Subang Jaya"}
              </p>
              <p>T: {from?.phone || "0162759780"}</p>
              {from?.email && <p>E: {from.email}</p>}
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Tax Invoice</h2>
            <div className="text-sm space-y-1">
              <p><strong>Date:</strong> {formatDate(invoice?.invoice_date || "")}</p>
              <p><strong>Invoice No.:</strong> {invoice?.invoice_number}</p>
            </div>
          </div>
        </div>

        {/* Recipient Section */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 font-bold text-sm border-b border-gray-300">Bill To</div>
            <div className="p-3 text-sm min-h-[80px]">
              <p className="font-bold">{to?.name}</p>
              <p className="whitespace-pre-line">{to?.address}</p>
              {to?.phone && <p>T: {to.phone}</p>}
              {to?.email && <p>E: {to.email}</p>}
            </div>
          </div>
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 font-bold text-sm border-b border-gray-300">Ship To</div>
            <div className="p-3 text-sm min-h-[80px]">
              <p className="font-bold">{to?.name}</p>
              <p className="whitespace-pre-line">{to?.address}</p>
              {to?.phone && <p>T: {to.phone}</p>}
              {to?.email && <p>E: {to.email}</p>}
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="w-full mb-6 text-xs table-border border-collapse">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-center font-bold">
                <th className="w-1/5 border border-gray-300 p-1">Sales Rep.</th>
                <th className="w-1/5 border border-gray-300 p-1">Shipping Method</th>
                <th className="w-1/5 border border-gray-300 p-1">Delivery Date</th>
                <th className="w-1/5 border border-gray-300 p-1">Payment Terms</th>
                <th className="w-1/5 border border-gray-300 p-1">Due Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="border border-gray-300 p-1">{invoice?.creator?.name || "-"}</td>
                <td className="border border-gray-300 p-1">-</td>
                <td className="border border-gray-300 p-1">{invoice?.order?.delivery_date ? formatDate(String(invoice.order.delivery_date)) : "-"}</td>
                <td className="border border-gray-300 p-1">-</td>
                <td className="border border-gray-300 p-1">{formatDate(invoice?.due_date || "")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Main Items Table */}
        <div className="w-full mb-6">
          <table className="w-full text-xs border-collapse">
            <thead className="bg-gray-100 font-bold">
              <tr>
                <th className="border border-gray-300 p-2 text-center w-12">Seq. No.</th>
                <th className="border border-gray-300 p-2 text-left w-24">Item Code</th>
                <th className="border border-gray-300 p-2 text-left">Item Name [Spec]</th>
                <th className="border border-gray-300 p-2 text-center w-16">Qty</th>
                <th className="border border-gray-300 p-2 text-right w-20">Price</th>
                <th className="border border-gray-300 p-2 text-right w-24">Discount Pretax Amount</th>
                <th className="border border-gray-300 p-2 text-right w-24">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice?.order?.items?.map((item, index) => (
                <tr key={item.id} className="align-top">
                  <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                  <td className="border border-gray-300 p-2">{item.product?.sku}</td>
                  <td className="border border-gray-300 p-2">
                    <div className="font-bold">{item.product?.name}</div>
                    {item.product?.specification && <div className="text-[10px] text-gray-500 italic mt-0.5">{item.product.specification}</div>}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">{Number(item.quantity).toFixed(2)}</td>
                  <td className="border border-gray-300 p-2 text-right">{Number(item.unit_price).toFixed(2)}</td>
                  <td className="border border-gray-300 p-2 text-right">{Number(item.discount).toFixed(2)}</td>
                  <td className="border border-gray-300 p-2 text-right font-bold">{Number(item.line_total).toFixed(2)}</td>
                </tr>
              ))}
              {/* Grand Total Row inside Table */}
              <tr className="bg-gray-50 font-bold">
                <td colSpan={6} className="border border-gray-300 p-2 text-center uppercase tracking-wider">Grand Total</td>
                <td className="border border-gray-300 p-2 text-right">{total}</td>
              </tr>
              {/* Fill remaining space if needed to match PDF height (optional) */}
              {[...Array(Math.max(0, 5 - (invoice?.order?.items?.length || 0)))].map((_, i) => (
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
        <div className="flex justify-between items-start">
          <div className="w-3/5 border border-gray-300 p-2 rounded-sm text-[12px]">
            <p className="font-bold mb-1">Note:</p>
            <p>All Cheques should be crossed and made payable to</p>
            <p className="font-bold uppercase">{from?.company_name || "F&Z GLOBAL TRADE (M) SDN BHD"}</p>
            <p>Account Number: <span className="font-bold">564230815279</span> (Maybank Berhad)</p>
          </div>

          <div className="w-1/3">
            <table className="w-full text-xs font-bold border-collapse">
              <tbody>
                <tr className="border border-gray-300">
                  <td className="p-1 px-4 text-left border-r border-gray-300">SUBTOTAL</td>
                  <td className="p-1 px-4 text-right">{currency} {subtotal.toFixed(2)}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="p-1 px-4 text-left border-r border-gray-300">DISCOUNT</td>
                  <td className="p-1 px-4 text-right">- {currency} {discount.toFixed(2)}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="p-1 px-4 text-left border-r border-gray-300">Add GST @ (6%)</td>
                  <td className="p-1 px-4 text-right">{currency} {gstAmount.toFixed(2)}</td>
                </tr>
                <tr className="border border-gray-300 bg-gray-50 text-sm">
                  <td className="p-1 px-4 text-left border-r border-gray-300">TOTAL</td>
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
            Download / Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
