

export interface SalesRoute {
  id: number;

  route_name: string;
  description?: string | null;

  assigned_sales_rep_id?: number | null;

  start_location?: string | null;
  end_location?: string | null;

  is_active: boolean;

  created_at: string;   // ISO date string
  updated_at: string;   // ISO date string
}
