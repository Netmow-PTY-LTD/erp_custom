export interface SalesRoute {
  id: number;
  route_name: string;
  description: string;
  assigned_sales_rep_id: number;
  start_location: string;
  end_location: string;
  is_active: boolean;
  created_at: string; 
  updated_at: string;
}