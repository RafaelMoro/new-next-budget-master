import { AccountModalAction, AccountsDisplay } from "@/shared/types/accounts.types"
import { Modal } from "flowbite-react"
import { AccountDetailsModal } from "./AccountDetailsModal"
import { EditAccountModal } from "./EditAccountModal"
import { DeleteAccountModal } from "./DeleteAccountModal"

interface AccountActionsModalProps {
  accDetails: AccountsDisplay | null
  openAccModal: boolean
  accAction: AccountModalAction | null
  closeModal: () => void
  updateAccAction: (acc: AccountModalAction) => void
}

export const AccountActionsModal = ({
  accDetails, closeModal, openAccModal, accAction, updateAccAction
}: AccountActionsModalProps) => {
  if (accDetails) {
    return (
      <Modal show={openAccModal} onClose={closeModal}>
      { accAction === 'view' && (
        <AccountDetailsModal
          account={accDetails}
          updateAccAction={updateAccAction}
        />
      )}
      { accAction === 'edit' && (
        <EditAccountModal
          account={accDetails}
          closeModal={closeModal}
          updateAccAction={updateAccAction}
        />
      )}

      { accAction === 'delete' && (
        <DeleteAccountModal
          account={accDetails}
          closeModal={closeModal}
          updateAccAction={updateAccAction}
        />
      )}
    </Modal>
    )
  }
  return null
}