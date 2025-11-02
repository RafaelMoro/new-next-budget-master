import { motion, AnimatePresence, AnimationGeneratorType } from "motion/react"
import { ReactNode } from "react";

const variantsAnimateBox = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const transition = {
  x: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 30,
  },
  opacity: {
    duration: 0.2,
  },
};

interface AnimateCardProps {
  children: ReactNode;
  direction: number;
}

/**
* This component has to be used as a wrapper of the child component that
* want to be animated.

* In the parent component, you have to use the hook useAnimateBox that
* has all the logic needed to start using AnimateBox component.
*/

const AnimateBox = ({ children, direction }: AnimateCardProps) => (
  <AnimatePresence custom={direction}>
    <motion.div
      custom={direction}
      variants={variantsAnimateBox}
      initial="enter"
      animate="center"
      exit="exit"
      transition={transition}
    >
      { children }
    </motion.div>
  </AnimatePresence>
);

export { AnimateBox };