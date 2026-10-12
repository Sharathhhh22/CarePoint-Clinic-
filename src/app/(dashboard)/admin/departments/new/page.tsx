import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createDepartment } from "@/app/actions/admin"

export default function NewDepartmentPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-[800px]">
      <div className="mb-4">
        <Link href="/admin/departments" className="text-[13px] font-medium tracking-wide text-muted-foreground hover:text-foreground flex items-center transition-colors">
          <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Back to Departments
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Add New Department</h2>
        <p className="text-muted-foreground mt-1">Register a new medical specialty.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createDepartment} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name *</Label>
              <Input id="name" name="name" placeholder="e.g. Cardiology" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="e.g. Heart and vascular care" />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                Save Department
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
