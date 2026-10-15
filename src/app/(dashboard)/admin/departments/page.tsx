import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export const revalidate = 0

export default async function AdminDepartmentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin' && profile?.role !== 'staff') {
    redirect('/dashboard')
  }

  const { data: departments } = await supabase.from('departments').select('*').order('name', { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Admin Panel
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Departments</h1>
          <p className="text-muted-foreground mt-1">View and edit your medical specialties.</p>
        </div>
        <Link
          href="/admin/departments/new"
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold tracking-wide text-primary-foreground hover:bg-primary-hover transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-8">No departments found.</TableCell>
                </TableRow>
              ) : (
                departments?.map((dept: any) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium text-foreground">{dept.name}</TableCell>
                    <TableCell className="text-muted-foreground">{dept.description || 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        dept.is_active 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-inset ring-emerald-600/30' 
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 ring-1 ring-inset ring-rose-600/30'
                      }`}>
                        {dept.is_active ? 'Active' : 'Inactive'}
                      </span>
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
