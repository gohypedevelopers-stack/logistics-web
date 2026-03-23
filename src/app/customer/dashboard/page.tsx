import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { BookOpen, PackageOpen, LayoutList, Box, Send, Ticket, AlertCircle, Clock } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div>Unauthorized. Please log in.</div>;
  }

  const userId = session.user.id;
  const userName = session.user.name || "User";

  console.log(`[DASHBOARD_PAGE] Loading data for user: ${userName} (${userId})`);

  let customerProfile = null;
  try {
    // Fetch customer profile and shipment counts
    customerProfile = await prisma.customerProfile.findUnique({
      where: { userId },
      include: {
        shipments: true
      }
    });
    console.log(`[DASHBOARD_PAGE] Successfully fetched profile. Shipments found: ${customerProfile?.shipments?.length || 0}`);
  } catch (error: any) {
    console.error(`[DASHBOARD_PAGE] CRITICAL ERROR fetching dashboard data:`, error);
    // Continue with null profile to at least render the page shell
  }

  const shipments = customerProfile?.shipments || [];
  
  // Logic for dynamic counts
  const allCount = shipments.length;
  const submittedCount = shipments.filter(s => (s.status as any) === 'SUBMITTED').length;
  const acceptedCount = shipments.filter(s => ['ACCEPTED', 'PICKUP_SCHEDULED'].includes(s.status as any)).length;
  const packedCount = shipments.filter(s => (s.status as any) === 'PICKUP_SCHEDULED').length;
  const dispatchedCount = shipments.filter(s => 
    ['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'].includes(s.status as any)
  ).length;
  
  const pickupsInCount = shipments.filter(s => 
    (s.status as any) === 'PICKUP_SCHEDULED' || (s.status as any) === 'PICKED_UP'
  ).length;
  const disputedCount = shipments.filter(s => (s.status as any) === 'REJECTED').length;
  const onHoldCount = shipments.filter(s => (s.status as any) === 'ON_HOLD').length;

  return (
    <div className="p-8 lg:p-10 max-w-[1600px] mx-auto min-h-full bg-[#f8f9fa]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight mb-4">Dashboard</h1>
        
        {/* Welcome Banner */}
        <div className="bg-[#FFF4EB] rounded-xl p-5 border border-orange-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
             <h2 className="text-[#D97706] font-bold text-lg">Welcome {userName} !!</h2>
             <p className="text-slate-600 font-medium text-sm mt-1">We are excited to have you on board. Start your journey with us by completing your KYC!</p>
          </div>
          <button className="whitespace-nowrap bg-[#1E3A8A] hover:bg-blue-900 text-white px-6 py-2.5 rounded-md font-medium text-sm transition-colors">
            Complete KYC
          </button>
        </div>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Link href="/customer/shipments?tab=all" className="bg-[#F4F7FA] rounded-xl p-5 border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between h-32">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <LayoutList className="w-5 h-5 text-blue-600" />
             </div>
             <span className="text-[#1E3A8A] font-medium text-sm">All Orders</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{String(allCount).padStart(2, '0')}</div>
        </Link>
        
        <Link href="/customer/shipments?tab=submitted" className="bg-[#FFFDF5] rounded-xl p-5 border border-amber-100 hover:shadow-md transition-all flex flex-col justify-between h-32">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-600" />
             </div>
             <span className="text-amber-700 font-medium text-sm">Pending Review</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{String(submittedCount).padStart(2, '0')}</div>
        </Link>

        <Link href="/customer/shipments?tab=accepted" className="bg-[#F2FCF5] rounded-xl p-5 border border-green-100 hover:shadow-md transition-all flex flex-col justify-between h-32">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <PackageOpen className="w-5 h-5 text-green-600" />
             </div>
             <span className="text-green-700 font-medium text-sm">Accepted</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{String(acceptedCount).padStart(2, '0')}</div>
        </Link>

        <Link href="/customer/shipments?tab=packed" className="bg-[#FFF5F5] rounded-xl p-5 border border-red-100 hover:shadow-md transition-all flex flex-col justify-between h-32">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Box className="w-5 h-5 text-red-600" />
             </div>
             <span className="text-red-700 font-medium text-sm">Packed Orders</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{String(packedCount).padStart(2, '0')}</div>
        </Link>

        <Link href="/customer/shipments?tab=in_transit" className="bg-[#F5F3FF] rounded-xl p-5 border border-purple-100 hover:shadow-md transition-all flex flex-col justify-between h-32">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Send className="w-5 h-5 text-purple-600" />
             </div>
             <span className="text-purple-700 font-medium text-sm">Dispatched Orders</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{String(dispatchedCount).padStart(2, '0')}</div>
        </Link>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Actions Cards */}
        <div>
           <h3 className="font-bold text-[#1E293B] mb-4">Actions</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/customer/shipments?tab=packed" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors flex flex-col justify-between h-[120px]">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center border border-purple-100">
                       <Ticket className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-xl font-bold text-slate-800">{String(pickupsInCount).padStart(2, '0')}</span>
                 </div>
                 <p className="text-sm text-slate-500 font-medium">Pickups In Progress</p>
              </Link>
              
              <Link href="/customer/shipments?tab=all" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors flex flex-col justify-between h-[120px]">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center border border-blue-100">
                       <Ticket className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xl font-bold text-slate-800">00</span>
                 </div>
                 <p className="text-sm text-slate-500 font-medium">Open Manifests</p>
              </Link>

              <Link href="/customer/shipments?tab=rejected" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors flex flex-col justify-between h-[120px]">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-red-50 flex items-center justify-center border border-red-100">
                       <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <span className="text-xl font-bold text-slate-800">{String(disputedCount).padStart(2, '0')}</span>
                 </div>
                 <p className="text-sm text-slate-500 font-medium">Disputed Orders</p>
              </Link>

              <Link href="/customer/shipments?tab=on_hold" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-colors flex flex-col justify-between h-[120px]">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center border border-green-100">
                       <Clock className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-xl font-bold text-slate-800">{String(onHoldCount).padStart(2, '0')}</span>
                 </div>
                 <p className="text-sm text-slate-500 font-medium">OnHold Orders</p>
              </Link>
           </div>
        </div>


      </div>

    </div>
  );
}
