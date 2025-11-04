"use client"
import { useState } from "react";
import { Button, Modal } from "flowbite-react";
import { RiAddLine } from "@remixicon/react";
import { CreateAccountModal } from "./CreateAccountModal";

export const CreateAccountButton = () => {
  const [openCreateAccModal, setOpenCreateAccModal] = useState<boolean>(false);
  const toggleModal = () => setOpenCreateAccModal((prev) => !prev);

  return (
    <>
      <Button onClick={() => setOpenCreateAccModal(true)}>
        <RiAddLine />
        Crear cuenta
      </Button>
      <Modal show={openCreateAccModal} onClose={toggleModal}>
        <CreateAccountModal closeModal={toggleModal} />
      </Modal>
    </>
  )
}