
export interface PurchaseOrder {
  notes: string | undefined;
  order_date: string | undefined;
  expected_delivery_date: string | undefined;
  id: number;
  po_number: string;
  supplier_id: number;
  total_amount: string;
  status: "pending" | "approved" | "rejected" | "delivered";
  created_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[]; 
}