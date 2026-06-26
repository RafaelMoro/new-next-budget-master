"use client"

import { useEffect, useState } from "react"
import { AnimatePresence } from "motion/react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { useMutation } from "@tanstack/react-query"
import { yupResolver } from "@hookform/resolvers/yup"
import { Toaster, toast } from "sonner"
import { Button, CheckIcon, Label, Spinner, Textarea, TextInput } from "flowbite-react"
import clsx from "clsx"

import { DateTimePicker } from "@/shared/ui/atoms/DateTimePicker"
import { CurrencyField } from "@/shared/ui/atoms/CurrencyField"
import { useCurrencyField } from "@/shared/hooks/useCurrencyField"
import { useCategoriesForm } from "@/shared/hooks/useCategoriesForm"
import { useTransferBankAccounts } from "@/shared/hooks/useTransferBankAccounts"
import { Category, CategoryShown } from "@/shared/types/categories.types"
import { AccountsCookie, GetAccountsResponse } from "@/shared/types/accounts.types"
import { BankMovement, CreateIncomeDataForm, CreateTransferPayload, CreateTransferValues, IncomeExpenseSchema, TransferDataResponse, TransferErrorResponse } from "@/shared/types/records.types"
import { cleanCurrencyString } from "@/shared/utils/currency.utils"
import { createTransferCb, getValuesIncomeAndExpense } from "@/shared/utils/records.utils"
import { DASHBOARD_ROUTE } from "@/shared/constants/global.constants"
import { DetailedError, GeneralError } from "@/shared/types/global.types"
import { ErrorMessage } from "@/shared/ui/atoms/ErrorMessage"
import { CATEGORY_FETCH_ERROR, CATEGORY_REQUIRED, SUBCATEGORY_REQUIRED } from "@/shared/constants/categories.constants"
import { CREATE_EXPENSE_INCOME_ERROR, DESTINATION_ACC_REQUIRED } from "@/shared/constants/records.constants"
import { TransactionCategorizerDropdown } from "../Categories/TransactionCategorizerDropdown"
import { ManageTagsModal } from "./ManageTagsModal"
import { useManageTags } from "@/shared/hooks/useManageTags"
import { FurtherDetailsAccordion } from "./FurtherDetailsAccordion"
import { useMediaQuery } from "@/shared/hooks/useMediaQuery"
import { CancelButtonExpenseTemplate } from "./ExpenseTemplate/CancelButtonExpenseTemplate"
import { TransferAccountsSelector } from "./Transfer/TransferAccountsSelector"

interface TransferTemplateProps {
  categories: Category[]
  selectedAccount: AccountsCookie | null
  resAccounts: GetAccountsResponse
  detailedErrorCategories: DetailedError | null
  editRecord: BankMovement | null
}

