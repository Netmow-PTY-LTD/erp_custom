import type { SalesOrder } from "./salesOrder.types";
import type { Payment } from "./types";



export interface SalesInvoice {
  id: number;
  invoice_number: string;
  order_id: number;
  invoice_date: string; // ISO date string
  due_date: string; // ISO date string
  total_amount: string; // numeric string
  status: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  order: SalesOrder;
  payments: Payment[]
}


// -------------------- Invoice Create Payload --------------------
export interface InvoiceCreatePayload {
  order_id: number;
  due_date: string; // "YYYY-MM-DD" format
}