import { AccountBank } from "@/shared/types/accounts.types";

export const mockAccounts: AccountBank[] = [
  {
    _id: '1',
    title: 'Santander',
    accountType: 'Credito',
    backgroundColor: '',
    color: '',
    amount: 12640.54,
    sub: '',
    accountProvider: 'mastercard',
  },
  {
    _id: '2',
    title: 'HSBC oro',
    accountType: 'Credito',
    backgroundColor: '',
    color: '',
    amount: 24780.08,
    sub: '',
    accountProvider: 'visa',
  },
];