export const TransferTemplate = ({
  categories,
  selectedAccount,
  resAccounts,
  detailedErrorCategories,
  editRecord,
}: TransferTemplateProps) => {
  const router = useRouter()
  const { isMobileTablet, isDesktop } = useMediaQuery()

  const [date, setDate] = useState<Date | undefined>(new Date())
  const buttonText = editRecord?.shortName ? 'Editar transferencia' : 'Crear transferencia'

  const { tags, updateTags, openTagModal, closeModal, openModal } = useManageTags()

  const asideCss = clsx(
    "w-full flex flex-col gap-12",
    { "max-w-xs": tags.current.length === 0 },
    { "max-w-2xl": tags.current.length > 0 }
  )

  const { handleChange, currencyState, errorAmount, validateZeroAmount, handleEditState, isZeroCurrency } = useCurrencyField({
    amount: null,
  })
  const {
    categoriesShown,
    categorySelected,
    updateCategory,
    updateSubcategory,
    subcategories,
    subcategory,
    categoryError,
    subcategoryError,
    updateCategoryError,
    updateSubcategoryError,
  } = useCategoriesForm({ categories })
  const {
    accountsFormatted,
    origin,
    destination,
    destinationError,
    destinationAccounts,
    updateOrigin,
    updateDestination,
    handleDestinationError,
  } = useTransferBankAccounts({
    accounts: resAccounts.accounts,
    selectedAccountId: selectedAccount?.accountId ?? null,
  })

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(IncomeExpenseSchema)
  })

  const {
    mutate: createTransfer,
    isError: isErrorCreate,
    isPending,
    isSuccess,
    error: errorCreate,
  } = useMutation<TransferDataResponse, TransferErrorResponse, CreateTransferPayload>({
    mutationFn: (data) => createTransferCb(data),
    onSuccess: () => {
      router.refresh()
      setTimeout(() => {
        router.push(DASHBOARD_ROUTE)
      }, 1000)
    }
  })
  const messageErrorCreate = (errorCreate as unknown as GeneralError)?.response?.data?.error?.message

  useEffect(() => {
    if (editRecord) {
      setValue('shortDescription', editRecord.shortName)
      setValue('description', editRecord.description)
      setDate(new Date(editRecord.date))
      handleEditState(editRecord.amountFormatted)
      updateSubcategory(editRecord.subCategory)
      updateTags(editRecord.tag)

      if (editRecord.category) {
        const category: CategoryShown = {
          name: editRecord.category.categoryName,
          categoryId: editRecord.category._id
        }
        updateCategory(category)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRecord])

  useEffect(() => {
    if (isErrorCreate && messageErrorCreate) {
      toast.error(CREATE_EXPENSE_INCOME_ERROR)
      return
    }
  }, [isErrorCreate, messageErrorCreate])

  useEffect(() => {
    if (detailedErrorCategories?.cause === 'connection') {
      toast.error('Error de conexión. Por favor, inténtalo más tarde.')
    } else if (detailedErrorCategories?.message) {
      toast.error(CATEGORY_FETCH_ERROR)
    }
  }, [detailedErrorCategories?.cause, detailedErrorCategories?.message])

  const onSubmit: SubmitHandler<CreateIncomeDataForm> = (data) => {
    if (!categorySelected.categoryId || !categorySelected.name) {
      updateCategoryError(CATEGORY_REQUIRED)
    }
    if (!subcategory) {
      updateSubcategoryError(SUBCATEGORY_REQUIRED)
    }
    if (!destination) {
      handleDestinationError(DESTINATION_ACC_REQUIRED)
    }
    validateZeroAmount({ amountState: currencyState })
    const isAmountZero = isZeroCurrency()

    if (!categoryError && !subcategoryError && !isAmountZero && !errorAmount && date && subcategory && !openTagModal && destination) {
      const amountNumber = cleanCurrencyString(currencyState)
      const payload: CreateTransferValues = {
        amount: amountNumber,
        budgets: [],
        category: categorySelected.categoryId,
        date,
        description: data.description ?? '',
        shortName: data.shortDescription,
        subCategory: subcategory,
        origin: origin?.accountId ?? '',
        destination: destination.accountId,
        tag: tags.current,
      }

      // ponytail: edit submit branch stripped - edit-transfer callbacks are deferred.
      const { newValuesExpense, newValuesIncome } = getValuesIncomeAndExpense({ values: payload })
      createTransfer({ expense: newValuesExpense, income: newValuesIncome })
    }
  }

  return (
    <div className="w-full flex justify-center gap-32">
      <AnimatePresence>
        <form key="transfer-template-form" onSubmit={handleSubmit(onSubmit)} className="w-full px-4 mx-auto flex flex-col gap-4 md:max-w-xl mb-6 lg:mx-0 lg:px-0">
          <DateTimePicker date={date} setDate={setDate} />
          <TransferAccountsSelector
            accountsFormatted={accountsFormatted}
            isPending={false}
            origin={origin}
            destination={destination}
            destinationAccounts={destinationAccounts}
            destinationError={destinationError}
            updateOrigin={updateOrigin}
            updateDestination={updateDestination}
          />
          <CurrencyField
            labelName="Cantidad"
            dataTestId="amount"
            fieldId="amount"
            value={currencyState}
            handleChange={handleChange}
          />
          { errorAmount && (
            <ErrorMessage isAnimated>{errorAmount}</ErrorMessage>
          )}
          <div>
            <div className="mb-2 block">
              <Label htmlFor="shortDescription">Pequeña descripción</Label>
            </div>
            <TextInput
              data-testid="shortDescription"
              id="shortDescription"
              type="text"
              {...register("shortDescription")}
            />
            { errors?.shortDescription?.message && (
              <ErrorMessage isAnimated>{errors.shortDescription.message}</ErrorMessage>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="description">Descripción (opcional)</Label>
            </div>
            <Textarea id="description" rows={4} {...register("description")} />
            { errors?.description?.message && (
              <ErrorMessage isAnimated>{errors.description.message}</ErrorMessage>
            )}
          </div>
          <TransactionCategorizerDropdown
            categoriesShown={categoriesShown}
            categorySelected={categorySelected}
            updateCategory={updateCategory}
            categoryError={categoryError}
            subcategories={subcategories}
            subcategory={subcategory}
            updateSubcategory={updateSubcategory}
            subcategoryError={subcategoryError}
          />
          { isMobileTablet && (
            <FurtherDetailsAccordion>
              <div className="w-full flex flex-col gap-12">
                <ManageTagsModal tags={tags.current} updateTags={updateTags} openModal={openTagModal} openModalFn={openModal} closeModalFn={closeModal} />
              </div>
            </FurtherDetailsAccordion>
          )}
          <div className="w-full flex flex-col lg:flex-row lg:justify-between gap-4">
            <CancelButtonExpenseTemplate action="create" />
            <Button
              className="hover:cursor-pointer"
              disabled={isPending || isSuccess || openTagModal}
              type="submit"
            >
              { isPending ? (
                <Spinner aria-label="loading create transfer" />
              ) : isSuccess ? (
                <CheckIcon data-testid="check-icon" />
              ) : buttonText }
            </Button>
          </div>
        </form>
        { (isErrorCreate || detailedErrorCategories?.message) && (
          <Toaster position="top-center" />
        )}
      </AnimatePresence>
      { isDesktop && (
        <aside className={asideCss}>
          <h2 className="text-center text-2xl font-semibold">Más detalles</h2>
          <ManageTagsModal tags={tags.current} updateTags={updateTags} openModal={openTagModal} openModalFn={openModal} closeModalFn={closeModal} />
        </aside>
      ) }
    </div>
  )
}
