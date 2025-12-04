export type PurchaseOrder = {
  id: string;
  supplierId: string;
  orderNumber: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[]; // you can type items properly if you have a structure
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};