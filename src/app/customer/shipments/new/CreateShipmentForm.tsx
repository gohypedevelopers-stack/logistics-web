"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Box,
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
}

export function CreateShipmentForm({
  countries,
  routes,
  warehouses,
}: CreateShipmentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [collectionType, setCollectionType] = useState<"PICKUP" | "WAREHOUSE_DROP">("PICKUP");
  const [pickupCountryId, setPickupCountryId] = useState(countries[0]?.id ?? "");
  const [destinationCountryId, setDestinationCountryId] = useState(
    countries[1]?.id ?? countries[0]?.id ?? "",
  );

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

  const canSubmit =
    collectionType === "PICKUP" || (collectionType === "WAREHOUSE_DROP" && Boolean(warehouseId));

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
        throw new Error(result.error || "Failed to create shipment.");
      }

      router.push("/customer/shipments");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create shipment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto min-h-full max-w-[1520px] p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900 lg:text-[2.1rem]">
          Create New Shipment
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Book your international delivery with enterprise-grade intelligence.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
        <div className="space-y-6">
          <section className="app-card p-7 lg:p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100">
                <Globe2 className="w-5 h-5 text-blue-700" />
              </div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                1. Route & Order Details
              </h2>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className={`cursor-pointer rounded-[18px] border px-5 py-4 transition-colors ${
                collectionType === "PICKUP"
                  ? "border-blue-300 bg-blue-50"
                  : "border-slate-200 bg-slate-50"
              }`}>
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

              <label className={`cursor-pointer rounded-[18px] border px-5 py-4 transition-colors ${
                collectionType === "WAREHOUSE_DROP"
                  ? "border-teal-300 bg-teal-50"
                  : "border-slate-200 bg-slate-50"
              }`}>
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
                  Select a company warehouse and drop the shipment there.
                </p>
              </label>
            </div>

            {collectionType === "PICKUP" ? (
              <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Pickup Country
                  </label>
                  <select
                    name="pickupCountryId"
                    value={pickupCountryId}
                    onChange={(event) => {
                      const nextCountryId = event.target.value;
                      setPickupCountryId(nextCountryId);
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

                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Destination Country
                  </label>
                  <select
                    name="destinationCountryId"
                    value={destinationCountryId}
                    onChange={(event) => setDestinationCountryId(event.target.value)}
                    className="app-input w-full px-4 text-sm font-medium"
                  >
                    {countries.map((country) => (
                      <option key={country.id} value={country.id}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Pickup Date
                  </label>
                  <input
                    name="pickupDate"
                    type="date"
                    className="app-input w-full px-4 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Reference Number
                  </label>
                  <input
                    name="referenceNo"
                    type="text"
                    placeholder="Optional client reference"
                    className="app-input w-full px-4 text-sm font-medium"
                  />
                </div>
              </div>
            ) : (
              <>
                <input
                  type="hidden"
                  name="pickupCountryId"
                  value={selectedWarehouse?.countryId || pickupCountryId}
                />
                <input type="hidden" name="destinationCountryId" value={destinationCountryId} />
                <input type="hidden" name="pickupDate" value="" />
                <input type="hidden" name="referenceNo" value="" />
              </>
            )}

            {collectionType === "PICKUP" ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Pickup City
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
                    Full Pickup Address
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
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Select Warehouse
                </label>
                <input type="hidden" name="pickupLocation" value={selectedWarehouse?.street1 || ""} />
                <input type="hidden" name="pickupCity" value={selectedWarehouse?.city || ""} />
                <input type="hidden" name="destinationCity" value="" />
                <input type="hidden" name="destinationLocation" value="" />

                {availableWarehouses.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                    No active warehouses are available for this country.
                  </div>
                ) : (
                  <div className="space-y-3">
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

                  </div>
                )}
              </div>
            )}
          </section>

          <section className="app-card p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100">
                <Box className="w-5 h-5 text-blue-700" />
              </div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                2. Package Details
              </h2>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  PCS
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

              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Weight (KG)
                </label>
                <input
                  name="weight"
                  type="number"
                  min="0.1"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="app-input w-full px-4 text-sm font-medium"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Declared Value
                </label>
                <input
                  name="declaredValue"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="app-input w-full px-4 text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                Contents Description
              </label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="e.g. Electronics, cotton garments, handling notes"
                className="app-textarea min-h-[136px] w-full resize-none p-4 text-sm font-medium"
              />
            </div>
          </section>

          {collectionType === "PICKUP" ? (
            <section className="app-card p-7 lg:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100">
                  <User className="w-5 h-5 text-blue-700" />
                </div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  3. Receiver Details
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Receiver Name
                  </label>
                  <input
                    name="receiverName"
                    required
                    placeholder="Receiver full name"
                    className="app-input w-full px-4 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Receiver Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      name="receiverPhone"
                      required
                      placeholder="Receiver contact number"
                      className="app-input w-full pl-11 pr-4 text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <>
              <input type="hidden" name="receiverName" value="" />
              <input type="hidden" name="receiverPhone" value="" />
            </>
          )}

          <div className="flex items-center justify-between border-t border-slate-200/80 px-1 pt-6 pb-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-800"
            >
              <X className="w-4 h-4" /> Cancel
            </button>

            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="app-button-primary flex h-14 items-center gap-3 px-8 text-sm font-semibold disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Confirm & Book Shipment <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <aside className="w-full space-y-5 xl:sticky xl:top-24 xl:self-start">
          <div className="app-card relative overflow-hidden p-6">
            <div className="relative z-10 mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-semibold tracking-[0.16em] text-slate-900 uppercase">Shipment Intel</h2>
            </div>

            <div className="relative z-10 grid gap-4">
              <div className="app-card-subtle p-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Route
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-indigo-100 bg-white px-4 py-3">
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
                  <div className="rounded-2xl border border-indigo-100 bg-white px-4 py-3">
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
                      ? selectedWarehouse.name
                      : "Select warehouse"}
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
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-sm leading-6 font-medium text-slate-700">
                  Shipment appears in admin immediately after submit
                </span>
              </div>
            </div>
          </div>

          <div className="app-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
                <Info className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="font-semibold text-slate-900">What Happens Next</h3>
            </div>

            <div className="space-y-4 text-sm leading-6 text-slate-600">
              <p>1. Shipment is created and appears immediately in the admin queue.</p>
              <p>2. Operations can assign AWB, update status, and add tracking notes.</p>
              <p>3. Customer dashboard and tracking timeline refresh from the same data.</p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
