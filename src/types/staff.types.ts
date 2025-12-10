// export type Staff = {
//   hire_date: string | undefined;
//   id: number;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   position: string;
//   department: string;
//   salary: number;
//   status: "active" | "inactive" | string; // You can expand if there are other statuses
//   created_at: string; // ISO date string
// };

export interface Staff {
  id: number;
  employeeId: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department: string | null;
  position: string;
  status: "active" | "terminated" | "on_leave"; 
  hire_date: string; 
  salary: number;
  thumb_url?: string;
  gallery_items?: string[];
}