"use client"

import React, { useEffect, useRef } from "react"
import * as THREE from "three"

export function CarePoint3DHeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let animationFrameId: number
    const width = container.clientWidth || window.innerWidth
    const height = container.clientHeight || 600

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 28

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // 3. 3D BIOMOLECULAR / DNA HELIX PARTICLES
    const particleCount = 280
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const color1 = new THREE.Color("#173F30") // Forest Green
    const color2 = new THREE.Color("#A9C2B2") // Muted Sage
    const color3 = new THREE.Color("#528265") // Emerald Sage

    for (let i = 0; i < particleCount; i++) {
      const t = (i / particleCount) * Math.PI * 6
      const radius = 5.5 + Math.sin(t * 2) * 1.2

      // Double helix intertwine
      const strand = i % 2 === 0 ? 1 : -1
      const x = Math.cos(t) * radius * strand + (Math.random() - 0.5) * 1.5
      const y = (i / particleCount - 0.5) * 22 + (Math.random() - 0.5) * 0.8
      const z = Math.sin(t) * radius * strand + (Math.random() - 0.5) * 1.5

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Gradient color interpolation
      const mixedColor = color1.clone().lerp(strand === 1 ? color2 : color3, Math.random())
      colors[i * 3] = mixedColor.r
      colors[i * 3 + 1] = mixedColor.g
      colors[i * 3 + 2] = mixedColor.b
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

    // Particle texture canvas
    const canvas = document.createElement("canvas")
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext("2d")
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
      gradient.addColorStop(0.3, "rgba(169, 194, 178, 0.8)")
      gradient.addColorStop(1, "rgba(23, 63, 48, 0)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 64, 64)
    }
    const texture = new THREE.CanvasTexture(canvas)

    const material = new THREE.PointsMaterial({
      size: 0.75,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.NormalBlending,
      depthWrite: false,
    })

    const pointCloud = new THREE.Points(geometry, material)
    scene.add(pointCloud)

    // 4. FLOATING 3D MEDICAL RINGS (Holographic depth)
    const ringGeo = new THREE.TorusGeometry(8, 0.04, 16, 100)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xa9c2b2,
      transparent: true,
      opacity: 0.25,
      wireframe: false,
    })
    const ring1 = new THREE.Mesh(ringGeo, ringMat)
    ring1.rotation.x = Math.PI / 3
    ring1.rotation.y = Math.PI / 4
    scene.add(ring1)

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(6, 0.03, 16, 100),
      new THREE.MeshBasicMaterial({
        color: 0x173f30,
        transparent: true,
        opacity: 0.2,
      })
    )
    ring2.rotation.x = -Math.PI / 4
    ring2.rotation.y = Math.PI / 6
    scene.add(ring2)

    // 5. MOUSE TRACKING & PARALLAX
    let targetMouseX = 0
    let targetMouseY = 0
    let currentMouseX = 0
    let currentMouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetMouseX = x * 3.5
      targetMouseY = y * 3.5
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    // 6. RESIZE HANDLER
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    // 7. ANIMATION LOOP
    let clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()

      // Smooth mouse lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05
      currentMouseY += (targetMouseY - currentMouseY) * 0.05

      // Gentle rotation & floating
      pointCloud.rotation.y = elapsedTime * 0.12 + currentMouseX * 0.3
      pointCloud.rotation.x = Math.sin(elapsedTime * 0.2) * 0.15 + currentMouseY * 0.3
      pointCloud.position.y = Math.sin(elapsedTime * 0.5) * 0.5

      ring1.rotation.z = elapsedTime * 0.08
      ring1.rotation.x = Math.PI / 3 + currentMouseY * 0.2
      ring2.rotation.z = -elapsedTime * 0.06

      // Undulate particle wave positions slightly
      const posAttr = geometry.attributes.position as THREE.BufferAttribute
      const posArr = posAttr.array as Float32Array
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        posArr[i3 + 2] += Math.sin(elapsedTime * 1.5 + i) * 0.008
      }
      posAttr.needsUpdate = true

      renderer.render(scene, camera)
    }

    animate()

    // 8. CLEANUP
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
      geometry.dispose()
      material.dispose()
      texture.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 z-0 pointer-events-none opacity-45 sm:opacity-60 overflow-hidden"
    />
  )
}
