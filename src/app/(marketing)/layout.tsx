import { CareNovaNavbar } from "@/components/carenova/CareNovaNavbar";
import { CareNovaFooter } from "@/components/carenova/CareNovaFooter";
import { CarePointMobileActionBar } from "@/components/carenova/CarePointMobileActionBar";
import { CarePointWhatsAppButton } from "@/components/carenova/CarePointWhatsAppButton";
import { BackToTop } from "@/components/carenova/BackToTop";
import { ScrollProgressBar } from "@/components/carenova/ScrollProgressBar";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#FAFAF7] dark:bg-[#0D1511] text-[#101512] dark:text-[#EAEFEA] antialiased selection:bg-[#173F30]/15 selection:text-[#173F30] transition-colors duration-200">
      <ScrollProgressBar />
      <CareNovaNavbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <CareNovaFooter />
      <BackToTop />
      <CarePointWhatsAppButton />
      <CarePointMobileActionBar />
    </div>
  );
}
