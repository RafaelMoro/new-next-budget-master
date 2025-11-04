import { useEffect, useState } from "react"
import { Avatar, ListGroup, ListGroupItem } from "flowbite-react"

import { IndebtedPeople, IndebtedPeopleUI } from "@/shared/types/records.types"
import { formatNumberToCurrency } from "@/shared/utils/currency.utils"

interface IndebtedPeoplePreviewRecordProps {
  indebtedPeople: IndebtedPeople[]
}

export const IndebtedPeoplePreviewRecord = ({ indebtedPeople }: IndebtedPeoplePreviewRecordProps) => {
  const [indebtedPeopleUI, setIndebtedPeopleUI] = useState<IndebtedPeopleUI[]>([])

  useEffect(() => {
    const updatedIndebtedPeopleUI: IndebtedPeopleUI[] = indebtedPeople.map((person) => ({
      ...person,
      amountFormatted: formatNumberToCurrency(person.amount),
      amountPaidFormatted: formatNumberToCurrency(person.amountPaid),
      remainingAmountFormatted: formatNumberToCurrency(person.amount - person.amountPaid)
    }))
    setIndebtedPeopleUI(updatedIndebtedPeopleUI)
  }, [indebtedPeople])

  return (
    <div data-testid="show-indebted-people-list">
      <ListGroup>
        { indebtedPeopleUI.map((person) => (
          <ListGroupItem key={person.name}>
            <div className="w-full grid grid-cols-[min-content_1fr_1fr] grid-rows-2 place-items-center gap-2">
              <Avatar className="justify-self-start row-span-2" placeholderInitials={person.name.charAt(0)} rounded />
              <p className="justify-self-start text-base place-self-end">{person.name}</p>
              { !person.isPaid && (
                <p className="text-xs justify-self-start place-self-start text-blue-400 row-start-2 row-end-3 col-start-2 col-end-3">
                  Restan - {person.remainingAmountFormatted}
                </p>
              )}
              { person.isPaid && (
                <p className="text-xs justify-self-start place-self-start text-green-400 row-start-2 row-end-3 col-start-2 col-end-3">
                  Pagado
                </p>
              )}
              <p className="text-red-600 justify-self-end row-span-2" >- {person.amountFormatted}</p>
            </div>
          </ListGroupItem>
        )) }
      </ListGroup>
    </div>
  )
}