export interface SalesInvoiceItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface SalesInvoice {
  _id?: string;
  invoiceNo: string;
  orderId: string;
  customerId: string;
  invoiceDate: string;         // ISO date string
  dueDate?: string;
  items: SalesInvoiceItem[];
  subTotal: number;
  tax?: number;
  discount?: number;
  grandTotal: number;
  paymentStatus: "unpaid" | "partial" | "paid";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
