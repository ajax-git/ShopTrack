import React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
 
export function AccordionAlwaysOpen() {
  const [open, setOpen] = React.useState(0);
  const [alwaysOpen, setAlwaysOpen] = React.useState(true);
 
  const handleAlwaysOpen = () => setAlwaysOpen((cur) => !cur);
  const handleOpen = (value: any) => setOpen(open === value ? 0 : value);
 
  return (
    <>
      <Accordion open={alwaysOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <AccordionHeader onClick={handleAlwaysOpen} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>What is Material Tailwind?</AccordionHeader>
        <AccordionBody>
          We&apos;re not always in the position that we want to be at. We&apos;re constantly
          growing. We&apos;re constantly making mistakes. We&apos;re constantly trying to express
          ourselves and actualize our dreams.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 1} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <AccordionHeader onClick={() => handleOpen(1)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          How to use Material Tailwind?
        </AccordionHeader>
        <AccordionBody>
          We&apos;re not always in the position that we want to be at. We&apos;re constantly
          growing. We&apos;re constantly making mistakes. We&apos;re constantly trying to express
          ourselves and actualize our dreams.
        </AccordionBody>
      </Accordion>
      <Accordion open={open === 2} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
        <AccordionHeader onClick={() => handleOpen(2)} placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          What can I do with Material Tailwind?
        </AccordionHeader>
        <AccordionBody>
          We&apos;re not always in the position that we want to be at. We&apos;re constantly
          growing. We&apos;re constantly making mistakes. We&apos;re constantly trying to express
          ourselves and actualize our dreams.
        </AccordionBody>
      </Accordion>
    </>
  );
}