"use client"
import { useRouter } from 'next/navigation'
import { Button, Card, CheckIcon, Label, Spinner, TextInput } from "flowbite-react"
import { AnimatePresence } from "motion/react"
import { SubmitHandler, useForm } from 'react-hook-form'

import { LOGIN_ROUTE } from "@/shared/constants/global.constants"
import { LinkButton } from "@/shared/ui/atoms/LinkButton"
import { ForgotPasswordData, ForgotPasswordFormValues, ForgotPasswordSchema } from '@/shared/types/login.types'
import { yupResolver } from '@hookform/resolvers/yup'
import { handleErrorForm } from '@/shared/utils/global.utils'
import { ErrorMessage } from '@/shared/ui/atoms/ErrorMessage'
import { useMutation } from '@tanstack/react-query'
import { GeneralApiError } from '@/shared/types/global.types'
import { forgotPasswordCb } from '@/shared/utils/login.utils'

export const ForgotPassword = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(ForgotPasswordSchema)
  })

  const { mutate: forgotPwdMutation, isError, isPending, isSuccess, isIdle, error } = useMutation<ForgotPasswordData, GeneralApiError, ForgotPasswordFormValues>({
    mutationFn: forgotPasswordCb,
    onSuccess: () => {
      setTimeout(() => {
        router.push(LOGIN_ROUTE)
      }, 1000)
    }
  })

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    try {
      forgotPwdMutation(data)
    }
    catch (error: unknown) {
      const infoError = handleErrorForm(error);
      console.error('error in forgot password =>', infoError)
    }
  }

  return (
    <AnimatePresence>
      <Card className="max-w-[400px]">
        <p className="text-xl mb-2">Te mandaremos un enlace seguro para que puedas crear una nueva contraseña.</p>
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
          <LinkButton className="mt-4" type="secondary" href={LOGIN_ROUTE}>
            Volver
          </LinkButton>
          <Button
            className="hover:cursor-pointer"
            disabled={isPending || isSuccess}
            type="submit"
          >
            { (isIdle || isError) && 'Enviar'}
            { isPending && (<Spinner aria-label="loading login budget master" />) }
            { isSuccess && (<CheckIcon />)}
          </Button>
        </form>
      </Card>
    </AnimatePresence>
  )
}