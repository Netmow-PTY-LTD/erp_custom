
export type Role = {
  id: number;
  name: string;

};

export type User = {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role: Role;
  created_at: string; // or Date if you want: Date
};
