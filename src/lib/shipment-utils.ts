import { compareDesc } from "date-fns";

export const SHIPMENT_STATUS_FLOW = [
  "CREATED",
  "WAITING",
  "ACCEPTED",
  "PICKUP_SCHEDULED",
  "PICKED_UP",
  "AT_WAREHOUSE",
  "PROCESSING",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "REJECTED",
] as const;

export const LEGACY_SHIPMENT_STATUS_OPTIONS = [
  "SUBMITTED",
  "ON_HOLD",
] as const;

export const ALL_SHIPMENT_STATUS_OPTIONS = [
  "CREATED",
  "WAITING",
  "SUBMITTED",
  "ACCEPTED",
  "PICKUP_SCHEDULED",
  "PICKED_UP",
  "AT_WAREHOUSE",
  "PROCESSING",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "REJECTED",
  "ON_HOLD",
] as const;

export const LEGACY_STATUS_MAP: Record<string, (typeof SHIPMENT_STATUS_FLOW)[number]> = {
  SUBMITTED: "CREATED",
  ON_HOLD: "WAITING",
};

export const WAITING_STATUSES = new Set(["CREATED", "WAITING"]);
export const TRANSIT_STATUSES = new Set([
  "ACCEPTED",
  "PICKUP_SCHEDULED",
  "PICKED_UP",
  "AT_WAREHOUSE",
  "PROCESSING",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
]);
export const COMPLETED_STATUSES = new Set(["DELIVERED"]);
export const CLOSED_STATUSES = new Set(["DELIVERED", "CANCELLED", "REJECTED"]);

const STATUS_META: Record<
  string,
  {
    label: string;
    customerLabel: string;
    tone: string;
    summary: string;
  }
> = {
  CREATED: {
    label: "Created",
    customerLabel: "Waiting",
    tone: "bg-slate-100 text-slate-700 border-slate-200",
    summary: "Shipment request received.",
  },
  WAITING: {
    label: "Waiting",
    customerLabel: "Waiting",
    tone: "bg-orange-50 text-orange-700 border-orange-200",
    summary: "Awaiting the next operational step.",
  },
  ACCEPTED: {
    label: "Accepted",
    customerLabel: "Accepted",
    tone: "bg-blue-100 text-blue-800 border-blue-200",
    summary: "Shipment accepted by operations.",
  },
  PICKUP_SCHEDULED: {
    label: "Pickup Scheduled",
    customerLabel: "Pickup Scheduled",
    tone: "bg-blue-50 text-blue-700 border-blue-200",
    summary: "Pickup slot is booked.",
  },
  PICKED_UP: {
    label: "Picked Up",
    customerLabel: "Picked Up",
    tone: "bg-teal-50 text-teal-700 border-teal-200",
    summary: "Cargo collected from pickup location.",
  },
  AT_WAREHOUSE: {
    label: "At Warehouse",
    customerLabel: "At Warehouse",
    tone: "bg-teal-50 text-teal-700 border-teal-200",
    summary: "Shipment reached warehouse.",
  },
  PROCESSING: {
    label: "Processing",
    customerLabel: "Processing",
    tone: "bg-slate-100 text-slate-700 border-slate-200",
    summary: "Shipment is being processed.",
  },
  IN_TRANSIT: {
    label: "In Transit",
    customerLabel: "In Transit",
    tone: "bg-blue-50 text-blue-700 border-blue-200",
    summary: "Shipment is moving through the route.",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    customerLabel: "Out for Delivery",
    tone: "bg-sky-50 text-sky-700 border-sky-200",
    summary: "Shipment is with the local delivery team.",
  },
  DELIVERED: {
    label: "Delivered",
    customerLabel: "Delivered",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
    summary: "Shipment delivered successfully.",
  },
  CANCELLED: {
    label: "Cancelled",
    customerLabel: "Cancelled",
    tone: "bg-rose-50 text-rose-700 border-rose-200",
    summary: "Shipment was cancelled.",
  },
  REJECTED: {
    label: "Rejected",
    customerLabel: "Rejected",
    tone: "bg-red-50 text-red-700 border-red-200",
    summary: "Shipment was rejected.",
  },
};

export const CUSTOMER_STATUS_TABS = [
  { id: "all", label: "All Shipments" },
  { id: "ongoing", label: "Ongoing" },
  { id: "completed", label: "Completed" },
  { id: "waiting", label: "Waiting" },
  { id: "accepted", label: "Accepted" },
  { id: "packed", label: "Packed" },
  { id: "in_transit", label: "In Transit" },
  { id: "rejected", label: "Rejected" },
  { id: "on_hold", label: "On Hold" },
  { id: "cancelled", label: "Cancelled" },
] as const;

