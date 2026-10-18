"use client"

import { useSyncExternalStore } from "react"
import { usePathname } from "next/navigation"
import { HealthcareChatbot } from "@/components/chat/HealthcareChatbot"

const emptySubscribe = () => () => {}

export function FeaturesOverlay() {
  const pathname = usePathname()
  const isMarketing = pathname === "/" || pathname?.startsWith("/about") || pathname?.startsWith("/services") || pathname?.startsWith("/gallery") || pathname?.startsWith("/pricing") || pathname?.startsWith("/contact")
  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false)

  if (!isClient) return null

  return (
    <>
      {/* Global Healthcare AI Chatbot (portal/dashboard routes only) */}
      {!isMarketing && <HealthcareChatbot />}
    </>
  )
}
