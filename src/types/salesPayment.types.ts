
export interface SalesPayment {
  _id?: string;
  paymentNo?: string;
  orderId?: string;
  invoiceId?: string;
  customerId: string;
  amount: number;
  paymentMethod: "cash" | "card" | "bank" | "mobile" | "cheque";
  transactionId?: string;
  paymentDate: string;      // ISO date
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
