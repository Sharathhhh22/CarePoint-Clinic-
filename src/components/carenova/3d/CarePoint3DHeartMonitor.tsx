"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Heart,
  Activity,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react"
import { openBookingModal } from "@/lib/booking-events"

export function CarePoint3DHeartMonitor() {
  const [bpm, setBpm] = useState(72)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  // Web Audio Synth for Heartbeat sound (safe, local, zero external audio assets)
  const playBeep = () => {
    if (!soundEnabled) return
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      const ctx = audioCtxRef.current
      if (ctx.state === "suspended") {
        ctx.resume()
      }
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(140, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } catch (e) {
      // Audio autoplay policy
    }
  }

  // 3D Perspective ECG Waveform Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let offset = 0
    let lastBeatTime = Date.now()
    const intervalMs = (60 / bpm) * 1000

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const w = canvas.width
      const h = canvas.height
      const centerY = h / 2

      // 1. Perspective 3D grid lines
      ctx.strokeStyle = "rgba(169, 194, 178, 0.2)"
      ctx.lineWidth = 1
      for (let y = 20; y < h; y += 24) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
      for (let x = 0; x < w; x += 32) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }

      // 2. Real-time dynamic P-Q-R-S-T ECG Waveform
      ctx.strokeStyle = "#173F30"
      ctx.lineWidth = 2.5
      ctx.shadowColor = "#A9C2B2"
      ctx.shadowBlur = 8
      ctx.beginPath()

      const now = Date.now()
      if (now - lastBeatTime >= intervalMs) {
        lastBeatTime = now
        playBeep()
      }

      for (let x = 0; x < w; x++) {
        const timePos = (x + offset) % 240
        let waveY = 0

        // P wave
        if (timePos > 40 && timePos < 65) {
          waveY = -Math.sin(((timePos - 40) / 25) * Math.PI) * 12
        }
        // Q wave
        else if (timePos >= 65 && timePos < 75) {
          waveY = Math.sin(((timePos - 65) / 10) * Math.PI) * 8
        }
        // QRS Spike (R)
        else if (timePos >= 75 && timePos < 90) {
          waveY = -Math.sin(((timePos - 75) / 15) * Math.PI) * 58
        }
        // S wave
        else if (timePos >= 90 && timePos < 102) {
          waveY = Math.sin(((timePos - 90) / 12) * Math.PI) * 14
        }
        // T wave
        else if (timePos >= 130 && timePos < 170) {
          waveY = -Math.sin(((timePos - 130) / 40) * Math.PI) * 20
        }

        const plotY = centerY + waveY
        if (x === 0) {
          ctx.moveTo(x, plotY)
        } else {
          ctx.lineTo(x, plotY)
        }
      }
      ctx.stroke()
      ctx.shadowBlur = 0

      // Leading pulse dot
      const leadX = (w - 20)
      ctx.fillStyle = "#E25C3D"
      ctx.beginPath()
      ctx.arc(leadX, centerY, 4.5, 0, Math.PI * 2)
      ctx.fill()

      offset += (bpm / 60) * 2.8
      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [bpm, soundEnabled])

  return (
    <div className="w-full bg-[#FAFAF7] rounded-[36px] border border-[#E0E4DF] p-6 sm:p-10 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT: 3D CARDIAC MONITOR VIEWPORT */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E0E4DF] p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E0E4DF]/70 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E25C3D] opacity-75"
                  style={{ animationDuration: `${60 / bpm}s` }}
                ></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E25C3D]"></span>
              </span>
              <span className="text-xs font-bold text-[#101512] uppercase tracking-wider">
                Digital ECG Lead II Telemetry
              </span>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-full border border-[#E0E4DF] text-[#777D79] hover:text-[#101512] hover:bg-[#E7EEE8] transition-colors"
              title={soundEnabled ? "Mute audio" : "Enable sound"}
              aria-label={soundEnabled ? "Mute heart sound" : "Enable heart sound"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-[#173F30]" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          {/* Canvas Waveform */}
          <div className="w-full h-44 bg-[#FAFAF7] rounded-2xl border border-[#E0E4DF] overflow-hidden flex items-center justify-center relative">
            <canvas ref={canvasRef} width={580} height={176} className="w-full h-full" />
            <span className="absolute bottom-2 right-3 text-[10px] font-mono text-[#777D79]">
              25mm/s &bull; 10mm/mV &bull; Filter 0.05-150Hz
            </span>
          </div>

          {/* BPM Controls */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E0E4DF]/70">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#173F30]">{bpm}</span>
              <span className="text-xs font-bold text-[#777D79] uppercase">BPM (Rhythm)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setBpm(62)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  bpm === 62
                    ? "bg-[#173F30] text-white shadow-xs"
                    : "bg-[#FAFAF7] text-[#777D79] border border-[#E0E4DF] hover:text-[#101512]"
                }`}
              >
                Resting (62)
              </button>
              <button
                onClick={() => setBpm(78)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  bpm === 78
                    ? "bg-[#173F30] text-white shadow-xs"
                    : "bg-[#FAFAF7] text-[#777D79] border border-[#E0E4DF] hover:text-[#101512]"
                }`}
              >
                Normal (78)
              </button>
              <button
                onClick={() => setBpm(108)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  bpm === 108
                    ? "bg-[#E25C3D] text-white shadow-xs"
                    : "bg-[#FAFAF7] text-[#777D79] border border-[#E0E4DF] hover:text-[#101512]"
                }`}
              >
                Elevated (108)
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: CLINICAL EXPLANATION & ACTION */}
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E7EEE8] text-[#173F30] text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 text-[#173F30]" />
            <span>Cardiovascular Diagnostics</span>
          </div>

          <h4 className="text-2xl font-bold text-[#101512] tracking-tight">
            Comprehensive Non-Invasive Cardiac Reviews
          </h4>

          <p className="text-xs sm:text-sm text-[#777D79] leading-relaxed">
            Our outpatient cardiology department utilizes high-precision 12-lead digital electrocardiography and color Doppler echocardiograms to detect silent arrhythmias, evaluate heart valve kinetics, and prevent coronary disease early.
          </p>

          <div className="space-y-2 text-xs text-[#101512] pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#173F30] shrink-0" />
              <span>Same-day digital ECG interpretation by board-certified cardiologist</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#173F30] shrink-0" />
              <span>Zero radiation, non-invasive acoustic ultrasound imaging</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#173F30] shrink-0" />
              <span>Direct encrypted report delivery to your smartphone patient portal</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() =>
                openBookingModal({
                  service: "Cardiovascular Health & Prevention",
                  doctor: "Dr. Marcus Vance, MD, FACC",
                })
              }
              className="inline-flex items-center gap-2 bg-[#173F30] hover:bg-[#123326] text-white text-xs font-bold px-6 py-3.5 rounded-full transition-all shadow-xs active:scale-[0.98]"
            >
              <span>Schedule Cardiac Evaluation ($130)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
