import { useAppSelector } from "@/store/store";
import type { RootState } from "@/store/store";
import type { PurchaseOrder } from "@/types/purchaseOrder.types";
import type { Settings } from "@/types/types";

interface Props {
  purchase: PurchaseOrder;
  settings: Settings | undefined;
}

export default function PrintablePurchaseOrder({ purchase, settings }: Props) {
  const currency = useAppSelector((state: RootState) => state.currency.value) || "RM";
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const date = new Date(dateStr);
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    } catch (e) {
      return dateStr.split("T")[0];
    }
  };

  // Calculations
  const subtotal = Number(purchase.total_amount || 0);
  const discount = Number(purchase.discount_amount || 0);
  const taxAmount = Number(purchase.tax_amount || 0);
  const total = Number(purchase.total_payable_amount).toFixed(2);

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
              {settings?.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="h-16 object-contain" />
              ) : (
                <div className="w-16 h-16 rounded-full border-2 border-[#4CAF50] flex items-center justify-center text-[#4CAF50] font-bold text-sm overflow-hidden">
                  F&Z
                </div>
              )}
            </div>
            <div className="self-end">
              <h2 className="font-bold text-black text-xl md:text-3xl tracking-wide print-title">Purchase Order</h2>
            </div>
          </div>

          {/* Bottom Row: Company Info & PO Details */}
          <div className="flex flex-col sm:flex-row justify-start items-start gap-4 sm:gap-10 mt-2">
            {/* Left Box: Company Info */}
            <div className="flex flex-col gap-1 text-[13px] w-full sm:w-1/2">
              <h1 className="font-bold company-name">{settings?.company_name || "F&Z Global Trade (M) Sdn Bhd"}</h1>
              <p className="leading-tight max-w-[400px] whitespace-pre-line">
                {settings?.address || "45, Jalan Industri USJ 1/10,\nTMN Perindustrian USJ 1, Subang Jaya"}
              </p>
              <p>T: {settings?.phone || "0380112772"}{settings?.email && `, E: ${settings.email}`}</p>
            </div>

            {/* Right Box: PO Details */}
            <div className="flex flex-col w-full sm:w-1/2 details-text sm:text-left sm:items-start">
              <div className="flex w-full sm:w-auto text-left">
                <span className="font-bold">Date</span>
                <span className="w-4 text-center">:</span>
                <span className="flex-1 sm:flex-none">{formatDate(purchase.order_date || "")}</span>
              </div>
              <div className="flex w-full sm:w-auto text-left mt-1">
                <span className="font-bold">PO No.</span>
                <span className="w-4 text-center">:</span>
                <span className="flex-1 sm:flex-none uppercase">{purchase.po_number}</span>
              </div>
              <div className="flex w-full sm:w-auto text-left mt-1">
                <span className="font-bold">Status</span>
                <span className="w-4 text-center">:</span>
                <span className="flex-1 sm:flex-none uppercase">{purchase.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recipient Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-5 mb-6">
          <div className="border border-gray-300 break-inside-avoid">
            <div className="bg-gray-100 px-3 py-1 font-bold details-text border-b border-gray-300">Vendor</div>
            <div className="p-3 details-text min-h-[80px]">
              <p className="font-bold">{purchase.supplier.name}</p>
              <p className="whitespace-pre-line">{purchase.supplier.address}</p>
              {purchase.supplier.phone && <p>T: {purchase.supplier.phone}</p>}
              {purchase.supplier.email && <p>E: {purchase.supplier.email}</p>}
            </div>
          </div>
          <div className="border border-gray-300 break-inside-avoid">
            <div className="bg-gray-100 px-3 py-1 font-bold details-text border-b border-gray-300">Ship To</div>
            <div className="p-3 details-text min-h-[80px]">
              <p className="font-bold">{settings?.company_name}</p>
              <p className="whitespace-pre-line">{settings?.address}</p>
              {settings?.phone && <p>T: {settings.phone}</p>}
              {settings?.email && <p>E: {settings.email}</p>}
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="w-full mb-6 text-xs table-border border-collapse overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px] sm:min-w-full">
            <thead>
              <tr className="bg-gray-100 text-center font-bold">
                <th className="w-1/4 border border-gray-300 p-1">Purchaser</th>
                <th className="w-1/4 border border-gray-300 p-1">Ship Mode</th>
                <th className="w-1/4 border border-gray-300 p-1">Delivery Date</th>
                <th className="w-1/4 border border-gray-300 p-1">Payment Terms</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center">
                <td className="border border-gray-300 p-1">{purchase.creator?.name || "-"}</td>
                <td className="border border-gray-300 p-1">-</td>
                <td className="border border-gray-300 p-1">{purchase.expected_delivery_date ? formatDate(purchase.expected_delivery_date) : "-"}</td>
                <td className="border border-gray-300 p-1">-</td>
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
              {purchase.items?.map((item: any, index: number) => {
                const price = Number(item.unit_cost || 0);
                const qty = Number(item.quantity || 0);
                const discount = Number(item.discount || 0);
                const rowTotal = (price * qty) - discount;

                return (
                  <tr key={item.id} className="align-top">
                    <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{item.product?.sku}</td>
                    <td className="border border-gray-300 p-2">
                       <span className="font-bold uppercase">{item.product?.name}</span>
                        {(item.product?.specification) && (
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
                <td colSpan={6} className="border border-gray-300 p-2 text-center uppercase tracking-wider">Grand Total</td>
                <td className="border border-gray-300 p-2 text-right">{(subtotal - discount).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Summary Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 w-full">
          {/* Note section */}
          <div className="w-full sm:w-[38%] border border-gray-300 p-2 rounded-sm details-text">
            <p className="font-bold mb-1 border-b-[1px] border-gray-200 pb-1">Notes:</p>
            <p className="whitespace-pre-line">{purchase.notes || "-"}</p>
          </div>

          {/* QR Code (Centered) */}
          {settings?.qr_code && (
            <div className="flex flex-col items-center justify-center min-w-[100px] self-center">
              <div className="flex flex-col items-center justify-center rounded-sm bg-white">
                <img
                  src={settings?.qr_code}
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
                  <td className="p-1 px-4 text-right">{currency} {(subtotal).toFixed(2)}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="p-1 px-4 text-left border-r border-gray-300 w-1/2 uppercase">Discount</td>
                  <td className="p-1 px-4 text-right"> - {currency} {discount.toFixed(2)}</td>
                </tr>
                <tr className="border border-gray-300">
                  <td className="p-1 px-4 text-left border-r border-gray-300 w-1/2 uppercase">Tax</td>
                  <td className="p-1 px-4 text-right">{currency} {taxAmount.toFixed(2)}</td>
                </tr>
                <tr className="border border-gray-300 bg-gray-50 text-base">
                  <td className="p-1 px-4 text-left border-r border-gray-300 w-1/2 uppercase tracking-wider">Total</td>
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
