import { ReactNode } from "react"
import { Button } from "flowbite-react"

import { HomeIcon } from "../../shared/ui/icons/HomeIcon"
import { CreditCardArrowIcon } from "../../shared/ui/icons/CreditCardArrowIcon"
import { AccountRecordsIcon } from "../../shared/ui/icons/AccountRecordsIcon"
import { DashboardAsideLink } from "./DashboardAsideLink"
import { DropdownSelectAccount } from "@/features/Accounts/DropdownSelectAccount"
import { AccountBank } from "@/shared/types/accounts.types"
import { DashboardScreens } from "@/shared/types/dashboard.types"
import { useDashboard } from "@/shared/hooks/useDashboard"

interface DashboardAsideProps {
  children: ReactNode;
  updateScreen: (newScreen: DashboardScreens) => void
  toggleSelectAccountModal: () => void
  accounts: AccountBank[];
  screen: DashboardScreens | null
}

export const DashboardAside = ({ children, accounts, updateScreen, toggleSelectAccountModal, screen }: DashboardAsideProps) => {
  const { handleGoCreateRecordRoute, redirectLogin } = useDashboard()
  const handleSignOut = async () => {
    await fetch('/api/auth/sign-out')
    redirectLogin()
  }

  return (
    <aside className="w-72 p-5 flex flex-col gap-4 border-r border-r-gray-600">
      {children}
      { accounts.length > 0 && (
        <DropdownSelectAccount goAccounts={toggleSelectAccountModal} />
      )}
      <Button
        onClick={handleGoCreateRecordRoute}
      >Registrar movimiento</Button>
      <nav className="mt-10 flex flex-col">
        <DashboardAsideLink isSelected={screen === 'overview'} onClickCb={() => updateScreen('overview')}>
            <HomeIcon />
            Panorama
        </DashboardAsideLink>
        <DashboardAsideLink isSelected={screen === 'accounts'} onClickCb={() => updateScreen('accounts')}>
            <CreditCardArrowIcon />
            Cuentas
        </DashboardAsideLink>
        <DashboardAsideLink isSelected={screen === 'transactions'} onClickCb={() => updateScreen('transactions')}>
            <AccountRecordsIcon />
            Transacciones
        </DashboardAsideLink>
      </nav>

      <section className="flex flex-col gap-2">
        <Button outline color="red" className="w-full" onClick={handleSignOut}>Cerrar sesión</Button>
      </section>
    </aside>
  )
}