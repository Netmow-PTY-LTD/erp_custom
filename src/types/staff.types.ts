
import type { Department } from "./types";

export interface Staff {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  salary: number;
  position: string;
  department_id: number;
  hire_date: string; // or Date if you transform it
  status: "active" | "inactive" | string; // Restricted to known statuses
  thumb_url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gallery_items: string[] | any[]; 
  created_at: string;
  updated_at: string;
  department: Department;
  
  // Nullable fields
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  notes: string | null;
}