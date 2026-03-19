import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { Search, Download, LayoutGrid, ChevronLeft, ChevronRight, AlertTriangle, MoreHorizontal, SlidersHorizontal, ChevronDown } from "lucide-react";

export default async function AdminShipments() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div>Unauthorized. Please log in.</div>;
  }

  const shipments = await prisma.shipment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: {
      customer: true,
      receiverAddress: true,
      route: { include: { destinationCountry: true } }
    }
  });

  const totalShipments = await prisma.shipment.count();
  const inTransit = await prisma.shipment.count({ where: { status: { notIn: ['DELIVERED', 'DRAFT', 'CREATED'] } } });
  const delivered = await prisma.shipment.count({ where: { status: 'DELIVERED' } });

  const getStatusStyle = (status: string) => {
    if (status === 'DELIVERED') return 'bg-green-50 text-green-700 border border-green-200';
    if (['IN_TRANSIT', 'PICKED_UP', 'PICKUP_COMPLETED'].includes(status)) return 'bg-[#e0f7fa] text-[#00838f] border border-[#b2ebf2]';
    if (['CREATED', 'PICKUP_SCHEDULED'].includes(status)) return 'bg-amber-50 text-amber-700 border border-amber-200';
    if (status === 'DRAFT') return 'bg-slate-100 text-slate-600 border border-slate-200';
    return 'bg-red-50 text-red-700 border border-red-200';
  };

  const getStatusDot = (status: string) => {
    if (status === 'DELIVERED') return 'bg-green-500';
    if (['IN_TRANSIT', 'PICKED_UP', 'PICKUP_COMPLETED'].includes(status)) return 'bg-teal-500';
    if (['CREATED', 'PICKUP_SCHEDULED'].includes(status)) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStatusLabel = (status: string) => {
    if (status === 'DELIVERED') return 'Delivered';
    if (['IN_TRANSIT', 'PICKED_UP', 'PICKUP_COMPLETED'].includes(status)) return 'In Transit';
    if (status === 'PICKUP_SCHEDULED') return 'Scheduled';
    if (status === 'DRAFT') return 'Draft';
    return status.replace(/_/g, ' ');
  };

  // Generate avatar initials and color from company name
  const getAvatarStyle = (name: string) => {
    const colors = [
      'bg-indigo-100 text-indigo-700',
      'bg-teal-100 text-teal-700',
      'bg-orange-100 text-orange-700',
      'bg-purple-100 text-purple-700',
      'bg-rose-100 text-rose-700',
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  };

  const totalPages = Math.ceil(totalShipments / 10);

  return (
    <div className="p-8 lg:p-10 min-h-full">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div>
          <h1 className="text-[32px] font-black text-[#1E1B4B] tracking-tight mb-2">Shipment Management</h1>
          <p className="text-slate-500 font-medium text-[15px]">Oversee global freight operations and live tracking intelligence.</p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <button className="h-11 px-6 rounded-xl bg-slate-200/60 text-slate-700 font-bold text-sm tracking-wide gap-2 flex items-center hover:bg-slate-200 transition-colors">
            <Download className="w-4 h-4" /> Export Report
          </button>
          <Link href="/admin/shipments/new">
            <button className="h-11 px-6 rounded-xl bg-[#1E1B4B] text-white font-bold text-sm tracking-wide gap-2 flex items-center hover:bg-[#2A377B] shadow-md transition-colors">
              <LayoutGrid className="w-4 h-4" /> Bulk Actions
            </button>
          </Link>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-[12px] font-medium text-slate-500 mb-2">Active Shipments</p>
          <div className="flex items-end gap-3">
            <span className="text-[34px] font-black text-[#1E1B4B] tracking-tight leading-none">1,284</span>
            <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mb-1">+12%</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-[12px] font-medium text-slate-500 mb-2">In Transit</p>
          <span className="text-[34px] font-black text-[#1E1B4B] tracking-tight leading-none">{inTransit}</span>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400 rounded-l-2xl"></div>
          <p className="text-[12px] font-medium text-slate-500 mb-2">At Risk (Delayed)</p>
          <div className="flex items-end gap-3">
            <span className="text-[34px] font-black text-red-600 tracking-tight leading-none">24</span>
            <AlertTriangle className="w-5 h-5 text-red-500 mb-1" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-[12px] font-medium text-slate-500 mb-2">Delivered Today</p>
          <span className="text-[34px] font-black text-[#1E1B4B] tracking-tight leading-none">{delivered}</span>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
        <div className="relative w-full md:flex-1 max-w-xl">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Tracking ID, Customer or AWB..."
            className="w-full h-12 bg-white border border-slate-200 rounded-xl pl-12 pr-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 placeholder:text-slate-400"
            readOnly
          />
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="h-12 px-5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
            Status: All <ChevronDown className="w-4 h-4" />
          </button>
          <button className="h-12 px-5 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-sm">
            Carrier: All <ChevronDown className="w-4 h-4" />
          </button>
          <button className="h-12 w-12 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F4F5F9] border-b border-slate-100">
              <tr>
                <th className="w-12 px-6 py-4">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#1E1B4B] focus:ring-[#1E1B4B] cursor-pointer" />
                </th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Tracking ID</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">AWB</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Customer</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Origin / Destination</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Amount</th>
                <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {/* Static example rows matching the mock */}
              {[
                { id: 'GN-8842109', awb: 'AWB-77421', company: 'Apex Logistics', tier: 'Global Partner', initials: 'AL', origin: 'Shanghai, CN', dest: 'Los Angeles, US', status: 'IN_TRANSIT', amount: '$12,450.00' },
                { id: 'GN-8842110', awb: 'AWB-77459', company: 'Nordic Maritime', tier: 'Standard Tier', initials: 'NM', origin: 'Oslo, NO', dest: 'Rotterdam, NL', status: 'DELAYED', amount: '$3,820.50' },
                { id: 'GN-8842112', awb: 'AWB-77502', company: 'Z-Quantum Systems', tier: 'Priority Tier', initials: 'ZQ', origin: 'Austin, TX', dest: 'Berlin, DE', status: 'DELIVERED', amount: '$8,100.00' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#1E1B4B] focus:ring-[#1E1B4B] cursor-pointer" />
                  </td>
                  <td className="px-4 py-5">
                    <span className="text-[#1E1B4B] font-bold text-[13px] hover:underline cursor-pointer">{row.id}</span>
                  </td>
                  <td className="px-4 py-5">
                    <span className="text-slate-700 font-medium text-[13px]">{row.awb}</span>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 ${
                        i === 0 ? 'bg-indigo-100 text-[#1E1B4B]' : i === 1 ? 'bg-orange-100 text-orange-700' : 'bg-teal-100 text-teal-700'
                      }`}>
                        {row.initials}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-[13px] leading-tight">{row.company}</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">{row.tier}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <p className="font-bold text-slate-700 text-[13px] leading-tight">{row.origin}</p>
                    <p className="text-[12px] text-slate-400 font-medium mt-0.5">to {row.dest}</p>
                  </td>
                  <td className="px-4 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                      row.status === 'DELIVERED' ? 'bg-green-50 text-green-700 border border-green-200' :
                      row.status === 'IN_TRANSIT' ? 'bg-[#e0f7fa] text-[#00838f] border border-[#b2ebf2]' :
                      'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        row.status === 'DELIVERED' ? 'bg-green-500' :
                        row.status === 'IN_TRANSIT' ? 'bg-teal-500' :
                        'bg-red-500'
                      }`}></span>
                      {row.status === 'IN_TRANSIT' ? 'In Transit' : row.status === 'DELIVERED' ? 'Delivered' : 'Delayed'}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <span className="font-bold text-slate-800 text-[14px]">{row.amount}</span>
                  </td>
                  <td className="px-4 py-5">
                    <button className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-400">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {/* Real DB rows */}
              {shipments.map((ship: any) => (
                <tr key={ship.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                  </td>
                  <td className="px-4 py-5">
                    <Link href={`/admin/shipments/${ship.id}`}>
                      <span className="text-[#1E1B4B] font-bold text-[13px] hover:underline cursor-pointer">{ship.trackingId}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-5">
                    <span className="text-slate-700 font-medium text-[13px]">{ship.awb || '—'}</span>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 ${getAvatarStyle(ship.customer?.companyName || '')}`}>
                        {getInitials(ship.customer?.companyName || '?')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-[13px] leading-tight">{ship.customer?.companyName || 'Unknown'}</p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">Standard Tier</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <p className="font-bold text-slate-700 text-[13px] leading-tight">{ship.senderCity || 'Origin'}</p>
                    <p className="text-[12px] text-slate-400 font-medium mt-0.5">to {ship.receiverAddress?.city || 'India'}</p>
                  </td>
                  <td className="px-4 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${getStatusStyle(ship.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(ship.status)}`}></span>
                      {getStatusLabel(ship.status)}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <span className="font-bold text-slate-800 text-[14px]">{ship.amount ? `$${ship.amount.toLocaleString()}` : '—'}</span>
                  </td>
                  <td className="px-4 py-5">
                    <Link href={`/admin/shipments/${ship.id}`}>
                      <button className="w-8 h-8 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-400">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 bg-white">
          <span className="text-[13px] font-medium text-slate-500">
            Showing 1–10 of <span className="font-bold">1,284</span> shipments
          </span>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {[1, 2, 3].map(p => (
              <button key={p} className={`w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold transition-colors ${p === 1 ? 'bg-[#1E1B4B] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {p}
              </button>
            ))}
            <span className="text-slate-400 font-bold px-1">…</span>
            <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[13px] font-bold text-slate-600 transition-colors">
              128
            </button>
            <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
