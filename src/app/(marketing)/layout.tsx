import { CareNovaNavbar } from "@/components/carenova/CareNovaNavbar";
import { CareNovaFooter } from "@/components/carenova/CareNovaFooter";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#FAFAF7] text-[#101512] antialiased selection:bg-[#173F30]/15 selection:text-[#173F30]">
      <CareNovaNavbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <CareNovaFooter />
    </div>
  );
}
