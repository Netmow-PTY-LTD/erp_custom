

export type Supplier = {
  postal_code: string | undefined;
  state: string | undefined;
  code: string | undefined;
  id?: number; // optional for creation
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  payment_terms: string;
  is_active: boolean;
  created_at?: string; // optional, usually returned from API
  updated_at?: string; // optional
};
