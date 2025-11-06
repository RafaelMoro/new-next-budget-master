"use client"

import { useEffect, useState } from "react"
import { AnimatePresence } from "motion/react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useRouter } from 'next/navigation'
import { useMutation } from "@tanstack/react-query"
import { yupResolver } from "@hookform/resolvers/yup"
import { Toaster, toast } from "sonner";
import { Button, CheckIcon, Label, Spinner, Textarea, TextInput, ToggleSwitch } from "flowbite-react"
import clsx from "clsx"

import { BankMovement, ExpenseDataResponse, CreateExpenseDataForm, ExpenseErrorResponse, CreateExpensePayload, EditExpensePayload, IncomeExpenseSchema } from "@/shared/types/records.types"
import { DateTimePicker } from "@/shared/ui/atoms/DateTimePicker"
import { CurrencyField } from "@/shared/ui/atoms/CurrencyField"
import { useCurrencyField } from "@/shared/hooks/useCurrencyField"
import { useCategoriesForm } from "@/shared/hooks/useCategoriesForm"
import { Category, CategoryShown } from "@/shared/types/categories.types"
import { cleanCurrencyString } from "@/shared/utils/currency.utils"
import { createExpenseCb, editExpenseCb, resetEditRecordLS } from "@/shared/utils/records.utils"
import { DASHBOARD_ROUTE } from "@/shared/constants/global.constants"
import { DetailedError, GeneralError } from "@/shared/types/global.types"
import { ErrorMessage } from "@/shared/ui/atoms/ErrorMessage"
import { CREATE_EXPENSE_INCOME_ERROR, EDIT_EXPENSE_INCOME_ERROR } from "@/shared/constants/records.constants"
import { CATEGORY_FETCH_ERROR, CATEGORY_REQUIRED, SUBCATEGORY_REQUIRED } from "@/shared/constants/categories.constants"
import { TransactionCategorizerDropdown } from "../../Categories/TransactionCategorizerDropdown"
import { ManageTagsModal } from "../ManageTagsModal"
import { useManageTags } from "@/shared/hooks/useManageTags"
import { useIndebtedPeople } from "@/shared/hooks/useIndebtedPeople"
import { FurtherDetailsAccordion } from "../FurtherDetailsAccordion"
import { useMediaQuery } from "@/shared/hooks/useMediaQuery"
import { PersonalDebtManager } from "../IndebtedPeople/PersonalDebtManager"
import { AccountsDisplay, CREDIT_ACCOUNT_TYPE } from "@/shared/types/accounts.types"
import { Budget, SelectBudget } from "@/shared/types/budgets.types"
import { useHandleBudgets } from "@/shared/hooks/useHandleBudgets"
import { SelectBudgetDropdown } from "@/features/Budgets/SelectBudget"
import { BUDGETS_FETCH_ERROR } from "@/shared/constants/budgets.constants"
import { CancelButtonExpenseTemplate } from "./CancelButtonExpenseTemplate"

interface ExpenseTemplateProps {
  categories: Category[]
  budgetsFetched: Budget[]
  selectedAccount: AccountsDisplay | null
  editRecord: BankMovement | null
  accessToken: string
  detailedErrorCategories: DetailedError | null
  detailedErrorBudgets: DetailedError | null
}

