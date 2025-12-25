import type { Supplier } from "./supplier.types";
import type { Product } from "./types";



export interface POItem {
  id: number;
  purchase_order_id: number;
  product_id: number;
  quantity: number;
  unit_cost: number;
  line_total: number;
  product: Product;
  discount: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  purchase_tax:number
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
  supplier: Supplier;
  total_amount: number;
  tax_amount: number;
  discount_amount: number;
  net_amount: number;
  total_payable_amount: number;
  paid_amount: number;
  status: "pending" | "approved" | "rejected" | "delivered";
  created_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: POItem |any ; 
}







export interface Coordinates {
  lat: number | null;
  lng: number | null;
}

export interface PurchaseOrderLocation {
  id: number;
  po_number: string;
  status: "pending" | "approved" | "received" | "delivered" | "rejected";
  total_amount: number;
  order_date: string; // ISO string
  expected_delivery_date: string; // ISO string
  supplier: Supplier;
  coordinates: Coordinates;
}


