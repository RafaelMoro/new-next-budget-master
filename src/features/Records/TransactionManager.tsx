"use client"
import { useState } from "react"
import { RiArrowLeftLine } from "@remixicon/react"

import { TransactionManagerGroupButton } from "./TransactionManagerGroupButton"
import { TransactionScreens } from "@/shared/types/dashboard.types"
import { Header } from "@/shared/ui/organisms/Header"
import { GetCategoriesResponse } from "@/shared/types/categories.types"
import { LinkButton } from "@/shared/ui/atoms/LinkButton"
import { DASHBOARD_ROUTE } from "@/shared/constants/global.constants"
import { ExpenseTemplate } from "./ExpenseTemplate/ExpenseTemplate";
import { GetBudgetsResponse } from "@/shared/types/budgets.types"
import { AccountsDisplay } from "@/shared/types/accounts.types"
// import { IncomeTemplate } from "./IncomeTemplate"
// import { TransferTemplate } from "./TransferTemplate"

interface TransactionManagerProps {
  resCategories: GetCategoriesResponse
  resBudgets: GetBudgetsResponse
  selectedAccount: AccountsDisplay | null
  accessToken: string
}

export const TransactionManager = ({ resCategories, resBudgets, selectedAccount, accessToken, }: TransactionManagerProps) => {
  const { categories, detailedError: errorCategories } = resCategories
  const { budgets, detailedError: errorBudgets } = resBudgets
  const [subscreen, setSubscreen] = useState<TransactionScreens>('expense')
  const updateExpenseScreen = () => setSubscreen('expense')
  const updateIncomeScreen = () => setSubscreen('income')
  const updateTransferScreen = () => setSubscreen('transfer')

  const titleDictionary: Record<TransactionScreens, string> = {
    expense: 'Gasto',
    income: 'Ingreso',
    transfer: 'Transferencia',
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="max-w-min ml-5 mb-8 md:mb-0">
        <LinkButton href={DASHBOARD_ROUTE} type="greySecondary">
          <RiArrowLeftLine />
          Volver
      </LinkButton>
      </div>
      <main className="flex-1 flex flex-col items-center gap-8 min-h-full">
        <h1 className="text-black dark:text-white text-4xl text-center font-bold">Crear {titleDictionary[subscreen]}</h1>
        <TransactionManagerGroupButton
          screen={subscreen}
          updateExpenseScreen={updateExpenseScreen}
          updateIncomeScreen={updateIncomeScreen}
          updateTransferScreen={updateTransferScreen}
        />
        { subscreen === 'expense' && (
          <ExpenseTemplate
            budgetsFetched={budgets}
            categories={categories}
            selectedAccount={selectedAccount}
            accessToken={accessToken}
            detailedErrorCategories={errorCategories}
            detailedErrorBudgets={errorBudgets}
            editRecord={null}
          />
        )}
        {/* { subscreen === 'income' && (
          <IncomeTemplate
            categories={categories}
            selectedAccount={selectedAccount}
            accessToken={accessToken}
            detailedErrorCategories={errorCategories}
            editRecord={null}
          />
        )}
        { subscreen === 'transfer' && (
          <TransferTemplate
            categories={categories}
            selectedAccount={selectedAccount}
            accessToken={accessToken}
            subscreen={subscreen}
            detailedErrorCategories={errorCategories}
            editRecord={null}
          />
        )} */}
      </main>
    </div>

  )
}