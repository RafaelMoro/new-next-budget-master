import { Button } from "flowbite-react";

import { IncomeExpensesChart } from "../../../Charts/IncomeExpenseChart"
import { useDashboardStore } from "@/zustand/provider/dashboard-store-provider";
import { useDashboard } from "@/shared/hooks/useDashboard";

export const OverviewStatisticsSubscreen = () => {
  const { handleGoCreateRecordRoute } = useDashboard()
  const records = useDashboardStore(
    (state) => state.records
  )

  if (records.length === 0) {
    return (
      <div className="flex flex-col justify-center gap-5 mt-20">
        <h2 className="text-2xl font-semibold text-center">Sin transacciones, sin gráficas... ¡por el momento!</h2>
        <p className="text-gray-400 text-center mb-5">Aún no podemos generar gráficas sin movimientos... ¡empieza a registrar y verás el cambio!</p>
        <div className="mx-auto my-0">
          <Button onClick={handleGoCreateRecordRoute} >
            Registrar movimiento
          </Button>
        </div>
      </div>
    )
  }
  return (
    <section className="grid grid-cols-1 gap-4">
      <div className="justify-self-end max-w-48">
        <Button onClick={handleGoCreateRecordRoute} >
          Registrar movimiento
        </Button>
      </div>
      <IncomeExpensesChart records={records} />
    </section>
  )
}