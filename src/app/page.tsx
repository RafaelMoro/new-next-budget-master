import { IncomeExpensesChart } from "@/shared/ui/atoms/IncomeExpensesChart";
import { Badge, Button } from "flowbite-react";

export default function Home() {
  return (
    <main className="w-full min-h-screen flex flex-col justify-center items-center gap-6">
      <h1 className="text-4xl font-bold">Welcome to my app</h1>
      <Button outline color="red">Click me</Button>
      <Badge color="info">Default</Badge>
      <IncomeExpensesChart />
    </main>
  );
}
