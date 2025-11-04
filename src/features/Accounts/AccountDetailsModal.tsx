import { Button, ModalBody, ModalHeader } from "flowbite-react"

import { TYPE_PROVIDER_DICT } from "@/shared/constants/accounts.constants";
import { AccountModalAction, AccountsDisplay } from "@/shared/types/accounts.types";

interface AccountDetailsProps {
  account: AccountsDisplay
  updateAccAction: (acc: AccountModalAction) => void
}

export const AccountDetailsModal = ({ account, updateAccAction }: AccountDetailsProps) => {
  return (
    <>
      <ModalHeader>{account.name}</ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <p className="text-xl font-bold">Balance: {account.amount}</p>
          <p className="text-base text-gray-400">Tipo de cuenta: {account.type}</p>
          { account.terminationFourDigits && (
            <p className="text-base text-gray-400">Terminación: {account.terminationFourDigitsTransformed}</p>
          ) }
          { account.alias && (
            <p className="text-base text-gray-400">Alias: {account.alias}</p>
          ) }
          { account.accountProvider && (
            <p className="text-gray-400">Tarjeta emitida por: {TYPE_PROVIDER_DICT[account.accountProvider]} </p>
          ) }
          <div className="flex justify-between">
            <Button onClick={() => updateAccAction('delete')} color="red" outline className="ml-2">Eliminar</Button>
            <Button onClick={() => updateAccAction('edit')}>Editar</Button>
          </div>
        </div>
      </ModalBody>
    </>
  )
}