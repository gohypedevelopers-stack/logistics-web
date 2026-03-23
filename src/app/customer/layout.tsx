import { CustomerSidebar } from "./Sidebar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8F9FC] font-sans">
      <CustomerSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 w-full">

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
