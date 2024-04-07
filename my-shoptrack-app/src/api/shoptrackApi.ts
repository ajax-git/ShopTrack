import { ShoppingList, ShoppingItem } from '../types';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:5000';
const getToken = (): string | null => localStorage.getItem('token');

// Funkcja pobierająca listy zakupów z serwera
export const getLists = async (): Promise<ShoppingList[]> => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/lists`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });
  if (!response.ok) {
    throw new Error('Problem fetching lists');
  }
  return response.json();
};

// Funkcja dodająca nową listę zakupów na serwerze
// Funkcja dodająca nową listę zakupów na serwerze
export const addList = async (title: string, deadline?: string, notes?: string): Promise<ShoppingList> => {
  const token = getToken();
  const requestBody = {
    title,
    deadline,
    notes
  };
  
  const response = await fetch(`${BASE_URL}/lists`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error('Problem adding list');
  }

  return response.json();
};


// Funkcja pobierająca elementy z określonej listy zakupów z serwera
export const getListItems = async (listId: number): Promise<ShoppingItem[]> => {
  const token = localStorage.getItem('token');

  const response = await fetch(`${BASE_URL}/lists/${listId}/items`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Problem fetching list items');
  }
  return response.json();
};

// Funkcja dodająca nowy element do określonej listy zakupów na serwerze
export const addListItem = async (listId: number, name: string, quantity: number): Promise<ShoppingItem> => {
  const token = getToken();
  const response = await fetch(`${BASE_URL}/lists/${listId}/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ name, quantity }),
  });
  if (!response.ok) {
    throw new Error('Problem adding list item');
  }
  return response.json();
};

// Funkcja usuwająca określony element z listy zakupów na serwerze
export const deleteItem = async (itemId: number): Promise<void> => {
  const token = getToken();
  await fetch(`${BASE_URL}/items/${itemId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Funkcja oznaczająca określony element jako kupiony na serwerze
export const markItemAsPurchased = async (itemId: number): Promise<void> => {
  const token = getToken();
  await fetch(`${BASE_URL}/items/${itemId}/purchase`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Funkcja usuwająca określoną listę zakupów wraz z jej elementami na serwerze
export const deleteList = async (listId: number): Promise<void> => {
  const token = getToken();
  await fetch(`${BASE_URL}/lists/${listId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Funkcja przypinająca określoną listę zakupów na serwerze
export const pinList = async (listId: number): Promise<void> => {
  const token = getToken();
  await fetch(`${BASE_URL}/lists/${listId}/pin`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

// Funkcja odpinająca określoną listę zakupów na serwerze
export const unpinList = async (listId: number): Promise<void> => {
  const token = getToken();
  await fetch(`${BASE_URL}/lists/${listId}/unpin`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Funkcja tworzaca nowe konto w bazie danych
export const registerUser = async (registerData: RegisterData): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Nie udało się zarejestrować użytkownika.');
    }

  } catch (error) {
    toast.error((error as Error).message)
  }
};

interface LoginResponse {
  token: string;
}

export const loginUser = async (emailOrUsername: string, password: string): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: emailOrUsername, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Problem with login');
  }

  return response.json();
};