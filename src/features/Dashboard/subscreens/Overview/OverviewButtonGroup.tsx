import { Button, ButtonGroup } from "flowbite-react"
import { RiLineChartLine } from "@remixicon/react"
import clsx from "clsx"

import { CreditCardIcon } from "@/shared/ui/icons/CreditCardIcon"
import { OverviewScreens } from "@/shared/types/dashboard.types"

interface OverviewButtonGroupProps {
  updateStatisticsScreen: () => void
  updateAccountScreen: () => void
  screen: OverviewScreens | null
}

export const OverviewButtonGroup = ({ updateStatisticsScreen, updateAccountScreen, screen }: OverviewButtonGroupProps) => {
  const isStatisticsScreen = screen === 'statistics'
  const cssStatistics = clsx({ "dark:text-indigo-400": isStatisticsScreen })
  const cssAccount = clsx({ "dark:text-indigo-400": !isStatisticsScreen })

  return (
    <div className="w-full flex justify-center">
      <ButtonGroup>
        <Button
          className={cssStatistics}
          onClick={updateStatisticsScreen}
          color="alternative"
        >
          <RiLineChartLine className="me-2 h-4 w-4" />
          Estadísticas
        </Button>
        <Button className={cssAccount} onClick={updateAccountScreen} color="alternative">
          <CreditCardIcon className="me-2 h-4 w-4" />
          Información general de la cuenta
        </Button>
      </ButtonGroup>
    </div>
  )
}