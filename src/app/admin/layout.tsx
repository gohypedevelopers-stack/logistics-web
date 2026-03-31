import { AdminSidebar } from "./Sidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "Admin Account";

  return (
    <div className="app-shell flex h-screen overflow-hidden font-sans">
      <AdminSidebar userName={userName} />

      <main className="relative z-10 flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <AppTopbar variant="admin" userName={userName} />
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
}
