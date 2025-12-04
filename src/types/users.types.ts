
export type Role = {
  id: number;
  name: string;
  description: string;
  created_at?: string;
};


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
