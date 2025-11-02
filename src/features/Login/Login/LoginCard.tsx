"use client"
import { Card, Label, TextInput } from "flowbite-react"
import { AnimatePresence } from "motion/react"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

import { LoginFormValues, LoginSchema } from "@/shared/types/login.types"
import { ErrorMessage } from "@/shared/ui/atoms/ErrorMessage"

export const LoginCard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(LoginSchema)
  })

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    const dataForm = {
      email: data.email,
      password: data.password
    }
    // loginMutation(dataForm)
  }

  return (
    <AnimatePresence>
      <Card className="max-w-sm">
        <h5 className="text-2xl">
          Ingrese sus credenciales para entrar a su cuenta.
        </h5>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-w-md flex-col gap-4"
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email">Correo Electrónico</Label>
            </div>
            <TextInput
              id="email"
              type="email"
              placeholder="correo-electrónico@gmail.com"
              {...register("email")}
            />
            { errors.email?.message && (
              <ErrorMessage isAnimated>{errors.email?.message}</ErrorMessage>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password">Contraseña</Label>
            </div>
            <TextInput
              id="password"
              type="password"
              {...register("password")}
            />
            { errors.password?.message && (
              <ErrorMessage isAnimated>{errors.password?.message}</ErrorMessage>
            )}
          </div>
        </form>
      </Card>
    </AnimatePresence>
  )
}