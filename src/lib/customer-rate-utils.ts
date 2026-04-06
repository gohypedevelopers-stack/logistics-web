type CustomerOverrideLike = {
  price: number;
};

type RateCardLike = {
  basePrice: number;
  currency: string;
  customerOverrides?: CustomerOverrideLike[];
};

export function getEffectiveCustomerRate(rateCard: RateCardLike) {
  const override = rateCard.customerOverrides?.[0] ?? null;
  const price = override?.price ?? rateCard.basePrice;

  return {
    price,
    currency: rateCard.currency,
    isOverride: Boolean(override),
  };
}

type WarehouseOverrideLike = {
  price: number;
  currency: string;
};

type WarehouseLike = {
  customerRateOverrides?: WarehouseOverrideLike[];
};

export function getEffectiveWarehouseRate(warehouse: WarehouseLike) {
  const override = warehouse.customerRateOverrides?.[0] ?? null;

  return {
    price: override?.price ?? null,
    currency: override?.currency ?? "USD",
    isOverride: Boolean(override),
  };
}
