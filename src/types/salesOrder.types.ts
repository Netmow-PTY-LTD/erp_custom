export interface SalesOrderItem {
  productId: string;
  productName: string;
  sku?: string;
  quantity: number;
  price: number;
  discount?: number;
  total: number;
}

export interface SalesOrder {
  _id?: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  orderDate: string;          // ISO date string
  dueDate?: string;
  status: "pending" | "confirmed" | "shipped" | "completed" | "cancelled";
  items: SalesOrderItem[];
  subTotal: number;
  discount?: number;
  tax?: number;
  grandTotal: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
