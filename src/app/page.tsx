import type { Metadata } from "next";
import { redirect } from 'next/navigation';

import { LOGIN_META_DESCRIPTION, LOGIN_META_TITLE } from "@/shared/constants/metadata.constants";
import { Header } from "@/shared/ui/organisms/Header";
import { LoginCard } from "@/features/Login/Login/LoginCard";
import { getAccessToken } from "@/shared/lib/auth.lib";
import { DASHBOARD_ROUTE } from "@/shared/constants/global.constants";

export const metadata: Metadata = {
  title: LOGIN_META_TITLE,
  description: LOGIN_META_DESCRIPTION,
};

export default async function Home() {
  const accessToken = await getAccessToken()
  if (accessToken) {
    redirect(DASHBOARD_ROUTE)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col justify-center items-center gap-20 min-h-full">
        <h1 className="text-black dark:text-white text-4xl text-center font-bold">Bienvenido de vuelta</h1>
        <LoginCard />
      </main>
    </div>
  );
}
