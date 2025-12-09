
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
  cost: number;
  initial_stock: number;          // API returns "1000.00" → string
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
  operation: string;
  quantity: number;
  product_id: number;
};

export type StockMovement = {
  id: number;
  name: string;
  product_id: number;
  movement_type: string; // you can restrict further if API is fixed
  quantity: number;
  reference_type: string;
  reference_id: number | null;
  date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
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
