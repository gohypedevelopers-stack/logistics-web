"use client";

import React, { useState } from "react";
import { User, ShieldCheck, Truck, Users, Key, CheckCircle2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

type ProfileClientProps = {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
};

export default function ProfileClient({ fullName, firstName, lastName, email }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState("profile");

  const menuItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "kyc", label: "KYC Details", icon: ShieldCheck },
    { id: "address", label: "Pickup Address", icon: Truck },
    { id: "refer", label: "Refer and Earn", icon: Users },
    { id: "password", label: "Change Password", icon: Key },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 lg:p-10 max-w-[1400px] mx-auto min-h-full bg-transparent">
      
      {/* Left Sidebar Menu */}
      <div className="w-full md:w-[260px] shrink-0">
        
        {/* User Card */}
        <div className="bg-gradient-to-b from-[#ffeaea] to-[#e4ebff] rounded-2xl p-6 border border-slate-100/50 flex flex-col items-center justify-center mb-6 text-center">
            <div className="w-[72px] h-[72px] rounded-full bg-[#ff7b7b] flex items-center justify-center mb-4">
               <User className="w-8 h-8 text-white stroke-[1.5]" />
            </div>
            <h2 className="text-base font-semibold text-slate-800">{fullName}</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5 flex-1">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-4 px-5 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                    ? "bg-[#1E3A8A] text-white shadow-md" 
                    : "text-slate-500 hover:bg-white hover:text-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
          
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-4 px-5 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all mt-4 border border-red-100/50"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">Log Out Account</span>
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
         <div className="mb-6">
            <h1 className="text-[22px] font-semibold text-slate-800 tracking-tight leading-tight">My Profile</h1>
            <div className="text-[13px] text-slate-400 flex items-center gap-1.5 mt-0.5">
               <span>Settings</span>
               <span className="text-slate-300">&gt;</span>
               <span className="text-slate-700 font-medium">My Profile</span>
            </div>
         </div>

         {activeTab === "profile" && (
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100">
                 <h3 className="text-[15px] font-bold text-slate-800">Basic Details</h3>
              </div>
              
              <div className="px-8 py-2">
                 {/* Name Row */}
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-slate-100">
                    <div className="md:col-span-3">
                       <span className="text-[15px] text-slate-500">Name</span>
                    </div>
                    <div className="md:col-span-4">
                       <p className="text-xs text-slate-400 mb-1">First Name</p>
                       <p className="text-[15px] font-medium text-slate-800">{firstName}</p>
                    </div>
                    <div className="md:col-span-4">
                       <p className="text-xs text-slate-400 mb-1">Last Name</p>
                       <p className="text-[15px] font-medium text-slate-800">{lastName}</p>
                    </div>
                 </div>

                 {/* Contact Row */}
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-8">
                    <div className="md:col-span-3">
                       <span className="text-[15px] text-slate-500">Contact Details</span>
                    </div>
                    <div className="md:col-span-4 space-y-6">
                       <div>
                          <p className="text-xs text-slate-400 mb-1">Phone Number</p>
                          <p className="text-[15px] font-medium text-slate-800">7428562272</p>
                       </div>
                       <div>
                          <p className="text-xs text-slate-400 mb-1">Email</p>
                          <p className="text-[15px] font-medium text-slate-800">{email}</p>
                       </div>
                    </div>
                    <div className="md:col-span-4">
                       <p className="text-xs text-slate-400 mb-1">Status</p>
                       <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-green-500 text-green-600 text-[13px] font-medium bg-white">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified
                       </div>
                    </div>
                 </div>
              </div>
           </div>
         )}

         {activeTab === "kyc" && (
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-8">
             <h3 className="text-lg font-bold text-slate-800 mb-4">KYC Details</h3>
             <p className="text-slate-500 text-sm">Your KYC is fully verified. No further action needed.</p>
           </div>
         )}
         
         {activeTab === "address" && (
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-8">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Pickup Address</h3>
             <p className="text-slate-500 text-sm">You have not saved any pickup addresses yet.</p>
           </div>
         )}

         {activeTab === "refer" && (
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-8">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Refer and Earn</h3>
             <p className="text-slate-500 text-sm">Invite friends and earn shipping credits.</p>
           </div>
         )}

         {activeTab === "password" && (
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-8">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Change Password</h3>
             <p className="text-slate-500 text-sm">Update your account security settings here.</p>
           </div>
         )}
         
      </div>
    </div>
  );
}
