import { BankMovement } from "../types/records.types";

export const getExpensesIncomesTotal = (allRecords: BankMovement[]) => {
  const totalsMap: Record<string, { expenseTotal: number; incomeTotal: number }> = {};

  allRecords.forEach((record) => {
    const { fullDate, typeOfRecord, amount } = record;
    if (typeOfRecord !== 'expense' && typeOfRecord !== 'income') return;
    if (!totalsMap[fullDate]) {
      totalsMap[fullDate] = { expenseTotal: 0, incomeTotal: 0 };
    }
    if (typeOfRecord === 'expense') {
      totalsMap[fullDate].expenseTotal += amount;
    } else if (typeOfRecord === 'income') {
      totalsMap[fullDate].incomeTotal += amount;
    }
  });

  return Object.entries(totalsMap).map(([fullDate, totals]) => ({
    fullDate,
    expenseTotal: totals.expenseTotal,
    incomeTotal: totals.incomeTotal,
  }));
};