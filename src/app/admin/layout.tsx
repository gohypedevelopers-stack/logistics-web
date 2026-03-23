import { AdminSidebar } from "./Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#F8FAFC] font-sans h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 w-full">
        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto w-full scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
}
