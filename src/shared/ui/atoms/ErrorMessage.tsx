import { motion } from "motion/react"
import { ReactNode } from "react";

interface ErrorMessageProps {
  children: ReactNode;
  isAnimated: boolean;
}

export const ErrorMessage = ({ children, isAnimated }: ErrorMessageProps) => {
  if (isAnimated) {
    return (
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-red-500 text-sm mt-1">{children}</motion.p>
    )
  }
  return (
    <p className="text-red-500 text-sm mt-1">{children}</p>
  )
}