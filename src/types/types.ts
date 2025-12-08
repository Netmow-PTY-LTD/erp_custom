
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

export type Unit = {
  id: number;
  name: string;
  symbol: string;
  is_active: boolean;
}

export type Product = {
  id: number;
  name: string;
  sku: string;
  description: string;
  category_id: number;
  unit_id: number;
  price: number;            // API returns "1500.00" → string
  cost: number;             // API returns "1000.00" → string
  stock_quantity: number;
  min_stock_level: number;
  max_stock_level: number;
  weight: number;
  width: number;
  height: number;
  length: number;
  barcode: string | null;
  thumb_url: string;
  gallery_items: string[];
  is_active: boolean;
  // Nested relationship
  category: Category; 
  unit: Unit; // In case category is missing
};

export type Stock = {
  total_products: number;
  low_stock_count: number;
  total_stock_value: number | string;
  low_stock_products: number;
};

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
  first_name: string;
  last_name: string;
  email: string;
  department: string | null; // "-" values can be treated as null
  position: string;
  status: "Active" | "On Leave" | "Inactive"; // restrict to known statuses
  hireDate: string; // could use Date if you want to parse it
}
