"use client"

import { useState } from "react"
import { RiCloseFill } from "@remixicon/react"
import { Badge, Button, Label, Modal, ModalBody, ModalFooter, ModalHeader, TextInput } from "flowbite-react"
import { AnimatePresence } from "motion/react"

import { ErrorMessage } from "@/shared/ui/atoms/ErrorMessage"
import { TAG_MAX_LENGTH_ERROR, TAG_MIN_LENGTH_ERROR, TAG_REPEATED_ERROR, TAG_REQUIRED_ERROR } from "@/shared/constants/records.constants"

interface ManageTagsModalProps {
  openModal: boolean
  openModalFn: () => void
  closeModalFn: () => void
  tags: string[]
  updateTags: (newTags: string[]) => void
}

/**
* This component is used to manage tags for records with a modal
* This component is meant to be used with the custom hook useManageTags
*/
export const ManageTagsModal = ({ tags, updateTags, openModal, openModalFn, closeModalFn }: ManageTagsModalProps) => {
  const subtext = tags.length === 0 ? 'Crear' : 'Administrar'
  const [internalTags, setInternalTags] = useState<string[]>(tags)
  // Using state instead of useForm because I can't clear the input without having required validation after submit
  const [inputValue, setInputValue] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const updateInternalTags = (newTag: string) => {
    setInternalTags([...internalTags, newTag])
  }
  const removeTag = (tagToRemove: string) => {
    setInternalTags(internalTags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = () => {
    // Validations
    if (!inputValue) {
      setError(TAG_REQUIRED_ERROR)
      return
    }
    if (inputValue.length < 3) {
      setError(TAG_MIN_LENGTH_ERROR)
      return
    }
    if (inputValue.length > 50) {
      setError(TAG_MAX_LENGTH_ERROR)
      return
    }
    const tagExist = internalTags.some(tag => tag.toLowerCase() === inputValue.toLowerCase())
    if (tagExist) {
      setError(TAG_REPEATED_ERROR)
      return
    }

    updateInternalTags(inputValue)
    setError(null)
    setInputValue('')
  }

  const handleChange = (newValue: string) => {
    if (error) setError(null)
    setInputValue(newValue)
  }

  const handleFinalize = () => {
    updateTags(internalTags)
    setInputValue('')
    setError(null)
    closeModalFn()
  }

  return (
    <section className="flex flex-col gap-4 md:mt-6">
      <h4 className="text-xl text-center md:text-start font-semibold">Etiquetas</h4>
      <p className="text-gray-400">Agrega etiquetas para recordar detalles importantes de tu transacción.</p>
    { tags.length > 0  && (
      <div className="mt-2 mb-4 flex flex-col gap-3 items-center md:flex-row">
        { tags.map((tag) => (
          <Badge key={tag} className="max-w-max" color="purple">
            {tag}
          </Badge>
        )) }
      </div>
    )}
      <Button className="mx-auto" color="light" onClick={openModalFn}>{subtext} etiquetas</Button>
      <AnimatePresence>
        <Modal key="add-tag-modal" show={openModal} onClose={closeModalFn}>
          <ModalHeader>Agregar etiqueta</ModalHeader>
          <ModalBody>
            <h3 className="text-2xl text-center font-semibold">Etiquetas:</h3>
            <div className="flex flex-col gap-3 md:flex-row">
              { internalTags.length > 0 && internalTags.map((tag) => (
                <Badge key={tag} className="max-w-max" color="purple">
                  <button onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>
                    <RiCloseFill className="inline-block mr-1" />
                  </button>
                  {tag}
                </Badge>
              )) }
            </div>
            <form className="flex flex-col gap-4 items-center mt-8">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="tag">Etiqueta</Label>
                </div>
                <TextInput
                  data-testid="tag"
                  id="tag"
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleChange(e.target.value)}
                />
                { error && (
                  <ErrorMessage isAnimated={false}>{error}</ErrorMessage>
                )}
              </div>
              <Button onClick={handleSubmit} className="max-w-max">Agregar etiqueta</Button>
            </form>
          </ModalBody>
          <ModalFooter>
            <div className="w-full flex justify-between">
              <Button onClick={closeModalFn} color="red">Cancelar</Button>
              <Button onClick={handleFinalize} color="green">Finalizar</Button>
            </div>
          </ModalFooter>
        </Modal>
      </AnimatePresence>
    </section>
  )
}