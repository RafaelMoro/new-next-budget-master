"use client"
import { Fragment, useState } from "react"
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle, HR } from "flowbite-react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios";

import { LAST_MONTH_RECORDS_TAG, RECORDS_API_ENDPOINT } from "@/shared/constants/global.constants";
import { getDateInfo } from "@/shared/utils/getDateInfo";
import { GetRecordsResponse } from "@/shared/types/records.types";
import { useDashboardStore } from "@/zustand/provider/dashboard-store-provider";
import { RecordEntrySkeleton } from "../RecordEntrySkeleton";
import { RecordEntry } from "../RecordEntry";
import { useRecordPreview } from "@/shared/hooks/useRecordPreview";
import { RecordsPreviewDrawer } from "../RecordsPreviewDrawer";
import { EmptyAccordionResult } from "./EmptyAccordionResult";

export const LastMonthAccordion = () => {
  const selectedAccount = useDashboardStore(
    (state) => state.selectedAccount
  )
  const [isOpen, setIsOpen] = useState(false)
  // Toggle open state on title click
  const handleAccordionTitleClick = () => {
    setIsOpen(true)
  }

  const {
    record, handleOpenRecordPreviewDrawer, handleCloseRecordPreviewDrawer, openRecordDrawer
  } = useRecordPreview()

  const {
    lastMonth, year,
  } = getDateInfo();

  const { data, isPending, isSuccess } = useQuery({
    queryKey: [LAST_MONTH_RECORDS_TAG, selectedAccount?._id],
    queryFn: async () => {
      const res: GetRecordsResponse = await axios.post(
        RECORDS_API_ENDPOINT,
        { accountId: selectedAccount?._id, month: lastMonth, year }
      )
      return res?.data.data
    },
    enabled: isOpen,
  })
  const records = data?.records ?? []

  return (
    <>
      <Accordion onClick={handleAccordionTitleClick} collapseAll className="max-w-3xl min-w-2xs md:min-w-[540px]">
        <AccordionPanel>
          <AccordionTitle>Último mes</AccordionTitle>
          <AccordionContent>
            { isPending && Array.from({ length: 3 }).map((_, index) => (
              <RecordEntrySkeleton key={index} />
            ))}
            { (records.length > 0 && isSuccess) && records.map((record, index) => (
              <Fragment key={record._id}>
                <RecordEntry record={record} handleOpenRecordPreviewDrawer={handleOpenRecordPreviewDrawer} />
                {index !== (records.length - 1) && <HR />}
              </Fragment>
            ))}
            { (records.length === 0 && isSuccess) && (
              <EmptyAccordionResult />
            )}
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
      <RecordsPreviewDrawer open={openRecordDrawer} handleClose={handleCloseRecordPreviewDrawer} record={record} />
    </>
  )
}