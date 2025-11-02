import type { Metadata } from "next";

import { REGISTER_META_DESCRIPTION, REGISTER_META_TITLE } from "@/shared/constants/metadata.constants";
import { Header } from "@/shared/ui/organisms/Header";
import { Register } from "@/features/Login/Register/Register";

export const metadata: Metadata = {
  title: REGISTER_META_TITLE,
  description: REGISTER_META_DESCRIPTION,
};

export default function RegisterPage() {

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      <Register />
    </div>
  )
}