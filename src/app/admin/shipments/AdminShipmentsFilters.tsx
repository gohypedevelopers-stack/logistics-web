"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search } from "lucide-react";

type CountryOption = {
  id: string;
  name: string;
  code: string;
};

type AdminShipmentsFiltersProps = {
  countries: CountryOption[];
  initialStatus: string;
  initialCountry: string;
  initialFrom: string;
  initialTo: string;
  initialQuery: string;
};

export function AdminShipmentsFilters({
  countries,
  initialStatus,
  initialCountry,
  initialFrom,
  initialTo,
  initialQuery,
}: AdminShipmentsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState(initialStatus);
  const [country, setCountry] = useState(initialCountry);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const queryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(initialQuery);
    setStatus(initialStatus);
    setCountry(initialCountry);
    setFrom(initialFrom);
    setTo(initialTo);
  }, [initialCountry, initialFrom, initialQuery, initialStatus, initialTo]);

  useEffect(() => {
    return () => {
      if (queryTimeoutRef.current) {
        clearTimeout(queryTimeoutRef.current);
      }
    };
  }, []);

  function updateFilters(next: {
    q?: string;
    status?: string;
    country?: string;
    from?: string;
    to?: string;
  }) {
    const params = new URLSearchParams();
    const nextQuery = next.q ?? query;
    const nextStatus = next.status ?? status;
    const nextCountry = next.country ?? country;
    const nextFrom = next.from ?? from;
    const nextTo = next.to ?? to;

    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextStatus && nextStatus !== "all") params.set("status", nextStatus);
    if (nextCountry) params.set("country", nextCountry);
    if (nextFrom) params.set("from", nextFrom);
    if (nextTo) params.set("to", nextTo);

    const search = params.toString();
    const href = search ? `${pathname}?${search}` : pathname;

    startTransition(() => {
      router.replace(href);
    });
  }

  function scheduleQueryUpdate(nextQuery: string) {
    setQuery(nextQuery);

    if (queryTimeoutRef.current) {
      clearTimeout(queryTimeoutRef.current);
    }

    queryTimeoutRef.current = setTimeout(() => {
      updateFilters({ q: nextQuery });
    }, 350);
  }

  return (
    <div className="grid gap-4 border-b border-slate-200/80 p-6 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(event) => scheduleQueryUpdate(event.target.value)}
          placeholder="Search AWB, tracking ID, reference, client"
          aria-label="Search shipments"
          className="app-input w-full pl-11 pr-4 text-sm"
        />
      </div>

      <select
        value={status}
        onChange={(event) => {
          const nextValue = event.target.value;
          setStatus(nextValue);
          updateFilters({ status: nextValue });
        }}
        aria-label="Filter by status"
        className="app-input w-full px-4 text-sm"
      >
        <option value="all">All statuses</option>
        <option value="waiting">Waiting</option>
        <option value="accepted">Accepted</option>
        <option value="pickup_scheduled">Pickup scheduled</option>
        <option value="in_transit">In transit</option>
        <option value="delivered">Delivered</option>
        <option value="rejected">Rejected</option>
        <option value="on_hold">On hold</option>
        <option value="closed">Closed</option>
      </select>

      <select
        value={country}
        onChange={(event) => {
          const nextValue = event.target.value;
          setCountry(nextValue);
          updateFilters({ country: nextValue });
        }}
        aria-label="Filter by country"
        className="app-input w-full px-4 text-sm"
      >
        <option value="">All countries</option>
        {countries.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name} ({item.code})
          </option>
        ))}
      </select>

      <input
        type="date"
        value={from}
        onChange={(event) => {
          const nextValue = event.target.value;
          setFrom(nextValue);
          updateFilters({ from: nextValue });
        }}
        aria-label="Created from"
        className="app-input w-full px-4 text-sm"
      />

      <div className="flex items-center gap-3">
        <input
          type="date"
          value={to}
          onChange={(event) => {
            const nextValue = event.target.value;
            setTo(nextValue);
            updateFilters({ to: nextValue });
          }}
          aria-label="Created to"
          className="app-input min-w-0 flex-1 px-4 text-sm"
        />
        {isPending ? <span className="text-xs font-semibold text-slate-400">Updating...</span> : null}
      </div>
    </div>
  );
}
