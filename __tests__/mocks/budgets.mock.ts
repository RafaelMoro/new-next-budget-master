import { Budget } from "@/shared/types/budgets.types";

export const mockBudgets: Budget[] = [
  {
    _id: "budget1",
    __v: 0,
    name: "Monthly Budget",
    typeBudget: "periodic",
    description: "Budget for monthly expenses",
    startDate: "2023-01-01",
    endDate: "2023-01-31",
    limit: 1000,
    currentAmount: 500,
    period: "monthly",
    nextResetDate: "2023-02-01",
    isActive: true,
    previousPeriods: []
  },
  {
    _id: "budget2",
    __v: 0,
    name: "Yearly Savings",
    typeBudget: "one-time",
    description: "Savings for the year",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    limit: 5000,
    currentAmount: 2000,
    period: "yearly",
    nextResetDate: "2024-01-01",
    isActive: true,
    previousPeriods: []
  }
]