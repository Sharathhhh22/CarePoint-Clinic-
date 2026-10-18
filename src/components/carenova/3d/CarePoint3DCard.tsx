"use client"

import React, { useRef, useState, useCallback } from "react"

interface CarePoint3DCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number // degree of max tilt (default 12)
  glare?: boolean // whether to show specular light reflection
  depth?: number // translateZ for inner 3D effect
  onClick?: () => void
}

export function CarePoint3DCard({
  children,
  className = "",
  intensity = 10,
  glare = true,
  depth = 20,
  onClick,
}: CarePoint3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)")
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      // Calculate rotation (-intensity to +intensity)
      const rotateX = ((y - centerY) / centerY) * -intensity
      const rotateY = ((x - centerX) / centerX) * intensity

      setTransform(
        `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(
          2
        )}deg) scale3d(1.02, 1.02, 1.02)`
      )

      if (glare) {
        const glareX = (x / rect.width) * 100
        const glareY = (y / rect.height) * 100
        setGlarePosition({ x: glareX, y: glareY, opacity: 0.18 })
      }
    },
    [intensity, glare]
  )

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)")
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform,
        transformStyle: "preserve-3d",
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
      className={`relative will-change-transform ${className}`}
    >
      <div
        style={{
          transform: `translateZ(${depth}px)`,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        {children}
      </div>

      {/* Dynamic Specular Light Glare Overlay */}
      {glare && (
        <div
          aria-hidden="true"
          style={{
            opacity: glarePosition.opacity,
            background: `radial-gradient(circle 320px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.85), transparent 75%)`,
            transition: isHovered ? "opacity 0.2s ease" : "opacity 0.5s ease",
            pointerEvents: "none",
          }}
          className="absolute inset-0 rounded-[inherit] z-20"
        />
      )}
    </div>
  )
}
