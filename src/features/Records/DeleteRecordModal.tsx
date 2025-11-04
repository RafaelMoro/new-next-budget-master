import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { Button, CheckIcon, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "flowbite-react"
import { Toaster, toast } from "sonner";

import { BankMovement, DeleteExpenseDataResponse, DeleteExpenseErrorResponse, DeleteIncomeDataResponse, DeleteIncomeErrorResponse, DeleteRecordPayload } from "@/shared/types/records.types"
import { deleteExpenseCb, deleteIncomeCb } from "@/shared/utils/records.utils"
import { DELETE_RECORD_ERROR } from "@/shared/constants/records.constants";

interface DeleteRecordModalProps {
  open: boolean
  toggleModal: () => void
  handleCloseDrawer: () => void;
  record: BankMovement
}

export const DeleteRecordModal = ({ record, open, toggleModal, handleCloseDrawer }: DeleteRecordModalProps) => {
  const router = useRouter()
  const handleError = () => {
    toast.error(DELETE_RECORD_ERROR)
    setTimeout(() => {
      toggleModal()
      handleCloseDrawer()
    }, 1000)
  }
  const handleSuccess = () => {
    router.refresh()
    setTimeout(() => {
      toggleModal()
      handleCloseDrawer()
    }, 1000)
  }

  const { mutate: deleteExpense, isError: isErrorExpense, isPending: isPendingExpense, isSuccess: isSuccessExpense } = useMutation<DeleteExpenseDataResponse
  , DeleteExpenseErrorResponse, DeleteRecordPayload>({
    mutationFn: deleteExpenseCb,
    onError: () => {
      handleError()
    },
    onSuccess: () => {
      handleSuccess()
    }
  })

  const { mutate: deleteIncome, isError: isErrorIncome, isPending: isPendingIncome, isSuccess: isSuccessIncome } = useMutation<DeleteIncomeDataResponse
  , DeleteIncomeErrorResponse, DeleteRecordPayload>({
    mutationFn: deleteIncomeCb,
    onError: () => {
      handleError()
    },
    onSuccess: () => {
      handleSuccess()
    }
  })

  const isPending = isPendingExpense || isPendingIncome;
  const isSuccess = isSuccessExpense || isSuccessIncome;
  const isError = isErrorExpense || isErrorIncome;

  const handleDeleteRecord = () => {
    if (record.typeOfRecord === 'income') {
      deleteIncome({ recordId: record._id })
      return
    }
  
    if (record.typeOfRecord === 'transfer' && record.transferRecord !== undefined) {
      // We don-t have an endpoint to delete transfers
      const isExpense = record?.isPaid !== undefined
      if (isExpense) {
        deleteExpense({ recordId: record._id })
        deleteIncome({ recordId: record.transferRecord.transferId })
        return
      }
      deleteIncome({ recordId: record._id })
      deleteExpense({ recordId: record.transferRecord.transferId  })
      return
    }
  
    deleteExpense({ recordId: record._id })
  }

  return (
    <>
      <Modal show={open} onClose={toggleModal}>
        <ModalHeader>Eliminar {record.shortName}</ModalHeader>
        <ModalBody>
          <p>¿Estás seguro de que deseas eliminar esta transacción?</p>
          <p className="text-red-600">Esta acción no puede deshacerse.</p>
        </ModalBody>
        <ModalFooter>
          <div className="w-full flex justify-between">
            <Button outline onClick={toggleModal}>Cancelar</Button>
            <Button color="red" onClick={handleDeleteRecord}>
              { isPending ? (
                <Spinner aria-label="loading delete record budget master" />
              ) : isSuccess ? (
                <CheckIcon data-testid="check-icon" />
              ) : 'Eliminar' }
            </Button>
          </div>
        </ModalFooter>
      </Modal>
      { (isError) && (
          <Toaster position="top-center" />
        )}
    </>
  )
}