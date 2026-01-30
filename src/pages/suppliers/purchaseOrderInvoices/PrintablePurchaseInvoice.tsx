import { useAppSelector } from "@/store/store";
import type { RootState } from "@/store/store";
import type { PurchaseInvoice } from "@/types/PurchaseInvoice.types";
import type { POItem } from "@/types/purchaseOrder.types";
import type { Supplier } from "@/types/supplier.types";
import type { Settings } from "@/types/types";

interface Props {
  invoice: PurchaseInvoice | undefined;
  from: Supplier | undefined;
  to: Settings | undefined;
}

export default function PrintablePurchaseInvoice({ invoice, from, to }: Props) {
  const currency = useAppSelector((state: RootState) => state.currency.value) || "RM";
  const formatDate = (dateStr: string) => dateStr?.split("T")[0];

  // Calculations
  const subtotal = Number(invoice?.purchase_order?.total_amount || 0);
  const discount = Number(invoice?.purchase_order?.discount_amount || 0);
  const gstAmount = Number(invoice?.purchase_order?.tax_amount || 0);
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
            font-size: 11px !important;
          }
          .invoice-box {
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          h1 { font-size: 11px !important; }
          h2 { font-size: 11px !important; }
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
          .p-3 { padding: 4px !important; }
          .p-2 { padding: 3px !important; }
          .mb-6 { margin-bottom: 8px !important; }
          .mb-4 { margin-bottom: 4px !important; }
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
          <div className="flex flex-col gap-2 mt-2 details-text">
            <h1 className="font-bold uppercase company-name">{to?.company_name || "F&Z Global Trade (M) Sdn Bhd"}</h1>
            <p className="leading-tight max-w-[400px]">
              {to?.address || "45, Jalan Industri USJ 1/10, TMN Perindustrian USJ 1, Subang Jaya"}
            </p>
            <p>T: {to?.phone || "0162759780"}{to?.email && `, E: ${to.email}`}</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="mb-1">
              {to?.logo_url ? (
                <img src={to.logo_url} alt="Logo" className="h-14 object-contain" />
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-[#4CAF50] flex items-center justify-center text-[#4CAF50] font-bold text-lg overflow-hidden">
                  F&Z
                </div>
              )}
            </div>
            <h2 className="font-bold text-gray-800 mb-1 uppercase details-text">Purchase Invoice</h2>
            <div className="details-text space-y-1">
              <p><strong>Date:</strong> {formatDate(invoice?.invoice_date || "")}</p>
              <p><strong>Invoice No.:</strong> {invoice?.invoice_number}</p>
            </div>
          </div>
        </div>

        {/* Recipient Section */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 font-bold details-text border-b border-gray-300">Bill From</div>
            <div className="p-3 details-text min-h-[80px]">
              <p className="font-bold">{from?.name}</p>
              <p className="whitespace-pre-line">{from?.address}</p>
              {from?.phone && <p>T: {from.phone}</p>}
              {from?.email && <p>E: {from.email}</p>}
            </div>
          </div>
          <div className="border border-gray-300">
            <div className="bg-gray-100 px-3 py-1 font-bold details-text border-b border-gray-300">Ship To</div>
            <div className="p-3 details-text min-h-[80px]">
              <p className="font-bold">{to?.company_name}</p>
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
                <th className="w-1/5 border border-gray-300 p-1">Purchaser</th>
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
                <td className="border border-gray-300 p-1">{invoice?.purchase_order?.expected_delivery_date ? formatDate(String(invoice.purchase_order.expected_delivery_date)) : "-"}</td>
                <td className="border border-gray-300 p-1">-</td>
                <td className="border border-gray-300 p-1">{formatDate(invoice?.due_date || "")}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Main Items Table */}
        <div className="w-full mb-6">
          <table className="w-full table-text border-collapse">
            <thead className="bg-gray-100 font-bold">
              <tr>
                <th className="border border-gray-300 p-2 text-left w-24">ID</th>
                <th className="border border-gray-300 p-2 text-left">Item Name & Specification</th>
                <th className="border border-gray-300 p-2 text-right w-20">Price</th>
                <th className="border border-gray-300 p-2 text-center w-16">Qty</th>
                <th className="border border-gray-300 p-2 text-right w-20">Discount</th>
                <th className="border border-gray-300 p-2 text-right w-24">Pretax Amt</th>
                <th className="border border-gray-300 p-2 text-right w-20">Tax</th>
                <th className="border border-gray-300 p-2 text-right w-24">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice?.purchase_order?.items?.map((item: any) => {
                const price = Number(item.unit_cost || 0);
                const qty = Number(item.quantity || 0);
                const discount = Number(item.discount || 0);
                const pretaxAmt = Number(item.line_total || (price * qty - discount)); // Fallback if line_total is pre-tax
                const tax = Number(item.tax_amount || 0);
                const itemTotal = pretaxAmt + tax;

                return (
                  <tr key={item.id} className="align-top">
                    <td className="border border-gray-300 p-2">{item.product?.sku}</td>
                    <td className="border border-gray-300 p-2">
                      <div className="font-bold">{item.product?.name}</div>
                      {(item.product?.specification || item.specification) && (
                        <div className="italic text-[10px] text-gray-500 mt-1">
                          {item.product?.specification || item.specification}
                        </div>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2 text-right">{price.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-center">{qty.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right">{discount.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right">{pretaxAmt.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right">{tax.toFixed(2)}</td>
                    <td className="border border-gray-300 p-2 text-right font-bold">{itemTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
              {/* Grand Total Row inside Table */}
              <tr className="bg-gray-50 font-bold">
                <td colSpan={7} className="border border-gray-300 p-2 text-center uppercase tracking-wider">Grand Total</td>
                <td className="border border-gray-300 p-2 text-right">{total}</td>
              </tr>
              {/* Fill remaining space if needed to match PDF height (optional) */}
              {[...Array(Math.max(0, 5 - (invoice?.purchase_order?.items?.length || 0)))].map((_, i) => (
                <tr key={`empty-${i}`} className="h-8">
                  <td className="border border-gray-300 p-2"></td>
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
          <div className="w-3/5 border border-gray-300 p-2 rounded-sm details-text">
            <p className="font-bold mb-1">Note:</p>
            <p>All Cheques should be crossed and made payable to</p>
            <p className="font-bold uppercase">{to?.company_name || "F&Z GLOBAL TRADE (M) SDN BHD"}</p>
            <p>Account Number: <span className="font-bold">564230815279</span> (Maybank Berhad)</p>
          </div>

          <div className="w-1/3">
            <table className="w-full details-text font-bold border-collapse">
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
                  <td className="p-1 px-4 text-left border-r border-gray-300">GST</td>
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
