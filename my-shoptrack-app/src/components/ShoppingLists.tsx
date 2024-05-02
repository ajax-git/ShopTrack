import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLists, deleteList, pinList, unpinList } from '../api/shoptrackApi';
import { ShoppingList } from '../types';
import { format, isWithinInterval, addDays, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { pl } from 'date-fns/locale';
import { Alert, Spinner, IconButton } from '@material-tailwind/react';
import { MdPushPin } from 'react-icons/md';

interface ShoppingListsProps {
  searchTerm: string;
}

const ShoppingLists: React.FC<ShoppingListsProps> = ({ searchTerm }) => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        const fetchedLists = await getLists();
        setLists(fetchedLists);
      } catch (error) {
        toast.error('Problem z pobraniem list zakupów.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, []);

  const handleDeleteList = async () => {
    if (deleteItemId) {
      await deleteList(deleteItemId);
      const updatedLists = lists.filter(list => list.id !== deleteItemId);
      setLists(updatedLists);
      setShowModal(false);
      setDeleteItemId(null);
      toast.info(`Lista została pomyślnie usunięta.`);
    }
  };

  const isUpcoming = (deadline: string | undefined) => {
    if (!deadline) return false;
    const deadlineDate = parseISO(deadline);
    const today = new Date();
    const nextWeek = addDays(today, 2);
    return isWithinInterval(deadlineDate, { start: today, end: nextWeek });
  };

  const handlePinList = async (listId: number) => {
    await pinList(listId);
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return { ...list, pinned: true };
      }
      return list;
    });
    toast.success(`Lista została pomyślnie przypięta.`);
    setLists(updatedLists);
  };

  const handleUnpinList = async (listId: number) => {
    await unpinList(listId);
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        return { ...list, pinned: false };
      }
      return list;
    });
    toast.error(`Lista została pomyślnie odpięta.`);
    setLists(updatedLists);
  };

  const getUpcomingDeadlineText = (deadline: string | undefined) => {
    if (!deadline) return '';

    const deadlineDate = parseISO(deadline);
    const today = new Date();
    const totalDuration = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (totalDuration <= 0) {
      return <span className="text-red-500">Termin realizacji minął.</span>;
    } else {
      return <span className="text-green-500">Zostało {totalDuration} dni do realizacji.</span>;
    }
  };

  const filteredLists = lists.filter(list =>
    list.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><Spinner className="h-12 w-12" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} /></div>;
  }

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {filteredLists.length === 0 ? (
        <Alert icon={<MdPushPin />}>Nie znaleziono żadnych list zakupów.</Alert>
      ) : (
        filteredLists
          .sort((a, b) => Number(b.pinned) - Number(a.pinned))
          .map(list => {
            return (
              <div key={list.id} className={`relative flex flex-col text-gray-700 ${list.pinned ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white'} shadow-md w-96 rounded-xl bg-clip-border ${isUpcoming(list.deadline) ? 'border-l-4 border-blue-500' : ''}`}>
                <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
                  <div role="button" className="flex items-center justify-between w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                    <Link to={`/list/${list.id}`} className="flex items-center">
                      <div className="grid mr-4 place-items-center">
                        <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                      </div>
                      <div>
                        <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                          {list.title}
                        </h6>
                        <h2 className="block font-sans text-base antialiased leading-relaxed tracking-normal text-blue-gray-900">
                          {list.notes}
                        </h2>
                        <p className="block font-sans text-sm antialiased font-normal leading-normal text-gray-700">
                          {list.deadline && getUpcomingDeadlineText(list.deadline)}
                        </p>
                      </div>
                    </Link>
                    <div className="flex items-center justify-start space-x-2">
                      {list.pinned ? (
                        <IconButton variant="text" color="blue-gray" onClick={() => handleUnpinList(list.id)} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} placeholder={undefined}>
                          <MdPushPin className="h-6 w-6 blue-gray-500" />
                        </IconButton>
                      ) : (
                        <IconButton variant="text" color="blue-gray" onClick={() => handlePinList(list.id)} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} placeholder={undefined}>
                          <MdPushPin className="h-6 w-6 blue-gray-500" />
                        </IconButton>
                      )}
                      <IconButton variant="text" color="blue-gray" onClick={() => {
                        setDeleteItemId(list.id);
                        setShowModal(true);
                      } } onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} placeholder={undefined}>
                        <svg className="h-6 w-6 blue-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </IconButton>
                    </div>
                  </div>
                </nav>
              </div>
            );
          })
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-1/2 p-8 rounded-lg shadow-lg"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
            >
              <p className="text-lg font-semibold mb-4">Czy na pewno chcesz usunąć tę listę zakupów?</p>
              <div className="flex justify-end">
                <button
                  onClick={handleDeleteList}
                  className="px-4 py-2 bg-red-500 text-white rounded-md mr-4 hover:bg-red-600"
                >
                  Usuń
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Anuluj
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShoppingLists;