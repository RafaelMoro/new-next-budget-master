"use client"
import { Button } from "flowbite-react"

import { useDashboard } from "@/shared/hooks/useDashboard"

export const EmptyAccordionResult = () => {
  const { handleGoCreateRecordRoute } = useDashboard()

  return (
    <div data-testid="empty-accordion-result" className="flex flex-col gap-5 justify-center">
      <p>Aún no has registrado movimientos este mes</p>
      <Button onClick={handleGoCreateRecordRoute} >Registrar movimiento</Button>
    </div>
  )
}