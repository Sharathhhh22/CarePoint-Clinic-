"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  MonitorUp, 
  Maximize2, 
  Minimize2, 
  FileText, 
  User, 
  Activity, 
  ShieldCheck, 
  Clock,
  Send,
  MessageSquare,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TeleconsultRoomProps {
  appointmentId: string
  appointmentData: {
    id: string
    patient_name: string
    doctor_name: string
    specialty?: string
    clinic_name?: string
    appointment_time?: string
    appointment_date?: string
    reason?: string
    isDoctor?: boolean
  }
}

export function TeleconsultRoom({ appointmentId, appointmentData }: TeleconsultRoomProps) {
  const router = useRouter()
  
  // Media states
  const [micActive, setMicActive] = useState(true)
  const [videoActive, setVideoActive] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  
  // Consultation timer
  const [secondsElapsed, setSecondsElapsed] = useState(0)
  
  // Doctor notes state
  const [clinicalNotes, setClinicalNotes] = useState("")
  const [notesSaved, setNotesSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<"intake" | "notes">("intake")

  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const screenTrackRef = useRef<MediaStreamTrack | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Start call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatCallDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Initialize camera and microphone
  useEffect(() => {
    let stream: MediaStream | null = null

    async function initMedia() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera/Microphone access is not supported in this browser.")
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: true,
        })

        localStreamRef.current = stream

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }
      } catch (err: any) {
        console.warn("Media access error:", err)
        setCameraError("Camera or microphone permission was denied or is unavailable. You can still consult via audio or text.")
      }
    }

    initMedia()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (screenTrackRef.current) {
        screenTrackRef.current.stop()
      }
    }
  }, [])

  // Toggle Mic
  const toggleMic = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = !micActive
      })
      setMicActive(!micActive)
    }
  }

  // Toggle Video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks()
      videoTracks.forEach(track => {
        track.enabled = !videoActive
      })
      setVideoActive(!videoActive)
    }
  }

  // Toggle Screen Share
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenTrackRef.current) {
        screenTrackRef.current.stop()
        screenTrackRef.current = null
      }
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current
      }
      setIsScreenSharing(false)
    } else {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        const screenTrack = displayStream.getVideoTracks()[0]
        screenTrackRef.current = screenTrack

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = displayStream
        }

        screenTrack.onended = () => {
          if (localVideoRef.current && localStreamRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current
          }
          setIsScreenSharing(false)
        }

        setIsScreenSharing(true)
      } catch (err) {
        console.warn("Screen share cancelled:", err)
      }
    }
  }

  // Fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.().catch(() => {})
      setIsFullscreen(false)
    }
  }

  // Save consultation notes
  const handleSaveNotes = () => {
    if (!clinicalNotes.trim()) return
    setNotesSaved(true)
    setTimeout(() => setNotesSaved(false), 3000)
  }

  // End Call
  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop())
    }
    if (screenTrackRef.current) {
      screenTrackRef.current.stop()
    }
    router.push(appointmentData.isDoctor ? '/doctor/dashboard' : `/receipt/${appointmentId}`)
  }

  return (
    <div ref={containerRef} className="min-h-[calc(100dvh-5rem)] flex flex-col bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Telehealth Banner */}
      <div className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-sm text-slate-100">
              {appointmentData.isDoctor ? `Consulting: ${appointmentData.patient_name}` : `Consultation with ${appointmentData.doctor_name}`}
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-mono">
            Encrypted Telehealth Session
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatCallDuration(secondsElapsed)}</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Video & Clinical Panel Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-0 overflow-hidden relative">
        {/* Remote & Local Video Stages (Col 1-3) */}
        <div className="lg:col-span-3 relative flex items-center justify-center bg-slate-950 p-4 min-h-[400px]">
          {/* Main Remote Video Mock / Active Stream */}
          <div className="relative w-full h-full max-h-[75dvh] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center shadow-inner">
            <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary text-3xl font-bold">
                {appointmentData.isDoctor 
                  ? appointmentData.patient_name.charAt(0) 
                  : (appointmentData.doctor_name.replace('Dr. ', '').charAt(0) || 'D')}
              </div>
              <h3 className="text-lg font-bold text-slate-100">
                {appointmentData.isDoctor ? appointmentData.patient_name : appointmentData.doctor_name}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Connected via peer-to-peer telehealth channel. Audio and video feeds are active.
              </p>
            </div>

            {/* Self View (Picture-in-Picture) */}
            <div className="absolute bottom-4 right-4 w-40 sm:w-56 aspect-video bg-black/80 rounded-xl overflow-hidden border border-slate-700 shadow-xl z-20">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${!videoActive ? 'hidden' : ''}`}
              />
              {!videoActive && (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400 text-xs font-medium">
                  Camera Off
                </div>
              )}
              <div className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-2 py-0.5 rounded text-slate-300 font-mono">
                You
              </div>
            </div>

            {/* Camera error notification if denied */}
            {cameraError && (
              <div className="absolute top-4 left-4 right-4 p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{cameraError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Clinical Intake & Notes Panel (Col 4) */}
        <div className="lg:col-span-1 bg-slate-900 border-l border-slate-800 flex flex-col h-full max-h-[75dvh]">
          {/* Panel Tabs */}
          <div className="flex items-center border-b border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab("intake")}
              className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === "intake" ? "border-primary text-primary bg-slate-800/50" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Patient Intake
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex-1 py-3 text-center transition-colors border-b-2 flex items-center justify-center gap-1.5 ${
                activeTab === "notes" ? "border-primary text-primary bg-slate-800/50" : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Clinical Notes
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {activeTab === "intake" ? (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Patient Details</span>
                  <p className="font-bold text-sm text-slate-100">{appointmentData.patient_name}</p>
                  <p className="text-slate-400">Appointment: {appointmentData.appointment_time} • {appointmentData.appointment_date}</p>
                  <p className="text-slate-400">{appointmentData.specialty || "General Consultation"}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Reported Symptoms</span>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                    {appointmentData.reason || "Routine check-up and follow-up consultation."}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 space-y-1 text-primary">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> AI Clinical Intake Note
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Patient has verified slot attendance. Standard vitals and triage checklist ready for physician sign-off.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 h-full flex flex-col text-xs">
                <label className="font-semibold text-slate-200">Physician Consultation Notes</label>
                <textarea
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="Record symptoms observed, provisional diagnosis, advised tests, and follow-up plan..."
                  className="w-full flex-1 min-h-[220px] p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 placeholder:text-slate-500 text-xs leading-relaxed focus:outline-none focus:border-primary resize-none"
                />
                <Button
                  onClick={handleSaveNotes}
                  className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-semibold h-9 text-xs rounded-xl"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  {notesSaved ? "Notes Saved to Record!" : "Save to Patient Record"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="h-20 bg-slate-900 border-t border-slate-800 px-6 flex items-center justify-center gap-4 shrink-0">
        <button
          onClick={toggleMic}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            micActive 
              ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' 
              : 'bg-rose-600 text-white hover:bg-rose-700'
          }`}
          title={micActive ? "Mute Microphone" : "Unmute Microphone"}
          aria-label="Toggle microphone"
        >
          {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleVideo}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            videoActive 
              ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' 
              : 'bg-rose-600 text-white hover:bg-rose-700'
          }`}
          title={videoActive ? "Turn Off Video" : "Turn On Video"}
          aria-label="Toggle video camera"
        >
          {videoActive ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        <button
          onClick={toggleScreenShare}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isScreenSharing 
              ? 'bg-primary text-primary-foreground hover:bg-primary-hover' 
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
          title={isScreenSharing ? "Stop Sharing Screen" : "Share Screen"}
          aria-label="Toggle screen sharing"
        >
          <MonitorUp className="w-5 h-5" />
        </button>

        <button
          onClick={handleEndCall}
          className="h-12 px-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-rose-600/30 transition-all active:scale-95"
          title="End Teleconsultation"
          aria-label="End call"
        >
          <PhoneOff className="w-5 h-5" /> End Call
        </button>
      </div>
    </div>
  )
}
