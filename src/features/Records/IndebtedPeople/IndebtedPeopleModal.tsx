"use client"
import { useEffect, useState } from "react"
import { Button, Label, Modal, ModalBody, ModalHeader, TextInput, ToggleSwitch  } from "flowbite-react"
import { AnimatePresence } from "motion/react"
import { yupResolver } from "@hookform/resolvers/yup"
import { SubmitHandler, useForm } from "react-hook-form"

import { useCurrencyField } from "@/shared/hooks/useCurrencyField"
import { CurrencyField } from "@/shared/ui/atoms/CurrencyField"
import { AddIndebtedPeopleDataForm, AddIndebtedPeopleSchema, IndebtedPeople, IndebtedPeopleUI } from "@/shared/types/records.types"
import { ErrorMessage } from "@/shared/ui/atoms/ErrorMessage"
import { cleanCurrencyString } from "@/shared/utils/currency.utils"

interface IndebtedPeopleModalProps {
  openModal: boolean
  toggleModal: () => void
  addIndebtedPerson: (newIndebtedPerson: IndebtedPeople) => void
  updateIndebtedPerson: (editPerson: IndebtedPeople) => void
  validatePersonExist: (name: string) => boolean
  editPerson: IndebtedPeopleUI | null
}

/**
 * The component shows a table of the indebted people added and adds a button to add indebted person to open a modal.
* This component is meant to be used with the custom hook useIndebtedPeople
*/
export const IndebtedPeopleModal = ({
  openModal, toggleModal, addIndebtedPerson, validatePersonExist, editPerson, updateIndebtedPerson,
}: IndebtedPeopleModalProps) => {
  const buttonText = editPerson ? 'Editar' : 'Agregar'
  const {
    handleChange: handleChangeAmountOwed,
    currencyState: amountOwed,
    errorAmount: errorAmountOwed,
    validateZeroAmount,
    resetCurrencyState: resetAmountOwed,
    handleEditState: handleEditStateAmountOwed
  } = useCurrencyField({
    amount: null,
  })
  const {
    handleChange: handleChangeAmountPaid,
    currencyState: amountPaid,
    resetCurrencyState: resetAmountPaid,
    handleEditState: handleEditStateAmountPaid
  } = useCurrencyField({
    amount: null,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError
  } = useForm<AddIndebtedPeopleDataForm>({
    resolver: yupResolver(AddIndebtedPeopleSchema)
  })

  useEffect(() => {
    if (editPerson?.name) {
      reset({ name: editPerson.name })
      handleEditStateAmountOwed(editPerson.amountFormatted)
      handleEditStateAmountPaid(editPerson.amountPaidFormatted)
      setDebtPaid(editPerson.isPaid)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editPerson])

  const [debtPaid, setDebtPaid] = useState<boolean>(false)
  const toggleDebtPaid = () => setDebtPaid((prev) => !prev)

  const onSubmit: SubmitHandler<AddIndebtedPeopleDataForm> = (data) => {
    const isValid = validateZeroAmount({ amountState: amountOwed })
    const personExists = validatePersonExist(data.name)
    if (!isValid) {
      return
    }
    if (personExists && !editPerson) {
      setError('name', { type: 'custom', message: 'El nombre de esa persona ya existe. Elija otro' })
      return
    }

    const amountOwedNumber = cleanCurrencyString(amountOwed)
    const amountPaidNumber = cleanCurrencyString(amountPaid)
    const payload: IndebtedPeople = {
      name: data.name,
      amount: amountOwedNumber,
      amountPaid: amountPaidNumber,
      isPaid: debtPaid
    }
    // Reset form fields
    reset()
    resetAmountOwed()
    resetAmountPaid()
    setDebtPaid(false)

    toggleModal()
    if (editPerson) {
      updateIndebtedPerson(payload)
      return
    }
    addIndebtedPerson(payload)

  }

  return (
    <AnimatePresence>
      <Modal key="add-indebted-people-modal" show={openModal} onClose={toggleModal}>
        <ModalHeader>Agregar persona que te debe</ModalHeader>
        <ModalBody>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              handleSubmit(onSubmit)(event)
            }}
            className="flex flex-col gap-4 items-center">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name">Nombre completo</Label>
              </div>
              <TextInput
                data-testid="name"
                id="name"
                type="text"
                {...register("name")}
              />
              { errors?.name?.message && (
                <ErrorMessage isAnimated={false}>{errors?.name?.message}</ErrorMessage>
              )}
            </div>
            <CurrencyField
              labelName="Cantidad a deber"
              dataTestId="amountOwed"
              fieldId="amountOwed"
              value={amountOwed}
              handleChange={handleChangeAmountOwed}
            />
            { errorAmountOwed && (
              <ErrorMessage isAnimated>{errorAmountOwed}</ErrorMessage>
            )}
            <CurrencyField
              labelName="Cantidad pagada"
              dataTestId="amountPaid"
              fieldId="amountPaid"
              value={amountPaid}
              handleChange={handleChangeAmountPaid}
            />
            <ToggleSwitch checked={debtPaid} label="Deuda pagada" onChange={toggleDebtPaid} />
            <Button type="submit" className="max-w-max">{buttonText} persona</Button>
          </form>
        </ModalBody>
      </Modal>
    </AnimatePresence>
  )
}