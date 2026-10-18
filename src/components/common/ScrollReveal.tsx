"use client"

import React from "react"
import { motion, useReducedMotion, type Variants } from "motion/react"

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
  threshold?: number
  id?: string
}

export function ScrollReveal({
  children,
  className = "",
  stagger = 0.08, // 80ms stagger standard
  delay = 0,
  threshold = 0.1,
  id,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants: Variants = {
    hidden: shouldReduceMotion ? { opacity: 1 } : { opacity: 0 },
    visible: {
      opacity: 1,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            staggerChildren: stagger,
            delayChildren: delay,
          },
    },
  }

  return (
    <motion.div
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface ScrollRevealItemProps {
  children: React.ReactNode
  className?: string
  yOffset?: number
}

export function ScrollRevealItem({
  children,
  className = "",
  yOffset = 20,
}: ScrollRevealItemProps) {
  const shouldReduceMotion = useReducedMotion()

  const itemVariants: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, y: 0 }
      : { opacity: 0, y: yOffset },
    visible: {
      opacity: 1,
      y: 0,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : {
            duration: 0.5,
            ease: [0.21, 0.47, 0.32, 0.98],
          },
    },
  }

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  )
}
