import type { Invoice, Order } from "./types";




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
  order: Order;
  invoice: Invoice | null;
}