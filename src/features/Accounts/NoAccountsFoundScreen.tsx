import Image from "next/image"
import { CreateAccountButton } from "./CreateAccountButton"
import { DashboardScreens } from "@/shared/types/dashboard.types"

interface NoAccountsFoundScreenProps {
  screen: DashboardScreens | null
}

export const NoAccountsFoundScreen = ({ screen }: NoAccountsFoundScreenProps) => {
  const titleDict: Record<DashboardScreens, string> = {
    overview: 'Panorama general',
    accounts: 'Cuentas bancarias',
    transactions: 'Transacciones',
    budgets: 'Presupuestos'
  }
  return (
    <main className="w-full pl-4 pt-4 md:min-w-xl mt-3 flex flex-col gap-4">
      { screen && (
        <h1 className="text-black dark:text-white text-4xl text-center font-bold col-span-3">{titleDict[screen]}</h1>
      )}
      <section className="mt-10 flex flex-col items-center gap-8">
        <h2 className="text-2xl  font-semibold">Aún no tienes cuentas registradas</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">¡Todo empieza aquí! Agrega una cuenta bancaria y empieza a organizar tus finanzas sin estrés.</p>
        <Image src="/img/no-accounts-found.webp" width={289} height={296} alt="No accounts found" />
        <div>
          <div className="w-full flex justify-center">
            <CreateAccountButton />
          </div>
        </div>
      </section>
    </main>
  )
}