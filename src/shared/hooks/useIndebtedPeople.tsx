import { useEffect, useState } from "react"
import { IndebtedPeople, IndebtedPeopleUI } from "../types/records.types"
import { formatNumberToCurrency } from "../utils/currency.utils"

/**
* This hook is meant to be used with component IndebtedPeopleModal
*/
export const useIndebtedPeople = () => {
  const [indebtedPeople, setIndebtedPeople] = useState<IndebtedPeople[]>([])
  const [editPerson, setEditPerson] = useState<IndebtedPeopleUI | null>(null)
  const [openIndebtedPeopleModal, setOpenIndebtedPeopleModal] = useState<boolean>(false)
  const [indebtedPeopleUI, setIndebtedPeopleUI] = useState<IndebtedPeopleUI[]>([])

  const toggleIndebtedPeopleModal = () => setOpenIndebtedPeopleModal((prev) => !prev)

  const addIndebtedPerson = (newIndebtedPerson: IndebtedPeople) => {
    setIndebtedPeople([...indebtedPeople, newIndebtedPerson])
  }

  const updateIndebtedPerson = (editPerson: IndebtedPeople) => {
    const filteredPeople = indebtedPeople.filter((person) => person.name.toLowerCase() !== editPerson.name.toLowerCase())
    const updatedPeople = [...filteredPeople, editPerson]

    setIndebtedPeople(updatedPeople)
    setEditPerson(null)
  }
  const updateIndebtedPeopleOnEdit = (newIndebtedPeople: IndebtedPeople[]) => {
    setIndebtedPeople(newIndebtedPeople)
  }

  const openEditModal = (person: IndebtedPeopleUI ) => {
    setEditPerson(person)
    toggleIndebtedPeopleModal()
  }

  const removePerson = (name: string) => {
    const filteredPeople = indebtedPeople.filter((person) => person.name.toLowerCase() !== name.toLowerCase())
    setIndebtedPeople(filteredPeople)
  }

  const validatePersonExist = (name: string): boolean => {
    return indebtedPeople.some((person) => person.name.toLowerCase() === name.toLowerCase())
  }

  useEffect(() => {
    const updatedIndebtedPeopleUI: IndebtedPeopleUI[] = indebtedPeople.map((person) => ({
      ...person,
      amountFormatted: formatNumberToCurrency(person.amount),
      amountPaidFormatted: formatNumberToCurrency(person.amountPaid),
      remainingAmountFormatted: formatNumberToCurrency(person.amount - person.amountPaid)
    }))
    setIndebtedPeopleUI(updatedIndebtedPeopleUI)
  }, [indebtedPeople])

  return {
    openIndebtedPeopleModal,
    toggleIndebtedPeopleModal,
    addIndebtedPerson,
    validatePersonExist,
    indebtedPeople,
    indebtedPeopleUI,
    editPerson,
    updateIndebtedPerson,
    updateIndebtedPeopleOnEdit,
    openEditModal,
    removePerson
  }
}