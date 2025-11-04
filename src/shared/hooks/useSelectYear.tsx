import { useEffect, useState } from "react"
import { getDateInfo } from "../utils/getDateInfo"

interface UseSelectYearProps {
  isOlderRecords?: boolean
}

/**
* It's to select year for the dropdown SelectYearDropdown
*/
export const useSelectYear = ({ isOlderRecords = false }: UseSelectYearProps) => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const updateSelectYear = (newYear: string) => setSelectedYear(newYear)

  useEffect(() => {
    const { year, yearOlderRecords } = getDateInfo()

    if (isOlderRecords) {
      setSelectedYear(yearOlderRecords)
      return
    }
    setSelectedYear(year)
  }, [isOlderRecords])

  return {
    selectedYear,
    updateSelectYear
  }
}