import { RiArrowDownSLine } from "@remixicon/react"
import { Button, Dropdown, DropdownItem } from "flowbite-react"

import { AccountTransfer } from "@/shared/types/accounts.types"
import { ErrorMessage } from "@/shared/ui/atoms/ErrorMessage"

interface TransferAccountsSelectorProps {
  isPending: boolean
  origin: AccountTransfer | null
  destination: AccountTransfer | null
  accountsFormatted: AccountTransfer[]
  destinationAccounts: AccountTransfer[]
  destinationError: string | null
  updateOrigin: (account: AccountTransfer) => void
  updateDestination: (account: AccountTransfer) => void
}

export const TransferAccountsSelector = ({
  origin,
  destination,
  isPending,
  destinationError,
  accountsFormatted,
  destinationAccounts,
  updateOrigin,
  updateDestination
}: TransferAccountsSelectorProps) => {
  return (
    <>
      <Dropdown label="" renderTrigger={() => (
        <Button disabled={isPending} data-testid="select-origin-dropdown-button" color="light">
          { isPending ? 'Cargando...' : `Origen: ${origin?.name}` }
          <RiArrowDownSLine />
        </Button>
      )}>
        { accountsFormatted.map((account) => (
          <DropdownItem
            onClick={() => updateOrigin(account)}
            value={account.accountId}
            key={account.accountId}
          >{account.name}</DropdownItem>
        ))}
      </Dropdown>
      <Dropdown label="" renderTrigger={() => (
        <Button disabled={isPending} data-testid="select-destination-dropdown-button" color="light">
          { isPending ? 'Cargando...' : `Destino: ${destination?.name ?? ''}` }
          <RiArrowDownSLine />
        </Button>
      )}>
        { destinationAccounts.map((account) => (
          <DropdownItem
            onClick={() => updateDestination(account)}
            value={account.accountId}
            key={account.accountId}
          >{account.name}</DropdownItem>
        ))}
      </Dropdown>
      { destinationError && (
        <ErrorMessage isAnimated>{destinationError}</ErrorMessage>
      )}
    </>
  )
}
