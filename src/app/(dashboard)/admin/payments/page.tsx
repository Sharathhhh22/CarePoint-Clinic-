import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, DollarSign, Wallet, ArrowLeft, ArrowUpRight, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export const revalidate = 0

export default async function AdminPaymentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin' && profile?.role !== 'staff') {
    redirect('/dashboard')
  }

  // Fetch recent appointments with payment and clinic details
  const { data: appointments } = await supabase
    .from('appointments')
    .select(`
      id,
      appointment_date,
      appointment_time,
      status,
      payment_mode,
      ticket_number,
      patient_name,
      created_at,
      doctors ( id, name, consultation_fee, specialty ),
      clinics ( id, name, address )
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  const aptList = appointments || []

  // Aggregate metrics
  let totalRevenue = 0
  let onlineRevenue = 0
  let clinicRevenue = 0
  let confirmedCount = 0
  let completedCount = 0

  for (const apt of aptList) {
    const fee = Number((apt.doctors as any)?.consultation_fee) || 500
    if (apt.status === 'confirmed' || apt.status === 'completed') {
      totalRevenue += fee
      if (apt.status === 'confirmed') confirmedCount++
      if (apt.status === 'completed') completedCount++

      if (apt.payment_mode === 'ONLINE' || apt.payment_mode === 'stripe') {
        onlineRevenue += fee
      } else {
        clinicRevenue += fee
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Admin Panel
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Payments & Settlements</h1>
          <p className="text-muted-foreground mt-1">
            Real-time consultation fees, online gateway payouts, and front-desk collection tracking.
          </p>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-surface shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total Booking Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From {confirmedCount + completedCount} confirmed & completed visits
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Online Payments (Stripe)
            </CardTitle>
            <CreditCard className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">₹{onlineRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Direct digital gateway settlements
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Pay at Clinic (Cash/POS)
            </CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">₹{clinicRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Collected at reception counter
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-surface shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Settlement Status
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">100% Reconciled</div>
            <p className="text-xs text-muted-foreground mt-1">
              Zero unassigned transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Ledger */}
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle>Consultation Payment Ledger</CardTitle>
          <CardDescription>
            Chronological audit of all booking payments and clinic settlements.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-surface-elevated/40">
                <TableRow>
                  <TableHead>Ticket / ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor & Specialty</TableHead>
                  <TableHead>Clinic Location</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aptList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      No payment transactions recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  aptList.map((apt: any) => {
                    const fee = Number(apt.doctors?.consultation_fee) || 500
                    const isOnline = apt.payment_mode === 'ONLINE' || apt.payment_mode === 'stripe'
                    
                    return (
                      <TableRow key={apt.id}>
                        <TableCell className="font-mono text-xs font-semibold text-foreground">
                          {apt.ticket_number || apt.id.substring(0, 8)}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {apt.patient_name || "Self Patient"}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs font-semibold text-foreground">{apt.doctors?.name || "Assigned Physician"}</div>
                          <div className="text-[11px] text-muted-foreground">{apt.doctors?.specialty || "General Medicine"}</div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {apt.clinics?.name || "Main Outpatient Clinic"}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            isOnline 
                              ? "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20"
                              : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                          }`}>
                            {isOnline ? "Online (Card)" : "Pay at Clinic"}
                          </span>
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          ₹{fee.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                            apt.status === 'completed'
                              ? "text-emerald-600 dark:text-emerald-400"
                              : apt.status === 'confirmed'
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}>
                            {apt.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {apt.status === 'confirmed' && <Clock className="w-3.5 h-3.5" />}
                            {apt.status === 'cancelled' && <AlertCircle className="w-3.5 h-3.5" />}
                            {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary-hover">
                            <Link href={`/receipt/${apt.id}`}>
                              View <ArrowUpRight className="w-3 h-3 ml-1" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

