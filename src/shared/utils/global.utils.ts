import { YupError } from "../types/global.types"

export const handleErrorForm = (error: unknown): YupError => {
  const newError = error as YupError
  return newError
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
export const formatNumberToCurrency = (amount: number): string =>
  formatter.format(amount);