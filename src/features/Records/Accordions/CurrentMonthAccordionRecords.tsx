import { BankMovement } from "@/shared/types/records.types"
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle, HR } from "flowbite-react"
import { Fragment } from "react";
import { RecordEntry } from "../RecordEntry";
import { RecordsPreviewDrawer } from "../RecordsPreviewDrawer";
import { useRecordPreview } from "@/shared/hooks/useRecordPreview";
import { EmptyAccordionResult } from "./EmptyAccordionResult";

interface CurrentMonthAccordionRecordsProps {
  records: BankMovement[];
  title: string
}

/**
 * Component Description: It's an accordion to show the records of the current month
 * @param records - Records fetched of any month
 * @param title - Title of the accordion
 * @returns The accordion showing the records
 */
export const CurrentMonthAccordionRecords = ({ records, title }: CurrentMonthAccordionRecordsProps) => {
  const {
    record, handleOpenRecordPreviewDrawer, handleCloseRecordPreviewDrawer, openRecordDrawer
  } = useRecordPreview()

  return (
    <>
      <Accordion className="max-w-3xl min-w-2xs md:min-w-[540px]">
        <AccordionPanel>
          <AccordionTitle>{title}</AccordionTitle>
          <AccordionContent>
            { records.length > 0 && records.map((record, index) => (
              <Fragment key={record._id}>
                <RecordEntry record={record} handleOpenRecordPreviewDrawer={handleOpenRecordPreviewDrawer} />
                {index !== (records.length - 1) && <HR />}
              </Fragment>
            ))}
            { records.length === 0 && (
              <EmptyAccordionResult />
            )}
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
      <RecordsPreviewDrawer open={openRecordDrawer} handleClose={handleCloseRecordPreviewDrawer} record={record} />
    </>
  )
}