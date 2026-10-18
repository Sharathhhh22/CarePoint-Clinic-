"use client" 

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

interface ShiningTextProps {
  text: string
  className?: string
}

export function ShiningText({ text, className = "" }: ShiningTextProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.h1
      className={`bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-base font-regular text-transparent ${className}`}
      initial={{ backgroundPosition: "200% 0" }}
      animate={shouldReduceMotion ? { backgroundPosition: "50% 0" } : { backgroundPosition: "-200% 0" }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              repeat: Infinity,
              duration: 2,
              ease: "linear",
            }
      }
    >
      {text}
    </motion.h1>
  )
}
