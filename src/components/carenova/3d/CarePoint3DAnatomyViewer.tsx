"use client"

import React, { useState, useEffect, useRef } from "react"
import {
  Brain,
  Heart,
  Activity,
  Sparkles,
  ArrowRight,
  RotateCw,
  RotateCcw,
  Stethoscope,
  Info,
  CheckCircle2,
  Calendar,
} from "lucide-react"
import { openBookingModal } from "@/lib/booking-events"

interface AnatomyZone {
  id: string
  name: string
  organ: string
  x: number // percent on body map
  y: number // percent on body map
  zDepth: number // 3d visual depth
  color: string
  specialist: string
  specialty: string
  duration: string
  fee: string
  symptoms: string[]
  diagnosticTests: string[]
  rationale: string
}

const ANATOMY_ZONES: AnatomyZone[] = [
  {
    id: "head",
    name: "Cranial & Neurological",
    organ: "Brain & Head",
    x: 50,
    y: 12,
    zDepth: 15,
    color: "#173F30",
    specialist: "Dr. Anita Chen, MD, PhD",
    specialty: "Neurology & Headache Clinic",
    duration: "45–60 mins",
    fee: "$150",
    symptoms: [
      "Throbbing hemicranial migraine",
      "Visual auras & light sensitivity",
      "Tension headaches & neck tightness",
      "Vestibular dizziness & imbalance",
    ],
    diagnosticTests: ["Cranial Nerve Screening", "Digital Nerve Velocity Assessment", "Cognitive Function Battery"],
    rationale:
      "Dr. Anita Chen provides thorough neurologic evaluations to distinguish vascular migraines from cervicogenic tension and formulate preventive therapeutic protocols.",
  },
  {
    id: "heart",
    name: "Cardiovascular & Rhythm",
    organ: "Heart & Vascular",
    x: 53,
    y: 31,
    zDepth: 25,
    color: "#E25C3D",
    specialist: "Dr. Marcus Vance, MD, FACC",
    specialty: "Cardiology & Vascular Health",
    duration: "45 mins",
    fee: "$130",
    symptoms: [
      "Fluttering heart palpitations",
      "Elevated resting blood pressure",
      "Exertional shortness of breath",
      "Family history of coronary disease",
    ],
    diagnosticTests: ["12-Lead Resting Digital ECG", "Color Doppler Echocardiography", "Advanced Lipid Biomarkers"],
    rationale:
      "Dr. Marcus Vance conducts prompt non-invasive cardiovascular reviews to detect arrhythmias, evaluate arterial elasticity, and establish preventive care.",
  },
  {
    id: "chest",
    name: "Respiratory & Pulmonary",
    organ: "Lungs & Airways",
    x: 46,
    y: 34,
    zDepth: 18,
    color: "#528265",
    specialist: "Dr. Sara Khan, MD",
    specialty: "Primary Care & Family Medicine",
    duration: "30–45 mins",
    fee: "$75",
    symptoms: [
      "Persistent dry or productive cough",
      "Seasonal allergic asthma",
      "Chest tightness after viral illness",
      "Wheezing during exertion",
    ],
    diagnosticTests: ["Pulse Oximetry Saturation", "Peak Expiratory Flow", "Targeted Lung Auscultation"],
    rationale:
      "Dr. Sara Khan examines airway reactivity, rules out secondary bronchospasm, and tailors inhaler regimens and antibiotic therapy when clinically indicated.",
  },
  {
    id: "abdomen",
    name: "Gastrointestinal & Metabolic",
    organ: "Digestive & Endocrine",
    x: 50,
    y: 47,
    zDepth: 20,
    color: "#A9C2B2",
    specialist: "Dr. Elena Rostova, MD, FACP",
    specialty: "Internal Medicine & Diagnostics",
    duration: "45 mins",
    fee: "$130",
    symptoms: [
      "Chronic unexplained fatigue",
      "Acid reflux & epigastric burning",
      "Metabolic resistance & weight shifts",
      "Food sensitivities & bloating",
    ],
    diagnosticTests: ["Full Metabolic Panel", "High-Resolution Abdominal Ultrasound", "Thyroid Profile (TSH, FT4)"],
    rationale:
      "Dr. Elena Rostova specializes in investigating complex multi-system complaints, identifying metabolic imbalances, and restoring endocrine harmony.",
  },
  {
    id: "joints",
    name: "Spine & Musculoskeletal",
    organ: "Spine & Joints",
    x: 50,
    y: 65,
    zDepth: 12,
    color: "#2C5E47",
    specialist: "Dr. Marcus Vance, MD",
    specialty: "Primary Care & Sports Medicine",
    duration: "30 mins",
    fee: "$75",
    symptoms: [
      "Lumbar spine aching & posture strain",
      "Knee & hip morning stiffness",
      "Shoulder impingement discomfort",
      "Workstation repetitive ergonomics",
    ],
    diagnosticTests: ["Range of Motion Assessment", "Joint Effusion Ultrasound", "Ergonomic Alignment Protocol"],
    rationale:
      "Comprehensive musculoskeletal examinations to alleviate inflammatory pain, correct mechanical dysfunction, and support active mobility without surgery.",
  },
]

