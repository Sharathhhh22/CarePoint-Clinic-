"use client"

import React, { useState } from "react"
import { MessageCircle, X } from "lucide-react"

export function CarePointWhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)

  const clinicPhoneFormatted = "+1 (800) 289-2273"
  const whatsappUrl =
    "https://wa.me/18002892273?text=Hello%20CarePoint%20Clinic,%20I%20would%20like%20to%20enquire%20about%20a%20consultation."

  return (
    <div className="whatsapp-floating-btn no-print fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end">
      {/* Quick message card on click */}
      {isOpen && (
        <div className="mb-3 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-[#E0E4DF] p-4 animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0E4DF]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                <MessageCircle className="w-4 h-4 fill-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#101512]">CarePoint Direct Support</p>
                <p className="text-[10px] text-[#25D366] font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                  Clinicians online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#777D79] hover:text-[#101512] p-1 rounded-full hover:bg-[#FAFAF7]"
              aria-label="Close WhatsApp card"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#777D79] mt-3 leading-relaxed">
            Need fast guidance regarding appointment availability, specialist recommendations, or clinic directions?
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Start WhatsApp Chat</span>
          </a>
          <p className="text-[9px] text-[#777D79] text-center mt-2">
            Standard data rates may apply &bull; Non-emergency only
          </p>
        </div>
      )}

      {/* Floating launcher button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 border-2 border-white"
        aria-label="Chat with CarePoint Clinic on WhatsApp"
        title="Chat with CarePoint Clinic on WhatsApp"
      >
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#173F30] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#173F30] border border-white"></span>
        </span>
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-white" />
      </button>
    </div>
  )
}
