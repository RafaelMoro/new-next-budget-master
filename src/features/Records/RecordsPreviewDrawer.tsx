"use client"

import { useState } from "react";
import { RiBankLine, RiCloseFill,
  RiCloseLine,
  RiPriceTag3Line } from "@remixicon/react";
import { Badge, Button, CheckIcon, Drawer, DrawerItems } from "flowbite-react";
import clsx from "clsx"
import { useRouter } from 'next/navigation'
import { toast } from "sonner";

import { BankMovement, TypeOfRecord } from "@/shared/types/records.types";
import { categoryIcons } from "@/shared/constants/categories.constants";
import { useMediaQuery } from "@/shared/hooks/useMediaQuery";
import { ChartLineIcon } from "@/shared/ui/icons/ChartLineIcon"
import { EDIT_EXPENSE_PAGE_ROUTE, EDIT_TRANSFER_PAGE_ROUTE } from "@/shared/constants/global.constants";
import { useDashboard } from "@/shared/hooks/useDashboard";
import { ExpensePaidList } from "./ExpensePaid/ExpensePaidList";
import { IndebtedPeoplePreviewRecord } from "./IndebtedPeople/IndebtedPeoplePreviewRecord";
import { DeleteRecordModal } from "./DeleteRecordModal";

interface RecordsPreviewDrawerProps {
  record: BankMovement | null;
  open: boolean;
  handleClose: () => void;
}

