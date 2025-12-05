// export type PurchaseOrder = {
//   id: string;
//   supplierId: string;
//   orderNumber: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   items: any[]; // you can type items properly if you have a structure
//   totalAmount: number;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
// };



/* TYPE */
export interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  total_amount: string;
  status: "pending" | "approved" | "rejected" | "delivered";
  created_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[]; 
}