import { Button, ButtonGroup } from "flowbite-react"
import clsx from "clsx"
import { TransactionScreens } from "@/shared/types/dashboard.types"

interface TransactionManagerGroupButtonProps {
  screen: TransactionScreens
  updateExpenseScreen: () => void
  updateIncomeScreen: () => void
  updateTransferScreen: () => void
}

export const TransactionManagerGroupButton = ({
  screen, updateExpenseScreen, updateIncomeScreen, updateTransferScreen
}: TransactionManagerGroupButtonProps) => {
  const expenseCss = clsx({ "dark:text-indigo-400": screen === 'expense' })
  const incomeCss = clsx({ "dark:text-indigo-400": screen === 'income' })
  const transferCss = clsx({ "dark:text-indigo-400": screen === 'transfer' })

  return (
    <div className="w-full flex justify-center">
      <ButtonGroup>
        <Button
          className={expenseCss}
          onClick={updateExpenseScreen}
          color="alternative"
        >
          Gasto
        </Button>
        <Button className={incomeCss} onClick={updateIncomeScreen} color="alternative">
          Ingreso
        </Button>
        <Button className={transferCss} onClick={updateTransferScreen} color="alternative">
          Transferencia
        </Button>
      </ButtonGroup>
    </div>
  )
}