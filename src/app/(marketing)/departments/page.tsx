"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Heart, Brain, Bone, Eye, Smile, Activity, ArrowRight, ShieldCheck } from "lucide-react"

export default function DepartmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const departments = [
    { 
      name: "Cardiology", 
      desc: "Heart and cardiovascular system specialists for hypertension, angina, and heart health.", 
      icon: Heart, 
      keywords: ["heart", "cardio", "chest", "blood pressure", "vascular"]
    },
    { 
      name: "Neurology", 
      desc: "Brain and nervous system specialists for migraines, neuropathy, and neurological disorders.", 
      icon: Brain, 
      keywords: ["brain", "headache", "nerve", "dizziness", "migraine"]
    },
    { 
      name: "Orthopedics", 
      desc: "Bone and joint specialists for fractures, joint pain, arthritis, and sports injuries.", 
      icon: Bone, 
      keywords: ["bone", "joint", "knee", "spine", "fracture", "arthritis"]
    },
    { 
      name: "Ophthalmology", 
      desc: "Comprehensive eye care, optical vision checks, cataracts, and ocular health.", 
      icon: Eye, 
      keywords: ["eye", "vision", "glasses", "cataract", "glaucoma"]
    },
    { 
      name: "Dentistry", 
      desc: "Oral health specialists for preventive cleaning, restorative care, and dental surgery.", 
      icon: Smile, 
      keywords: ["teeth", "tooth", "dental", "gum", "cavity", "oral"]
    },
    { 
      name: "General Practice", 
      desc: "Primary care physicians for general health concerns, routine screenings, and family medicine.", 
      icon: Activity, 
      keywords: ["general", "fever", "cough", "routine", "primary", "checkup", "doctor"]
    },
  ]

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return departments
    const q = searchTerm.toLowerCase()
    return departments.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.desc.toLowerCase().includes(q) ||
      d.keywords.some(k => k.includes(q))
    )
  }, [searchTerm])

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Medical Departments & Specialists
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400">
            Browse verified clinical departments across partner healthcare networks.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by department, condition, or symptom (e.g., heart, migraine)..." 
              className="w-full h-12 bg-white dark:bg-slate-900 rounded-xl pl-12 pr-4 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          {searchTerm && (
            <p className="text-xs text-slate-500 mt-2 text-right">
              Showing {filtered.length} matching department{filtered.length === 1 ? '' : 's'}
            </p>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
            <Activity className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No exact department match found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Our AI booking wizard can analyze your specific symptoms and route you to the correct practitioner.
            </p>
            <Link 
              href="/appointments/new" 
              className="inline-flex items-center text-sm font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Use AI Symptom Triage &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dept, idx) => (
              <Link 
                key={idx} 
                href="/appointments/new" 
                className="group bg-white dark:bg-slate-900 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/40 rounded-xl flex items-center justify-center mb-5 group-hover:bg-teal-600 transition-colors">
                    <dept.icon className="w-6 h-6 text-teal-600 dark:text-teal-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {dept.desc}
                  </p>
                </div>
                <div className="text-sm font-semibold text-teal-600 dark:text-teal-400 flex items-center">
                  Book Specialist 
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