export function CarePoint3DAnatomyViewer() {
  const [selectedZoneId, setSelectedZoneId] = useState<string>("heart")
  const [rotationAngle, setRotationAngle] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const activeZone = ANATOMY_ZONES.find((z) => z.id === selectedZoneId) || ANATOMY_ZONES[0]

  // Render 3D Canvas Body Wireframe & Orbiting Hotspot Field
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let angle = rotationAngle

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const rad = (angle * Math.PI) / 180

      // 1. Draw glowing 3D perspective ellipse grid
      ctx.strokeStyle = "rgba(169, 194, 178, 0.25)"
      ctx.lineWidth = 1
      for (let r = 80; r <= 220; r += 45) {
        ctx.beginPath()
        ctx.ellipse(centerX, centerY + 180, r, r * 0.35, 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      // 2. Draw 3D Human Silhouette Mesh Wireframe
      // Head
      ctx.strokeStyle = "rgba(23, 63, 48, 0.45)"
      ctx.lineWidth = 1.5
      const headX = centerX + Math.sin(rad) * 6
      ctx.beginPath()
      ctx.arc(headX, centerY - 180, 26, 0, Math.PI * 2)
      ctx.stroke()

      // Neck & Shoulders
      ctx.beginPath()
      ctx.moveTo(headX, centerY - 154)
      ctx.lineTo(headX, centerY - 135)
      ctx.lineTo(centerX - 65, centerY - 105)
      ctx.lineTo(centerX + 65, centerY - 105)
      ctx.closePath()
      ctx.stroke()

      // Torso & Chest
      ctx.beginPath()
      ctx.moveTo(centerX - 65, centerY - 105)
      ctx.lineTo(centerX - 42, centerY + 25)
      ctx.lineTo(centerX + 42, centerY + 25)
      ctx.lineTo(centerX + 65, centerY - 105)
      ctx.closePath()
      ctx.stroke()

      // Spine axis
      ctx.strokeStyle = "rgba(169, 194, 178, 0.5)"
      ctx.setLineDash([4, 4])
      ctx.beginPath()
      ctx.moveTo(headX, centerY - 180)
      ctx.lineTo(centerX + Math.sin(rad) * 4, centerY + 160)
      ctx.stroke()
      ctx.setLineDash([])

      // Pelvis & Legs
      ctx.strokeStyle = "rgba(23, 63, 48, 0.35)"
      ctx.beginPath()
      // Left leg
      ctx.moveTo(centerX - 35, centerY + 25)
      ctx.lineTo(centerX - 30, centerY + 110)
      ctx.lineTo(centerX - 32, centerY + 190)
      // Right leg
      ctx.moveTo(centerX + 35, centerY + 25)
      ctx.lineTo(centerX + 30, centerY + 110)
      ctx.lineTo(centerX + 32, centerY + 190)
      ctx.stroke()

      // Arms
      ctx.beginPath()
      // Left arm
      ctx.moveTo(centerX - 65, centerY - 105)
      ctx.lineTo(centerX - 85, centerY - 10)
      ctx.lineTo(centerX - 95, centerY + 70)
      // Right arm
      ctx.moveTo(centerX + 65, centerY - 105)
      ctx.lineTo(centerX + 85, centerY - 10)
      ctx.lineTo(centerX + 95, centerY + 70)
      ctx.stroke()

      // 3. Render 3D Orbiting Hotspot Pins
      ANATOMY_ZONES.forEach((zone) => {
        const isSelected = zone.id === selectedZoneId
        // Calculate 3D perspective coordinate
        const zoneRad = rad + (zone.zDepth * Math.PI) / 180
        const posX = centerX + ((zone.x - 50) / 50) * 80 + Math.sin(zoneRad) * 14
        const posY = ((zone.y / 100) * 440) + 30

        // Pulsing rings
        ctx.save()
        if (isSelected) {
          ctx.strokeStyle = "#173F30"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(posX, posY, 16 + Math.sin(Date.now() / 200) * 3, 0, Math.PI * 2)
          ctx.stroke()

          ctx.fillStyle = "rgba(23, 63, 48, 0.25)"
          ctx.beginPath()
          ctx.arc(posX, posY, 12, 0, Math.PI * 2)
          ctx.fill()
        }

        // Core dot
        ctx.fillStyle = isSelected ? "#173F30" : "#528265"
        ctx.beginPath()
        ctx.arc(posX, posY, isSelected ? 7 : 5, 0, Math.PI * 2)
        ctx.fill()

        // Label
        ctx.fillStyle = isSelected ? "#101512" : "#777D79"
        ctx.font = isSelected ? "bold 11px sans-serif" : "10px sans-serif"
        ctx.fillText(zone.organ, posX + 12, posY + 4)
        ctx.restore()
      })

      if (isAutoRotating) {
        angle += 0.35
        setRotationAngle(Math.round(angle % 360))
        animationId = requestAnimationFrame(render)
      }
    }

    render()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [rotationAngle, selectedZoneId, isAutoRotating])

  return (
    <div className="w-full bg-[#FAFAF7] rounded-[36px] border border-[#E0E4DF] p-6 sm:p-10 lg:p-12 shadow-sm">
      {/* HEADER */}
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E7EEE8] text-[#173F30] text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#173F30]" />
          <span>Interactive 3D Body Triage Map</span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-extrabold text-[#101512] tracking-tight">
          Where are you experiencing discomfort?
        </h3>
        <p className="text-sm sm:text-base text-[#777D79] mt-2">
          Rotate the 3D anatomical model or choose a biological system to immediately view diagnostic testing protocols and matched physicians.
        </p>
      </div>

      {/* INTERACTIVE 3D EXPLORER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT: 3D ANATOMY CANVAS WITH ROTATION CONTROLS */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E0E4DF] p-6 flex flex-col items-center justify-between shadow-2xs relative overflow-hidden">
          {/* Rotation bar */}
          <div className="w-full flex items-center justify-between pb-4 border-b border-[#E0E4DF]/70 z-10">
            <span className="text-xs font-bold text-[#101512] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#173F30]" />
              <span>3D Anatomical Perspective: {rotationAngle}°</span>
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setRotationAngle((prev) => (prev - 30 + 360) % 360)}
                className="w-8 h-8 rounded-full border border-[#E0E4DF] hover:bg-[#E7EEE8] text-[#101512] flex items-center justify-center transition-colors"
                title="Rotate Left"
                aria-label="Rotate Left"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setRotationAngle((prev) => (prev + 30) % 360)}
                className="w-8 h-8 rounded-full border border-[#E0E4DF] hover:bg-[#E7EEE8] text-[#101512] flex items-center justify-center transition-colors"
                title="Rotate Right"
                aria-label="Rotate Right"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                  isAutoRotating
                    ? "bg-[#173F30] text-white border-[#173F30]"
                    : "bg-[#FAFAF7] text-[#777D79] border-[#E0E4DF] hover:text-[#101512]"
                }`}
              >
                {isAutoRotating ? "Pause" : "360° Spin"}
              </button>
            </div>
          </div>

          {/* Canvas element */}
          <div className="relative w-full h-[440px] flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={420}
              height={440}
              className="max-w-full h-auto cursor-grab active:cursor-grabbing"
              onClick={(e) => {
                // Click proximity detection to select hotspot
                const rect = e.currentTarget.getBoundingClientRect()
                const clickY = ((e.clientY - rect.top) / rect.height) * 100
                if (clickY < 20) setSelectedZoneId("head")
                else if (clickY < 38) setSelectedZoneId("heart")
                else if (clickY < 55) setSelectedZoneId("abdomen")
                else setSelectedZoneId("joints")
              }}
            />
          </div>

          {/* Quick zone pills */}
          <div className="w-full pt-4 border-t border-[#E0E4DF]/70 flex flex-wrap gap-1.5 justify-center z-10">
            {ANATOMY_ZONES.map((zone) => {
              const isSelected = zone.id === selectedZoneId
              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-[#173F30] text-white shadow-xs"
                      : "bg-[#FAFAF7] text-[#777D79] hover:bg-[#E7EEE8] hover:text-[#101512] border border-[#E0E4DF]"
                  }`}
                >
                  {zone.organ}
                </button>
              )
            })}
          </div>
        </div>

        {/* RIGHT: LIVE CLINICAL DIAGNOSIS & PHYSICIAN RECOMMENDATION */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E0E4DF] p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-[#E7EEE8] text-[#173F30] text-xs font-bold uppercase tracking-wider">
                {activeZone.organ} Region
              </span>
              <span className="text-xs font-semibold text-[#777D79]">
                {activeZone.duration}
              </span>
            </div>

            <h4 className="text-2xl font-bold text-[#101512] mb-1">{activeZone.name}</h4>
            <p className="text-xs font-semibold text-[#173F30] mb-5">
              {activeZone.specialty}
            </p>

            {/* Common clinical signs */}
            <div className="mb-6">
              <p className="text-xs font-bold text-[#101512] uppercase tracking-wider mb-2">
                Typical Symptoms Checked:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeZone.symptoms.map((s, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-[#FAFAF7] border border-[#E0E4DF] text-xs text-[#777D79] flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#173F30] shrink-0" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic protocols */}
            <div className="mb-6">
              <p className="text-xs font-bold text-[#101512] uppercase tracking-wider mb-2">
                Diagnostic Equipment Utilized:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeZone.diagnosticTests.map((t, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-[#E7EEE8]/70 text-[#173F30] text-[11px] font-semibold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Medical Rationale */}
            <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E0E4DF] text-xs text-[#777D79] leading-relaxed mb-6">
              <p className="font-bold text-[#101512] mb-1 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#173F30]" /> Clinical Routing Standard:
              </p>
              {activeZone.rationale}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-[#E0E4DF] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-[#777D79] uppercase font-bold tracking-wider">
                Attending Specialist
              </p>
              <p className="text-sm font-bold text-[#101512]">{activeZone.specialist}</p>
              <p className="text-xs font-extrabold text-[#173F30] mt-0.5">
                {activeZone.fee} consultation rate
              </p>
            </div>

            <button
              onClick={() =>
                openBookingModal({
                  service: activeZone.specialty,
                  doctor: activeZone.specialist,
                })
              }
              className="inline-flex items-center justify-center gap-2 bg-[#173F30] hover:bg-[#123326] text-white text-xs font-bold px-6 py-3.5 rounded-full transition-all shadow-xs active:scale-[0.98]"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment for This Region</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
