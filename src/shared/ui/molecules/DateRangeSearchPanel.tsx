"use client"

import { Button } from "flowbite-react"
import { SelectMonthDropdown } from "../atoms/SelectMonthDropdown"
import { SelectYearDropdown } from "../atoms/SelectYearDropdown"
import { CompleteMonthsType } from "@/shared/types/global.types"
import { FormEvent } from "react"

interface DateRangeSearchPanelProps {
  allMonths: CompleteMonthsType[]
  selectedMonth: CompleteMonthsType | null
  selectedYear: string | null
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void
  changeSelectedMonth: (newMonth: CompleteMonthsType) => void
  changeSelectedYear: (newYear: string) => void
}

export const DateRangeSearchPanel = ({
  allMonths,
  selectedMonth,
  selectedYear,
  handleSubmit,
  changeSelectedMonth,
  changeSelectedYear
}: DateRangeSearchPanelProps) => {
  return (
  <form className="flex justify-center gap-3" onSubmit={handleSubmit}>
    <SelectMonthDropdown allMonths={allMonths} selectedMonth={selectedMonth} changeSelectedMonth={changeSelectedMonth} />
    <SelectYearDropdown selectedYear={selectedYear} changeSelectedYear={changeSelectedYear} />
    <Button type="submit" className="max-w-max" outline>Buscar</Button>
  </form>
  )
}