export const RecordsPreviewDrawer = ({ open, handleClose, record }: RecordsPreviewDrawerProps) => {
  const router = useRouter()
  const { isMobile } = useMediaQuery()
  const { manageSelectedAccountCookie, accountsDisplay } = useDashboard()

  const [openDeleteRecordModal, setOpenDeleteRecordModal] = useState(false);
  const toggleDeleteRecordModal = () => setOpenDeleteRecordModal((prev) => !prev);

  const isOrigin = typeof record?.isPaid !== 'undefined' && record?.typeOfRecord === 'transfer';
  const transferText = isOrigin ? 'Transferencia a' : 'Transferencia desde';
  const transferAccountName = accountsDisplay.find(account => account.accountId === record?.transferRecord?.account)?.name || ''

  const Icon = categoryIcons[record?.category?.icon ?? 'newCategory']
  const paidStatus = record?.isPaid ? 'Pagado' : 'Sin pagar'
  const typeRecordDict: Record<TypeOfRecord, string> = {
    expense: 'Gasto',
    income: 'Ingreso',
    transfer: 'Transferencia'
  }
  const statusBoxCss = clsx(
    "flex gap-1 items-center",
    { "text-green-500": record?.isPaid },
    { "text-red-500": !record?.isPaid }
  )
  const colorText = clsx(
    { "text-red-600": record?.typeOfRecord === 'expense'},
    { "text-green-400": record?.typeOfRecord === 'income' },
    { "text-blue-400": record?.typeOfRecord === 'transfer' }
  )
  const priceStyles = clsx(
    "text-2xl font-semibold text-center",
    colorText
  )
  const typeRecordStyle = clsx(
    "text-sm col-start-2 col-end-3 row-start-2 row-end-3",
    colorText
  )

  const drawerDirection = isMobile ? 'bottom' : 'right'
  
  if (!record) {
    return null;
  }

  const handleEditRecord = async () => {
    await manageSelectedAccountCookie()
    if (record.typeOfRecord === 'income') {
      toast.error("La edición de ingresos aún no está disponible.")
      return
    }
    if (record.typeOfRecord === 'transfer') {
      router.push(EDIT_TRANSFER_PAGE_ROUTE)
      return
    }
    router.push(EDIT_EXPENSE_PAGE_ROUTE)
  }

  return (
    <>
      <Drawer className="w-max" open={open} onClose={handleClose} position={drawerDirection}>
        <div className="grid min-h-full grid-layout-header-footer">
          <header className="grid grid-rows-2 grid-record-preview gap-x-2 text-gray-600 dark:text-gray-400">
            <ChartLineIcon className="row-span-2 place-self-center" />
            <h4 className="text-gray-600 dark:text-gray-400 col-start-2 col-end-3 row-start-1 row-end-2">Detalles de la transacción</h4>
            <p className={typeRecordStyle}>{typeRecordDict[record.typeOfRecord]}</p>
            <button
              className="text-gray-600 dark:text-gray-400 place-self-center cursor-pointer"
              onClick={handleClose}
              aria-label="Close"
            >
              <RiCloseFill />
            </button>
          </header>
          <DrawerItems>
            <div className="flex flex-col gap-10 mt-8">
              <div className="flex flex-col gap-4">
                <h4 className="text-xl font-semibold capitalize">{record.shortName}</h4>
                <p className={priceStyles}>{record.amountFormatted}</p>
                <p className="text-sm text-gray-400">{record.description}</p>
              </div>

              { record?.transferRecord && (
                <div className="flex flex-col gap-2">
                  <h5 className="text-lg tracking-wider">Detalle de la transferencia:</h5>
                  <div className="flex gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <RiBankLine size={20} />
                    <p>{transferText}: <span className="text-black dark:text-white">{transferAccountName}</span></p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <h5 className="text-lg tracking-wider">Categorias:</h5>
                <div className="flex gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <Icon size={20} />
                  <p>Categoria: <span className="text-black dark:text-white">{record.category?.categoryName}</span></p>
                </div>
                <div className="flex gap-1 text-sm text-gray-600 dark:text-gray-400">
                  <RiPriceTag3Line size={20} />
                  <p>Subcategoria: <span className="text-black dark:text-white">{record.subCategory}</span></p>
                </div>
              </div>

              { record.typeOfRecord === 'expense' && (
                <div className="flex flex-col gap-2">
                  <h5 className="text-lg tracking-wider">Estatus de pago:</h5>
                  <div className={statusBoxCss}>
                    { record.isPaid ? (<CheckIcon />) : (<RiCloseLine />) }
                    <p className="text-sm">{paidStatus}</p>
                  </div>
                </div>
              ) }

              { record?.linkedBudgets && record?.linkedBudgets.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h5 className="text-lg tracking-wider">Presupuestos:</h5>
                  <div className="flex gap-2">
                    { record.linkedBudgets.map((budget) => (
                      <Badge key={budget._id} className="max-w-max" color="warning">
                        {budget.description}
                      </Badge>
                    )) }
                  </div>
                </div>
                ) }

                { record.tag.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h5 className="text-lg tracking-wider">Etiquetas:</h5>
                    <div className="flex gap-2">
                      { record.tag.map((t) => (
                        <Badge key={t} className="max-w-max" color="purple">
                          {t}
                        </Badge>
                      )) }
                    </div>
                  </div>
                ) }

                { record?.indebtedPeople && record?.indebtedPeople.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <h5 className="text-lg tracking-wider">Personas que te deben:</h5>
                    <IndebtedPeoplePreviewRecord indebtedPeople={record?.indebtedPeople} />
                  </div>
                )}

                { record?.expensesPaid && record?.expensesPaid.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h5 className="text-lg tracking-wider">Gastos pagados:</h5>
                    <ExpensePaidList expenses={record?.expensesPaid} />
                  </div>
                )}
            </div>
          </DrawerItems>
          <footer className="mt-10 lg:mt-0 flex justify-between">
            <Button color="red" outline onClick={toggleDeleteRecordModal}>Eliminar</Button>
            <Button onClick={handleEditRecord}>Editar</Button>
          </footer>
        </div>
      </Drawer>
      <DeleteRecordModal open={openDeleteRecordModal} toggleModal={toggleDeleteRecordModal} handleCloseDrawer={handleClose} record={record} />
    </>
  )
}