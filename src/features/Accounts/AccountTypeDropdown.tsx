"use client"
import { useEffect, useMemo, useState } from "react";
import { RiArrowDownSLine } from "@remixicon/react";
import { Button, Dropdown, DropdownItem } from "flowbite-react";

import { AccountTypes, TYPE_OF_ACCOUNTS } from "@/shared/types/accounts.types";

interface AccountTypeDropdownProps {
  selectedAccountType: AccountTypes
  changeSelectedAccountType: (newAccType: AccountTypes) => void
}

/**
 * Component Description:
 * The component needs as param a state with its handler to update it
 * @params selectedAccountType: AccountType state - changeSelectedAccountType: handler to update the state
 */
export const AccountTypeDropdown = ({ selectedAccountType, changeSelectedAccountType }: AccountTypeDropdownProps) => {
  const typeAccounts = useMemo(() => [...TYPE_OF_ACCOUNTS], []);
  const [filteredAccountTypes, setFilteredAccountTypes] = useState<AccountTypes[]>(typeAccounts)

  const handleSelectAccountType = (newAccType: AccountTypes) => {
    changeSelectedAccountType(newAccType)
    const fileteredTypes = typeAccounts.filter(type => type !== newAccType)
    setFilteredAccountTypes(fileteredTypes)
  }

  useEffect(() => {
    if (selectedAccountType) {
      const fileteredTypes = typeAccounts.filter(type => type !== selectedAccountType)
      setFilteredAccountTypes(fileteredTypes)
    }
  }, [selectedAccountType, typeAccounts])
  
  return (
    <Dropdown label="" renderTrigger={() => (
      <Button color="dark">
        Tipo de cuenta: {selectedAccountType}
        <RiArrowDownSLine />
      </Button>
    )}>
      { filteredAccountTypes.map((type, index) => (
        <DropdownItem
          onClick={() => handleSelectAccountType(type)}
          value={type}
          key={`${type}-${index}`}
        >{type}</DropdownItem>
      ))}
    </Dropdown>
  )
}