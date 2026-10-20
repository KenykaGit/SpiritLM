import type { Metadata } from "next";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

export const metadata: Metadata = {
  title: "Главная",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100dvh-3rem)] flex-col bg-[#050505] md:flex-row">
        <Sidebar />
        <div className="order-first min-w-0 flex-1 rounded-t-none bg-[#242424] text-[#f3f2ee] md:order-none md:rounded-tl-[20px]">
          {children}
        </div>
      </div>
    </>
  );
}
