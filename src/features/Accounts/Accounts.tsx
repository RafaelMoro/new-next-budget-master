import Image from "next/image"
import { AccountProvider, AccountsDisplay } from "@/shared/types/accounts.types";

interface AccountProps {
  account: AccountsDisplay
  openModal: (acc: AccountsDisplay) => void
}

/**
 * Component Description: Card representation of a bank account as button
 */
export const Account = ({ account, openModal }: AccountProps) => {
  const { name, amount, type, accountProvider = 'mastercard', terminationFourDigitsTransformed } = account
  const accProviderImg: Record<AccountProvider, string> = {
    mastercard: '/img/mastercard-logo.svg',
    visa: '/img/visa-logo.svg',
    'american-express': '/img/amex-logo.svg'
  }

  return (
    <button onClick={() => openModal(account)} className="p-2 rounded-3xl card-gradient-bg flex flex-col justify-between max-w-64 min-w-3xs min-h-40 text-start cursor-pointer">
      <span className="text-lg text-gray-200">{name}</span>
      <div>
        <h5 className="text-2xl text-gray-200 font-semibold">{amount}</h5>
        <div className="flex justify-between mx-2 mb-1">
          <p className="text-sm text-gray-300 dark:text-gray-400">{type} {terminationFourDigitsTransformed}</p>
          <Image src={accProviderImg[accountProvider]} alt="Account Provider Logo" width={40} height={40} />
        </div>
      </div>
    </button>
  )
}