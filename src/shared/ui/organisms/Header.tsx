import Image from "next/image"
import { ToggleDarkMode } from "../atoms/ToggleDarkMode"

export const Header = () => {

  return (
    <header className="p-4 flex flex-row justify-between items-center">
      <Image className="rounded-full" src="/img/logo-no-bg.webp" alt="Budget Master Logo" width={70} height={70} />
      <ToggleDarkMode />
    </header>
  )
}