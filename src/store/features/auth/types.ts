// User details returned from the backend
export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

// Request payload for login
export interface LoginRequest {
  email: string;
  password: string;
}

// Response returned by the login API
export interface LoginResponse {
  user: User;
  token: string;
}

// Auth slice state shape
export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}