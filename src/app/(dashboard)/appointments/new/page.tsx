import { BookingWizard } from "@/components/booking/BookingWizard"

export default function NewAppointmentPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-2 sm:py-4 text-foreground">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight sm:text-4xl">
          Book an Appointment
        </h1>
        <p className="mt-2 text-base md:text-lg text-muted-foreground">
          Our AI assistant will guide you to the right specialist.
        </p>
      </div>

      <BookingWizard />
    </div>
  )
}
