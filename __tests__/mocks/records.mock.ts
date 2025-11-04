import { Category } from "@/shared/types/categories.types";
import { BankMovement, ExpensePaid } from "@/shared/types/records.types";
import { mockBudgets } from "./budgets.mock"
import { mockCategories } from "./categories.mock"

const categoryMock: Category = {
  _id: "65f3be727c46232bf19e7d00",
  categoryName: "Comida y Bebida",
  subCategories: [
    "Comida rápida",
    "Restaurantes",
    "Bebidas",
  ],
  icon: "foodAndDrink",
  __v: 0
}

export const recordMock: BankMovement ={
  _id: "6855ed98e3d57ba1214bc5bf",
  userId: "6352d54809f579c80080353f",
  shortName: "Arby's burger y papas",
  typeOfRecord: "expense",
  description: "",
  amount: 380,
  amountFormatted: "$380.00",
  date: new Date("2025-06-20T17:23:42.000Z"),
  fullDate: "Vie, 20 Jun, 2025",
  formattedTime: "17:23pm",
  category: categoryMock,
  subCategory: "Comida rápida",
  tag: [],
  indebtedPeople: [],
  account: "6579221448b3dbd136ce2988",
  budgets: [],
  isPaid: false,
  linkedBudgets: [],
}

// ExpensePaid based on recordMock
export const expensePaidFromRecordMock: ExpensePaid = {
  _id: "6855ed98e3d57ba1214bc5bf",
  shortName: "Arby's burger y papas",
  amount: 380,
  amountFormatted: "$380.00",
  formattedTime: "17:23pm",
  fullDate: "Vie, 20 Jun, 2025",
  isPaid: false,
  date: new Date("2025-06-20T17:23:42.000Z"),
}

export const editExpense: BankMovement = {
  ...recordMock,
  _id: "6855ed98e3d57ba1214bc5c0",
  shortName: 'Edited Expense',
  description: 'a edited expense description',
  amount: 500,
  amountFormatted: '$500.00',
  date: new Date("2025-06-21T17:23:42.000Z"),
  fullDate: "Sab, 21 Jun, 2025",
  tag: ['something'],
  indebtedPeople: [
    { name: 'John', amount: 12, amountPaid: 0, isPaid: false }
  ],
  linkedBudgets: [mockBudgets[0]],
  category: mockCategories[0],
  subCategory: mockCategories[0].subCategories[0],
};

// ExpensePaid based on editExpense
export const expensePaidFromEditExpense: ExpensePaid = {
  _id: "6855ed98e3d57ba1214bc5c0",
  shortName: "Edited Expense",
  amount: 500,
  amountFormatted: "$500.00",
  formattedTime: "17:23pm",
  fullDate: "Sab, 21 Jun, 2025",
  isPaid: false,
  date: new Date("2025-06-21T17:23:42.000Z"),
};

export const editIncome: BankMovement = {
  ...recordMock,
  _id: "6855ed98e3d57ba1214bc5c1",
  shortName: 'Edited Income',
  typeOfRecord: 'income',
  description: 'a edited income description',
  amount: 500,
  amountFormatted: '$500.00',
  date: new Date("2025-06-22T17:23:42.000Z"),
  fullDate: "Dom, 22 Jun, 2025",
  tag: ['something'],
  category: mockCategories[0],
  subCategory: mockCategories[0].subCategories[0],
  expensesPaid: []
}

export const paidRecordMock: BankMovement = {
  ...recordMock,
  _id: "6855ed98e3d57ba1214bc5c2",
  isPaid: true,
  shortName: "Paid Record Example",
  amount: 750,
  amountFormatted: "$750.00",
  date: new Date("2025-06-23T17:23:42.000Z"),
  fullDate: "Lun, 23 Jun, 2025",
};

export const transferRecordMock: BankMovement = {
  ...recordMock,
  _id: "6855ed98e3d57ba1214bc5c8",
  shortName: "Transfer to Savings",
  typeOfRecord: "transfer",
  description: "Monthly savings transfer",
  amount: 1000,
  amountFormatted: "$1,000.00",
  date: new Date("2025-06-24T10:00:00.000Z"),
  fullDate: "Mar, 24 Jun, 2025",
  transferRecord: {
    account: "6579221448b3dbd136ce2989",
    transferId: "transfer123"
  },
  tag: [],
  isPaid: true,
};

export const drawerTestExpense1: ExpensePaid = {
  ...recordMock,
  _id: "6855ed98e3d57ba1214bc5c3",
  shortName: "Drawer Test Expense 1",
  amount: 200,
  amountFormatted: "$200.00",
  date: new Date("2025-06-24T17:23:42.000Z"),
  fullDate: "Mar, 24 Jun, 2025",
  isPaid: false,
};

export const drawerTestExpense2: ExpensePaid = {
  ...recordMock,
  _id: "6855ed98e3d57ba1214bc5c4",
  shortName: "Drawer Test Expense 2",
  amount: 300,
  amountFormatted: "$300.00",
  date: new Date("2025-06-25T17:23:42.000Z"),
  fullDate: "Mie, 25 Jun, 2025",
  isPaid: true,
};

// Mock expenses for ExpensePaidList component tests
export const expensePaidListMock1: ExpensePaid = {
  _id: "6855ed98e3d57ba1214bc5c5",
  shortName: "Coffee Shop Purchase",
  amount: 150,
  amountFormatted: "$150.00",
  date: new Date("2025-07-01T08:30:00.000Z"),
  fullDate: "Mar, 1 Jul, 2025",
  formattedTime: "08:30am",
  isPaid: false,
};

export const expensePaidListMock2: ExpensePaid = {
  _id: "6855ed98e3d57ba1214bc5c6",
  shortName: "Grocery Store",
  amount: 2500,
  amountFormatted: "$2,500.00",
  date: new Date("2025-07-02T14:15:30.000Z"),
  fullDate: "Mie, 2 Jul, 2025",
  formattedTime: "14:15pm",
  isPaid: true,
};

export const expensePaidListMock3: ExpensePaid = {
  _id: "6855ed98e3d57ba1214bc5c7",
  shortName: "Gas Station Fill-up",
  amount: 5000,
  amountFormatted: "$5,000.00",
  date: new Date("2025-07-03T19:45:00.000Z"),
  fullDate: "Jue, 3 Jul, 2025",
  formattedTime: "19:45pm",
  isPaid: false,
};

// Transfer
export const editTransfer: BankMovement = {
  ...recordMock,
  _id: "6855ed98e3d57ba1214bc5c2",
  account: '2', // HSBC oro account ID
  transferRecord: {
    account: '1', // Santander account ID (destination)
    transferId: 'some-transfer-id'
  },
  shortName: 'Edited Transfer',
  typeOfRecord: 'transfer',
  description: 'a edited income description',
  amount: 500,
  amountFormatted: '$500.00',
  date: new Date("2025-06-22T17:23:42.000Z"),
  fullDate: "Dom, 22 Jun, 2025",
  tag: ['something'],
  category: mockCategories[0],
  subCategory: mockCategories[0].subCategories[0],
  expensesPaid: [expensePaidListMock1]
}