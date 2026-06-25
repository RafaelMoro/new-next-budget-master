import {
  Avatar,
  CheckIcon,
  ListGroup,
  ListGroupItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow
} from "flowbite-react";
import { RiCloseLine, RiPencilLine, RiDeleteBinFill } from "@remixicon/react";

import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { IndebtedPeopleUI } from "@/shared/types/records.types";

interface ShowIndebtedPeopleProps {
  indebtedPeople: IndebtedPeopleUI[]
  openEditModal: (person: IndebtedPeopleUI) => void
  removePerson: (name: string) => void
}

export const ShowIndebtedPeople = ({ indebtedPeople, openEditModal, removePerson }: ShowIndebtedPeopleProps) => {
  const { isMobile } = useMediaQuery()

  if (isMobile) {
    return (
      <div data-testid="show-indebted-people-list">
        <ListGroup>
          { indebtedPeople.map((person) => (
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

  return (
    <div data-testid="show-indebted-people-table" className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>Persona</TableHeadCell>
            <TableHeadCell className="px-4">Debe</TableHeadCell>
            <TableHeadCell className="px-4">Ha pagado</TableHeadCell>
            <TableHeadCell className="px-4">Resta</TableHeadCell>
            <TableHeadCell className="px-2">Pagado</TableHeadCell>
            <TableHeadCell className="px-2">
              <span className="sr-only">Acciones</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {
            indebtedPeople.map((person) => (
            <TableRow key={person.name} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {person.name}
              </TableCell>
              <TableCell className="px-4">{person.amountFormatted}</TableCell>
              <TableCell className="px-4">{person.amountPaidFormatted}</TableCell>
              <TableCell className="px-4">{person.remainingAmountFormatted}</TableCell>
              <TableCell className="px-2">
                { person.isPaid ? (<CheckIcon />) : (<RiCloseLine />) }
              </TableCell>
              <TableCell className="px-2">
                <button aria-label="Edit person" onClick={() => openEditModal(person)} className="cursor-pointer mr-3">
                  <RiPencilLine />
                </button>
                <button aria-label="Remove person" onClick={() => removePerson(person.name)} className="cursor-pointer">
                  <RiDeleteBinFill />
                </button>
              </TableCell>
            </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}