"use client"
import Link from "next/link";
import { Card, Button, Label, TextInput } from "flowbite-react";
import { useForm, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";;

import { InputsPersonalInformation, PersonalInformationSchema } from "@/shared/types/login.types";
import { AnimateBox } from "@/shared/ui/atoms/AnimateBox";
import { ErrorMessage } from "@/shared/ui/atoms/ErrorMessage";

interface PersonalInformationProps {
  personalInformation: InputsPersonalInformation;
  updatePersonalInformation: (data: InputsPersonalInformation) => void;
  nextCb: () => void;
  direction: number
}

export const PersonalInformation = ({ nextCb, personalInformation, updatePersonalInformation, direction }: PersonalInformationProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InputsPersonalInformation>({
    resolver: yupResolver(PersonalInformationSchema)
  })
  const onSubmit: SubmitHandler<InputsPersonalInformation> = (data) => {
    updatePersonalInformation(data)
    nextCb()
  }

  return (
    <AnimateBox direction={direction} >
      <Card className="max-w-sm">
        <h5 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Crear cuenta.
        </h5>
        <p className="text-xl text-black dark:text-white">Llene la siguiente información para crear su cuenta.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-md flex-col gap-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="firstName">Nombre</Label>
            </div>
            <TextInput data-testid="firstName" defaultValue={personalInformation.firstName} id="firstName" type="text" {...register("firstName")} />
            { errors?.firstName?.message && (
              <ErrorMessage isAnimated>{errors.firstName?.message}</ErrorMessage>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="middleName">Segundo Nombre (Opcional)</Label>
            </div>
            <TextInput data-testid="middleName" defaultValue={personalInformation.middleName} id="middleName" type="text" {...register("middleName")} />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="lastName">Apellido</Label>
            </div>
            <TextInput id="lastName" defaultValue={personalInformation.lastName} type="text" {...register("lastName")} />
            { errors?.lastName?.message && (
              <ErrorMessage isAnimated>{errors?.lastName?.message}</ErrorMessage>
            )}
          </div>
          <Link className="relative flex items-center justify-center rounded-lg text-center font-medium focus:outline-none focus:ring-4 h-10 px-5 text-sm border border-primary-700 text-primary-700 hover:border-primary-800 hover:bg-primary-800 hover:text-white focus:ring-primary-300 dark:border-primary-600 dark:text-primary-500 dark:hover:border-primary-700 dark:hover:bg-primary-700 dark:hover:text-white dark:focus:ring-primary-800" href="/">Volver</Link>
          <Button type="submit" className="hover:cursor-pointer">
            Siguiente
          </Button>
        </form>
      </Card>
    </AnimateBox>
  )
}