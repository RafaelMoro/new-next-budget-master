"use client"
import { useState } from "react";
import { useRouter } from 'next/navigation'
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { AnimatePresence } from "motion/react"
import { Button, CheckIcon, Label, ModalBody, Spinner, TextInput } from "flowbite-react"
import { RiArrowLeftLine, RiCloseFill } from "@remixicon/react"
import { Toaster, toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { AccountModalAction, AccountProvider, AccountsDisplay, AccountTypes, EditAccountData, AccountFormData, EditAccountPayload, AccountFormSchema, OperationAccountError } from "@/shared/types/accounts.types"
import { CurrencyField } from "@/shared/ui/atoms/CurrencyField";
import { useCurrencyField } from "@/shared/hooks/useCurrencyField";
import { ErrorMessage } from "@/shared/ui/atoms/ErrorMessage";
import { AccountTypeDropdown } from "@/features/Accounts/AccountTypeDropdown";
import { AccountProviderDropdown } from "@/features/Accounts/AccountProviderDropdown";
import { editBankAccountCb } from "@/shared/utils/accounts.utils";
import { cleanCurrencyString } from "@/shared/utils/currency.utils";
import { ACCOUNT_UPDATE_ERROR } from "@/shared/constants/accounts.constants";
import { getRandomFourDigitString } from "@/shared/utils/global.utils";

interface EditAccountProps {
  account: AccountsDisplay
  closeModal: () => void;
  updateAccAction: (acc: AccountModalAction) => void;
}

export const EditAccountModal = ({ account, closeModal, updateAccAction }: EditAccountProps) => {
  const router = useRouter()
  const [selectedAccountType, setSelectedAccountType] = useState<AccountTypes>(account.type)
  const [selectedProvider, setSelectedProvider] = useState<AccountProvider>(account.accountProvider ?? 'mastercard')

  const changeSelectedAccountType = (newAccType: AccountTypes) => setSelectedAccountType(newAccType)
  const changeSelectedProviderType = (newProvider: AccountProvider) => setSelectedProvider(newProvider)

  const { handleChange, currencyState } = useCurrencyField({
    amount: account.amount
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AccountFormSchema)
  })

  const { mutate, isError, isPending, isSuccess, isIdle } = useMutation<EditAccountData, OperationAccountError, EditAccountPayload>({
    mutationFn: (data) => editBankAccountCb(data),
    onError: () => {
      toast.error(ACCOUNT_UPDATE_ERROR);
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

  const onSubmit: SubmitHandler<AccountFormData> = async (data) => {
    const amountNumber = cleanCurrencyString(currencyState)
    const payload: EditAccountPayload = {
      accountId: account.accountId,
      title: data.title,
      alias: data.alias || data.title,
      accountType: selectedAccountType,
      accountProvider: selectedProvider,
      amount: amountNumber,
      terminationFourDigits: data.terminationFourDigits || getRandomFourDigitString(),
      backgroundColor: 'Dark Orange',
      color: 'white'
    }
    mutate(payload)
  }

  return (
    <AnimatePresence>
      <div key="edit-account-modal">
        { (isError) && (
            <Toaster position="top-center" />
          )}
        <div key={`edit-acc-${account.accountId}`} className="flex justify-between items-start rounded-t border-b p-5 dark:border-gray-600">
          <Button onClick={() => updateAccAction('view')} color="gray" outline>
            <RiArrowLeftLine />
            Volver
          </Button>
          <h4 className="text-2xl font-bold">Editar {account.name}</h4>
          <Button onClick={closeModal} color="gray" outline>
            <RiCloseFill />
          </Button>
        </div>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title">Titulo de la cuenta</Label>
              </div>
              <TextInput
                data-testid="title"
                defaultValue={account.name}
                id="title"
                type="text"
                {...register("title")}
                />
              { errors?.title?.message && (
                <ErrorMessage isAnimated>{errors.title?.message}</ErrorMessage>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="alias">Alias (opcional)</Label>
              </div>
              <TextInput
                data-testid="alias"
                defaultValue={account.alias}
                id="alias"
                type="text"
                {...register("alias")}
                />
              <p className="text-sm text-gray-600 dark:text-gray-400">Si este campo se deja en blanco, el alias será el nombre de la cuenta</p>
              { errors?.alias?.message && (
                <ErrorMessage isAnimated>{errors.alias?.message}</ErrorMessage>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="terminationNumber">Terminación de la cuenta (opcional)</Label>
              </div>
              <TextInput
                data-testid="terminationNumber"
                defaultValue={account.terminationFourDigits ?? 0}
                id="terminationNumber"
                inputMode="numeric"
                pattern="[0-9]*"
                type="text"
                {...register("terminationFourDigits")}
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">Si este campo se deja en blanco, se asignará un número aleatorio</p>
              { errors?.terminationFourDigits?.message && (
                <ErrorMessage isAnimated>{errors.terminationFourDigits?.message}</ErrorMessage>
              )}
            </div>
            <CurrencyField
              labelName="Saldo de la cuenta"
              dataTestId="amount"
              fieldId="amount"
              value={currencyState}
              handleChange={handleChange}
            />
            <AccountTypeDropdown selectedAccountType={selectedAccountType} changeSelectedAccountType={changeSelectedAccountType} />
            <AccountProviderDropdown selectedProvider={selectedProvider} changeSelectedProviderType={changeSelectedProviderType}  />
            <div className="flex justify-between">
              <Button disabled={isPending || isSuccess} color="alternative" onClick={closeModal}>
                Cancelar
              </Button>
              <Button disabled={isPending || isSuccess} className="hover:cursor-pointer" type="submit">
                { (isIdle || isError) && 'Editar'}
                { isPending && (<Spinner aria-label="loading create account budget master" />) }
                { isSuccess && (<CheckIcon data-testid="success-button" />)}
              </Button>
            </div>
          </form>
        </ModalBody>
      </div>
    </AnimatePresence>
  )
}