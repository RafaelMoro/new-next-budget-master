import type { Metadata } from "next";

import { DASHBOARD_META_DESCRIPTION, DASHBOARD_META_TITLE } from "@/shared/constants/metadata.constants"
import { getAccessToken } from "@/shared/lib/auth.lib";
import { fetchAccounts, fetchRecordsCurrentMonth } from "@/shared/lib/dashboard.lib";
import { getAccountCookie } from "@/shared/lib/preferences.lib";
import { DashboardStoreProvider } from "@/zustand/provider/dashboard-store-provider";
import { LoginRequiredModal } from "@/shared/ui/organisms/LoginRequiredModal";
import { Dashboard } from "@/features/Dashboard/Dashboard";

export const metadata: Metadata = {
  title: DASHBOARD_META_TITLE,
  description: DASHBOARD_META_DESCRIPTION,
}

export default async function DashboardPage() {
  const [
    accessToken,
    { accounts, detailedError },
    selectedAccountCookie
  ] = await Promise.all([
    getAccessToken(),
    fetchAccounts(),
    getAccountCookie()
  ])
  const selectedAccount = selectedAccountCookie?.accountId ?? accounts[0]?._id ?? null;
  const { records } = await fetchRecordsCurrentMonth({ accountId: selectedAccount });

  return (
    <DashboardStoreProvider records={records} accounts={accounts} selectedAccountId={selectedAccount}>
      <LoginRequiredModal accessToken={accessToken} />
      <Dashboard detailedError={detailedError} accountsFetched={accounts} recordsFetched={records} />
    </DashboardStoreProvider>
  )
}