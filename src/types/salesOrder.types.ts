


export interface SalesOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: string;      // decimal return as string
  total_price: string;     // decimal return as string
  created_at: string;      // ISO date
  updated_at: string;      // ISO date
}

export interface SalesOrder {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoice: any;
  due_date: string | number | Date;
  id: number;
  order_number: string;
  customer_id: number;
  order_date: string;          // ISO date
  status: "pending" | "confirmed" | "shipped" | "completed" | "cancelled" | string;
  total_amount: string;        // decimal
  tax_amount: string;          // decimal
  discount_amount: string;     // decimal
  shipping_address: string;
  billing_address: string | null;
  payment_status: "unpaid" | "partial" | "paid" | string;
  notes: string | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  items: SalesOrderItem[];
}






export interface SalesOrderFormValues {
  customer_id: number;
  shipping_address: string;
  items: {
    product_id: number;
    quantity: number;
    unit_price: number;
  }[];
}


