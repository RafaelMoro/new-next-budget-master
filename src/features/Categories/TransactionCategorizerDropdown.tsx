"use client"

import { CategoryShown } from "@/shared/types/categories.types"
import { ErrorMessage } from "@/shared/ui/atoms/ErrorMessage"
import { RiArrowDownSLine } from "@remixicon/react"
import { Button, Dropdown, DropdownItem } from "flowbite-react"

interface TransactionCategorizerDropdownProps {
  categoriesShown: CategoryShown[]
  categorySelected: CategoryShown
  updateCategory: (newCat: CategoryShown) => void
  categoryError: string | null
  subcategories: string[]
  subcategory: string | null
  updateSubcategory: (newSubcat: string) => void
  subcategoryError: string | null
}

/**
* Component Description: It's a dropdown to select category and subcategory for transactions
* This component is to meant to be used with the custom hook useCategoriesForm
*/
export const TransactionCategorizerDropdown = ({
  categoriesShown, categorySelected, updateCategory, categoryError, subcategories, subcategory, updateSubcategory, subcategoryError
}: TransactionCategorizerDropdownProps) => {
  return (
    <>
      <Dropdown aria-label="Select category" label="Categorias" renderTrigger={() => (
        <Button data-testid="category-dropdown" color="dark">
          Categoria: {categorySelected.name}
          <RiArrowDownSLine />
        </Button>
      )}>
        { categoriesShown.map((cat) => (
          <DropdownItem key={cat.categoryId} value={cat.categoryId} onClick={() => updateCategory(cat) } className="flex justify-between">
            {cat.name}
          </DropdownItem>
        )) }
      </Dropdown>
      { categoryError && (
        <ErrorMessage isAnimated>{categoryError}</ErrorMessage>
      )}
      <Dropdown disabled={subcategories.length === 0} aria-label="Select subcategory" label="Subcategorias" renderTrigger={() => (
        <Button data-testid="subcategory-dropdown" color="dark">
          Subcategoria: {subcategory}
          <RiArrowDownSLine />
        </Button>
      )}>
        { (subcategories.length > 0) && subcategories.map((subcat) => (
          <DropdownItem key={subcat} onClick={() => updateSubcategory(subcat)} className="flex justify-between">
            {subcat}
          </DropdownItem>
        )) }
      </Dropdown>
      { subcategoryError && (
        <ErrorMessage isAnimated>{subcategoryError}</ErrorMessage>
      )}
    </>
  )
}