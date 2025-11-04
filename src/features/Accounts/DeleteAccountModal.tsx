import { FormEvent } from 'react';
import { useRouter } from 'next/navigation'
import { useMutation } from "@tanstack/react-query";
import { Button, CheckIcon, ModalBody, Spinner } from "flowbite-react"
import { RiArrowLeftLine, RiCloseFill } from "@remixicon/react";
import { Toaster, toast } from "sonner";

import { deleteBankAccountCb } from '@/shared/utils/accounts.utils';
import { AccountModalAction, AccountsDisplay, DeleteAccountData, DeleteAccountPayload, OperationAccountError } from "@/shared/types/accounts.types"
import { ACCOUNT_DELETE_ERROR } from '@/shared/constants/accounts.constants';

interface DeleteAccountProps {
  account: AccountsDisplay
  closeModal: () => void;
  updateAccAction: (acc: AccountModalAction) => void;
}

export const DeleteAccountModal = ({ account, closeModal, updateAccAction }: DeleteAccountProps) => {
  const router = useRouter()

  const { mutate, isError, isPending, isSuccess, isIdle } = useMutation<DeleteAccountData, OperationAccountError, DeleteAccountPayload>({
    mutationFn: (data) => deleteBankAccountCb(data),
    onError: () => {
      toast.error(ACCOUNT_DELETE_ERROR);
      closeModal()
    },
    onSuccess: () => {
      setTimeout(() => {
        closeModal()
        // Refetch data after mutation
        router.refresh()
      }, 1000)
    }
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: DeleteAccountPayload = {
      accountId: account.accountId
    }
    mutate(payload)
  }

  return (
    <>
      { (isError) && (
        <Toaster position="top-center" />
      )}
      <div className="flex justify-between items-start rounded-t border-b p-5 dark:border-gray-600">
        <Button onClick={() => updateAccAction('view')} color="gray" outline>
          <RiArrowLeftLine />
          Volver
        </Button>
        <h4 className="text-2xl font-bold">Eliminar {account.name}</h4>
        <Button onClick={closeModal} color="gray" outline>
          <RiCloseFill />
        </Button>
      </div>
      <ModalBody>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h5 className="text-xl font-semibold">Estás por eliminar tu cuenta</h5>
          <p className="text-base text-gray-400">
            Estás por eliminar tu cuenta de forma permanente. Si estás completamente seguro, continúa.
            No podrás recuperar tu información después.
          </p>
          <p className="text-base text-gray-400">
            ¿Estás seguro que deseas continuar?
          </p>
          <div className="flex justify-between">
            <Button disabled={isPending || isSuccess} outline onClick={() => updateAccAction('view')}>Cancelar</Button>
            <Button color="red" disabled={isPending || isSuccess} className="hover:cursor-pointer" type="submit">
              { (isIdle || isError) && 'Eliminar'}
              { isPending && (<Spinner aria-label="loading delete account" />) }
              { isSuccess && (<CheckIcon data-testid="success-delete-acc-button" />)}
            </Button>
          </div>
        </form>
      </ModalBody>
    </>
  )
}