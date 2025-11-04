import { IndebtedPeople as IndebtedPeopleType, IndebtedPeopleUI } from "@/shared/types/records.types"
import { IndebtedPeopleSection } from "./IndebtedPeopleSection"
import { IndebtedPeopleModal } from "./IndebtedPeopleModal"
import { ShowIndebtedPeople } from "./ShowIndebtedPeople"

interface IndebtedPeopleProps {
  indebtedPeople: IndebtedPeopleUI[]
  openModal: boolean
  toggleModal: () => void
  openEditModal: (person: IndebtedPeopleUI) => void
  addIndebtedPerson: (newIndebtedPerson: IndebtedPeopleType) => void
  updateIndebtedPerson: (editPerson: IndebtedPeopleType) => void
  removePerson: (name: string) => void
  validatePersonExist: (name: string) => boolean
  editPerson: IndebtedPeopleUI | null
}

/**
 * This component wraps the section, the modal and the list of table of indebted people.
 * This component is meant to be used with the custom hook useIndebtedPeople.
 */
export const PersonalDebtManager = ({
  indebtedPeople,
  openModal,
  editPerson,
  toggleModal,
  openEditModal,
  addIndebtedPerson,
  updateIndebtedPerson,
  validatePersonExist,
  removePerson,
}: IndebtedPeopleProps) => {
  return (
    <IndebtedPeopleSection
      indebtedPeople={indebtedPeople}
      toggleModal={toggleModal}
      showIndebtedPeople={<ShowIndebtedPeople removePerson={removePerson} openEditModal={openEditModal} indebtedPeople={indebtedPeople} />}
    >
      <IndebtedPeopleModal
        openModal={openModal}
        toggleModal={toggleModal}
        addIndebtedPerson={addIndebtedPerson}
        validatePersonExist={validatePersonExist}
        updateIndebtedPerson={updateIndebtedPerson}
        editPerson={editPerson}
      />
    </IndebtedPeopleSection>
  )
}