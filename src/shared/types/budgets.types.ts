import { DetailedError } from "./global.types";

export type TypeBudget = 'one-time' | 'periodic';
export type PeriodBudget = 'weekly' | 'bi-weekly' | 'monthly' | 'daily' | 'yearly';

export type Budget = {
  _id: string
  __v: number;
  name: string;
  typeBudget: TypeBudget;
  description: string;
  // start date and end date are saved as strings because of the non serialized error in redux but these are Date type
  startDate: string;
  endDate: string;
  limit: number;
  currentAmount: number;
  period: PeriodBudget;
  // nextResetDate is saved as strings because of the non serialized error in redux but these are Date type
  nextResetDate: string;
  isActive: boolean;
  previousPeriods: string[];
}

export type SelectBudget = {
  budgetId: string
  name: string
}

export type GetBudgetsResponse = {
  detailedError: DetailedError | null;
  budgets: Budget[];
}

export type FetchBudgetsResponse = {
  data: {
    budgets: Budget[];
  }
}