const deliveryFees: Record<string, number> = {
  "Lusaka CBD": 35,
  Kabulonga: 45,
  Woodlands: 45,
  "Ibex Hill": 55,
  Chilenje: 40,
  Chelstone: 50,
  Matero: 45,
  "Outside Lusaka": 85
};

export function getDeliveryFee(area?: string) {
  if (!area) return 0;
  return deliveryFees[area] ?? 60;
}

export function listDeliveryAreas() {
  return Object.entries(deliveryFees).map(([area, fee]) => ({ area, fee }));
}

