import { YupError } from "../types/global.types"

export const handleErrorForm = (error: unknown): YupError => {
  const newError = error as YupError
  return newError
}