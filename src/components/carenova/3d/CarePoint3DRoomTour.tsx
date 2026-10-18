"use client"

import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import {
  Compass,
  Maximize2,
  CheckCircle2,
  Info,
  ShieldCheck,
  RotateCw,
  Eye,
  Layers,
} from "lucide-react"

interface RoomConfig {
  id: string
  name: string
  image: string
  subtitle: string
  hotspots: {
    title: string
    spec: string
    yaw: number // horizontal angle degrees
    pitch: number // vertical angle degrees
  }[]
}

const ROOMS: RoomConfig[] = [
  {
    id: "suite",
    name: "Consultation Suite 3A",
    image: "/images/carenova/clinic-interior.jpg",
    subtitle: "Private unhurried consultation suite with daylight & acoustic dampening",
    hotspots: [
      {
        title: "HEPA-14 Air Scrubber",
        spec: "12 hospital-grade air exchanges per hour eliminating 99.97% of particulates",
        yaw: 45,
        pitch: 15,
      },
      {
        title: "Ergonomic Patient Recliner",
        spec: "Integrated touchless vitals measurement and zero-gravity recline angle",
        yaw: -30,
        pitch: -10,
      },
      {
        title: "Acoustic Partition Barrier",
        spec: "STC-55 lab-tested dual soundproofing for complete dialogue privacy",
        yaw: 120,
        pitch: 0,
      },
    ],
  },
  {
    id: "diagnostics",
    name: "Diagnostic & Ultrasound Bay",
    image: "/images/carenova/doc-clinic-2.jpg",
    subtitle: "On-site high-resolution echocardiography and rapid biomarker testing",
    hotspots: [
      {
        title: "Color Doppler Ultrasound",
        spec: "Sub-millimeter cardiac valve and abdominal organ resolution with instant cloud PACS",
        yaw: 15,
        pitch: -5,
      },
      {
        title: "Digital ECG Lead Hub",
        spec: "12-lead synchronized telemetry analyzing rhythm irregularities in 90 seconds",
        yaw: -60,
        pitch: 10,
      },
    ],
  },
  {
    id: "lounge",
    name: "Botanical Waiting Lounge",
    image: "/images/carenova/doc-clinic-4.jpg",
    subtitle: "Serene arrival lounge designed to lower heart rates and remove waiting fatigue",
    hotspots: [
      {
        title: "Biophilic Living Plant Wall",
        spec: "Natural oxygenating vertical garden proven to reduce patient anxiety levels",
        yaw: 60,
        pitch: 5,
      },
      {
        title: "Zero-Queue Check-in Node",
        spec: "Digital mobile token arrival system with average wait under 4 minutes",
        yaw: -45,
        pitch: -8,
      },
    ],
  },
]

