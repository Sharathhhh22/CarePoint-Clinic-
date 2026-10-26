"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Bot, User, ArrowRight, Loader2, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { ChatMessage } from "@/services/llm/types"

function createMsgId(prefix: string): string {
  return `${prefix}-${Date.now()}`
}

function createTimestamp(): string {
  return new Date().toISOString()
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    content: "Hello! I am the SlotUrSelf Healthcare Assistant. Describe your symptoms or ask about clinical specialists, and I will guide you to the right department.",
    timestamp: "2026-01-01T00:00:00.000Z",
    metadata: {
      suggestedActions: [
        { label: "Book an Appointment", action: "book" },
        { label: "Find Specialists", action: "department" },
      ]
    }
  }
]

const QUICK_PROMPTS = [
  "I have a throbbing headache & sensitivity to light",
  "Chest tightness after climbing stairs",
  "Joint pain in my left knee",
  "Persistent dry cough for two weeks"
]

export function HealthcareChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isOpen])

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim()
    if (!text || isLoading) return

    const userMessage: ChatMessage = {
      id: createMsgId("usr"),
      role: "user",
      content: text,
      timestamp: createTimestamp()
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputValue("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      if (!res.ok) throw new Error("Server error")

      const botMessage: ChatMessage = await res.json()
      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      console.error("Chatbot request failed:", err)
      const fallbackMsg: ChatMessage = {
        id: createMsgId("err"),
        role: "assistant",
        content: "I am having trouble connecting to our clinical knowledge base right now. You can browse all verified medical departments directly or book a general consultation.",
        timestamp: createTimestamp(),
        metadata: {
          suggestedActions: [
            { label: "Browse Medical Departments", action: "department" },
            { label: "Book General Consultation", action: "book" }
          ]
        }
      }
      setMessages(prev => [...prev, fallbackMsg])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    <>
      {/* Floating Toggle Button (elevated above mobile bottom nav on small screens) */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close clinical assistant" : "Open clinical assistant"}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-transform hover:scale-105 active:scale-95"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-teal-500"></span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Chat Window Dialog - Fullscreen on mobile, floating card on desktop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Clinical AI Assistant"
            className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-[60] w-full sm:w-[420px] h-[100dvh] sm:h-[80vh] sm:max-h-[620px] flex flex-col bg-card sm:border sm:border-border sm:rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 bg-surface border-b border-border pt-[calc(0.75rem+env(safe-area-inset-top,0px))] sm:pt-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    SlotUrSelf AI Assistant
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                      Beta
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">Triage & Specialist Guidance</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-surface-elevated transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Emergency Notice Banner */}
            <div className="px-4 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2 text-[11px] text-amber-700 dark:text-amber-300">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>For urgent medical crises, dial 108 immediately.</span>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[82%] space-y-2`}>
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-xs"
                          : "bg-surface border border-border text-foreground rounded-bl-xs shadow-xs whitespace-pre-line"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Department or Action Cards */}
                    {msg.metadata?.suggestedActions && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.metadata.suggestedActions.map((action, i) => (
                          <div key={i}>
                            {action.action === "book" ? (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-primary/40 text-primary hover:bg-primary/10"
                              >
                                <Link
                                  href={`/appointments/new${action.payload ? `?dept=${encodeURIComponent(action.payload)}` : ""}`}
                                  onClick={() => setIsOpen(false)}
                                >
                                  {action.label}
                                  <ArrowRight className="w-3 h-3 ml-1" />
                                </Link>
                              </Button>
                            ) : action.action === "department" ? (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-border text-foreground hover:bg-muted"
                              >
                                <Link href="/departments" onClick={() => setIsOpen(false)}>
                                  {action.label}
                                </Link>
                              </Button>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-primary shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-surface border border-border rounded-2xl rounded-bl-xs p-3 text-sm text-muted-foreground flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    <span>Analyzing clinical guidelines...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            {messages.length <= 2 && (
              <div className="p-3 bg-surface border-t border-border">
                <p className="text-[11px] font-medium text-muted-foreground mb-2">Common questions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-left text-xs px-2.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-muted border border-border text-foreground transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] bg-surface border-t border-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe your health concern..."
                  className="flex-1 h-11 px-3.5 rounded-xl border border-border bg-input-bg text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading || !inputValue.trim()}
                  className="h-11 w-11 px-0 flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground shrink-0 shadow-xs"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
