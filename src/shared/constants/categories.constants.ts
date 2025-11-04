import {
  RiRestaurantLine,
  RiHome9Fill,
  RiServiceLine,
  RiBusLine,
  RiBankLine,
  RiHospitalLine,
  RiShoppingBagLine
} from "@remixicon/react";
import { CategoriesIcons } from "../types/categories.types";
import { ElementType } from "react";
import { BellDollarIcon } from "../ui/icons/BellDollarIcon";
import { BabyCarriageIcon } from "../ui/icons/BabyCarriageIcon";
import { MaskTheaterIcon } from "../ui/icons/MaskTheaterIcon";
import { BusinessPlanIcon } from "../ui/icons/BusinessPlanIcon";
import { PigMoneyIcon } from "../ui/icons/PigMoneyIcon";
import { CoinsIcon } from "../ui/icons/CoinsIcon";

export const categoryIcons: Record<CategoriesIcons, ElementType> = {
  foodAndDrink: RiRestaurantLine,
  house: RiHome9Fill,
  utilities: RiServiceLine,
  subcriptions: BellDollarIcon,
  transportation: RiBusLine,
  debtAndLoans: RiBankLine,
  healthCare: RiHospitalLine,
  kids: BabyCarriageIcon,
  shopping: RiShoppingBagLine,
  entertainment: MaskTheaterIcon,
  savings: PigMoneyIcon,
  income: BusinessPlanIcon,
  newCategory: CoinsIcon
}

export const CATEGORY_FETCH_ERROR = 'Error al obtener las categorías. Por favor, inténtalo más tarde.';

// Form Validation errors
export const CATEGORY_REQUIRED = 'Por favor, seleccione una categoría.'
export const SUBCATEGORY_REQUIRED = 'Por favor, seleccione una subcategoría.';