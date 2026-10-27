import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin, Calendar, Briefcase, User as UserIcon, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { EditProfileModal } from "./components/EditProfileModal"
import { ProfileCompletion } from "./components/ProfileCompletion"
import { SecuritySection } from "./components/SecuritySection"
import { AvatarUpload } from "./components/AvatarUpload"

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch full profile from the database
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const joinDate = new Date(profile?.created_at || user.created_at).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric'
  })

  // Calculate completion percentage
  const fields = [
    { name: 'full_name', value: profile?.full_name, label: 'Add full name' },
    { name: 'mobile', value: profile?.mobile, label: 'Add phone number' },
    { name: 'address', value: profile?.address, label: 'Add physical address' },
    { name: 'bio', value: profile?.bio, label: 'Add professional bio' },
    { name: 'avatar_url', value: profile?.avatar_url, label: 'Upload profile photo' }
  ]
  
  const completedFields = fields.filter(f => !!f.value).length
  const completionPercentage = Math.round((completedFields / fields.length) * 100)
  const missingFields = fields.filter(f => !f.value).map(f => f.label)

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Clinic Breadcrumb */}
      <div className="flex items-center justify-between pb-1">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to SlotUrSelf Website</span>
        </Link>
        <span className="text-xs text-muted-foreground font-medium">
          Personal Patient Profile &bull; HIPAA Compliant
        </span>
      </div>

      {/* HEADER SECTION */}
      <div className="bg-card rounded-3xl shadow-sm border border-border overflow-hidden">
        {/* Cover Banner */}
        <div className="h-32 sm:h-40 w-full bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 relative border-b border-border/50 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Profile Info Details */}
        <div className="px-6 sm:px-10 pb-8 pt-0 relative bg-card">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-14 sm:-mt-16 mb-5">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              <div className="shrink-0 relative">
                <AvatarUpload userId={user.id} initialUrl={profile?.avatar_url} />
              </div>

              <div className="space-y-1.5 sm:pb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {profile?.full_name || "Anonymous User"}
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                    {profile?.role === 'admin' ? 'System Administrator' : profile?.role === 'doctor' ? 'Verified Physician' : 'Patient'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Member since {joinDate}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0 sm:pb-1">
              <EditProfileModal profile={profile || {}} userEmail={user.email} />
            </div>
          </div>

          {profile?.bio && (
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl leading-relaxed pt-3 border-t border-border/40">
              {profile.bio}
            </p>
          )}

          {profile?.address && (
            <div className="flex items-center gap-2 mt-4 text-xs sm:text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <span>{profile.address}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="md:col-span-1 space-y-8">
          <ProfileCompletion percentage={completionPercentage} missingFields={missingFields} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-2 space-y-8">
          <Card className="shadow-sm border-border">
            <CardHeader className="border-b border-border bg-surface pb-4">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid sm:grid-cols-2 gap-y-8 gap-x-6">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <UserIcon className="w-4 h-4" /> Full Name
                  </span>
                  <p className="font-semibold text-foreground">{profile?.full_name || "—"}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </span>
                  <p className="font-semibold text-foreground">{user.email || "—"}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone Number
                  </span>
                  <p className="font-semibold text-foreground">{profile?.mobile || "—"}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Location
                  </span>
                  <p className="font-semibold text-foreground">{profile?.address || "—"}</p>
                </div>
                
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Account Type
                  </span>
                  <p className="font-semibold text-foreground capitalize">{profile?.role || "Patient"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <SecuritySection userEmail={user.email || ''} />
        </div>

      </div>
    </div>
  )
}
