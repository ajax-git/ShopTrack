import { ShoppingList, ShoppingItem } from '../types';
import { toast } from 'react-toastify';
import { APIConfig, RegisterData, LoginResponse  } from '../types';

//const BASE_URL = 'http://localhost:5000';
const BASE_URL = 'https://ajax22.pl:5000';

const getToken = (): string | null => localStorage.getItem('token');

const fetchAPI = async <T>(url: string, config: APIConfig = {}): Promise<T> => {
  const token = getToken();
  const headers: HeadersInit = { 
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };

  const fetchConfig: RequestInit = {
    method: config.body ? 'POST' : 'GET',
    ...config,
    headers: {
      ...headers,
      ...config.headers,
    },
    body: config.body ? JSON.stringify(config.body) : undefined,
  };

  try {
    const response = await fetch(`${BASE_URL}${url}`, fetchConfig);
    const data = await response.json() as any;
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      const errorMessage = typeof data.message === 'string' ? data.message : 'An error occurred';
      throw new Error(errorMessage);
    }
    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Unknown error occurred');
    }
    throw error;
  }
};

export const getLists = (): Promise<ShoppingList[]> => fetchAPI('/lists');

export const addList = (title: string, deadline?: string, notes?: string): Promise<ShoppingList> => {
  return fetchAPI('/lists', { 
    body: { title, deadline, notes }, 
    method: 'POST' 
  });
};

export const getListItems = (listId: number): Promise<ShoppingItem[]> => fetchAPI(`/lists/${listId}/items`);

export const addListItem = (listId: number, name: string, quantity: number): Promise<ShoppingItem> => {
  return fetchAPI(`/lists/${listId}/items`, { 
    body: { name, quantity }, 
    method: 'POST' 
  });
};

export const deleteItem = (itemId: number): Promise<void> => fetchAPI(`/items/${itemId}`, { method: 'DELETE' });

export const markItemAsPurchased = (itemId: number): Promise<void> => {
  return fetchAPI(`/items/${itemId}/purchase`, { method: 'PATCH' });
};

export const deleteList = (listId: number): Promise<void> => fetchAPI(`/lists/${listId}`, { method: 'DELETE' });

export const pinList = (listId: number): Promise<void> => fetchAPI(`/lists/${listId}/pin`, { method: 'PATCH' });

export const unpinList = (listId: number): Promise<void> => fetchAPI(`/lists/${listId}/unpin`, { method: 'PATCH' });

export const registerUser = (data: RegisterData): Promise<void> => {
  return fetchAPI('/register', { body: data, method: 'POST' });
};

export const loginUser = (emailOrUsername: string, password: string): Promise<LoginResponse> => {
  return fetchAPI<LoginResponse>('/login', { 
    body: { login: emailOrUsername, password }, 
    method: 'POST' 
  });
};