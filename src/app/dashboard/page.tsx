import type { Metadata } from "next";

import { DASHBOARD_META_DESCRIPTION, DASHBOARD_META_TITLE } from "@/shared/constants/metadata.constants"
import { getAccessToken } from "@/shared/lib/auth.lib";
import { fetchAccounts } from "@/shared/lib/dashboard.lib";
import { getAccountCookie } from "@/shared/lib/preferences.lib";
import { DashboardStoreProvider } from "@/zustand/provider/dashboard-store-provider";
import { LoginRequiredModal } from "@/shared/ui/organisms/LoginRequiredModal";

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
  const selectedAccount = selectedAccountCookie ?? accounts[0]?._id ?? null;

  // TODO: Change the fetch of records
  return (
    <DashboardStoreProvider records={[]} accounts={accounts} selectedAccountId={selectedAccount}>
      <LoginRequiredModal accessToken={accessToken} />
      <h1>Dashboard</h1>
    </DashboardStoreProvider>
  )
}