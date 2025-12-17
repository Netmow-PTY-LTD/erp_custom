
import type { Department } from "./types";

export interface Staff {
  address: string;
  id: number;
  employeeId: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department_id: number;
  department: Department | null;
  position: string;
  status: "active" | "terminated" | "on_leave"; 
  hire_date: string; 
  salary: number;
  thumb_url?: string;
  gallery_items?: string[];
}