"use client"
import { useEffect, useState } from "react"
import { Budget, SelectBudget } from "../types/budgets.types"

interface UseHandleBudgetsProps {
  budgetsFetched: Budget[]
}

/**
 * Hook Description: Used along with SelectBudgetDropdown. It handles the budget that was selected in the dropdown.
 */
export const useHandleBudgets = ({ budgetsFetched }: UseHandleBudgetsProps) => {
  const [budgets, setBudgets] = useState<SelectBudget[]>([])
  const [selectedBudget, setSelectedBudget] = useState<SelectBudget | null>(null)
  const [budgetsOptions, setBudgetOptions] = useState<SelectBudget[]>([])

  const updateSelectedBudget = (newBudget: SelectBudget) => {
    setSelectedBudget(newBudget)
    const filteredOptions = budgets.filter((bud) => bud.budgetId !== newBudget.budgetId)
    setBudgetOptions(filteredOptions)
  }

  useEffect(() => {
    if (budgetsFetched.length > 0) {
      const budgetsFormatted: SelectBudget[] = budgetsFetched.map((budget) => ({
        budgetId: budget._id,
        name: budget.name,
      }))
      setBudgets(budgetsFormatted)
      setBudgetOptions(budgetsFormatted)
    }
  }, [budgetsFetched])

  return {
    budgets,
    selectedBudget,
    budgetsOptions,
    updateSelectedBudget,
  }
}