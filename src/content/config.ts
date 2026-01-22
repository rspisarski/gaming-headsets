import { z, defineCollection } from 'astro:content';

// ============================================================================
// ENUMS - Single source of truth for all filterable values
// ============================================================================

// 1. Connectivity & Wireless
export const CONNECTION_TYPE = [
  '3.5mm',
  'USB-A',
  'USB-C',
  '2.4GHz Wireless',
  'Bluetooth',
] as const;

export const CHARGING_TYPE = [
  'USB-C',
  'USB-A',
  'Micro-USB',
  'Wireless Charging'
] as const;

// 2. Platform Compatibility
export const PLATFORM = [
  'PC',
  'PlayStation 5',
  'PlayStation 4',
  'Xbox Series X|S',
  'Xbox One',
  'Nintendo Switch',
  'Mobile',
  'Steam Deck',
  'VR Headsets'
] as const;

// 3. Audio Specifications
export const DRIVER_TYPE = [
  'Dynamic',
  'Planar Magnetic',
  'Electrostatic',
  'Hybrid',
  'Graphene'
] as const;

export const SURROUND_SOUND_TYPE = [
  'Stereo',
  'Virtual 5.1',
  'Virtual 7.1',
  'True 7.1',
  'Dolby Atmos',
  'DTS:X',
  'Windows Sonic',
  'THX Spatial Audio',
  'Tempest 3D Audio',
  'Proprietary Spatial'
] as const;

export const HEADPHONE_TYPE = [
  'Closed-back',
  'Open-back',
  'Semi-open'
] as const;

// 4. Microphone
export const MICROPHONE_TYPE = [
  'Boom Mic',
  'Retractable Mic',
  'Detachable Mic',
  'Inline Mic',
  'Dual Microphone Array',
  'No Microphone'
] as const;

export const MIC_FEATURE = [
  'Noise Cancellation',
  'AI Noise Cancellation',
  'Pop Filter',
  'Sidetone',
  'Mute Button',
  'Auto-mute',
  'LED Mute Indicator',
  'Broadcast Quality',
  'Beamforming'
] as const;

// 5. Comfort & Build
export const EAR_CUP_DESIGN = [
  'Over-ear',
  'On-ear'
] as const;

export const CUSHION_MATERIAL = [
  'Memory Foam',
  'Gel-infused',
  'Velour',
  'Leatherette',
  'Genuine Leather',
  'Microfiber',
  'Breathable Fabric'
] as const;

export const BUILD_MATERIAL = [
  'Plastic',
  'Steel',
  'Aluminum',
  'PVD-coated Steel',
  'Carbon Fiber'
] as const;

export const COMFORT_FEATURE = [
  'Adjustable Headband',
  'Ski-goggle Suspension',
  'Replaceable Ear Pads',
  'Glasses-friendly',
  'Foldable',
  'Rotating Ear Cups',
  'Lightweight',
  'Reinforced Chassis',
  'Durable Frame'
] as const;

// 6. Advanced Features
export const ACTIVE_FEATURE = [
  'Active Noise Cancellation',
  'Transparency Mode',
  'Ambient Sound Mode',
  'Wear Detection',
  'Auto Play/Pause'
] as const;

export const RGB_OPTION = [
  'Customizable RGB',
  'Static RGB',
  'Reactive Lighting',
  'No Lighting'
] as const;

export const SPECIAL_FEATURE = [
  'Haptic Feedback',
  'Head Tracking',
  'Voice Assistant',
  'Multi-point Connection',
  'Low Latency Mode',
  'Game/Chat Mix',
  'Swappable Batteries',
  'Quick Charge'
] as const;

// 7. Software
export const SOFTWARE_FEATURE = [
  'Custom EQ',
  'EQ Presets',
  'Mic Enhancement',
  'Button Remapping',
  'Firmware Updates',
  'Cloud Sync'
] as const;

// 8. Certifications
export const CERTIFICATION = [
  'Hi-Res Audio',
  'Discord Certified',
  'TeamSpeak Certified',
  'Microsoft Teams Certified',
  'Works with PlayStation',
  'Designed for Xbox',
  'Made for iPhone',
  'Nintendo Licensed'
] as const;

// 9. Accessories
export const ACCESSORY = [
  'Carrying Case',
  'USB Dongle',
  'USB Cable',
  'Audio Cable',
  'Console Adapters',
  'Extra Ear Pads',
  'Mic Windscreen'
] as const;

export const CABLE_FEATURE = [
  'Detachable Cable',
  'Braided Cable',
  'Inline Controls',
  'Y-splitter'
] as const;

// Price categories (for filtering)
export const PRICE_CATEGORY = [
  'Budget',      // $0-75
  'Value',       // $75-150
  'Mid-range',   // $150-250
  'Premium',     // $250-400
  'Flagship'     // $400+
] as const;

// ============================================================================
// MAIN SCHEMA
// ============================================================================

const headsetCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // ========================================================================
    // BASIC INFO
    // ========================================================================
    name: z.string(),
    brand: z.string(),
    model: z.string().optional(), // e.g., "Arctis Nova 7"
    price: z.number(),
    image: z.string().url(),
    release_date: z.string().optional(), // ISO date string
    discontinued: z.boolean().default(false),

    // ========================================================================
    // CONNECTIVITY & WIRELESS
    // ========================================================================
    connection_types: z.array(z.enum(CONNECTION_TYPE)),
    // Examples: ['USB-C', 'Bluetooth', '3.5mm']

    // Wireless-specific (null if wired-only)
    battery_life: z.number().nullable().optional(), // hours
    charging_type: z.enum(CHARGING_TYPE).nullable().optional(),
    wireless_range: z.number().nullable().optional(), // feet
    wireless_latency: z.number().nullable().optional(), // ms

    // ========================================================================
    // PLATFORM COMPATIBILITY
    // ========================================================================
    platforms: z.array(z.enum(PLATFORM)),
    // Examples: ['PC', 'PlayStation 5', 'Xbox Series X|S']

    xbox_wireless_native: z.boolean().default(false),
    // Whether it has native Xbox wireless (not just USB)

    // ========================================================================
    // AUDIO SPECIFICATIONS
    // ========================================================================
    driver_size: z.number().optional(), // mm
    driver_type: z.enum(DRIVER_TYPE).optional(),
    frequency_response: z.string().optional(), // "20Hz - 20kHz"
    impedance: z.number().optional(), // ohms
    sensitivity: z.number().optional(), // dB SPL/mW

    surround_sound: z.enum(SURROUND_SOUND_TYPE),
    headphone_type: z.enum(HEADPHONE_TYPE),

    // ========================================================================
    // MICROPHONE
    // ========================================================================
    microphone_type: z.enum(MICROPHONE_TYPE),
    mic_detachable: z.boolean().default(false),
    mic_frequency_response: z.string().optional(), // "100Hz - 10kHz"
    mic_features: z.array(z.enum(MIC_FEATURE)).default([]),

    // ========================================================================
    // COMFORT & BUILD
    // ========================================================================
    ear_cup_design: z.enum(EAR_CUP_DESIGN),
    cushion_materials: z.array(z.enum(CUSHION_MATERIAL)).optional(),
    // Can have multiple cushion options (e.g., leatherette + velour included)

    build_material: z.enum(BUILD_MATERIAL),
    weight: z.number().optional(), // grams

    comfort_features: z.array(z.enum(COMFORT_FEATURE)).default([]),

    // ========================================================================
    // CONTROLS & FEATURES
    // ========================================================================
    onboard_controls: z.array(z.string()).optional(),
    // Examples: ['Volume Wheel', 'Mute Button', 'Game/Chat Mix']

    active_features: z.array(z.enum(ACTIVE_FEATURE)).default([]),
    rgb_lighting: z.enum(RGB_OPTION).default('No Lighting'),
    special_features: z.array(z.enum(SPECIAL_FEATURE)).default([]),

    // ========================================================================
    // SOFTWARE & CUSTOMIZATION
    // ========================================================================
    has_software: z.boolean().default(false),
    software_name: z.string().optional(), // "Razer Synapse", "G Hub"
    software_features: z.array(z.enum(SOFTWARE_FEATURE)).default([]),

    // ========================================================================
    // CERTIFICATIONS & WARRANTY
    // ========================================================================
    certifications: z.array(z.enum(CERTIFICATION)).default([]),
    warranty_years: z.number().default(1),

    // Durability
    water_resistant: z.boolean().default(false),
    ip_rating: z.string().nullable().optional(), // "IPX4"

    // ========================================================================
    // PACKAGING & ACCESSORIES
    // ========================================================================
    included_accessories: z.array(z.enum(ACCESSORY)).default([]),
    cable_length: z.number().nullable().optional(), // feet (for wired)
    cable_features: z.array(z.enum(CABLE_FEATURE)).default([]),

    // ========================================================================
    // AFFILIATE LINKS
    // ========================================================================
    amazon_us: z.string().url().optional(),
    amazon_ca: z.string().url().optional(),
    amazon_uk: z.string().url().optional(),
    bestbuy: z.string().url().optional(),
    newegg: z.string().url().optional(),
    manufacturer_url: z.string().url(),

    // ========================================================================
    // SEO & METADATA
    // ========================================================================
    description: z.string(), // Meta description
    slug: z.string().optional(), // Auto-generated from filename if not provided

    // For content organization
    featured: z.boolean().default(false),
    best_for: z.array(z.string()).optional(),
    // Examples: ['Competitive FPS', 'Streaming', 'Console Gaming']
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.string(),
    image: z.string().url(),
    author: z.string().optional(),
    published: z.date(),
    updated: z.date().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  headsets: headsetCollection,
  blog: blogCollection,
};

// ============================================================================
// UTILITY FUNCTIONS FOR FILTERING
// ============================================================================

/**
 * Get price category from price value
 */
export function getPriceCategory(price: number): typeof PRICE_CATEGORY[number] {
  if (price < 75) return 'Budget';
  if (price < 150) return 'Value';
  if (price < 250) return 'Mid-range';
  if (price < 400) return 'Premium';
  return 'Flagship';
}

/**
 * Check if headset has wireless connectivity
 */
export function isWireless(connectionTypes: string[]): boolean {
  return connectionTypes.some(type =>
    type === '2.4GHz Wireless' || type === 'Bluetooth'
  );
}

/**
 * Check if headset has wired connectivity
 */
export function isWired(connectionTypes: string[]): boolean {
  return connectionTypes.some(type =>
    type === '3.5mm' || type === 'USB-A' || type === 'USB-C'
  );
}

/**
 * Get all unique values for a specific enum (for filter generation)
 */
export function getFilterOptions<T extends readonly string[]>(enumArray: T): T[number][] {
  return [...enumArray];
}

// ============================================================================
// TYPE EXPORTS (for TypeScript usage)
// ============================================================================

export type ConnectionType = typeof CONNECTION_TYPE[number];
export type Platform = typeof PLATFORM[number];
export type SurroundSoundType = typeof SURROUND_SOUND_TYPE[number];
export type MicrophoneType = typeof MICROPHONE_TYPE[number];
export type ComfortFeature = typeof COMFORT_FEATURE[number];
// ... export more as needed