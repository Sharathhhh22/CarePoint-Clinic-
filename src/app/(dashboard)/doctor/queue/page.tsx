import { ClinicQueueManager } from "@/components/queue/ClinicQueueManager"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Clinic Queue Console",
  description: "Live patient queue management and ticket calling console for SlotUrSelf doctors and clinic staff.",
}

export default async function DoctorQueuePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/doctor/queue')
  }

  // Check doctor record
  const { data: doctor } = await supabase
    .from('doctors')
    .select('id, name, clinic_id')
    .eq('profile_id', user.id)
    .maybeSingle()

  return (
    <div className="space-y-6">
      <ClinicQueueManager 
        doctorId={doctor?.id} 
        clinicId={doctor?.clinic_id} 
        doctorName={doctor?.name} 
      />
    </div>
  )
}
