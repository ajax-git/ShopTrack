import React, { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { addList } from '../api/shoptrackApi';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Button, Input, Popover, PopoverHandler, PopoverContent, Textarea } from "@material-tailwind/react";
import { DayPicker } from "react-day-picker";

interface AddListFormProps {
  onListAdded: () => void;
}

const AddListForm: React.FC<AddListFormProps> = ({ onListAdded }) => {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = React.useState<Date>();
  const [notes, setNotes] = useState('');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !deadline) return;

    const formattedDeadline = format(deadline, "yyyy-MM-dd");

    await addList(title, formattedDeadline, notes);
    setTitle('');
    setDeadline(undefined);
    onListAdded();

    toast.info(`Pomyślnie utworzono nową listę: ${title}`);
  };

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className="p-4 bg-white rounded-lg shadow-md mb-8"
    >
      <h3 className="text-lg font-semibold mb-4">Dodaj nową listę zakupów</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nazwa listy"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Części do BMW E92"
          required crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}        />
        <Popover placement="bottom">
          <PopoverHandler>
            <Input
              label="Termin zakupów"
              readOnly
              value={deadline ? format(deadline, "PPP", { locale: pl }) : ""} crossOrigin={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}            />
          </PopoverHandler>
          <PopoverContent placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <DayPicker
              mode="single"
              selected={deadline}
              onSelect={setDeadline}
              locale={pl}
              disabled={{ before: today }}
            />
          </PopoverContent>
        </Popover>

        <Textarea 
        size="md" 
        label="Dodatkowe uwagi" 
        value={notes}
        maxLength={64}
        onChange={(e) => setNotes(e.target.value)}
        onPointerEnterCapture={undefined} 
        onPointerLeaveCapture={undefined} />

        <div className="flex flex-wrap justify-center gap-4">
          <Button className="flex items-center gap-3" type="submit" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            Zapisz
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddListForm;
