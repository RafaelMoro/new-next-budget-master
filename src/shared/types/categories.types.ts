import { DetailedError } from "./global.types";

export type Category = {
  _id: string;
  __v: number;
  categoryName: string;
  subCategories: string[];
  icon: CategoriesIcons;
}

export type CategoriesIcons = 'foodAndDrink' |
  'house' |
  'utilities' |
  'subcriptions' |
  'transportation' |
  'debtAndLoans' |
  'healthCare' |
  'kids' |
  'shopping' |
  'entertainment' |
  'savings' |
  'income' |
  'newCategory'

export type CategoryShown = {
  name: string;
  categoryId: string;
}

export type GetCategoriesResponse = {
  detailedError: DetailedError | null;
  categories: Category[];
}

export type FetchCategoriesResponse = {
  data: {
    categories: Category[];
  }
}