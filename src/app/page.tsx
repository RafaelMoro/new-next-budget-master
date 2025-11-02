import type { Metadata } from "next";

import { IncomeExpensesChart } from "@/shared/ui/atoms/IncomeExpensesChart";
import { Badge, Button } from "flowbite-react";
import { LOGIN_META_DESCRIPTION, LOGIN_META_TITLE } from "@/shared/constants/metadata.constants";

export const metadata: Metadata = {
  title: LOGIN_META_TITLE,
  description: LOGIN_META_DESCRIPTION,
};

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
