import { useState } from "react"
import { useRouter } from 'next/navigation'
import { AnimatePresence } from "motion/react"
import { Button, CheckIcon, Label, ModalBody, ModalHeader, Spinner, TextInput } from "flowbite-react"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";
import { Toaster, toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { useCurrencyField } from "@/shared/hooks/useCurrencyField"
import { CurrencyField } from "@/shared/ui/atoms/CurrencyField"
import { AccountTypeDropdown } from "./AccountTypeDropdown"
import { AccountProviderDropdown } from "./AccountProviderDropdown"
import { AccountFormData, AccountFormSchema, AccountProvider, AccountTypes, CreateAccountData, CreateAccountPayload, OperationAccountError } from "@/shared/types/accounts.types"
import { ErrorMessage } from "@/shared/ui/atoms/ErrorMessage";
import { cleanCurrencyString } from "@/shared/utils/currency.utils"
import { createBankAccountCb } from "@/shared/utils/accounts.utils"
import { ACCOUNT_CREATE_ERROR } from "@/shared/constants/accounts.constants";
import { getRandomFourDigitString } from "@/shared/utils/global.utils"

interface CreateAccountProps {
  closeModal: () => void;
}

export const CreateAccountModal = ({ closeModal }: CreateAccountProps) => {
  const router = useRouter()
  const [selectedAccountType, setSelectedAccountType] = useState<AccountTypes>('Crédito')
  const [selectedProvider, setSelectedProvider] = useState<AccountProvider>('mastercard')
  const { handleChange, currencyState } = useCurrencyField({
    amount: null
  })

  const changeSelectedAccountType = (newAccType: AccountTypes) => setSelectedAccountType(newAccType)
  const changeSelectedProviderType = (newProvider: AccountProvider) => setSelectedProvider(newProvider)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AccountFormSchema)
  })

  const { mutate, isError, isPending, isSuccess, isIdle } = useMutation<CreateAccountData, OperationAccountError, CreateAccountPayload>({
    mutationFn: (data) => createBankAccountCb(data),
    onError: () => {
      toast.error(ACCOUNT_CREATE_ERROR);
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
    const payload: CreateAccountPayload = {
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
      <div key="create-account-modal">
        { (isError) && (
          <Toaster position="top-center" />
        )}
        <ModalHeader>Crear cuenta</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="title">Titulo de la cuenta</Label>
              </div>
              <TextInput
                data-testid="title"
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
                id="terminationNumber"
                type="string"
                inputMode="numeric"
                pattern="[0-9]*"
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
                { (isIdle || isError) && 'Crear'}
                { isPending && (<Spinner aria-label="loading create account budget master" />) }
                { isSuccess && (<CheckIcon data-testid="create-acc-success-button" />)}
              </Button>
            </div>
          </form>
        </ModalBody>
      </div>
    </AnimatePresence>
  )
}