import Link from "next/link"
import { Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-surface text-muted-foreground py-12 md:py-16 border-t border-border">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          <div className="md:col-span-1">
            <Link href="/" className="inline-block group mb-4">
              <h2 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                SlotUrSelf
              </h2>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground mb-6">
              Verified specialists, real-time slots, and no phone calls. Your healthcare journey, simplified.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:support@sloturself.com" className="hover:text-foreground transition-colors">
                  support@sloturself.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+18007568669" className="hover:text-foreground transition-colors">
                  1-800-SLOT-NOW
                </a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">Patients</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/appointments/new" className="hover:text-foreground transition-colors">Book Appointment</Link></li>
              <li><Link href="/login" className="hover:text-foreground transition-colors">Patient Portal</Link></li>
              <li><Link href="/departments" className="hover:text-foreground transition-colors">Find Doctors & Departments</Link></li>
              <li><Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/features" className="hover:text-foreground transition-colors">Platform Features</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">Legal & Trust</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border text-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} SlotUrSelf. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <span>&middot;</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
