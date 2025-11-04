import { useEffect, useState } from "react"

import { OverviewButtonGroup } from "./OverviewButtonGroup"
import { OverviewScreens } from "@/shared/types/dashboard.types"
import { OverviewStatisticsSubscreen } from "./OverviewStatisticsSubscreen"
import { AccountOverviewSubscreen } from "./subscreens/AccountOverviewSubscreen"
import { getPreferencesCookie } from "@/shared/lib/preferences.lib"
import { saveOverviewSubscreenApi } from "@/shared/utils/preferences.utils"
import { OVERVIEW_SUBSCREEN_KEY } from "@/shared/constants/global.constants"

export const OverviewScreen = () => {
  const [subscreen, setSubscreen] = useState<OverviewScreens | null>(null)
  const updateSubscreen = async (newScreen: OverviewScreens) => {
    await saveOverviewSubscreenApi(newScreen)
    setSubscreen(newScreen)
  }

  useEffect(() => {
    getPreferencesCookie(OVERVIEW_SUBSCREEN_KEY).then((subscr) => {
      if (!subscr) {
        setSubscreen('statistics')
        return
      }
      setSubscreen(subscr as OverviewScreens)
    })
  }, [])

  return (
    <main className="w-full px-4 pt-4 md:min-w-xl mt-3 flex flex-col gap-4">
      <h1 className="text-black dark:text-white text-4xl text-center font-bold col-span-3 mb-5">Panorama general</h1>
      <OverviewButtonGroup
        updateStatisticsScreen={() => updateSubscreen('statistics')}
        updateAccountScreen={() => updateSubscreen('accountInfo')}
        screen={subscreen}
      />
      { subscreen === 'statistics' && (<OverviewStatisticsSubscreen />)}
      { subscreen === 'accountInfo' && (<AccountOverviewSubscreen />)}
    </main>
  )
}