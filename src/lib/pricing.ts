import { FeatureMatch } from './features.js';

export const PRICE_TIERS = {
  BUDGET: { min: 0, max: 59.99, label: 'Budget', color: 'green' },
  AFFORDABLE: { min: 60, max: 99.99, label: 'Affordable', color: 'blue' },
  PREMIUM: { min: 100, max: 199.99, label: 'Premium', color: 'purple' },
  ULTRA_PREMIUM: { min: 200, max: Infinity, label: 'Ultra Premium', color: 'gold' }
} as const;

export type PriceTier = keyof typeof PRICE_TIERS;

export function getPriceTier(price: number): PriceTier {
  for (const [tier, config] of Object.entries(PRICE_TIERS)) {
    if (price >= config.min && price <= config.max) {
      return tier as PriceTier;
    }
  }
  return 'BUDGET'; // fallback
}

export function getPriceTierConfig(tier: PriceTier) {
  return PRICE_TIERS[tier];
}

export function getAllPriceTiers() {
  return Object.entries(PRICE_TIERS).map(([key, config]) => ({
    id: key,
    ...config
  }));
}