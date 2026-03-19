import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search, Plus, SlidersHorizontal, PackageOpen } from "lucide-react";
import { Input } from "@/components/ui/Input";

export default async function CustomerShipments() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div>Unauthorized. Please log in.</div>;
  }

  const userId = session.user.id;
  
  const customerProfile = await prisma.customerProfile.findUnique({
    where: { userId },
    include: {
      shipments: {
        orderBy: { createdAt: 'desc' },
        include: { receiverAddress: true, route: { include: { destinationCountry: true } } }
      }
    }
  });

  const getStatusColor = (status: string) => {
    if (['DELIVERED'].includes(status)) return 'success';
    if (['DRAFT'].includes(status)) return 'secondary';
    if (['CREATED', 'PICKUP_SCHEDULED', 'PICKUP_COMPLETED'].includes(status)) return 'warning';
    return 'default'; 
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Shipment Directory</h1>
          <p className="text-sm font-bold tracking-wide mt-2 text-slate-500">Track and manage all your international cargo records.</p>
        </div>
        <Link href="/customer/shipments/new">
          <Button size="lg" className="shadow-md bg-primary hover:bg-[#0B0E27] text-white font-bold h-12 px-8 uppercase tracking-[0.15em] text-xs flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Request
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden min-h-[500px] flex flex-col">
        {/* Filters and Search */}
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:w-96">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Search by Tracking ID, AWB, or Reference..." 
                className="pl-12 h-12 rounded-lg border-slate-200 font-medium bg-slate-50 focus:bg-white"
                readOnly
              />
           </div>
           <Button variant="outline" className="h-12 px-8 rounded-lg font-bold uppercase tracking-widest text-[11px] text-slate-600 border-slate-200 hover:bg-slate-50 flex gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              FILTERS
           </Button>
        </div>

        {/* List Content */}
        {!customerProfile?.shipments || customerProfile.shipments.length === 0 ? (
           <div className="flex-1 flex flex-col items-center justify-center p-16 text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                 <PackageOpen className="w-8 h-8" />
              </div>
              <p className="text-lg font-black text-slate-900 tracking-tight">Your vault is empty</p>
              <p className="text-sm text-slate-500 mt-2 font-medium max-w-md">You haven't initialized any cross-border shipments yet. Click the create button to begin.</p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4 border-r border-slate-100">Shipment Origin / ID</th>
                  <th className="px-8 py-4 border-r border-slate-100">Consignee Dest.</th>
                  <th className="px-8 py-4 border-r border-slate-100">Details</th>
                  <th className="px-8 py-4 border-r border-slate-100">Current Status</th>
                  <th className="px-8 py-4" aria-hidden="true"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customerProfile.shipments.map((ship: any) => (
                  <tr key={ship.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5 border-r border-slate-50">
                      <div className="font-black text-slate-900 text-base group-hover:text-primary transition-colors cursor-pointer">{ship.trackingId}</div>
                      <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{ship.awb || 'No AWB'}</div>
                      {ship.referenceNo && (
                        <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">REF: {ship.referenceNo}</div>
                      )}
                    </td>
                    <td className="px-8 py-5 border-r border-slate-50">
                       <div className="font-bold text-slate-800 text-sm">{ship.receiverAddress?.city || 'Unassigned'}</div>
                       <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{ship.route?.destinationCountry?.name || 'India'}</div>
                    </td>
                    <td className="px-8 py-5 border-r border-slate-50">
                       <div className="font-bold text-slate-800 text-sm whitespace-nowrap">{ship.content ? ship.content : '-'}</div>
                       <div className="flex gap-2 mt-2">
                         <div className="text-[10px] font-bold tracking-widest px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500 uppercase">
                           WGT: {ship.weight} kg
                         </div>
                         {ship.amount && (
                           <div className="text-[10px] font-bold tracking-widest px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-primary uppercase">
                             VAL: ${ship.amount}
                           </div>
                         )}
                       </div>
                    </td>
                    <td className="px-8 py-5 border-r border-slate-50">
                      <Badge variant={getStatusColor(ship.status)} className="shadow-none">
                        {ship.status.replace(/_/g, ' ')}
                      </Badge>
                      <div className="text-[10px] font-bold text-slate-400 mt-2 tracking-widest uppercase">
                         {new Date(ship.createdAt).toLocaleDateString()}
                       </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <Link href={`/customer/shipments/${ship.id}`}>
                         <Button variant="outline" size="sm" className="font-bold tracking-widest uppercase text-[10px] shadow-none hover:bg-slate-50 hover:text-primary border-slate-200 transition-all h-8 px-5">TRACK</Button>
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination mock */}
        <div className="mt-auto p-6 border-t border-slate-200 bg-white flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest">
           <div>{customerProfile?.shipments?.length || 0} Records Parsed</div>
           <div className="flex gap-2">
              <Button disabled variant="outline" size="sm" className="rounded-md h-8 text-[10px] font-bold uppercase tracking-widest">Prev</Button>
              <Button disabled variant="outline" size="sm" className="rounded-md h-8 text-[10px] font-bold uppercase tracking-widest">Next</Button>
           </div>
        </div>
      </div>
    </div>
  );
}
