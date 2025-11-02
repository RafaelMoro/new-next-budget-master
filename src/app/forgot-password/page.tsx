import type { Metadata } from "next";
import { FORGOT_PASSWORD_META_DESCRIPTION, FORGOT_PASSWORD_META_TITLE } from "@/shared/constants/metadata.constants";
import { Header } from "@/shared/ui/organisms/Header";
import { ForgotPassword } from "@/features/Login/ForgotPassword/ForgotPassword";

export const metadata: Metadata = {
  title: FORGOT_PASSWORD_META_TITLE,
  description: FORGOT_PASSWORD_META_DESCRIPTION,
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col justify-center items-center gap-20 min-h-full">
        <h1 className="text-black dark:text-white text-4xl text-center font-bold">Recupera tu cuenta en un momento</h1>
        <ForgotPassword />
      </main>
    </div>
  )
}