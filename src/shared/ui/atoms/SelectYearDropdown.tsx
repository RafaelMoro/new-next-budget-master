import { Button, Dropdown, DropdownItem } from "flowbite-react"
import { RiArrowDownSLine } from "@remixicon/react"

import { getDateInfo } from "@/shared/utils/getDateInfo";

interface SelectYearDropdownProps {
  selectedYear: string | null
  changeSelectedYear: (newYear: string) => void
}

/**
* Component to select a year from a dropdown.
* It's meant to be used in the useSelectYear hook.
*/
export const SelectYearDropdown = ({ selectedYear, changeSelectedYear: changeSelectedYear }: SelectYearDropdownProps ) => {
  const { years } = getDateInfo()

  return (
    <Dropdown label="" renderTrigger={() => (
      <Button data-testid="select-year-dropdown-button" color="light">
        { selectedYear ? selectedYear : 'Año:' }
        <RiArrowDownSLine />
      </Button>
    )}>
      { years.map((year, index) => (
        <DropdownItem
          onClick={() => changeSelectedYear(year)}
          value={year}
          key={`${year}-${index}`}
        >{year}</DropdownItem>
      ))}
    </Dropdown>
  )
}