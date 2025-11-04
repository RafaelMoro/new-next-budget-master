import { Category } from "@/shared/types/categories.types";

export const mockCategories: Category[] = [
  {
    _id: "65f3be727c46232bf19e7d00",
    categoryName: "Comida y Bebida",
    subCategories: [
        "Bar",
        "Alcohol & Cigarros",
        "Comida para llevar",
        "Comida rápida",
        "Cafetería",
        "Restaurantes",
        "Despensa"
    ],
    icon: "foodAndDrink",
    __v: 0
  },
  {
    _id: "65f3be727c46232bf19e7d01",
    categoryName: "Transporte",
    subCategories: [
        "Bus",
        "Taxi",
        "Gasolina"
    ],
    icon: "transportation",
    __v: 0
  }
]