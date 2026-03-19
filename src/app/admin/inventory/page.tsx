import { Search, Plus, SlidersHorizontal, ChevronLeft, ChevronRight, Plane, Ship, BarChart2, ArrowRight, ExternalLink, CheckCircle, PauseCircle, Activity } from "lucide-react";
import Link from "next/link";

const routes = [
  {
    id: 1,
    code: 'LHR → DXB',
    desc: 'London to Dubai International',
    icon: 'air',
    carrier: 'SkyCargo',
    carrierColor: 'bg-green-100 text-green-700',
    carrierInitials: 'SC',
    level: 'EXPRESS',
    levelColor: 'bg-orange-500 text-white',
    rate: '£5.42',
    status: 'Active',
    statusColor: 'text-green-600',
  },
  {
    id: 2,
    code: 'SOU → NYC',
    desc: 'Southampton to New York Port',
    icon: 'sea',
    carrier: 'Maersk',
    carrierColor: 'bg-blue-100 text-blue-700',
    carrierInitials: 'MK',
    level: 'ECONOMY',
    levelColor: 'bg-slate-200 text-slate-700',
    rate: '£1.85',
    status: 'Active',
    statusColor: 'text-green-600',
  },
  {
    id: 3,
    code: 'JFK → LHR',
    desc: 'New York JFK to London Heathrow',
    icon: 'air',
    carrier: 'FedEx Int.',
    carrierColor: 'bg-violet-100 text-violet-700',
    carrierInitials: 'FX',
    level: 'PRIORITY',
    levelColor: 'bg-[#1E1B4B] text-white',
    rate: '£8.90',
    status: 'Paused',
    statusColor: 'text-slate-400',
  },
  {
    id: 4,
    code: 'MAN → CDG',
    desc: 'Manchester to Paris Charles de Gaulle',
    icon: 'air',
    carrier: 'DHL Freight',
    carrierColor: 'bg-yellow-100 text-yellow-700',
    carrierInitials: 'DH',
    level: 'STANDARD',
    levelColor: 'bg-slate-100 text-slate-600',
    rate: '£2.30',
    status: 'Active',
    statusColor: 'text-green-600',
  },
];

