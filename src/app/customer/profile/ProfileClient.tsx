"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  ArrowRight,
  CheckCircle2,
  LogOut,
  MapPin,
  PackageSearch,
  Truck,
  User,
} from "lucide-react";

type AddressItem = {
  id: string;
  label: string | null;
  name: string;
  phone: string | null;
  street1: string;
  street2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: { code: string; name: string };
  isDefault: boolean;
};

type ProfileClientProps = {
  fullName: string;
  email: string;
  phone: string;
  addressCount: number;
  addresses: AddressItem[];
  memberSince: string;
  profileUpdatedAt: string;
  primaryAddressLabel: string;
};

function formatAddress(address: AddressItem) {
  return [
    address.street1,
    address.street2,
    address.city,
    address.state,
    address.postalCode,
    address.country.name,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function ProfileClient({
  fullName,
  email,
  phone,
  addressCount,
  addresses,
  memberSince,
  profileUpdatedAt,
  primaryAddressLabel,
}: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "addresses">("profile");

  const menuItems = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "addresses" as const, label: "Pickup Addresses", icon: Truck },
  ];

  return (
    <div className="mx-auto flex min-h-full max-w-[1440px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 xl:flex-row xl:items-start xl:gap-10">
      <aside className="w-full shrink-0 xl:w-[300px]">
        <div className="app-card overflow-hidden rounded-[28px] border border-slate-200/80 bg-gradient-to-b from-[#fff7f7] to-[#eef2ff] p-6 text-center shadow-[0_18px_40px_rgba(15,23,42,0.07)]">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#ff6f6f] text-white shadow-[0_14px_30px_rgba(255,111,111,0.35)]">
            <User className="h-9 w-9 stroke-[1.8]" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">{fullName}</h2>
          <p className="mt-1 text-sm text-slate-500">{email}</p>
        </div>

        <nav className="mt-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all ${
                  isActive
                    ? "bg-[#1e4b7a] text-white shadow-[0_14px_30px_rgba(30,75,122,0.22)]"
                    : "border border-transparent bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-6 flex w-full items-center gap-4 rounded-2xl border border-red-100 bg-white px-5 py-4 text-left text-red-500 transition-all hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </aside>

      <main className="min-w-0 flex-1">
        <div className="mb-6">
          <h1 className="text-[22px] font-bold tracking-tight text-slate-900">Profile</h1>
          <div className="mt-1 text-[13px] text-slate-400">
            <span>Settings</span>
            <span className="mx-2 text-slate-300">&gt;</span>
            <span className="font-medium text-slate-700">Profile</span>
          </div>
        </div>

        {activeTab === "profile" ? (
          <div className="space-y-6">
            <section className="app-card overflow-hidden rounded-[28px] border border-slate-200/80">
              <div className="border-b border-slate-100 px-8 py-5">
                <h2 className="text-[15px] font-bold text-slate-900">Basic Details</h2>
              </div>

              <div className="grid gap-0 md:grid-cols-3">
                <div className="border-b border-slate-100 px-8 py-7 md:col-span-1 md:border-b-0 md:border-r">
                  <p className="text-sm font-medium text-slate-500">Account Name</p>
                  <p className="mt-2 text-[15px] font-semibold text-slate-900">{fullName}</p>
                </div>

                <div className="border-b border-slate-100 px-8 py-7 md:col-span-1 md:border-b-0 md:border-r">
                  <p className="text-sm font-medium text-slate-500">Phone Number</p>
                  <p className="mt-2 text-[15px] font-semibold text-slate-900">
                    {phone || "Not added yet"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    This comes from your registration form or profile record.
                  </p>
                </div>

                <div className="px-8 py-7 md:col-span-1">
                  <p className="text-sm font-medium text-slate-500">Email Address</p>
                  <p className="mt-2 text-[15px] font-semibold text-slate-900">{email}</p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[13px] font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="app-card rounded-[28px] border border-slate-200/80 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Saved Addresses
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{addressCount}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Pickup and warehouse addresses linked to your account.
                </p>
              </div>

              <div className="app-card rounded-[28px] border border-slate-200/80 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Account Status
                </p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Active</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your account is available for booking and tracking.
                </p>
              </div>

              <div className="app-card rounded-[28px] border border-slate-200/80 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Member Since
                </p>
                <p className="mt-3 text-xl font-bold tracking-tight text-slate-900">
                  {new Date(memberSince).toLocaleDateString()}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Profile created from your registration record.
                </p>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
              <div className="app-card rounded-[28px] border border-slate-200/80 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Profile Updated
                </p>
                <p className="mt-3 text-xl font-bold tracking-tight text-slate-900">
                  {new Date(profileUpdatedAt).toLocaleDateString()}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Last profile sync from the account record.
                </p>
              </div>

              <div className="app-card rounded-[28px] border border-slate-200/80 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Primary Address
                </p>
                <p className="mt-3 text-xl font-bold tracking-tight text-slate-900">
                  {primaryAddressLabel || "Not set"}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  The top saved address is shown here for quick reference.
                </p>
              </div>
            </section>

            <section className="app-card rounded-[28px] border border-slate-200/80 p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Quick Actions
                  </p>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">Common profile tasks</h3>
                </div>
                <Link
                  href="/customer/shipments/new"
                  className="inline-flex items-center gap-2 rounded-full bg-[#1e4b7a] px-4 py-2 text-sm font-semibold text-white"
                >
                  Create Shipment
                  <PackageSearch className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href="/customer/addresses"
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-[#1e4b7a]"
                >
                  Open Address Book
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/customer/track"
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-[#1e4b7a]"
                >
                  Track Shipment
                  <Truck className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>
        ) : (
          <section className="app-card overflow-hidden rounded-[28px] border border-slate-200/80">
            <div className="border-b border-slate-100 px-8 py-5">
              <h2 className="text-[15px] font-bold text-slate-900">Pickup Addresses</h2>
              <p className="mt-1 text-sm text-slate-500">
                Saved pickup locations and shipment-linked addresses are shown here.
              </p>
            </div>

            <div className="p-8">
              {addresses.length ? (
                <div className="grid gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="text-base font-bold text-slate-900">
                              {address.label || "Saved Address"}
                            </p>
                            {address.isDefault ? (
                              <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">
                                Default
                              </span>
                            ) : null}
                          </div>

                          <p className="flex items-center gap-2 text-sm text-slate-600">
                            <Truck className="h-4 w-4 text-slate-400" />
                            {address.name}
                            {address.phone ? ` | ${address.phone}` : ""}
                          </p>

                          <p className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                            <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                            <span>{formatAddress(address)}</span>
                          </p>
                        </div>

                        <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {address.country.code}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-white p-10 text-center">
                  <p className="text-base font-semibold text-slate-900">No pickup addresses yet</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Saved addresses from your shipment history will appear here automatically.
                  </p>
                  <Link
                    href="/customer/addresses"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1e4b7a] px-5 py-3 text-sm font-semibold text-white"
                  >
                    Go to Address Book
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
