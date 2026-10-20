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
      <div className="flex min-h-[calc(100dvh-3rem)] bg-[#050505]">
        <Sidebar />
        <div className="min-w-0 flex-1 rounded-tl-[20px] bg-[#242424] text-[#f3f2ee] max-sm:rounded-t-none">
          {children}
        </div>
      </div>
    </>
  );
}
