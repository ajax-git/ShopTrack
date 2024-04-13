import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getListItems, addListItem, deleteItem, markItemAsPurchased } from '../api/shoptrackApi';
import { ShoppingItem } from '../types';
import { Button, IconButton, Input, Select, Option as TailwindOption } from "@material-tailwind/react";
import { toast } from 'react-toastify';
import { Alert, List, ListItem } from "@material-tailwind/react";

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path
      fillRule="evenodd"
      d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
      clipRule="evenodd"
    />
  </svg>
);

const PurchaseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-5 w-5"
  >
    <path d="M12 4a8 8 0 100 16 8 8 0 000-16zm4.293 5.293l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L11 12.586l4.293-4.293a1 1 0 011.414 1.414z" />
  </svg>
);

interface Product {
  id: number;
  name: string;
}

const ShoppingListDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [error, setError] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } 
    
    const fetchItems = async () => {
      try {
        const listItems = await getListItems(parseInt(id!));
        setItems(sortItems(listItems));
      } catch (error) {
        setError((error as Error).message)
      }
    };

    fetchItems();
  }, [id]);

  const sortItems = (itemsToSort: ShoppingItem[]) => {
    return itemsToSort.sort((a, b) => {
      let compareValue = 0;

      if (sortBy === 'name') {
        compareValue = a.name.localeCompare(b.name);
      } else if (sortBy === 'quantity') {
        compareValue = a.quantity - b.quantity;
      } else if (sortBy === 'purchased') {
        compareValue = (a.is_purchased ? 1 : 0) - (b.is_purchased ? 1 : 0);
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    
    const updatedProducts = [...products];
    if (!updatedProducts.some(product => product.name === newItemName)) {
      const newProduct = { id: updatedProducts.length + 1, name: newItemName };
      updatedProducts.push(newProduct);

      localStorage.setItem('products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    }

    const newItem = await addListItem(parseInt(id!), newItemName, newItemQuantity);
    setItems(currentItems => [...currentItems, newItem]);
    setNewItemName('');
    setNewItemQuantity(1);

    toast.info(`Dodałeś produkt ${newItemName} do listy.`);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDeleteItem = async (itemId: number) => {
    await deleteItem(itemId);
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));

    toast.error(`Usunąłeś produkt z listy.`);
  };

  const handleMarkItemAsPurchased = async (itemId: number) => {
    await markItemAsPurchased(itemId);
    setItems(currentItems => currentItems.map(item => item.id === itemId ? { ...item, is_purchased: true } : item));

    toast.success(`Oznaczyłeś produkt jako zakupiony.`);
  };

  const [forceUpdateKey, setForceUpdateKey] = useState(0);

  const handleProductChange = (value: string | undefined) => {
    if (value) {
      setNewItemName(value);
      setForceUpdateKey(prevKey => prevKey + 1);
    }
  };

  return (
  <div className="p-4">
    <h4 className="block mb-2 font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
      Dodaj nowy produkt do listy
    </h4>
  <div className="mt-4 flex gap-x-2">
    <Select key={forceUpdateKey} label="Ostatnie produkty" onChange={handleProductChange} value={newItemName} placeholder="Ostatnie produkty" className="border rounded px-2 py-1" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
      {products.map((product) => (
        <TailwindOption key={product.id} value={product.name}>{product.name}</TailwindOption>
      ))}
    </Select>
    <div className="flex gap-x-2">
      <Input
              label="Nazwa produktu"
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Nazwa produktu"
              required 
              onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}    />
      <Input
              label="Ilość"
              type="number"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(parseInt(e.target.value))}
              placeholder="Ilość"
              min="1"
              required 
              onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} crossOrigin={undefined}    />
      <button
    className="flex items-center gap-2 px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none hover:bg-gray-900/10 active:bg-gray-900/20"
    type="button"
    onClick = {handleAddItem}
    >
      Dodaj{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </button>
        </div>
    </div>
    <br />
    <div className="flex items-center space-x-2">
      <div className="relative h-10 w-72 min-w-[250px]">
        <select
          className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
        >
          <option value="name">Nazwa</option>
          <option value="quantity">Ilość</option>
          <option value="purchased">Kupiony</option>
        </select>
        <label
          className="pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
        >
          Sortuj według:
        </label>
      </div>
        <button
              className="px-6 py-3 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none hover:bg-gray-900/10 active:bg-gray-900/20 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
              onClick={handleSortOrderChange}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
      <br />
      {error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <List className="space-y-4" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          {items.length === 0 ? (
            <Alert>Nie znaleziono żadnych produktów na liście.</Alert>
          ) : (
            sortItems(items).map(item => (
              <ListItem
                key={item.id}
                className={`border rounded p-4 flex justify-between items-center ${item.is_purchased ? 'bg-green-100' : ''}`} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}              >
                <div>
                  <p className="font-semibold">{item.name}
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-100 bg-gray-600 rounded-full">
                    {item.quantity}
                    </span>
                  </p>
                </div>
                <div className="space-x-2">
                  <IconButton variant="text" color="blue-gray" onClick={() => handleMarkItemAsPurchased(item.id)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <PurchaseIcon />
                  </IconButton>
                  <IconButton variant="text" color="blue-gray" onClick={() => handleDeleteItem(item.id)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
                    <TrashIcon />
                  </IconButton>
                </div>
              </ListItem>
            ))
          )}
        </List>
      )}
     </div>
  );
};

export default ShoppingListDetails;
