import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/tremor/AccordionTremor";
import { ReactNode } from "react";

interface FurtherDetailsAccordeonProps {
  children: ReactNode
}

export const FurtherDetailsAccordion = ({ children }: FurtherDetailsAccordeonProps) => {
  return (
    <Accordion type="single" collapsible>
    <AccordionItem value="item-1">
      <AccordionTrigger>Más detalles</AccordionTrigger>
      <AccordionContent>
        {children}
      </AccordionContent>
    </AccordionItem>
  </Accordion>

  )
}