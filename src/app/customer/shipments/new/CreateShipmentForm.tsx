"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Box,
  CalendarDays,
  Globe2,
  Info,
  Loader2,
  Phone,
  Truck,
  User,
  X,
  Zap,
} from "lucide-react";

type CountryOption = {
  id: string;
  code: string;
  name: string;
};

type RouteOption = {
  id: string;
  originCountryId: string;
  destinationCountryId: string;
  originCountry: { code: string; name: string };
  destinationCountry: { code: string; name: string };
};

type WarehouseOption = {
  id: string;
  name: string;
  code: string;
  city: string;
  street1: string;
  phone: string | null;
  countryId: string;
  country: { code: string; name: string };
};

interface CreateShipmentFormProps {
  countries: CountryOption[];
  routes: RouteOption[];
  warehouses: WarehouseOption[];
  mode?: "create" | "schedule";
}

export function CreateShipmentForm({
  countries,
  routes,
  warehouses,
  mode = "create",
}: CreateShipmentFormProps) {
  const router = useRouter();
  const isScheduleMode = mode === "schedule";
  const pickupCountryOptions = countries.filter((country) => country.code !== "IN");
  const defaultPickupCountryId = pickupCountryOptions[0]?.id ?? countries[0]?.id ?? "";
  const defaultDestinationCountryId =
    countries.find((country) => country.code === "IN")?.id ??
    countries.find((country) => country.id !== defaultPickupCountryId)?.id ??
    countries[0]?.id ??
    "";
  const [loading, setLoading] = useState(false);
  const [collectionType, setCollectionType] = useState<"PICKUP" | "WAREHOUSE_DROP">("PICKUP");
  const [pickupCountryId, setPickupCountryId] = useState(defaultPickupCountryId);
  const [destinationCountryId, setDestinationCountryId] = useState(defaultDestinationCountryId);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupPhone, setPickupPhone] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const availableWarehouses = warehouses;
  const [warehouseId, setWarehouseId] = useState(availableWarehouses[0]?.id ?? "");

  useEffect(() => {
    if (collectionType !== "WAREHOUSE_DROP") return;

    const warehouseStillAvailable = availableWarehouses.some(
      (warehouse) => warehouse.id === warehouseId,
    );

    if (!warehouseStillAvailable) {
      setWarehouseId(availableWarehouses[0]?.id ?? "");
    }
  }, [collectionType, availableWarehouses, warehouseId]);

  useEffect(() => {
    if (!pickupCountryId || !destinationCountryId || pickupCountryId !== destinationCountryId) {
      return;
    }

    const nextDestinationCountryId =
      countries.find((country) => country.id !== pickupCountryId)?.id ?? "";

    if (nextDestinationCountryId && nextDestinationCountryId !== destinationCountryId) {
      setDestinationCountryId(nextDestinationCountryId);
    }
  }, [countries, destinationCountryId, pickupCountryId]);

  const hasSupportedLane = routes.some(
    (route) =>
      route.originCountryId === pickupCountryId &&
      route.destinationCountryId === destinationCountryId,
  );

  const selectedOrigin = countries.find((country) => country.id === pickupCountryId);
  const selectedDestination = countries.find(
    (country) => country.id === destinationCountryId,
  );
  const selectedWarehouse = availableWarehouses.find((warehouse) => warehouse.id === warehouseId);
  const heroTone = isScheduleMode
    ? "border-blue-200 bg-gradient-to-r from-blue-50 via-white to-orange-50"
    : "border-orange-200 bg-gradient-to-r from-orange-50 via-white to-slate-50";
  const heroIconTone = isScheduleMode ? "bg-blue-600 text-white" : "bg-orange-600 text-white";
  const isPickupDateRequired = collectionType === "PICKUP" || isScheduleMode;

  const canSubmit =
    Boolean(acceptedTerms) &&
    (!isPickupDateRequired || Boolean(pickupDate)) &&
    (collectionType === "PICKUP" || (collectionType === "WAREHOUSE_DROP" && Boolean(warehouseId)));

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      collectionType: formData.get("collectionType"),
      pickupCountryId: formData.get("pickupCountryId"),
      destinationCountryId: formData.get("destinationCountryId"),
      warehouseId: formData.get("warehouseId"),
      pickupDate: formData.get("pickupDate"),
      pickupPhone: formData.get("pickupPhone"),
      pickupLocation: formData.get("pickupLocation"),
      pickupCity: formData.get("pickupCity"),
      destinationLocation: formData.get("destinationLocation"),
      destinationCity: formData.get("destinationCity"),
      receiverName: formData.get("receiverName"),
      receiverPhone: formData.get("receiverPhone"),
      referenceNo: formData.get("referenceNo"),
      pcs: formData.get("pcs"),
      weight: formData.get("weight"),
      description: formData.get("description"),
      declaredValue: formData.get("declaredValue"),
    };

    try {
      const response = await fetch("/api/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Failed to ${isScheduleMode ? "schedule" : "create"} shipment.`);
      }

      router.push(isScheduleMode ? "/customer/dashboard" : "/customer/shipments");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : `Failed to ${isScheduleMode ? "schedule" : "create"} shipment.`,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto min-h-full max-w-[1520px] p-4 sm:p-6 lg:p-8">
      <div className="mb-8 rounded-[28px] border border-slate-200/80 bg-gradient-to-r from-white via-[#fbfcff] to-[#f4f8ff] px-6 py-5 shadow-[0_16px_42px_rgba(15,23,42,0.06)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#1e4b7a]">Customer Workspace</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 lg:text-[2.1rem]">
          {isScheduleMode ? "Schedule Shipment" : "Create New Shipment"}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          {isScheduleMode
            ? "Plan a pickup slot or warehouse drop, then review upcoming schedules from the Overview panel."
            : "Book your international delivery with enterprise-grade intelligence."}
        </p>
      </div>

      <div className={`app-card mb-6 overflow-hidden border ${heroTone} shadow-[0_18px_44px_rgba(30,75,122,0.08)]`}>
        <div className="h-1 bg-gradient-to-r from-[#1e4b7a] via-[#7fb0ff] to-[#fe6801]" />
        <div className="p-5 lg:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${heroIconTone}`}>
                {isScheduleMode ? <CalendarDays className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  {isScheduleMode ? "Plan an upcoming shipment slot" : "Create a shipment request"}
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                  {isScheduleMode
                    ? "Choose pickup or warehouse drop, set the shipment date, and let the dashboard track upcoming scheduled requests."
                    : "Create a shipment entry with route, package, and receiver details so operations can start processing it."}
                </p>
              </div>
            </div>

            <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:min-w-[420px]">
              <div className="rounded-[22px] border border-white/80 bg-white/80 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <p className="font-semibold text-slate-900">
                  {isScheduleMode ? "Best for future pickups" : "Best for immediate requests"}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {isScheduleMode
                    ? "Shows directly in Overview under upcoming shipment dates."
                    : "Sends a full shipment request into the customer and admin shipment lists."}
                </p>
              </div>
              <div className="rounded-[22px] border border-white/80 bg-white/80 px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <p className="font-semibold text-slate-900">
                  {isScheduleMode ? "Requires schedule date" : "Includes full shipment details"}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {isScheduleMode
                    ? "Pickup or warehouse drop date is required before submit."
                    : collectionType === "WAREHOUSE_DROP"
                      ? "Warehouse drop date is optional in create mode."
                      : "Receiver, package, and route data are collected in one flow."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
        <div className="space-y-6">
          <section className="app-card overflow-hidden rounded-[28px] border border-slate-200/80 shadow-[0_18px_44px_rgba(15,23,42,0.06)]">
            <div className="h-1.5 bg-gradient-to-r from-[#1e4b7a] via-[#7fb0ff] to-[#fe6801]" />
            <div className="p-7 lg:p-8">
              <div className="mb-6 flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isScheduleMode ? "bg-blue-100" : "bg-orange-100"}`}>
                  <Globe2 className={`h-5 w-5 ${isScheduleMode ? "text-blue-700" : "text-orange-700"}`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                    {isScheduleMode ? "1. Route & Schedule" : "1. Route & Order Details"}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Choose route, collection mode, and shipment timing.
                  </p>
                </div>
              </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <label
                className={`cursor-pointer rounded-[22px] border px-5 py-5 transition-all ${
                  collectionType === "PICKUP"
                    ? "border-blue-300 bg-blue-50 shadow-[0_12px_28px_rgba(30,75,122,0.08)]"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="collectionType"
                  value="PICKUP"
                  checked={collectionType === "PICKUP"}
                  onChange={() => setCollectionType("PICKUP")}
                  className="sr-only"
                />
                <p className="text-base font-semibold text-slate-900">Pickup</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Our team will collect the shipment from your address.
                </p>
              </label>

              <label
                className={`cursor-pointer rounded-[22px] border px-5 py-5 transition-all ${
                  collectionType === "WAREHOUSE_DROP"
                    ? "border-orange-300 bg-orange-50 shadow-[0_12px_28px_rgba(254,104,1,0.10)]"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                <input
                  type="radio"
                  name="collectionType"
                  value="WAREHOUSE_DROP"
                  checked={collectionType === "WAREHOUSE_DROP"}
                  onChange={() => {
                    setCollectionType("WAREHOUSE_DROP");
                    setWarehouseId(availableWarehouses[0]?.id ?? "");
                    if (availableWarehouses[0]?.countryId) {
                      setPickupCountryId(availableWarehouses[0].countryId);
                    }
                  }}
                  className="sr-only"
                />
                <p className="text-base font-semibold text-slate-900">Warehouse Drop</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Select a company warehouse and schedule your drop there.
                </p>
              </label>
            </div>

            {collectionType === "PICKUP" ? (
              <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Pickup Country *
                  </label>
                  <select
                    name="pickupCountryId"
                    value={pickupCountryId}
                    onChange={(event) => {
                      const nextPickupCountryId = event.target.value;
                      setPickupCountryId(nextPickupCountryId);

                      if (nextPickupCountryId === destinationCountryId) {
                        const nextDestinationCountryId =
                          countries.find((country) => country.id !== nextPickupCountryId)?.id ?? "";

                        if (nextDestinationCountryId) {
                          setDestinationCountryId(nextDestinationCountryId);
                        }
                      }
                    }}
                    className="app-input w-full px-4 text-sm font-medium"
                  >
                    {pickupCountryOptions.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Destination Country *
                  </label>
                  <select
                    name="destinationCountryId"
                    value={destinationCountryId}
                    onChange={(event) => {
                      const nextDestinationCountryId = event.target.value;

                      if (nextDestinationCountryId === pickupCountryId) {
                        return;
                      }

                      setDestinationCountryId(nextDestinationCountryId);
                    }}
                    className="app-input w-full px-4 text-sm font-medium"
                  >
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Warehouse *
                  </label>
                  <input
                    type="hidden"
                    name="pickupCountryId"
                    value={selectedWarehouse?.countryId || pickupCountryId}
                  />
                  {availableWarehouses.length === 0 ? (
                    <div className="rounded-[18px] border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500">
                      No active warehouses are available for this country.
                    </div>
                  ) : (
                    <select
                      name="warehouseId"
                      value={warehouseId}
                      onChange={(event) => {
                        const nextWarehouseId = event.target.value;
                        setWarehouseId(nextWarehouseId);
                        const nextWarehouse = availableWarehouses.find(
                          (warehouse) => warehouse.id === nextWarehouseId,
                        );
                        if (nextWarehouse?.countryId) {
                          setPickupCountryId(nextWarehouse.countryId);
                        }
                      }}
                      className="app-input w-full px-4 text-sm font-medium"
                    >
                      <option value="" disabled>
                        Select warehouse
                      </option>
                      {availableWarehouses.map((warehouse) => (
                        <option key={warehouse.id} value={warehouse.id}>
                          {warehouse.name} ({warehouse.code}) - {warehouse.city}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Destination Country *
                  </label>
                  <select
                    name="destinationCountryId"
                    value={destinationCountryId}
                    onChange={(event) => {
                      const nextDestinationCountryId = event.target.value;

                      if (nextDestinationCountryId === pickupCountryId) {
                        return;
                      }

                      setDestinationCountryId(nextDestinationCountryId);
                    }}
                    className="app-input w-full px-4 text-sm font-medium"
                  >
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

              <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {collectionType === "WAREHOUSE_DROP"
                      ? "Drop Date (Optional)"
                      : isScheduleMode
                        ? "Pickup Date *"
                        : "Pickup Date *"}
                  </label>
                  <input
                    name="pickupDate"
                    type="date"
                    required={isPickupDateRequired}
                    value={pickupDate}
                    onChange={(event) => setPickupDate(event.target.value)}
                    className="app-input w-full px-4 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Reference Number (Optional)
                  </label>
                  <input
                    name="referenceNo"
                    type="text"
                    placeholder="Optional client reference"
                    className="app-input w-full px-4 text-sm font-medium"
                  />
                </div>
            </div>

            {collectionType === "PICKUP" ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Pickup Contact Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="pickupPhone"
                      required
                      placeholder="Pickup contact number"
                      className="app-input w-full pl-11 pr-4 text-sm font-medium"
                      value={pickupPhone}
                      onChange={(event) => setPickupPhone(event.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Pickup City *
                  </label>
                  <input
                    name="pickupCity"
                    required
                    placeholder="Pickup city"
                    className="app-input w-full px-4 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Full Pickup Address *
                  </label>
                  <textarea
                    name="pickupLocation"
                    required
                    rows={3}
                    placeholder="Street, building, apartment, pickup note"
                    className="app-textarea min-h-[108px] w-full resize-none p-4 text-sm font-medium"
                  />
                </div>
              </div>
            ) : (
              <>
                <input type="hidden" name="pickupLocation" value={selectedWarehouse?.street1 || ""} />
                <input type="hidden" name="pickupCity" value={selectedWarehouse?.city || ""} />
                <input type="hidden" name="destinationCity" value="" />
                <input type="hidden" name="destinationLocation" value="" />
              </>
            )}
            </div>
          </section>

          <section className="app-card overflow-hidden rounded-[28px] border border-orange-200/70 shadow-[0_18px_44px_rgba(254,104,1,0.08)]">
            <div className="h-1.5 bg-gradient-to-r from-[#fe6801] via-[#ffb76b] to-[#1e4b7a]" />
            <div className="p-7 lg:p-8">
              <div className="mb-6 flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isScheduleMode ? "bg-blue-100" : "bg-orange-100"}`}>
                  <Box className={`h-5 w-5 ${isScheduleMode ? "text-blue-700" : "text-orange-700"}`} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                    2. Package Details
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Quantity, weight, declared value, and content notes.
                  </p>
                </div>
              </div>

            <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                <div className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    PCS *
                  </label>
                  <input
                  name="pcs"
                  type="number"
                  min="1"
                  required
                  placeholder="1"
                  className="app-input w-full px-4 text-sm font-medium"
                  />
                </div>

                <div className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Weight (KG) (Optional)
                  </label>
                  <input
                    name="weight"
                    type="number"
                    min="0.1"
                    step="0.01"
                    placeholder="0.00"
                    className="app-input w-full px-4 text-sm font-medium"
                  />
                  <p className="mt-2 text-[11px] leading-5 text-slate-500">
                    Actual weight is optional when booking. You can add it later if needed.
                  </p>
                </div>

                <div className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Declared Value (Optional)
                  </label>
                  <input
                    name="declaredValue"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="app-input w-full px-4 text-sm font-medium"
                  />
                </div>
            </div>

            <div className="rounded-[20px] border border-slate-100 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Contents Description (Optional)
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="e.g. Electronics, cotton garments, handling notes"
                className="app-textarea min-h-[136px] w-full resize-none p-4 text-sm font-medium"
              />
            </div>
            </div>
          </section>

          {collectionType === "PICKUP" ? (
            <section className="app-card overflow-hidden rounded-[28px] border border-blue-200/70 shadow-[0_18px_44px_rgba(30,75,122,0.06)]">
              <div className="h-1.5 bg-gradient-to-r from-[#1e4b7a] via-[#7fb0ff] to-[#fe6801]" />
              <div className="p-7 lg:p-8">
                <div className="mb-6 flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isScheduleMode ? "bg-blue-100" : "bg-orange-100"}`}>
                    <User className={`h-5 w-5 ${isScheduleMode ? "text-blue-700" : "text-orange-700"}`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                      3. Receiver Details
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      Receiver details are required for pickup bookings and shipment handoff.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Receiver Name *
                  </label>
                  <input
                    name="receiverName"
                    required
                    placeholder="Receiver full name"
                    className="app-input w-full px-4 text-sm font-medium"
                  />
                </div>

                <div className="rounded-[20px] border border-slate-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Receiver Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      name="receiverPhone"
                      required
                      placeholder="Receiver contact number"
                      className="app-input w-full pl-11 pr-4 text-sm font-medium"
                    />
                  </div>
                </div>
                </div>
              </div>
            </section>
          ) : (
            <>
              <input type="hidden" name="receiverName" value="" />
              <input type="hidden" name="receiverPhone" value="" />
              <input type="hidden" name="pickupPhone" value={selectedWarehouse?.phone || ""} />
            </>
          )}

          <section className="app-card overflow-hidden rounded-[28px] border border-slate-200/80 shadow-[0_18px_44px_rgba(15,23,42,0.05)]">
            <div className="h-1 bg-gradient-to-r from-slate-300 via-blue-200 to-orange-300" />
            <div className="p-6 lg:p-7">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center">
                  <input
                    id="termsAcceptance"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(event) => setAcceptedTerms(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#1e4b7a] focus:ring-[#1e4b7a]"
                  />
                </div>
                <label htmlFor="termsAcceptance" className="cursor-pointer text-sm leading-6 text-slate-600">
                  By booking this shipment, I agree to the{" "}
                  <Link href="/terms" className="font-semibold text-[#1e4b7a] underline">
                    Terms of Service
                  </Link>
                  ,{" "}
                  <Link href="/privacy" className="font-semibold text-[#1e4b7a] underline">
                    Privacy Policy
                  </Link>
                  , and{" "}
                  <Link href="/fraud-awareness" className="font-semibold text-[#1e4b7a] underline">
                    Fraud Awareness and Security Disclaimer
                  </Link>
                  .
                </label>
              </div>
            </div>
          </section>

          <div className="app-card flex flex-col gap-3 rounded-[28px] border border-slate-200/80 px-5 py-4 shadow-[0_16px_36px_rgba(15,23,42,0.05)] sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="app-button-secondary inline-flex h-12 items-center justify-center gap-2 px-5 text-sm font-semibold text-slate-600 transition-all hover:-translate-y-0.5 hover:text-slate-900"
            >
              <X className="h-4 w-4" /> Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="app-button-primary flex h-12 items-center justify-center gap-3 px-6 text-sm font-semibold shadow-[0_14px_30px_rgba(30,75,122,0.18)] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {isScheduleMode ? "Confirm Schedule" : "Confirm & Book Shipment"}{" "}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <aside className="w-full space-y-5 xl:sticky xl:top-24 xl:self-start">
          <div className="app-card relative overflow-hidden p-6">
            <div className="relative z-10 mb-6 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isScheduleMode ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                <Zap className="h-5 w-5" />
              </div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-900">
                {isScheduleMode ? "Schedule Intel" : "Shipment Intel"}
              </h2>
            </div>

            <div className="relative z-10 grid gap-4">
              <div className="app-card-subtle p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Route
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-orange-100 bg-white px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      From
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {selectedOrigin?.code || "--"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedOrigin?.name || "Pickup"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-orange-100 bg-white px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                      To
                    </p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {selectedDestination?.code || "--"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedDestination?.name || "Destination"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="app-card-subtle p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Collection Mode
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {collectionType === "PICKUP"
                    ? "Customer pickup address"
                    : selectedWarehouse
                      ? `${selectedWarehouse.name}, ${selectedWarehouse.city}`
                      : "Select warehouse"}
                </p>
              </div>

              <div className="app-card-subtle p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Schedule
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {pickupDate
                    ? `${collectionType === "WAREHOUSE_DROP" ? "Drop" : "Pickup"} planned for ${pickupDate}`
                    : collectionType === "WAREHOUSE_DROP" && !isScheduleMode
                      ? "Drop date is optional for warehouse drop"
                      : "Choose a shipment date"}
                </p>
              </div>

              <div className="app-card-subtle p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Route Status
                </p>
                <p className="text-sm font-medium text-slate-900">
                  {hasSupportedLane ? "Supported lane available" : "Lane pending admin route setup"}
                </p>
              </div>

              <div className="app-card-subtle flex items-start gap-3 p-4">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-blue-600">
                  <Truck className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium leading-6 text-slate-700">
                  {isScheduleMode
                    ? "Scheduled shipments appear in Overview under upcoming shipment dates."
                    : "Shipment appears in admin immediately after submit."}
                </span>
              </div>
            </div>
          </div>

          <div className="app-card p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
                <Info className="h-5 w-5 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900">What Happens Next</h3>
            </div>

            <div className="space-y-4 text-sm leading-6 text-slate-600">
              <p>1. Your shipment request is saved with the selected schedule.</p>
              <p>2. Operations can review, assign AWB, and update tracking notes.</p>
              <p>3. Upcoming scheduled requests appear in the customer dashboard overview.</p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

