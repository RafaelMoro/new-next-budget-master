"use client"
import { toast, Toaster } from "sonner";
import { useEffect, useState } from "react";

import { AccountBank } from "@/shared/types/accounts.types";
import { BankMovement } from "@/shared/types/records.types";
import { DetailedError } from "@/shared/types/global.types";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { HeaderDashboard } from "@/shared/ui/organisms/HeaderDashboard";
import { HeaderMenuMobile } from "@/shared/ui/organisms/HeaderMenuMobile";
import { DashboardScreens } from "@/shared/types/dashboard.types";
import { useDashboardStore } from "@/zustand/provider/dashboard-store-provider";
import { getDashboardScreen, saveDashboardScreen } from "@/shared/lib/preferences.lib";
import { NoAccountsFoundScreen } from "../Accounts/NoAccountsFoundScreen";
import { SelectAccountDialog } from "../Accounts/SelectAccountDialog";
import { ERROR_CONNECTION, ERROR_CONNECTION_MESSAGE, GENERAL_ERROR_MESSAGE } from "@/shared/constants/global.constants";
import { DashboardAside } from "./DashboardAside";
import { AccountSubscreen } from "./subscreens/AccountSubscreen";

interface DashboardViewProps {
  accountsFetched: AccountBank[]
  recordsFetched: BankMovement[]
  detailedError: DetailedError | null
}

/**
 * Component Description:
 * For mobile, the component renders the header and inside the drawer with the show accounts selector
 * For Desktop, the component shows the aside section along with the links and show accounts selector
 */
export const Dashboard = ({ detailedError, accountsFetched, recordsFetched }: DashboardViewProps) => {
  const { isMobile } = useMediaQuery()
  const { accounts, updateAccounts, updateSelectedAccount, updateRecords } = useDashboardStore(
  (state) => state
  )

  const [screen, setScreen] = useState<DashboardScreens | null>(null)
  const [openSelectAccountModal, setOpenSelectAccountModal] = useState<boolean>(false)

  const updateScreen = async (newScreen: DashboardScreens) => {
    await saveDashboardScreen(newScreen)
    setScreen(newScreen)
  }

  useEffect(() => {
    getDashboardScreen().then((screen) => {
      if (!screen) {
        setScreen('overview')
        return
      }
      setScreen(screen as DashboardScreens)
    })
  }, [])

  // If the router has been refreshed, update zustand store of records
  useEffect(() => {
    updateRecords(recordsFetched)
  }, [recordsFetched, updateRecords])

  const toggleSelectAccountModal = () => setOpenSelectAccountModal((prev) => !prev)

  useEffect(() => {
    if (detailedError?.cause === ERROR_CONNECTION) {
      toast.error(ERROR_CONNECTION_MESSAGE);
    } else if (detailedError?.message) {
      toast.error(GENERAL_ERROR_MESSAGE);
    }
  }, [detailedError?.cause, detailedError?.message])

  useEffect(() => {
    if (accounts.length !== accountsFetched.length) {
      const [firstAccount = null] = accountsFetched;
      if (firstAccount) {
        updateSelectedAccount(firstAccount)
      }
    }
    updateAccounts(accountsFetched)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountsFetched])

  if (isMobile) {
    return (
      <main className='mt-3 flex flex-col gap-4"'>
        <HeaderDashboard isMobile>
          <HeaderMenuMobile screen={screen} accounts={accounts} updateScreen={updateScreen} toggleSelectAccountModal={toggleSelectAccountModal} />
        </HeaderDashboard>
        { accounts.length === 0 && (
          <NoAccountsFoundScreen screen={screen} />
        )}
        {/* { (screen === 'overview' && accounts.length > 0 ) && (<OverviewScreen />) } */}
        { (screen === 'accounts' && accounts.length > 0 ) && (<AccountSubscreen />) }
        <Toaster position="top-center" />
        <SelectAccountDialog openModal={openSelectAccountModal} closeModal={toggleSelectAccountModal} />
      </main>
    )
  }

  return (
    <div className="w-full min-h-screen max-w-screen-2xl flex mx-auto my-0">
      <DashboardAside screen={screen} toggleSelectAccountModal={toggleSelectAccountModal} updateScreen={updateScreen} accounts={accounts}>
        <HeaderDashboard isMobile={isMobile} />
      </DashboardAside>
      { accounts.length === 0 && (
        <NoAccountsFoundScreen screen={screen} />
      )}
      {/* { (screen === 'overview' && accounts.length > 0 ) && (<OverviewScreen />) } */}
      { (screen === 'accounts' && accounts.length > 0 ) && (<AccountSubscreen />) }
      <Toaster position="top-center" />
      <SelectAccountDialog openModal={openSelectAccountModal} closeModal={toggleSelectAccountModal} />
    </div>
  )
}