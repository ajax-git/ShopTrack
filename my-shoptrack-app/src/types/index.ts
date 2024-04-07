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