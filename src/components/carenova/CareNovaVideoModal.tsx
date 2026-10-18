"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { X, Play, Pause, Volume2, VolumeX, Shield, Heart, Clock, CheckCircle2 } from "lucide-react"

interface CareNovaVideoModalProps {
  isOpen: boolean
  onClose: () => void
  onBookClick?: () => void
}

export function CareNovaVideoModal({
  isOpen,
  onClose,
  onBookClick,
}: CareNovaVideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [activeChapter, setActiveChapter] = useState(0)

  const chapters = [
    {
      title: "1. Human-Centred Philosophy",
      time: "0:00 - 1:15",
      desc: "How we prioritize active listening, patient dignity, and unrushed consultations."
    },
    {
      title: "2. The Clinical Facility",
      time: "1:15 - 2:30",
      desc: "Touring our calm, modern outpatient suites designed for comfort and privacy."
    },
    {
      title: "3. Collaborative Treatment Plans",
      time: "2:30 - 3:45",
      desc: "Partnering with patients to craft clear, manageable healthcare strategies."
    }
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#101512]/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="CarePoint Clinic Introduction Video"
    >
      <div
        className="w-full max-w-3xl bg-[#FAFAF7] rounded-3xl border border-[#E0E4DF] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E0E4DF] bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#173F30] animate-pulse" />
            <div>
              <h3 className="text-base font-bold text-[#101512]">CarePoint Clinic Introduction</h3>
              <p className="text-xs text-[#777D79]">Our approach to compassionate, human-centred healthcare</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E7EEE8] text-[#173F30] hover:bg-[#173F30] hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Display */}
        <div className="relative aspect-video w-full bg-[#101512] overflow-hidden flex items-center justify-center group">
          {/* Visual Poster Frame */}
          <Image
            src="/images/carenova/clinic-interior.jpg"
            alt="CarePoint Clinic modern outpatient consultation room"
            fill
            className={`object-cover transition-opacity duration-500 ${isPlaying ? 'opacity-85 scale-102' : 'opacity-65'}`}
            priority
          />

          {/* Subtle gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

          {/* Interactive Play / Pause Overlay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute z-10 w-16 h-16 rounded-full bg-[#173F30]/90 text-white flex items-center justify-center shadow-lg border-2 border-white/40 hover:scale-110 active:scale-95 transition-all"
            aria-label={isPlaying ? "Pause introduction" : "Play introduction"}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 text-white fill-white" />
            ) : (
              <Play className="w-7 h-7 text-white fill-white translate-x-0.5" />
            )}
          </button>

          {/* Video Status Indicator Card on Player */}
          <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A9C2B2] animate-ping" />
            <span>Introduction Walkthrough &bull; {chapters[activeChapter].title}</span>
          </div>

          {/* Bottom Player Controls */}
          <div className="absolute bottom-0 inset-x-0 p-4 z-10 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="hover:text-[#A9C2B2] transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="hover:text-[#A9C2B2] transition-colors"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-white/80">{chapters[activeChapter].time}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-white/90">
              <Shield className="w-3.5 h-3.5 text-[#A9C2B2]" />
              <span>Certified Healthcare Quality</span>
            </div>
          </div>
        </div>

        {/* Chapters and Key Highlights */}
        <div className="p-6 bg-[#FAFAF7] space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#101512] uppercase tracking-wider">
              Walkthrough Chapters
            </h4>
            <span className="text-xs text-[#777D79]">Click a chapter to preview</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {chapters.map((ch, idx) => (
              <button
                key={ch.title}
                onClick={() => {
                  setActiveChapter(idx)
                  setIsPlaying(true)
                }}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  activeChapter === idx
                    ? "bg-white border-[#173F30] shadow-xs"
                    : "bg-[#E7EEE8]/50 border-[#E0E4DF] hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className={`font-semibold ${activeChapter === idx ? 'text-[#173F30]' : 'text-[#101512]'}`}>
                    {ch.title}
                  </span>
                </div>
                <p className="text-[11px] text-[#777D79] leading-relaxed">
                  {ch.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E0E4DF]">
            <div className="flex items-center gap-2 text-xs text-[#777D79]">
              <Heart className="w-4 h-4 text-[#173F30] shrink-0" />
              <span>Ready to experience compassionate, human-centred healthcare?</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-full border border-[#E0E4DF] text-xs font-semibold text-[#101512] hover:bg-[#E7EEE8] transition-colors"
              >
                Close Video
              </button>
              {onBookClick && (
                <button
                  onClick={() => {
                    onClose()
                    onBookClick()
                  }}
                  className="w-full sm:w-auto px-5 py-2 rounded-full bg-[#173F30] text-white text-xs font-semibold hover:bg-[#123326] transition-colors shadow-xs"
                >
                  Book an Appointment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
