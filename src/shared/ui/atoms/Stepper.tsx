import { RiArrowRightSLine, RiCheckLine } from "@remixicon/react"
import clsx from "clsx"

interface StepperProps {
  steps: Set<string>
  currentStep: number
}

export const Stepper = ({ steps, currentStep }: StepperProps) => {
  const stepsArray = Array.from(steps)

  const circleClass = (index: number) => clsx(
    'w-8 h-8 rounded-full border flex items-center justify-center',
    {'bg-green-800 dark:bg-green-600 border-green-800 dark:border-green-600': currentStep > index + 1},
    {'bg-blue-800 border-blue-800': currentStep === index + 1}
  )
  const spanNumberClass = (index: number) => clsx(
    {'text-white': currentStep === index + 1}
  )
  const h3Class = (index: number) => clsx(
    'text-sm font-medium',
    {'text-blue-800 dark:text-blue-400': currentStep === index + 1}
  )

  return (
    <ul className="flex gap-2">
      { stepsArray.map((item, index) => (
        <div key={`step-${item}-${index}`} className="flex gap-2 items-center">
          <li className="flex gap-2 items-center">
            <div
              id={`step-number-circle-${index + 1}`}
              className={circleClass(index)}
            >
              { currentStep > index + 1 ? (<RiCheckLine />) : (<span className={spanNumberClass(index)}>{index + 1}</span>)}
            </div>
            <h3 className={h3Class(index)}>
              {item}
            </h3>
          </li>
          { (index + 1 !== stepsArray.length) && (
            <div className="block">
              <RiArrowRightSLine />
            </div>
          ) }
        </div>
      ))}
    </ul>
  )
}