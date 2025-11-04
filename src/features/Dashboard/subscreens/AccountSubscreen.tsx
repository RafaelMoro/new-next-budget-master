import { CreateAccountButton } from "../../Accounts/CreateAccountButton";
import { AccountsView } from "../../Accounts/AccountsView";

/**
 * Shows the screen of accounts with title, instructions and button to create an account
 * @param accounts - Accounts fetched 
 * @returns a screen to handle accounts
 */
export const AccountSubscreen = () => {
  return (
    <main className="w-full px-4 pt-4 md:min-w-xl mt-3 flex flex-col gap-4">
      <h1 className="text-black dark:text-white text-4xl text-center font-bold col-span-3">Cuentas bancarias</h1>
      <div className="w-full flex justify-end mt-10 mb-5 lg:my-0">
        <CreateAccountButton />
      </div>
      <p className="text-center text-xl mb-5">Haz click en cualquiera de tus cuentas para ver más en detalle la informacion</p>
      <AccountsView />
    </main>
  )
}