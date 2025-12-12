


export interface POItem {
  id: number;
  purchase_order_id: number;
  product_id: number;
  quantity: number;
  unit_cost: number;
  line_total: number;
  created_at: string;
  updated_at: string;
}




export interface PurchaseOrder {
  created_by: number;
  updated_at: string;
  notes: string | undefined;
  order_date: string | undefined;
  expected_delivery_date: string | undefined;
  id: number;
  po_number: string;
  supplier_id: number;
  total_amount: number;
  status: "pending" | "approved" | "rejected" | "delivered";
  created_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: POItem |any ; 
}