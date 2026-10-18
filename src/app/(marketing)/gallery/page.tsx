import type { Metadata } from "next"
import { GalleryClient } from "./GalleryClient"

export const metadata: Metadata = {
  title: "Clinic Facilities & Diagnostic Technology Gallery | CarePoint Clinic",
  description:
    "Explore CarePoint Clinic's purpose-built architectural facilities, consultation suites, diagnostic ultrasound equipment, and peaceful patient reception lounges.",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Clinic Facilities & Diagnostic Technology Gallery | CarePoint Clinic",
    description:
      "Explore CarePoint Clinic's purpose-built architectural facilities, consultation suites, diagnostic ultrasound equipment, and peaceful patient reception lounges.",
    url: "/gallery",
  },
}

export default function GalleryPage() {
  return <GalleryClient />
}
