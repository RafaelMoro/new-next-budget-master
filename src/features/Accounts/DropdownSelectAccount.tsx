"use client"
import { Dropdown, DropdownItem } from "flowbite-react"
import { RiExpandUpDownLine } from "@remixicon/react";
import { useQueryClient } from '@tanstack/react-query'

import { useSelectAccount } from "@/shared/hooks/useSelectAccount";
import { LAST_MONTH_RECORDS_TAG } from "@/shared/constants/global.constants";

interface DropdownSelectAccountProps {
  cssClass?: string;
  goAccounts: () => void
}
/**
 * Component Description:
 * For desktop, This button component is shown in the aside bar of the dashboard to select other account.
 * For mobile, it's shown in the drawer menu of the header
 * 
 * Caveats: I cannot have the custom element of the prop renderTrigger in a separate component as the dropdown when clicked,
 * it does not trigger the onclick event.
 */
export const DropdownSelectAccount = ({ cssClass, goAccounts }: DropdownSelectAccountProps) => {
  const queryClient = useQueryClient()
  const { accountsOptions, selectedAccountDisplay, handleSelectAccount, hasMore10Accounts } = useSelectAccount({ limit10Accounts: true })

  const onSelectAccount = (accountId: string) => {
    queryClient.invalidateQueries({ queryKey: [LAST_MONTH_RECORDS_TAG] })
    handleSelectAccount(accountId)
  }

  return (
    <div className={cssClass && cssClass}>
      <Dropdown aria-label="Select other account" label="" renderTrigger={() => (
        <article
          className="flex justify-between w-full items-center gap-x-2.5 rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm transition-all hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 hover:dark:bg-gray-900 focus:ring-2 focus:ring-indigo-200 focus:dark:ring-indigo-700/30 focus:border-indigo-500 focus:dark:border-indigo-700"
          >
          <div className="flex flex-col gap-2 items-start">
            <p className="text-sm">{selectedAccountDisplay?.name}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{selectedAccountDisplay?.amount}</p>
            <span className="bg-blue-100 max-w-min text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
              {selectedAccountDisplay?.type}
            </span>
          </div>
          <RiExpandUpDownLine data-testid="dropdown-icon" className="cursor-pointer" strokeWidth={1} />
        </article>
      )}>
        { accountsOptions.length > 0 && accountsOptions.map((acc) => (
            <DropdownItem data-testid={`option-${acc.accountId}`} className="flex justify-between" onClick={() => onSelectAccount(acc.accountId)} key={acc.accountId}>
              <div className="flex flex-col gap-1 items-start">
                <span>{acc.name}</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{acc.type}</span>
              </div>
              <span>{acc.amount}</span>
            </DropdownItem>
        )) }
        { hasMore10Accounts && (
          <DropdownItem className="flex justify-between" onClick={goAccounts}>
            Ver todas las cuentas
          </DropdownItem>
        ) }
      </Dropdown>
    </div>
  )
}