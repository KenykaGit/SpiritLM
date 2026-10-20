import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Документация",
};

export default function DashboardDocsPage() {
  return (
    <main className="min-w-0 flex-1 p-6" aria-labelledby="dashboard-page-title">
      <h1 id="dashboard-page-title" className="text-xl font-semibold">
        Документация
      </h1>
    </main>
  );
}
