import { Button, Dropdown, DropdownItem } from "flowbite-react"
import { RiArrowDownSLine } from "@remixicon/react"

import { CompleteMonthsType } from "@/shared/types/global.types";

interface SelectMonthDropdownProps {
  allMonths: CompleteMonthsType[]
  selectedMonth: CompleteMonthsType | null
  changeSelectedMonth: (newMonth: CompleteMonthsType) => void
}

/**
* Component to select a month from a dropdown.
* It's meant to be used in the useSelectMonth hook.
*/
export const SelectMonthDropdown = ({ allMonths, selectedMonth, changeSelectedMonth }: SelectMonthDropdownProps) => {
  return (
    <Dropdown label="" renderTrigger={() => (
      <Button data-testid="select-month-dropdown-button" color="light">
        { selectedMonth ? selectedMonth : 'Mes:' }
        <RiArrowDownSLine />
      </Button>
    )}>
      { allMonths.map((month, index) => (
        <DropdownItem
          onClick={() => changeSelectedMonth(month)}
          value={month}
          key={`${month}-${index}`}
        >{month}</DropdownItem>
      ))}
    </Dropdown>
  )
}