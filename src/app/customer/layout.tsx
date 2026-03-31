import { CustomerSidebar } from "./Sidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "Customer Account";

  return (
    <div className="app-shell flex h-screen font-sans">
      <CustomerSidebar userName={userName} />

      <main className="relative z-10 flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <AppTopbar variant="customer" userName={userName} />
        <div className="flex-1 overflow-y-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
