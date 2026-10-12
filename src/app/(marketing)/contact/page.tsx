"use client"

import { useState } from "react"
import { Mail, MapPin, Phone, CheckCircle2, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Please fill in all required fields.")
      setStatus('error')
      return
    }

    setStatus('sending')
    setErrorMsg("")

    // Simulating message transmission with guaranteed state transition
    setTimeout(() => {
      setStatus('success')
    }, 1000)
  }

  const handleReset = () => {
    setFormData({ firstName: "", lastName: "", email: "", message: "" })
    setStatus('idle')
  }

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400">
            Have questions about clinical integrations or booking on our platform? We are here to help.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <div className="flex-1 space-y-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Information</h2>
            <div className="space-y-6 text-slate-600 dark:text-slate-400">
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Email Us</p>
                  <p className="mt-1">
                    <a href="mailto:support@appointly.com" className="text-teal-600 dark:text-teal-400 hover:underline">
                      support@appointly.com
                    </a>
                  </p>
                  <p>
                    <a href="mailto:partnerships@appointly.com" className="text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:underline">
                      partnerships@appointly.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Call Us Directly</p>
                  <p className="mt-1">
                    <a href="tel:+18007568669" className="text-teal-600 dark:text-teal-400 font-medium hover:underline">
                      1-800-SLOT-NOW (1-800-756-8669)
                    </a>
                  </p>
                  <p className="text-xs text-slate-500">Mon-Fri, 9am - 6pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">Headquarters</p>
                  <p className="mt-1">123 Health Tech Blvd, Suite 400</p>
                  <p>San Francisco, CA 94107</p>
                </div>
              </div>

            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-slate-900 p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
            {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Message Sent Successfully!</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
                  Thank you for reaching out, {formData.firstName}. Our medical operations team will get back to you within 24 business hours.
                </p>
                <div className="pt-4">
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="border-slate-300 dark:border-slate-700 font-medium"
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {status === 'error' && (
                  <ErrorMessage 
                    title="Could not submit message"
                    message={errorMsg}
                    onRetry={() => setStatus('idle')}
                  />
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      First Name <span className="text-teal-600">*</span>
                    </label>
                    <input 
                      required 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jane"
                      className="w-full h-11 px-3.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full h-11 px-3.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email Address <span className="text-teal-600">*</span>
                  </label>
                  <input 
                    required 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="w-full h-11 px-3.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Message <span className="text-teal-600">*</span>
                  </label>
                  <textarea 
                    required 
                    rows={4} 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we assist you?"
                    className="w-full p-3.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  disabled={status === 'sending'} 
                  className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
