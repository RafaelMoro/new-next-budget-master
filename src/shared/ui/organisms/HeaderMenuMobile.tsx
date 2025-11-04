"use client"

import { Button, Drawer, DrawerHeader, DrawerItems, Sidebar, SidebarItemGroup, SidebarItems } from "flowbite-react"
import { RiMenuLine } from "@remixicon/react"
import { useState } from "react"
import { HomeIcon } from "../icons/HomeIcon"
import { AccountBank } from "@/shared/types/accounts.types"
import { DropdownSelectAccount } from "@/features/Accounts/DropdownSelectAccount"
import { MenuMobileLink } from "../atoms/MenuMobileLink"
import { CreditCardArrowIcon } from "../icons/CreditCardArrowIcon"
import { AccountRecordsIcon } from "../icons/AccountRecordsIcon"
import { ToggleDarkMode } from "../atoms/ToggleDarkMode"
import { DashboardScreens } from "@/shared/types/dashboard.types"
import { useDashboard } from "@/shared/hooks/useDashboard"

interface HeaderMenuMobileProps {
  accounts: AccountBank[];
  screen: DashboardScreens | null;
  updateScreen: (newScreen: DashboardScreens) => void
  toggleSelectAccountModal: () => void
}

export const HeaderMenuMobile = ({ accounts, screen, updateScreen, toggleSelectAccountModal }: HeaderMenuMobileProps) => {
  const { redirectLogin } = useDashboard()

  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const toggleDrawer = () => setOpenDrawer((prev) => !prev)
  const handleClick = (onClickCb: (newScreen: DashboardScreens) => void, newScreen: DashboardScreens) => {
    onClickCb(newScreen);
    toggleDrawer();
  }
  const handleSignOut = async () => {
    // resetLocalStorage()
    await fetch('/api/auth/sign-out')
    redirectLogin()
  }

  return (
    <>
      <Button onClick={toggleDrawer} color="dark">
        <RiMenuLine />
      </Button>
      <Drawer open={openDrawer} onClose={toggleDrawer}>
        <DrawerHeader title="Menu" />
        <DrawerItems>
          <Sidebar
            aria-label="Sidebar with multi-level dropdown example"
            className="[&>div]:bg-transparent [&>div]:p-0"
          >
            <div className="flex h-full flex-col justify-between py-2">
              <div>
                <SidebarItems>
                    { accounts.length > 0 && (
                      <SidebarItemGroup>
                        <DropdownSelectAccount
                          cssClass="mt-10"
                          goAccounts={toggleSelectAccountModal}
                        />
                      </SidebarItemGroup>
                    )}

                  <SidebarItemGroup>
                    <MenuMobileLink isSelected={screen === 'overview'} onClickCb={() => handleClick(updateScreen, 'overview')}>
                      <HomeIcon />
                      Panorama
                    </MenuMobileLink>
                    <MenuMobileLink isSelected={screen === 'accounts'} onClickCb={() => handleClick(updateScreen,'accounts')}>
                      <CreditCardArrowIcon />
                      Cuentas
                    </MenuMobileLink>
                    <MenuMobileLink isSelected={screen === 'transactions'} onClickCb={() => handleClick(updateScreen, 'transactions')}>
                      <AccountRecordsIcon />
                      Transacciones
                    </MenuMobileLink>
                  </SidebarItemGroup>

                  <SidebarItemGroup>
                    <ToggleDarkMode cssClass="w-full my-5" />
                    <Button outline color="red" className="w-full" onClick={handleSignOut}>Cerrar sesión</Button>
                  </SidebarItemGroup>
                </SidebarItems>
              </div>
            </div>
          </Sidebar>
        </DrawerItems>
      </Drawer>
    </>
  )
}