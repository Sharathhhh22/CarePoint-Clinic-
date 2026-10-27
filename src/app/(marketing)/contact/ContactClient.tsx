"use client"

import { useState } from "react"
import { Mail, MapPin, Phone, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { ErrorMessage } from "@/components/ui/ErrorMessage"
import { toast } from "@/components/ui/toast"
import { trackEvent } from "@/lib/analytics"

export function ContactClient() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Please fill in all required fields.")
      setStatus('error')
      toast({
        title: "Required Fields Missing",
        description: "Please provide your first name, email, and message.",
        variant: "destructive"
      })
      return
    }

    setStatus('sending')
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.")
      }

      setStatus('success')
      toast({
        title: "Message Transmitted",
        description: "Your inquiry has been sent to our clinical operations team.",
        variant: "success",
      })
      trackEvent("contact_form_submitted", { emailDomain: formData.email.split("@")[1] })
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred. Please try again."
      setErrorMsg(msg)
      setStatus('error')
      toast({
        title: "Submission Error",
        description: msg,
        variant: "destructive",
      })
    }
  }

  const handleReset = () => {
    setFormData({ firstName: "", lastName: "", email: "", message: "" })
    setStatus('idle')
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
      <div className="flex-1 space-y-10">
        <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
        <div className="space-y-6 text-muted-foreground">
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-foreground">Email Us</p>
              <p className="mt-1">
                <a href="mailto:support@sloturself.com" className="text-primary hover:underline">
                  support@sloturself.com
                </a>
              </p>
              <p>
                <a href="mailto:partnerships@sloturself.com" className="text-muted-foreground hover:text-primary hover:underline">
                  partnerships@sloturself.com
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-foreground">Call Us Directly</p>
              <p className="mt-1">
                <a href="tel:+918045678900" className="text-primary font-medium hover:underline">
                  +91 80 4567 8900
                </a>
              </p>
              <p className="text-xs text-muted-foreground">Mon-Sat, 9:00 AM - 7:00 PM IST (Emergency: 108)</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-foreground">Headquarters</p>
              <p className="mt-1">100 Feet Road, Indiranagar</p>
              <p>Bengaluru, Karnataka 560038, India</p>
            </div>
          </div>

        </div>
      </div>

      <div className="flex-1 bg-card p-8 md:p-10 rounded-2xl shadow-sm border border-border">
        {status === 'success' ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Message Sent Successfully!</h2>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              Thank you for reaching out, {formData.firstName}. Our medical operations team will get back to you within 24 business hours.
            </p>
            <div className="pt-4">
              <Button 
                onClick={handleReset}
                variant="outline"
                className="border-border text-foreground font-medium"
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
                <label className="text-sm font-medium text-foreground">
                  First Name <span className="text-primary">*</span>
                </label>
                <input 
                  required 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Jane"
                  className="w-full h-11 px-3.5 rounded-lg border border-border bg-input/20 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full h-11 px-3.5 rounded-lg border border-border bg-input/20 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Email Address <span className="text-primary">*</span>
              </label>
              <input 
                required 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className="w-full h-11 px-3.5 rounded-lg border border-border bg-input/20 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Message <span className="text-primary">*</span>
              </label>
              <textarea 
                required 
                rows={4} 
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="How can we assist you?"
                className="w-full p-3.5 rounded-lg border border-border bg-input/20 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" 
              />
            </div>

            <Button 
              type="submit" 
              disabled={status === 'sending'} 
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors shadow-sm"
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
  )
}
