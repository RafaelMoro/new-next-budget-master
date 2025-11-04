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
import { saveDashboardScreen } from "@/shared/lib/preferences.lib";
import { NoAccountsFoundScreen } from "../Accounts/NoAccountsFoundScreen";

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
  const toggleSelectAccountModal = () => setOpenSelectAccountModal((prev) => !prev)

  if (isMobile) {
    return (
      <main className='mt-3 flex flex-col gap-4"'>
        <HeaderDashboard isMobile>
          <HeaderMenuMobile screen={screen} accounts={accounts} updateScreen={updateScreen} toggleSelectAccountModal={toggleSelectAccountModal} />
        </HeaderDashboard>
        { accounts.length === 0 && (
          <NoAccountsFoundScreen screen={screen} />
        )}
        {/* { (screen === 'overview' && accounts.length > 0 ) && (<OverviewScreen />) }
        { (screen === 'accounts' && accounts.length > 0 ) && (<AccountScreen />) } */}
        <Toaster position="top-center" />
        {/* <SelectAccountDialog openModal={openSelectAccountModal} closeModal={toggleSelectAccountModal} /> */}
      </main>
    )
  }
}