export function normalizeShipmentStatus(status?: string | null) {
  if (!status) return "CREATED";
  return LEGACY_STATUS_MAP[status] ?? status;
}

export function getShipmentStatusMeta(status?: string | null) {
  const normalized = normalizeShipmentStatus(status);
  return STATUS_META[normalized] ?? STATUS_META.CREATED;
}

export function formatShipmentStatus(status?: string | null, customerFacing = false) {
  const meta = getShipmentStatusMeta(status);
  return customerFacing ? meta.customerLabel : meta.label;
}

export function isWaitingStatus(status?: string | null) {
  return WAITING_STATUSES.has(normalizeShipmentStatus(status));
}

export function isTransitStatus(status?: string | null) {
  return TRANSIT_STATUSES.has(normalizeShipmentStatus(status));
}

export function isDeliveredStatus(status?: string | null) {
  return COMPLETED_STATUSES.has(normalizeShipmentStatus(status));
}

export function isClosedStatus(status?: string | null) {
  return CLOSED_STATUSES.has(normalizeShipmentStatus(status));
}

export function matchCustomerShipmentTab(status: string, tab: string) {
  const normalized = normalizeShipmentStatus(status);

  if (tab === "all") return true;
  if (tab === "ongoing") return isTransitStatus(normalized) || isWaitingStatus(normalized);
  if (tab === "completed") return isDeliveredStatus(normalized);
  if (tab === "waiting") return isWaitingStatus(normalized);
  if (tab === "accepted") return ["ACCEPTED", "PICKUP_SCHEDULED"].includes(normalized);
  if (tab === "packed") return normalized === "PICKUP_SCHEDULED";
  if (tab === "in_transit")
    return ["PICKED_UP", "AT_WAREHOUSE", "PROCESSING", "IN_TRANSIT", "OUT_FOR_DELIVERY"].includes(
      normalized,
    );
  if (tab === "rejected") return normalized === "REJECTED";
  if (tab === "on_hold") return normalized === "WAITING";
  if (tab === "cancelled") return ["CANCELLED", "REJECTED"].includes(normalized);

  return false;
}

export function createTrackingTitle(status?: string | null) {
  switch (normalizeShipmentStatus(status)) {
    case "CREATED":
      return "Shipment created";
    case "WAITING":
      return "Shipment waiting for review";
    case "ACCEPTED":
      return "Shipment accepted";
    case "PICKUP_SCHEDULED":
      return "Pickup scheduled";
    case "PICKED_UP":
      return "Shipment picked up";
    case "AT_WAREHOUSE":
      return "Shipment reached warehouse";
    case "PROCESSING":
      return "Shipment processing completed";
    case "IN_TRANSIT":
      return "Shipment in transit";
    case "OUT_FOR_DELIVERY":
      return "Shipment out for delivery";
    case "DELIVERED":
      return "Shipment delivered";
    case "CANCELLED":
      return "Shipment cancelled";
    case "REJECTED":
      return "Shipment rejected";
    default:
      return "Shipment updated";
  }
}

export function createTrackingSummary(status?: string | null) {
  return getShipmentStatusMeta(status).summary;
}

export type TimelineInput = {
  id: string;
  status?: string | null;
  location?: string | null;
  notes?: string | null;
  note?: string | null;
  title?: string | null;
  createdAt: Date | string;
};

export function buildShipmentTimeline(
  statusHistory: TimelineInput[] = [],
  events: TimelineInput[] = [],
) {
  const historyEntries = statusHistory.map((entry) => {
    const normalized = normalizeShipmentStatus(entry.status);

    return {
      id: `history-${entry.id}`,
      kind: "status" as const,
      status: normalized,
      title: createTrackingTitle(normalized),
      note: entry.notes ?? entry.note ?? createTrackingSummary(normalized),
      location: entry.location ?? null,
      createdAt: new Date(entry.createdAt),
    };
  });

  const eventEntries = events.map((entry) => {
    const normalized = entry.status ? normalizeShipmentStatus(entry.status) : null;

    return {
      id: `event-${entry.id}`,
      kind: "event" as const,
      status: normalized,
      title: entry.title ?? createTrackingTitle(normalized),
      note:
        entry.note ??
        entry.notes ??
        (normalized ? createTrackingSummary(normalized) : null),
      location: entry.location ?? null,
      createdAt: new Date(entry.createdAt),
    };
  });

  return [...historyEntries, ...eventEntries].sort((a, b) =>
    compareDesc(a.createdAt, b.createdAt),
  );
}

export function buildShipmentTrackingId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TRK-${stamp}-${suffix}`;
}

export function buildReferenceNumber() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `REF-${stamp}-${suffix}`;
}
