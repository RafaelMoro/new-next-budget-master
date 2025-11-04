"use client"
import { useEffect, useMemo, useState } from "react";
import { Button, Dropdown, DropdownItem } from "flowbite-react"
import { RiArrowDownSLine } from "@remixicon/react"

import { ACCOUNT_PROVIDERS, AccountProvider } from "@/shared/types/accounts.types";
import { TYPE_PROVIDER_DICT } from "@/shared/constants/accounts.constants";

interface AccountProviderDropdownProps {
  selectedProvider: AccountProvider;
  changeSelectedProviderType: (newProvider: AccountProvider) => void
}

/**
 * Component Description:
 * The component needs as param a state with its handler to update it
 * @params selectedProvider: AccountProvider state - changeSelectedProviderType: handler to update the state
 */
export const AccountProviderDropdown = ({ selectedProvider, changeSelectedProviderType }: AccountProviderDropdownProps) => {
  const typeProviders = useMemo(() => [...ACCOUNT_PROVIDERS], []);
  
  const [filteredProviders, setFilteredAccountTypes] = useState<AccountProvider[]>(typeProviders)

  useEffect(() => {
      if (selectedProvider) {
        const newFilteredProviders = typeProviders.filter(prov => prov !== selectedProvider)
        setFilteredAccountTypes(newFilteredProviders)
      }
    }, [selectedProvider, typeProviders])

  const handleSelectAccountType = (newAccProvider: AccountProvider) => {
    changeSelectedProviderType(newAccProvider)
    const fileteredTypes = typeProviders.filter(prov => prov !== newAccProvider)
    setFilteredAccountTypes(fileteredTypes)
  }

  return (
    <Dropdown label="" renderTrigger={() => (
      <Button color="dark">
        Proveedor: {TYPE_PROVIDER_DICT[selectedProvider]}
        <RiArrowDownSLine />
      </Button>
    )}>
      { filteredProviders.map((prov, index) => (
        <DropdownItem
          onClick={() => handleSelectAccountType(prov)}
          value={prov}
          key={`${prov}-${index}`}
        >{TYPE_PROVIDER_DICT[prov]}</DropdownItem>
      ))}
    </Dropdown>
  )
}