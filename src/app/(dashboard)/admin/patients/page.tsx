import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export const revalidate = 0

export default async function AdminPatientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin' && profile?.role !== 'staff') {
    redirect('/dashboard')
  }

  // Fetch all profiles that are not admin/staff (i.e. patients)
  const { data: patients } = await supabase
    .from('profiles')
    .select('*')
    .not('role', 'in', '("admin", "staff")')
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-[1200px]">
      <div className="mb-4">
        <Link href="/admin" className="text-[13px] font-medium tracking-wide text-muted-foreground hover:text-foreground flex items-center">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Admin Panel
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Patient Directory</h2>
          <p className="text-muted-foreground mt-1">View all registered patients.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Patients</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="mb-2 h-8 w-8 text-muted-foreground" />
                      <p>No patients found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                patients?.map((pat: any) => (
                  <TableRow key={pat.id}>
                    <TableCell className="font-medium text-foreground">{pat.full_name || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground">{pat.email || 'Hidden by privacy settings'}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 ring-1 ring-inset ring-teal-600/30 capitalize">
                        {pat.role || 'Patient'}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(pat.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
