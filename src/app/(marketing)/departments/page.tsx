"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Heart, Brain, Bone, Eye, Smile, Activity, ArrowRight } from "lucide-react"

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
    <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-background text-foreground">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
            Medical Departments & Specialists
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Browse verified clinical departments across partner healthcare networks.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by department, condition, or symptom (e.g., heart, migraine)..." 
              className="w-full h-12 bg-card rounded-xl pl-12 pr-4 shadow-sm border border-border text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          {searchTerm && (
            <p className="text-xs text-muted-foreground mt-2 text-right">
              Showing {filtered.length} matching department{filtered.length === 1 ? '' : 's'}
            </p>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border p-8">
            <Activity className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-bold text-foreground mb-1">No exact department match found</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Our AI booking wizard can analyze your specific symptoms and route you to the correct practitioner.
            </p>
            <Link 
              href="/appointments/new" 
              className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
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
                className="group bg-card p-7 rounded-2xl border border-border hover:border-primary hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary transition-colors">
                    <dept.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {dept.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {dept.desc}
                  </p>
                </div>
                <div className="text-sm font-semibold text-primary flex items-center">
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
