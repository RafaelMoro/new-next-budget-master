"use client"
import Image from "next/image"
import { ReactNode } from "react";

import { ToggleDarkMode } from "../atoms/ToggleDarkMode"

interface HeaderDashboardProps {
  isMobile: boolean;
  children?: ReactNode
}

export const HeaderDashboard = ({ isMobile, children }: HeaderDashboardProps) => {
  if (isMobile) {
    return (
      <header className="p-4 flex flex-row justify-between items-center">
        <Image className="rounded-full" src="/img/logo-no-bg.webp" alt="Budget Master Logo" width={70} height={70} />
        { children }
      </header>
    )
  }

  return (
    <div className="flex justify-between items-center">
      <Image className="rounded-full" src="/img/logo-no-bg.webp" alt="Budget Master Logo" width={70} height={70} />
      <ToggleDarkMode />
    </div>
  )
}