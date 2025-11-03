import { LOGIN_ROUTE } from "@/shared/constants/global.constants"
import { GeneralApiError } from "@/shared/types/global.types";
import { ResetPasswordData, ResetPasswordFormValues, ResetPasswordPayload, ResetPasswordSchema, ResetPasswordStatus } from "@/shared/types/login.types";
import { ErrorMessage } from "@/shared/ui/atoms/ErrorMessage";
import { LinkButton } from "@/shared/ui/atoms/LinkButton"
import { resetPasswordCb } from "@/shared/utils/login.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { Button, Card, CheckIcon, Label, Spinner, TextInput } from "flowbite-react"
import { AnimatePresence } from "motion/react"
import { SubmitHandler, useForm } from "react-hook-form";

interface ResetPasswordFormProps {
  slug: string;
  toggleMessageCardState: (state: ResetPasswordStatus) => void
}

export const ResetPasswordForm = ({ slug, toggleMessageCardState }: ResetPasswordFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(ResetPasswordSchema)
  })

  const { mutate: resetPwdMutation, isError, isPending, isSuccess, isIdle } = useMutation<ResetPasswordData, GeneralApiError, ResetPasswordPayload>({
    mutationFn: (data) => resetPasswordCb(data),
    onError: () => {
      toggleMessageCardState("error")
    },
    onSuccess: () => {
      toggleMessageCardState("success")
    }
  })

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = (data) => {
    const payload: ResetPasswordPayload = {
      password: data.password,
      slug,
    }
    resetPwdMutation(payload)
  }

  return (
    <AnimatePresence>
      <Card className="max-w-[400px]">
        <p className="text-xl text-black dark:text-white mb-2">
          Ingresa tu nueva contraseña para reestablecer tu contraseña y continuar con el acceso seguro a tu cuenta.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex max-w-md flex-col gap-4"
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password">Nueva Contraseña</Label>
            </div>
            <TextInput
              data-testid="password"
              id="password"
              type="password"
              {...register("password")}
            />
            { errors?.password?.message && (
              <ErrorMessage isAnimated>{errors.password?.message}</ErrorMessage>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
            </div>
            <TextInput
              data-testid="confirmPassword"
              type="password"
              id="confirmPassword"
              {...register("confirmPassword")}
            />
            { errors?.confirmPassword?.message && (
              <ErrorMessage isAnimated>{errors.confirmPassword?.message}</ErrorMessage>
            )}
          </div>
          <LinkButton className="mt-4" type="secondary" href={LOGIN_ROUTE} >Volver al inicio</LinkButton>
            <Button
              className="hover:cursor-pointer"
              disabled={isPending || isSuccess}
              type="submit"
              >
            { (isIdle || isError) && 'Reestablecer contraseña'}
            { isPending && (<Spinner aria-label="loading reset password budget master" />) }
            { isSuccess && (<CheckIcon />)}
          </Button>
        </form>
      </Card>
    </AnimatePresence>
  )
}