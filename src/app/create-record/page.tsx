import type { Metadata } from "next";

import { TransactionManager } from "@/features/Records/TransactionManager";
import { getAccessToken } from "@/shared/lib/auth.lib";
import { fetchCategories } from "@/shared/lib/categories.lib";
import { getAccountCookie } from "@/shared/lib/preferences.lib";
import { LoginRequiredModal } from "@/shared/ui/organisms/LoginRequiredModal";
import { CREATE_RECORD_META_DESCRIPTION, CREATE_RECORD_META_TITLE } from "@/shared/constants/metadata.constants";
import { fetchAllBudgets } from "@/shared/lib/budgets.lib";

export const metadata: Metadata = {
  title: CREATE_RECORD_META_TITLE,
  description: CREATE_RECORD_META_DESCRIPTION,
};

export default async function CreateRecordPage() {
  const [
      accessToken,
      selectedAccountCookie,
      resCategories,
      resBudgets
    ] = await Promise.all([
      getAccessToken(),
      getAccountCookie(),
      fetchCategories(),
      fetchAllBudgets()
    ])

  return (
    <>
      <LoginRequiredModal accessToken={accessToken} />
      <TransactionManager
        resCategories={resCategories}
        resBudgets={resBudgets}
        selectedAccount={selectedAccountCookie}
        accessToken={accessToken}
      />
    </>
  )
}