export const ExpenseTemplate = ({
  categories,
  budgetsFetched,
  selectedAccount,
  accessToken,
  detailedErrorCategories,
  detailedErrorBudgets,
  editRecord
}: ExpenseTemplateProps) => {
  const router = useRouter()
  const { isMobileTablet, isDesktop } = useMediaQuery()

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isPaid, setIsPaid] = useState<boolean>(false)
  const toggleDebtPaid = () => setIsPaid((prev) => !prev)
  const isCredit = selectedAccount?.type === CREDIT_ACCOUNT_TYPE
  const buttonText = editRecord?.shortName ? 'Editar gasto' : 'Crear gasto'

  const { tags, updateTags, openTagModal, closeModal, openModal } = useManageTags()
  const { budgetsOptions, updateSelectedBudget, selectedBudget, budgets } = useHandleBudgets({ budgetsFetched })

  const { addIndebtedPerson, openIndebtedPeopleModal, toggleIndebtedPeopleModal, indebtedPeople, indebtedPeopleUI,
    validatePersonExist, openEditModal, removePerson, editPerson, updateIndebtedPerson, updateIndebtedPeopleOnEdit } = useIndebtedPeople()

  const asideCss = clsx(
    "w-full flex flex-col gap-12",
    { "max-w-xs": indebtedPeopleUI.length === 0 },
    { "max-w-2xl": indebtedPeopleUI.length > 0 }
  )

  const { handleChange, currencyState, errorAmount, validateZeroAmount, handleEditState, isZeroCurrency } = useCurrencyField({
    amount: null,
  })
  const { categoriesShown, categorySelected, updateCategory, updateSubcategory, subcategories, subcategory,
    categoryError, subcategoryError, updateCategoryError, updateSubcategoryError,
  } = useCategoriesForm({ categories })

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(IncomeExpenseSchema)
  })

  const {
    mutate: createExpense, isError: isErrorCreate, isPending: isPendingCreate, isSuccess: isSuccessCreate, error: errorCreate
  } = useMutation<ExpenseDataResponse, ExpenseErrorResponse, CreateExpensePayload>({
    mutationFn: (data) => createExpenseCb(data, accessToken),
    onSuccess: () => {
      router.refresh()
      setTimeout(() => {
        router.push(DASHBOARD_ROUTE)
      }, 1000)
    }
  })
  const {
    mutate: editExpense, isError: isErrorEdit, isPending: isPendingEdit, isSuccess: isSuccessEdit, error: errorEdit
  } = useMutation<ExpenseDataResponse, ExpenseErrorResponse, EditExpensePayload>({
    mutationFn: (data) => editExpenseCb(data, accessToken),
    onError: () => {
      setTimeout(() => {
        resetEditRecordLS()
        router.push(DASHBOARD_ROUTE)
      }, 1500)
    },
    onSuccess: () => {
      setTimeout(() => {
        resetEditRecordLS()
        // Refetch data after mutation
        router.refresh()
        router.push(DASHBOARD_ROUTE)
      }, 1000)
    }
  })
  const isPending = isPendingCreate || isPendingEdit
  const isSuccess = isSuccessCreate || isSuccessEdit
  const isError = isErrorCreate || isErrorEdit
  const messageErrorCreate = (errorCreate as unknown as GeneralError)?.response?.data?.error?.message
  const messageErrorEdit = (errorEdit as unknown as GeneralError)?.response?.data?.error?.message

  useEffect(() => {
    // Init state to edit expense
    if (editRecord) {
      setValue('shortDescription', editRecord?.shortName)
      setValue('description', editRecord?.description)
      setDate(new Date(editRecord.date))
      handleEditState(editRecord.amountFormatted)
      updateSubcategory(editRecord.subCategory)
      updateTags(editRecord.tag)
      if (editRecord.indebtedPeople) {
        updateIndebtedPeopleOnEdit(editRecord.indebtedPeople)
      }

      if (editRecord.category) {
        const cat: CategoryShown = {
          name: editRecord.category.categoryName,
          categoryId: editRecord.category._id
        }
        updateCategory(cat)
      }
      if (editRecord?.linkedBudgets && editRecord?.linkedBudgets?.length > 0) {
        const [linkedBudget] = editRecord.linkedBudgets
        const budget: SelectBudget = {
          budgetId: linkedBudget._id,
          name: linkedBudget.name
        }
        updateSelectedBudget(budget)
      }
      if (editRecord?.isPaid) setIsPaid(editRecord?.isPaid)
      
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editRecord])

  useEffect(() => {
    if (isErrorCreate && messageErrorCreate) {
      toast.error(CREATE_EXPENSE_INCOME_ERROR);
      return
    }
  }, [isErrorCreate, messageErrorCreate])

  useEffect(() => {
    if (isErrorEdit && messageErrorEdit) {
      toast.error(EDIT_EXPENSE_INCOME_ERROR);
      return
    }
  }, [isErrorEdit, messageErrorEdit])

  useEffect(() => {
    if (detailedErrorCategories?.cause === 'connection' || detailedErrorBudgets?.cause === 'connection') {
      toast.error('Error de conexión. Por favor, inténtalo más tarde.');
    } else if (detailedErrorCategories?.message) {
      toast.error(CATEGORY_FETCH_ERROR);
    } else if (detailedErrorBudgets?.message) {
      toast.error(BUDGETS_FETCH_ERROR);
    }
  }, [detailedErrorBudgets?.cause, detailedErrorBudgets?.message, detailedErrorCategories?.cause, detailedErrorCategories?.message])

  const onSubmit: SubmitHandler<CreateExpenseDataForm> = (data) => {
    if (!categorySelected.categoryId || !categorySelected.name) {
      updateCategoryError(CATEGORY_REQUIRED)
    }
    if (!subcategory) {
      updateSubcategoryError(SUBCATEGORY_REQUIRED)
    }
    validateZeroAmount({ amountState: currencyState })
    const isAmountZero = isZeroCurrency()

    if (!categoryError && !subcategoryError && !isAmountZero && !errorAmount && selectedAccount && date && subcategory && !openTagModal) {
      const amountNumber = cleanCurrencyString(currencyState)
      const payload: CreateExpensePayload = {
        account: selectedAccount,
        amount: amountNumber,
        // Prop budgets deprecated
        budgets: [],
        category: categorySelected.categoryId,
        date,
        description: data.description ?? '',
        indebtedPeople,
        isPaid,
        linkedBudgets: selectedBudget ? [selectedBudget.budgetId] : [],
        shortName: data.shortDescription,
        subCategory: subcategory,
        tag: tags.current,
        typeOfRecord: 'expense'
      }

      if (editRecord?.shortName) {
        const payloadEdit: EditExpensePayload = {
          ...payload,
          recordId: editRecord._id
        }
        editExpense(payloadEdit)
        return
      }

      createExpense(payload)
    }
  }

  return (
    <div className="w-full flex justify-center gap-32">
      <AnimatePresence>
        <form key="expense-template-form" onSubmit={handleSubmit(onSubmit)} className="w-full px-4 mx-auto flex flex-col gap-4 md:max-w-xl mb-6 lg:mx-0 lg:px-0">
          <DateTimePicker date={date} setDate={setDate} />
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
              <ErrorMessage isAnimated>{errors.shortDescription?.message}</ErrorMessage>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="description">Descripción (opcional)</Label>
            </div>
            <Textarea id="description" rows={4} {...register("description")} />
            { errors?.description?.message && (
              <ErrorMessage isAnimated>{errors.description?.message}</ErrorMessage>
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
          { budgets.length > 0 && (
            <SelectBudgetDropdown
              budgetOptions={budgetsOptions}
              selectedBudget={selectedBudget}
              updateSelectedBudget={updateSelectedBudget}
            />
          ) }
          { isCredit && (<ToggleSwitch data-testid="toggle-switch-is-paid" checked={isPaid} label="Pagado" onChange={toggleDebtPaid} />) }
          { isMobileTablet && (
            <FurtherDetailsAccordion>
              <div className="w-full flex flex-col gap-12">
                <ManageTagsModal tags={tags.current} updateTags={updateTags} openModal={openTagModal} openModalFn={openModal} closeModalFn={closeModal} />
                <PersonalDebtManager
                  indebtedPeople={indebtedPeopleUI}
                  openModal={openIndebtedPeopleModal}
                  toggleModal={toggleIndebtedPeopleModal}
                  openEditModal={openEditModal}
                  addIndebtedPerson={addIndebtedPerson}
                  updateIndebtedPerson={updateIndebtedPerson}
                  validatePersonExist={validatePersonExist}
                  editPerson={editPerson}
                  removePerson={removePerson}
                />
              </div>
            </FurtherDetailsAccordion>
          )}
          <div className="w-full flex flex-col lg:flex-row lg:justify-between gap-4">
            <CancelButtonExpenseTemplate action={editRecord?.shortName ? "edit" : "create"} />
            <Button
              className="hover:cursor-pointer"
              disabled={isPending || isSuccess || openTagModal}
              type="submit"
            >
              { isPending ? (
                  <Spinner aria-label="loading reset password budget master" />
                ) : isSuccess ? (
                  <CheckIcon data-testid="check-icon" />
                ) : buttonText }
            </Button>
          </div>
        </form>
        { (isError || detailedErrorCategories?.message || detailedErrorBudgets?.message) && (
          <Toaster position="top-center" />
        )}
      </AnimatePresence>
      { isDesktop && (
        <aside className={asideCss}>
          <h2 className="text-center text-2xl font-semibold">Más detalles</h2>
          <ManageTagsModal tags={tags.current} updateTags={updateTags} openModal={openTagModal} openModalFn={openModal} closeModalFn={closeModal} />
          <PersonalDebtManager
            indebtedPeople={indebtedPeopleUI}
            openModal={openIndebtedPeopleModal}
            toggleModal={toggleIndebtedPeopleModal}
            openEditModal={openEditModal}
            addIndebtedPerson={addIndebtedPerson}
            updateIndebtedPerson={updateIndebtedPerson}
            validatePersonExist={validatePersonExist}
            editPerson={editPerson}
            removePerson={removePerson}
          />
        </aside>
      ) }
    </div>
  )
}