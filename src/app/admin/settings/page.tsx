import { 
  Settings, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  CreditCard, 
  Database,
  ArrowRight,
  Zap,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

const settingGroups = [
  {
    title: "Operational Config",
    items: [
      { name: "Shipment Rules", desc: "Manage operational flow and constraints.", icon: Zap },
      { name: "Dispatch Hubs", desc: "Configure pickup and delivery routing points.", icon: MapPin },
    ]
  },
  {
    title: "Security & Users",
    items: [
      { name: "Staff Access", desc: "Manage IAM and permission levels.", icon: ShieldCheck },
      { name: "System Notifications", desc: "Global notification and audit configuration.", icon: Bell },
    ]
  },
  {
    title: "Data & Billing",
    items: [
       { name: "Currency & Taxes", desc: "Universal tariff and currency mapping.", icon: CreditCard },
       { name: "System Logs", desc: "PostgreSQL Neon sync and persistence logs.", icon: Database },
    ]
  }
];

export default function AdminSettings() {
  return (
    <div className="p-8 lg:p-10 max-w-[1600px] mx-auto min-h-full bg-[#f8f9fa] font-sans">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-[#1E293B]">
              <Link href="/admin/dashboard" className="w-6 h-6 rounded-full bg-[#1E1B4B] text-white flex items-center justify-center hover:bg-slate-900 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </Link>
              System Settings
            </div>
            <div className="text-sm font-medium text-slate-500 mt-1 pl-8">
              Configure platform rules, user access, and global logistics data.
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-12 pb-20">
         {settingGroups.map((group) => (
           <div key={group.title} className="space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">{group.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {group.items.map((item) => (
                   <Link key={item.name} href={item.name === "Staff Access" ? "/admin/settings/staff" : "#"} className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group flex items-start gap-6">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#1E1B4B] group-hover:text-white transition-all">
                         <item.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                         <h4 className="font-bold text-slate-800 text-base group-hover:text-blue-700 transition-colors">{item.name}</h4>
                         <p className="text-xs font-medium text-slate-500 mt-2 leading-relaxed italic line-clamp-2">
                           {item.desc}
                         </p>
                         <div className="mt-6 flex items-center justify-between group-hover:text-blue-600 transition-colors">
                            <span className="text-[10px] font-bold uppercase tracking-wider">Configure Settings</span>
                            <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                         </div>
                      </div>
                   </Link>
                 ))}
              </div>
           </div>
         ))}
      </div>
    </div>
  );
}
