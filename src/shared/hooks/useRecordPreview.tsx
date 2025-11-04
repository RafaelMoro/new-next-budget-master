import { useState } from "react";
import { BankMovement } from "../types/records.types";

export const useRecordPreview = () => {
  const [openRecordDrawer, setOpenRecordDrawer] = useState(false);
  const [record, setRecord] = useState<BankMovement | null>(null);

  const handleOpenRecordPreviewDrawer = (passedRecord: BankMovement) => {
    setOpenRecordDrawer(true)
    setRecord(passedRecord);
  }

  const handleCloseRecordPreviewDrawer = () => {
    setOpenRecordDrawer(false);
    setRecord(null);
  }

  return {
    openRecordDrawer,
    record,
    handleOpenRecordPreviewDrawer,
    handleCloseRecordPreviewDrawer,
  }
}