export function CarePoint3DRoomTour() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0)
  const [activeHotspot, setActiveHotspot] = useState<{ title: string; spec: string } | null>(null)
  const [isUserInteracting, setIsUserInteracting] = useState(false)

  const currentRoom = ROOMS[selectedRoomIndex]

  useEffect(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    let animId: number

    const width = container.clientWidth
    const height = container.clientHeight || 480

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, width / height, 1, 1100)
    const cameraTarget = new THREE.Vector3(0, 0, 0)

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    container.innerHTML = ""
    container.appendChild(renderer.domElement)

    // 3. 3D PANORAMIC SPHERE
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1) // invert sphere so image is projected inside

    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load(currentRoom.image, () => {
      renderer.render(scene, camera)
    })
    texture.colorSpace = THREE.SRGBColorSpace

    const material = new THREE.MeshBasicMaterial({ map: texture })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // 4. MOUSE DRAG / PAN LOGIC
    let isMouseDown = false
    let onPointerDownPointerX = 0
    let onPointerDownPointerY = 0
    let onPointerDownLon = 0
    let onPointerDownLat = 0
    let lon = 0
    let lat = 0
    let phi = 0
    let theta = 0

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      isMouseDown = true
      setIsUserInteracting(true)
      const clientX = "touches" in event ? event.touches[0].clientX : event.clientX
      const clientY = "touches" in event ? event.touches[0].clientY : event.clientY
      onPointerDownPointerX = clientX
      onPointerDownPointerY = clientY
      onPointerDownLon = lon
      onPointerDownLat = lat
    }

    const onPointerMove = (event: MouseEvent | TouchEvent) => {
      if (!isMouseDown) return
      const clientX = "touches" in event ? event.touches[0].clientX : event.clientX
      const clientY = "touches" in event ? event.touches[0].clientY : event.clientY
      lon = (onPointerDownPointerX - clientX) * 0.15 + onPointerDownLon
      lat = (clientY - onPointerDownPointerY) * 0.15 + onPointerDownLat
    }

    const onPointerUp = () => {
      isMouseDown = false
      setTimeout(() => setIsUserInteracting(false), 3000)
    }

    container.addEventListener("mousedown", onPointerDown)
    container.addEventListener("mousemove", onPointerMove)
    window.addEventListener("mouseup", onPointerUp)

    container.addEventListener("touchstart", onPointerDown, { passive: true })
    container.addEventListener("touchmove", onPointerMove, { passive: true })
    window.addEventListener("touchend", onPointerUp)

    // Resize listener
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", onResize)

    // 5. ANIMATION LOOP
    const animate = () => {
      animId = requestAnimationFrame(animate)

      // Slow auto-rotation when user is not dragging
      if (!isMouseDown) {
        lon += 0.08
      }

      lat = Math.max(-85, Math.min(85, lat))
      phi = THREE.MathUtils.degToRad(90 - lat)
      theta = THREE.MathUtils.degToRad(lon)

      cameraTarget.x = 500 * Math.sin(phi) * Math.cos(theta)
      cameraTarget.y = 500 * Math.cos(phi)
      cameraTarget.z = 500 * Math.sin(phi) * Math.sin(theta)

      camera.lookAt(cameraTarget)
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("mouseup", onPointerUp)
      window.removeEventListener("touchend", onPointerUp)
      window.removeEventListener("resize", onResize)
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [selectedRoomIndex, currentRoom.image])

  return (
    <div className="w-full bg-[#FAFAF7] rounded-[36px] border border-[#E0E4DF] p-6 sm:p-10 shadow-sm overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E7EEE8] text-[#173F30] text-xs font-semibold mb-3">
            <Compass className="w-3.5 h-3.5 text-[#173F30]" />
            <span>Interactive 3D Virtual Clinic Tour</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#101512] tracking-tight">
            Explore CarePoint Clinic in 360° 3D
          </h3>
          <p className="text-xs sm:text-sm text-[#777D79] mt-1">
            Click and drag inside the viewport to look 360 degrees around our facilities.
          </p>
        </div>

        {/* Room Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-full border border-[#E0E4DF] shadow-2xs">
          {ROOMS.map((room, idx) => (
            <button
              key={room.id}
              onClick={() => {
                setSelectedRoomIndex(idx)
                setActiveHotspot(null)
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedRoomIndex === idx
                  ? "bg-[#173F30] text-white shadow-xs"
                  : "text-[#777D79] hover:text-[#101512]"
              }`}
            >
              {room.name.split(" ")[0]} {room.name.split(" ")[1] || ""}
            </button>
          ))}
        </div>
      </div>

      {/* 3D PANORAMIC VIEWPORT CONTAINER */}
      <div className="relative w-full h-[480px] sm:h-[540px] rounded-3xl overflow-hidden border border-[#E0E4DF] shadow-inner bg-[#101512]">
        <div
          ref={containerRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          title="Click and drag to rotate 360 degrees"
        />

        {/* Overlay drag hint indicator */}
        <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#173F30] text-xs font-bold shadow-sm flex items-center gap-2 pointer-events-none">
          <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "8s" }} />
          <span>360° Drag & Look Active</span>
        </div>

        {/* Hotspot spec pill modal if clicked */}
        {activeHotspot && (
          <div className="absolute top-4 right-4 z-10 max-w-xs bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#E0E4DF] shadow-xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E0E4DF]">
              <span className="text-xs font-bold text-[#173F30] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#173F30]" />
                <span>Feature Inspection</span>
              </span>
              <button
                onClick={() => setActiveHotspot(null)}
                className="text-xs text-[#777D79] hover:text-[#101512] font-bold px-1.5 py-0.5 rounded hover:bg-[#E7EEE8]"
              >
                &times;
              </button>
            </div>
            <h5 className="text-sm font-bold text-[#101512]">{activeHotspot.title}</h5>
            <p className="text-xs text-[#777D79] mt-1 leading-relaxed">{activeHotspot.spec}</p>
          </div>
        )}

        {/* Bottom bar with hotspot buttons */}
        <div className="absolute bottom-4 inset-x-4 z-10 p-3 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E0E4DF] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div>
            <p className="text-xs font-bold text-[#101512]">{currentRoom.name}</p>
            <p className="text-[11px] text-[#777D79]">{currentRoom.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#777D79] uppercase tracking-wider hidden sm:inline">
              Inspect:
            </span>
            {currentRoom.hotspots.map((hs, i) => (
              <button
                key={i}
                onClick={() => setActiveHotspot(hs)}
                className="px-3 py-1 rounded-full bg-[#FAFAF7] hover:bg-[#E7EEE8] text-[#173F30] text-xs font-semibold border border-[#E0E4DF] transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3 h-3" />
                <span>{hs.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
