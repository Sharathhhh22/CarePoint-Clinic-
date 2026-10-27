import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgressBar } from "@/components/common/ScrollProgressBar";
import { BackToTop } from "@/components/common/BackToTop";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-teal-500/20 selection:text-teal-700 dark:selection:text-teal-300">
      <ScrollProgressBar />
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
