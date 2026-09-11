import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />
      <main className="ml-64 flex-1 overflow-y-auto bg-slate-50">
        {children}
      </main>
    </div>
  );
}
