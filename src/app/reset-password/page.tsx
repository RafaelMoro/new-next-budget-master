import type { Metadata } from "next";

import { RESET_PASSWORD_META_DESCRIPTION, RESET_PASSWORD_META_TITLE } from "@/shared/constants/metadata.constants";
import { Header } from "@/shared/ui/organisms/Header";

export const metadata: Metadata = {
  title: RESET_PASSWORD_META_TITLE,
  description: RESET_PASSWORD_META_DESCRIPTION,
};

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
 
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col justify-center items-center gap-20 min-h-full">

      </main>
    </div>
  )
}