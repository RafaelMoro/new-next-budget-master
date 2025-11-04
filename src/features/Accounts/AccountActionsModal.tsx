import { AccountModalAction, AccountsDisplay } from "@/shared/types/accounts.types"
import { Modal } from "flowbite-react"
import { AccountDetailsModal } from "./AccountDetailsModal"
import { EditAccountModal } from "./EditAccountModal"
import { DeleteAccount } from "./DeleteAccount"

interface AccountDialogProps {
  accDetails: AccountsDisplay | null
  openAccModal: boolean
  accAction: AccountModalAction | null
  closeModal: () => void
  updateAccAction: (acc: AccountModalAction) => void
}

export const AccountDialog = ({
  accDetails, closeModal, openAccModal, accAction, updateAccAction
}: AccountDialogProps) => {
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
        <DeleteAccount
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