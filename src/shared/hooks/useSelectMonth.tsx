import { useEffect, useMemo, useState } from "react"
import { abbreviatedMonthsCompleteMonthsDict, AbbreviatedMonthsType, CompleteMonthsType, MONTHS } from "../types/global.types"
import { getDateInfo } from "../utils/getDateInfo"

interface UseSelectMonthProps {
  isOlderRecords?: boolean
}

/**
* It's to select month for the dropdown SelectMonthDropdown
*/
export const useSelectMonth = ({ isOlderRecords = false }: UseSelectMonthProps) => {
  const [selectedMonth, setSelectedMonth] = useState<CompleteMonthsType | null>(null)
  const [selectedAbbreviatedMonth, setSelectedAbbreviatedMonth] = useState<AbbreviatedMonthsType | null>(null)
  const updateSelectMonth = (newMonth: CompleteMonthsType) => {
    const abbreviatedMonth = abbreviatedMonthsCompleteMonthsDict[newMonth];
    setSelectedMonth(newMonth);
    setSelectedAbbreviatedMonth(abbreviatedMonth);
  }

  const allMonths: CompleteMonthsType[] = useMemo(() => [...MONTHS], []);

  useEffect(() => {
    const { completeMonth, beforeLastMonth, beforeLastMonthComplete } = getDateInfo()
    if (isOlderRecords) {
      setSelectedMonth(beforeLastMonthComplete)
      setSelectedAbbreviatedMonth(beforeLastMonth);
      return;
    }

    const abbreviatedMonth = abbreviatedMonthsCompleteMonthsDict[completeMonth];
    setSelectedMonth(completeMonth)
    setSelectedAbbreviatedMonth(abbreviatedMonth);
  }, [isOlderRecords])

  return {
    selectedMonth,
    allMonths,
    selectedAbbreviatedMonth,
    updateSelectMonth
  }
}