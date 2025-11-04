import { ExpensePaid } from "@/shared/types/records.types";
import { ListGroup, ListGroupItem } from "flowbite-react";

interface ExpensePaidListProps {
  expenses: ExpensePaid[];
}

/**
 * This component is to show the expenses paid list in the record preview drawer
 */
export const ExpensePaidList = ({ expenses }: ExpensePaidListProps) => {
  return (
    <ListGroup>
      { expenses.map((expense) => (
        <ListGroupItem className="max-w-screen" key={expense._id}>
          <div className="w-full grid grid-cols-2 grid-rows-2 gap-2">
            <p className="text-xs text-gray-600 dark:text-gray-400 col-span-2">{expense.fullDate}</p>
            <h5 className="text-start text-base">{expense.shortName}</h5>
            <p className="place-self-center text-red-500">- {expense.amountFormatted}</p>
          </div>
        </ListGroupItem>
      )) }
    </ListGroup>
  )
}