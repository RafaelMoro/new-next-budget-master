import { YupError } from "../types/global.types"

export const handleErrorForm = (error: unknown): YupError => {
  const newError = error as YupError
  return newError
}

export const createYearsArray = (currentYear: string): string[] => {
  const END_YEAR = Number(currentYear);
  const START_YEAR = 2022;
  const times = END_YEAR - START_YEAR;

  const years = [String(START_YEAR)];

  for (let index = 0; index < times; index += 1) {
    const year = START_YEAR + (index + 1);
    years.push(String(year));
  }

  return years;
};