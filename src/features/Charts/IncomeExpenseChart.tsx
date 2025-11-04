import { BankMovement } from "@/shared/types/records.types";
import { AreaChart } from "@/shared/ui/tremor/AreaChartTremor";
import { getExpensesIncomesTotal } from "@/shared/utils/statistics.utils";
import { Card } from "flowbite-react";

interface IncomeExpensesChartProps {
  records: BankMovement[]
}

export const IncomeExpensesChart = ({ records }: IncomeExpensesChartProps) => {
  const currentData = getExpensesIncomesTotal(records);
  console.log('currentData', currentData);

  return (
    <Card className="flex flex-col gap-2">
      <h4 className="text-2xl font-bold">Ingresos vs Gastos</h4>
      { currentData.length > 0 && (
        <AreaChart
          className="h-52"
          data-testid="income-expenses-chart"
          data={currentData}
          index="fullDate"
          categories={["expenseTotal", "incomeTotal"]}
          showLegend={false}
        />
      )}
      { currentData.length === 0 && (
        <p className="text-gray-500 text-center">No hay datos suficientes para mostrar el gráfico.</p>
      )}
    </Card>
  )
}