export default function RatesRoutesPage() {
  return (
    <div className="p-8 lg:p-10 min-h-full pb-20">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Operations</span>
        <span className="text-slate-300">/</span>
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Global Logistics</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
        <div>
          <h1 className="text-[34px] font-black text-[#1E1B4B] tracking-tight mb-3">Rates &amp; Routes</h1>
          <p className="text-slate-500 font-medium text-[15px] max-w-lg leading-relaxed">
            Manage proprietary pricing matrices across your international network. Configure per-kilogram baselines and carrier partnerships.
          </p>
        </div>
        <button className="h-11 px-6 rounded-xl bg-[#1E1B4B] text-white font-bold text-sm tracking-wide gap-2 flex items-center hover:bg-[#2A377B] shadow-md transition-colors flex-shrink-0 self-start">
          <Plus className="w-4 h-4" /> Add New Rate
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* Active Routes */}
        <div className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm flex flex-col justify-between h-36">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Active Routes</p>
          <div>
            <div className="flex items-end gap-3">
              <span className="text-[38px] font-black text-[#1E1B4B] tracking-tight leading-none">142</span>
              <span className="text-[12px] font-bold text-green-600 mb-1">+4 this month</span>
            </div>
          </div>
        </div>

        {/* Avg Rate */}
        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-7 shadow-lg flex flex-col justify-between h-36 text-white">
          <p className="text-[11px] font-bold uppercase tracking-widest text-teal-100">AVG. Rate / KG</p>
          <div>
            <div className="flex items-end gap-3">
              <span className="text-[38px] font-black tracking-tight leading-none">£4.12</span>
              <span className="text-[13px] font-bold text-teal-100 mb-1">Global Aggregate</span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm flex items-center justify-between h-36">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">System Health</p>
            <h3 className="text-[18px] font-black text-[#1E1B4B] mb-1">Live Carrier Sync</h3>
            <p className="text-[12px] font-medium text-slate-500">All 12 carrier APIs responding within &lt; 200ms</p>
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-green-500" />
          </div>
        </div>

      </div>

      {/* Search + Filters + Quick Origins */}
      <div className="flex flex-col lg:flex-row items-center gap-4 mb-8">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search routes, carriers, or zones..."
            className="w-full h-11 bg-white border border-slate-200 rounded-xl pl-11 pr-4 text-sm font-medium text-slate-700 outline-none focus:ring-2 ring-indigo-500/20 placeholder:text-slate-400"
          />
        </div>
        <button className="h-11 w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors flex-shrink-0">
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 ml-auto flex-wrap">
          <span className="text-[12px] font-bold text-slate-400 tracking-wide uppercase">Quick Origins:</span>
          <button className="h-9 px-4 rounded-lg bg-[#1E1B4B] text-white font-bold text-[12px] tracking-wide">UK (LHR)</button>
          <button className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-[12px] tracking-wide hover:bg-slate-50 transition-colors">USA (JFK)</button>
          <button className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-[12px] tracking-wide hover:bg-slate-50 transition-colors">EU (AMS)</button>
        </div>
      </div>

      {/* Routes Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F4F5F9] border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Route Info</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Carrier</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Service Level</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Base Rate / KG</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {routes.map((route) => (
                <tr key={route.id} className="hover:bg-slate-50/60 transition-colors group">
                  {/* Route Info */}
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        {route.icon === 'air'
                          ? <Plane className="w-5 h-5 text-slate-500" />
                          : <Ship className="w-5 h-5 text-slate-500" />
                        }
                      </div>
                      <div>
                        <p className="font-black text-[#1E1B4B] text-[14px] tracking-tight mb-0.5">
                          {route.code.split(' → ')[0]} <ArrowRight className="w-3 h-3 inline mb-0.5 text-slate-400" /> {route.code.split(' → ')[1]}
                        </p>
                        <p className="text-[12px] font-medium text-slate-400">{route.desc}</p>
                      </div>
                    </div>
                  </td>

                  {/* Carrier */}
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0 ${route.carrierColor}`}>
                        {route.carrierInitials}
                      </div>
                      <span className="font-bold text-slate-700 text-[13px]">{route.carrier}</span>
                    </div>
                  </td>

                  {/* Service Level */}
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest ${route.levelColor}`}>
                      {route.level}
                    </span>
                  </td>

                  {/* Base Rate */}
                  <td className="px-6 py-6">
                    <span className="font-black text-[#1E1B4B] text-[18px] tracking-tight">{route.rate}</span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-6">
                    <div className={`flex items-center gap-2 ${route.statusColor}`}>
                      {route.status === 'Active'
                        ? <CheckCircle className="w-4 h-4" />
                        : <PauseCircle className="w-4 h-4" />
                      }
                      <span className="font-bold text-[13px]">{route.status}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-6">
                    <button className="h-9 w-9 rounded-xl hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-400 border border-slate-200">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 bg-white">
          <span className="text-[13px] font-medium text-slate-500">
            Showing 1–12 of <span className="font-bold">142</span> total routes
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
            <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-600">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">

        {/* Intelligence Alert */}
        <div className="bg-gradient-to-br from-[#2A377B] to-[#1E1B4B] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-[9px] font-bold tracking-widest uppercase text-indigo-200 mb-5 backdrop-blur-sm">
              Intelligence Alert
            </div>
            <h3 className="text-[22px] font-black text-white mb-4 tracking-tight">Fuel Surcharge Update</h3>
            <p className="text-[14px] text-indigo-100/90 font-medium leading-relaxed mb-6 max-w-sm">
              Expect a 2.4% increase in transatlantic air freight base rates starting next quarter due to fuel index volatility. Recalculate JFK–LHR routes recommended.
            </p>
            <button className="flex items-center gap-2 text-[13px] font-bold text-white hover:text-indigo-200 transition-colors underline underline-offset-4 decoration-indigo-400/50">
              Review Suggested Adjustments <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carrier Performance */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-5">
                <BarChart2 className="w-6 h-6 text-[#1E1B4B]" />
              </div>
              <h3 className="text-[20px] font-black text-[#1E1B4B] mb-3 tracking-tight">Carrier Performance</h3>
              <p className="text-[14px] text-slate-500 font-medium leading-relaxed">
                SkyCargo maintains a 98.4% on-time delivery rate this month. Pricing is optimized.
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-8">
            <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2">
              <span>On-Time Rate</span>
              <span>98.4%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-2 w-[98.4%] bg-gradient-to-r from-[#1E1B4B] to-indigo-400 rounded-full"></div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="border-t border-slate-200/70 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-[#1E1B4B] text-[16px] mb-1">Global Navigator Logistics</h2>
          <p className="text-[12px] text-slate-500 font-medium">© 2024 Global Navigator Logistics. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap gap-6 text-[12px] font-bold text-slate-500">
          <a href="#" className="hover:text-[#1E1B4B] transition-colors hover:underline underline-offset-4">Privacy Policy</a>
          <a href="#" className="hover:text-[#1E1B4B] transition-colors hover:underline underline-offset-4">Terms of Service</a>
          <a href="#" className="hover:text-[#1E1B4B] transition-colors hover:underline underline-offset-4">Global Compliance</a>
          <a href="#" className="hover:text-[#1E1B4B] transition-colors hover:underline underline-offset-4">Sustainability</a>
          <a href="#" className="hover:text-[#1E1B4B] transition-colors hover:underline underline-offset-4">Carrier Relations</a>
        </div>
      </div>

    </div>
  );
}
