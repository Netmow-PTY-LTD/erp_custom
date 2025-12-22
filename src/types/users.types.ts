
export interface Role {
  id: number;
  role: string;
  display_name: string;
  description: string;
  status: string;
 permissions: string[]
}

export type User = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  status: any;
  id: number;
  name: string;
  email: string;
  role_id: number;
  role: Role;
  created_at: string; // or Date if you want: Date
};
