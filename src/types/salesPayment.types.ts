
import type { SalesInvoice } from "./salesInvoice.types";
import type { SalesOrder } from "./salesOrder.types";




export interface SalesPayment {
  id: number;
  invoice_id: number | null;
  order_id: number;
  amount: string;
  payment_date: string;
  payment_method: string;
  reference_number: string;
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  order: SalesOrder;
  invoice: SalesInvoice | null;
}