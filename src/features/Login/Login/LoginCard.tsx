"use client"
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation'
import { Button, Card, Label, Spinner, TextInput } from "flowbite-react"
import { AnimatePresence } from "motion/react"
import { SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Toaster, toast } from 'sonner'

import { LoginData, LoginError, LoginFormValues, LoginSchema } from "@/shared/types/login.types"
import { ErrorMessage } from "@/shared/ui/atoms/ErrorMessage"
import { DASHBOARD_ROUTE, FORGOT_PASSWORD_ROUTE, GENERAL_ERROR_MESSAGE, REGISTER_ROUTE } from "@/shared/constants/global.constants";
import { LinkButton } from "@/shared/ui/atoms/LinkButton";
import { useMutation } from "@tanstack/react-query";
import { LoginMutationCb } from "@/shared/utils/login.utils";
import { CheckIcon } from "@/shared/ui/icons/CheckIcon";
import { ERROR_UNAUTHORIZED_LOGIN, ERROR_UNAUTHORIZED_LOGIN_MESSAGE } from "@/shared/constants/login.constants";

export const LoginCard = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(LoginSchema)
  })

  const { mutate: loginMutation, isError, isPending, isSuccess, isIdle, error } = useMutation<LoginData, LoginError, LoginFormValues>({
    mutationFn: LoginMutationCb,
    onSuccess: () => {
      setTimeout(() => {
        router.push(DASHBOARD_ROUTE)
      }, 1000)
    }
  })
  const messageError = error?.response?.data?.message

  useEffect(() => {
    if (isError && messageError) {
      if (messageError === ERROR_UNAUTHORIZED_LOGIN) {
        toast.error(ERROR_UNAUTHORIZED_LOGIN_MESSAGE);
        return
      }
      toast.error(GENERAL_ERROR_MESSAGE);
    }
  }, [isError, messageError])

  const onSubmit: SubmitHandler<LoginFormValues> = (data) => {
    const dataForm = {
      email: data.email,
      password: data.password
    }
    loginMutation(dataForm)
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
          <Link className="underline" href={FORGOT_PASSWORD_ROUTE}>¿Olvidaste tu contraseña?</Link>
          <LinkButton type="secondary" href={REGISTER_ROUTE} >
            Registrarse
          </LinkButton>
          <Button
            className="hover:cursor-pointer"
            disabled={isPending || isSuccess}
            type="submit"
          >
            { (isIdle || isError) && 'Iniciar sesión'}
            { isPending && (<Spinner aria-label="loading login budget master" />) }
            { isSuccess && (<CheckIcon />)}
          </Button>
        </form>
        { (isError) && (
          <Toaster position="top-center" />
        )}
      </Card>
    </AnimatePresence>
  )
}