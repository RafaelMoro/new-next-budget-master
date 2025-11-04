"use client"
import { FormEvent, Fragment, useState } from "react"
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle, HR } from "flowbite-react"
import { RiErrorWarningLine } from "@remixicon/react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios";

import { EmptyAccordionResult } from "./EmptyAccordionResult"
import { useRecordPreview } from "@/shared/hooks/useRecordPreview"
import { RecordsPreviewDrawer } from "../RecordsPreviewDrawer"
import { DateRangeSearchPanel } from "@/shared/ui/molecules/DateRangeSearchPanel"
import { useSelectMonth } from "@/shared/hooks/useSelectMonth"
import { useSelectYear } from "@/shared/hooks/useSelectYear"
import { GetRecordsResponse } from "@/shared/types/records.types";
import { useDashboardStore } from "@/zustand/provider/dashboard-store-provider";
import { OLDER_RECORDS_TAG } from "@/shared/constants/Global.constants";
import { RecordEntrySkeleton } from "../RecordEntrySkeleton";
import { RecordEntry } from "../RecordEntry";
import { getDateInfo } from "@/shared/utils/getDateInfo";

export const OlderRecordsAccordion = () => {
  const selectedAccount = useDashboardStore(
    (state) => state.selectedAccount
  )
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const handleAccordionTitleClick = () => {
    setIsOpen(true)
  }

  const {
    completeCurrentMonth, completeLastMonth, year
  } = getDateInfo();
  const { selectedMonth, updateSelectMonth, allMonths } = useSelectMonth({ isOlderRecords: true })
  const { selectedYear, updateSelectYear } = useSelectYear({ isOlderRecords: true })

  const { data, isPending, isSuccess, refetch } = useQuery({
    queryKey: [OLDER_RECORDS_TAG, selectedAccount?._id],
    queryFn: async () => {
      const res: GetRecordsResponse = await axios.post('api/records', { accountId: selectedAccount?._id, month: selectedMonth, year: selectedYear })
      return res?.data.data
    },
    enabled: isOpen,
  })
  const records = data?.records ?? []

  const handleSubmitGetRecord = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setError(null)

    if (selectedMonth === completeCurrentMonth && selectedYear === year) {
      setError(`Los movimientos de ${completeCurrentMonth} se muestran en la sección de "Este mes". Selecciona un mes anterior.`)
      return
    }
    if (selectedMonth === completeLastMonth && selectedYear === year) {
      setError(`Los movimientos de ${completeLastMonth} se muestran en la sección de "Último mes". Selecciona un mes anterior.`)
      return
    }
    refetch()
  }

  const {
    record, handleOpenRecordPreviewDrawer, handleCloseRecordPreviewDrawer, openRecordDrawer
  } = useRecordPreview()

  return (
    <>
      <Accordion onClick={handleAccordionTitleClick} collapseAll className="max-w-3xl min-w-2xs md:min-w-[540px]">
        <AccordionPanel>
          <AccordionTitle>Transacciones anteriores</AccordionTitle>
          <AccordionContent>
            <div className="mb-5">
                <DateRangeSearchPanel
                  allMonths={allMonths}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  handleSubmit={handleSubmitGetRecord}
                  changeSelectedMonth={updateSelectMonth}
                  changeSelectedYear={updateSelectYear}
                />
              </div>
              { isPending && !error && Array.from({ length: 3 }).map((_, index) => (
                <RecordEntrySkeleton key={index} />
              ))}
              { (records.length > 0 && isSuccess && !error) && records.map((record, index) => (
                <Fragment key={record._id}>
                  <RecordEntry record={record} handleOpenRecordPreviewDrawer={handleOpenRecordPreviewDrawer} />
                  {index !== (records.length - 1) && <HR />}
                </Fragment>
              ))}
              { (records.length === 0 && isSuccess && !error) && (
                <EmptyAccordionResult />
              )}
              { error && (
                <div data-testid="error-accordion-result" className="flex flex-col gap-5 items-center">
                  <span className="text-red-500">
                    <RiErrorWarningLine />
                  </span>
                  <p className="text-red-500">{error}</p>
                </div>
              )}
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
      <RecordsPreviewDrawer open={openRecordDrawer} handleClose={handleCloseRecordPreviewDrawer} record={record} />
    </>
  )
}