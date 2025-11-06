import { SelectBudget } from "@/shared/types/budgets.types"
import { RiArrowDownSLine } from "@remixicon/react"
import { Button, Dropdown, DropdownItem } from "flowbite-react"

interface SelectBudgetDropdownProps {
  budgetOptions: SelectBudget[]
  selectedBudget: SelectBudget | null
  updateSelectedBudget: (budget: SelectBudget) => void
}

export const SelectBudgetDropdown = ({ budgetOptions, selectedBudget, updateSelectedBudget }: SelectBudgetDropdownProps) => {
  return (
    <Dropdown aria-label="Select category" label="Categorias" renderTrigger={() => (
      <Button data-testid="select-budget-dropdown-button" color="dark">
        Presupuesto: {selectedBudget?.name}
        <RiArrowDownSLine />
      </Button>
    )}>
      { budgetOptions.map((budget) => (
        <DropdownItem key={budget.budgetId} value={budget.budgetId} onClick={() => updateSelectedBudget(budget) } className="flex justify-between">
          {budget.name}
        </DropdownItem>
      )) }
    </Dropdown>
  )
}