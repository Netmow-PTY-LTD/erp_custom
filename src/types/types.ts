
export type Department = {
  id: number;
  name: string;
  description: string;
}

export type Category = {
  id: number;
  name: string;
  description?: string;
  parent_id?: number | null;
  is_active: boolean;
}
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
  id: number;
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
  id: number;
  paymentNumber: string;
  customer: string;
  customerId: string;
  invoiceNumber: string;
  paymentDate: string;
  method: "Cash" | "Bank Transfer" | "Credit Card";
  amount: number;
  reference: string;
};

export type WarehouseOrder = {
  orderId: string;
  customer: string;
  total: number;
  date: string;
  status: "confirmed";
};

export interface DeliveryOrder {
  id: number;
  orderNumber: string;
  customer: string;
  total: number;
  date: string;
  status: string;
}

export interface SalesRoute {
  id: number;
  name: string;
  description: string;
  staff: number;
  customers: number;
}

export interface Staff {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  department: string | null; // "-" values can be treated as null
  position: string;
  status: "Active" | "On Leave" | "Inactive"; // restrict to known statuses
  hireDate: string; // could use Date if you want to parse it
}
