import { Button } from "flowbite-react";

import { AccountActionsModal } from "@/features/Accounts/AccountActionsModal";
import { Account } from "@/features/Accounts/Accounts";
import { CurrentMonthAccordionRecords } from "@/features/Records/Accordions/CurrentMonthAccordionRecords";
import { useAccountModal } from "@/shared/hooks/useAccountModal";
import { useDashboard } from "@/shared/hooks/useDashboard";
import { useDashboardStore } from "@/zustand/provider/dashboard-store-provider";
import { LastMonthAccordion } from "@/features/Records/Accordions/LastMonthAccordion"
import { OlderRecordsAccordion } from "@/features/Records/Accordions/OlderRecordsAccordion";

/**
 * Component Description: This subscreen shows the overview of the account with it's information and records
 */
export const OverviewAccountTransactionsSubscreen = () => {
  const { handleGoCreateRecordRoute } = useDashboard()
  const { records, selectedAccountDisplay } = useDashboardStore(
    (state) => state
  )
  const {
    openAccModal,
    accDetails,
    accAction,
    openModal,
    closeModal,
    updateAccAction
  } = useAccountModal()

  return (
    <section className="w-full my-9 flex flex-col gap-5 items-center justify-center">
      { selectedAccountDisplay && (
        <Account
          account={selectedAccountDisplay}
          openModal={openModal}
        />
      )}
      <AccountActionsModal
        accDetails={accDetails}
        openAccModal={openAccModal}
        accAction={accAction}
        closeModal={closeModal}
        updateAccAction={updateAccAction}
      />
      { records.length > 0 && (
        <Button onClick={handleGoCreateRecordRoute} >
          Registrar movimiento
        </Button>
      ) }
      <CurrentMonthAccordionRecords records={records} title="Este mes" />
      <LastMonthAccordion />
      <OlderRecordsAccordion />
    </section>
  )
}