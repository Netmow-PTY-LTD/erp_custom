export type Order = {
  id: number;
  orderNumber: string;
  customer: string;
  customerId: string;
  date: string;
  dueDate: string | "-";
  status:
    | "Pending"
    | "Delivered"
    | "Confirmed"
    | "Processing"
    | "Draft"
    | "Shipped";
  amount: number;
  staff: string | "-";
};

export type Invoice = {
  invoiceNumber: string;
  customer: string;
  customerId: string;
  orderNumber: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  status: "Paid" | "Sent" | "Draft";
};

// Payment type
export type Payment = {
  paymentNumber: string;
  customer: string;
  customerId: string;
  invoiceNumber: string;
  paymentDate: string;
  method: "Cash" | "Bank Transfer" | "Credit Card";
  amount: number;
  reference: string;
};
