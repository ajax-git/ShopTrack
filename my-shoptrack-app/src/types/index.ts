export interface ShoppingList {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  deadline?: string;
  pinned: boolean;
  notes?: string;
}

export interface ShoppingItem {
  list_id: number;
  name: string;
  quantity: number;
  is_purchased: boolean;
  id: number;
}

export interface APIConfig {
  method?: 'GET' | 'POST' | 'DELETE' | 'PATCH';
  body?: Record<string, any>;
  headers?: HeadersInit;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface FormData {
  name: string;
  email: string;
  password: string;
}

export interface ShoppingListsProps {
  searchTerm: string;
}