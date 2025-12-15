// types/purchaseInvoice.types.ts

export type InvoiceStatus =
  | "draft"
  | "pending"
  | "paid"
  | "cancelled"
  | "overdue";




export type PurchaseInvoice = {
  id: number;
  invoice_number: string;
  purchase_order_id: number;
  total_amount: number;
  status:InvoiceStatus;
  invoice_date: string; // ISO string
  due_date: string; // ISO string
  created_by: number;
  created_at: string; // ISO string
  updated_at: string; // ISO string
};
