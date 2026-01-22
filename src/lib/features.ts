// Comprehensive feature definitions based on features.md categories
export const VALID_FEATURES = {
  // 1. Connectivity & Wireless
  CONNECTION_TYPES: ['3.5mm', 'USB-A', 'USB-C', '2.4GHz Wireless', 'Bluetooth', 'Simultaneous Connections'],
  CHARGING_TYPES: ['USB-C', 'USB-A', 'Micro-USB', 'Wireless Charging'],
  WIRELESS_RANGES: ['10 feet', '20 feet', '30 feet', '40 feet'],
  WIRELESS_FEATURES: ['Quick Charge', 'Swappable Batteries', 'Low Latency'],
  
  // 2. Platform Compatibility
  PLATFORMS: ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X|S', 'Xbox One', 'Nintendo Switch', 'Mobile', 'Steam Deck', 'VR Headsets'],
  XBOX_COMPATIBILITY: ['Native', 'USB Only', 'Not Compatible'],
  
  // 3. Audio Specifications
  DRIVER_TYPES: ['Dynamic', 'Planar Magnetic', 'Electrostatic', 'Hybrid', 'Graphene'],
  SURROUND_SOUND: ['Stereo', 'Virtual 5.1', 'Virtual 7.1', 'True 7.1', 'Dolby Atmos', 'DTS:X 2.0', 'Windows Sonic', 'THX Spatial Audio', 'PlayStation Tempest 3D Audio'],
  HEADPHONE_TYPES: ['Closed-back', 'Open-back', 'Semi-open'],
  
  // 4. Microphone Features
  MICROPHONE_TYPES: ['Boom Mic', 'Retractable Mic', 'Detachable Mic', 'Inline Mic', 'Dual Microphone Array', 'No Microphone'],
  PICKUP_PATTERNS: ['Unidirectional', 'Bidirectional', 'Omnidirectional', 'Cardioid'],
  MICROPHONE_FEATURES: ['Noise Cancellation', 'AI Noise Cancellation', 'Pop Filter', 'Sidetone', 'Mute Button', 'Auto-mute', 'LED Mute Indicator', 'Monitoring', 'Broadcast Quality'],
  
  // 5. Comfort & Build
  EAR_CUP_DESIGNS: ['Over-ear', 'On-ear'],
  CUSHION_MATERIALS: ['Memory Foam', 'Gel-infused', 'Velour', 'Leatherette', 'Genuine Leather', 'Microfiber', 'Hybrid'],
  BUILD_MATERIALS: ['Plastic Frame', 'Steel Frame', 'Aluminum Frame', 'Carbon Fiber'],
  COMFORT_FEATURES: ['Adjustable Headband', 'Ski-goggle Suspension', 'Replaceable Ear Pads', 'Glasses-friendly', 'Foldable', 'Ear Cup Rotation'],
  
  // 6. Advanced Features
  ACTIVE_FEATURES: ['Active Noise Cancellation', 'Transparency Mode', 'Ambient Sound Mode', 'Auto Play/Pause', 'Wear Detection'],
  RGB_LIGHTING: ['Customizable RGB', 'Reactive Lighting', 'No Lighting'],
  SPECIAL_FEATURES: ['Haptic Feedback', 'Head Tracking', 'Biometric Sensors', 'Voice Assistant', 'Multi-point Connection', 'Low Latency Mode', 'Hearing Protection'],
  
  // 7. Software & Customization
  SOFTWARE_FEATURES: ['Companion Software', 'Custom EQ', 'EQ Presets', 'Mic EQ/Enhancement', 'Button Remapping', 'Firmware Updates', 'Cloud Sync', 'Mobile App'],
  SOFTWARE_APPS: ['SteelSeries GG', 'Razer Synapse', 'Logitech G Hub', 'HyperX NGENUITY', 'Corsair iCUE', 'ASTRO Command Center', 'Turtle Beach Audio Hub', 'Beyerdynamic MOSAYC', 'Bose Music', 'JBL QuantumENGINE'],
  
  // 8. Price Categories (for filtering)
  PRICE_CATEGORIES: ['Budget', 'Value', 'Mid-range', 'Premium', 'Flagship']
} as const;

// Feature type definitions
export type ConnectionType = typeof VALID_FEATURES.CONNECTION_TYPES[number];
export type ChargingType = typeof VALID_FEATURES.CHARGING_TYPES[number];
export type WirelessRange = typeof VALID_FEATURES.WIRELESS_RANGES[number];
export type WirelessFeature = typeof VALID_FEATURES.WIRELESS_FEATURES[number];
export type Platform = typeof VALID_FEATURES.PLATFORMS[number];
export type XboxCompatibility = typeof VALID_FEATURES.XBOX_COMPATIBILITY[number];
export type DriverType = typeof VALID_FEATURES.DRIVER_TYPES[number];
export type SurroundSound = typeof VALID_FEATURES.SURROUND_SOUND[number];
export type HeadphoneType = typeof VALID_FEATURES.HEADPHONE_TYPES[number];
export type MicrophoneType = typeof VALID_FEATURES.MICROPHONE_TYPES[number];
export type PickupPattern = typeof VALID_FEATURES.PICKUP_PATTERNS[number];
export type MicrophoneFeature = typeof VALID_FEATURES.MICROPHONE_FEATURES[number];
export type EarCupDesign = typeof VALID_FEATURES.EAR_CUP_DESIGNS[number];
export type CushionMaterial = typeof VALID_FEATURES.CUSHION_MATERIALS[number];
export type BuildMaterial = typeof VALID_FEATURES.BUILD_MATERIALS[number];
export type ComfortFeature = typeof VALID_FEATURES.COMFORT_FEATURES[number];
export type ActiveFeature = typeof VALID_FEATURES.ACTIVE_FEATURES[number];
export type RgbLighting = typeof VALID_FEATURES.RGB_LIGHTING[number];
export type SpecialFeature = typeof VALID_FEATURES.SPECIAL_FEATURES[number];
export type SoftwareFeature = typeof VALID_FEATURES.SOFTWARE_FEATURES[number];
export type SoftwareApp = typeof VALID_FEATURES.SOFTWARE_APPS[number];
export type PriceCategory = typeof VALID_FEATURES.PRICE_CATEGORIES[number];

// Feature priority types
export type FeaturePriority = 'must-have' | 'nice-to-have';
export type FeatureMatch = 'complete' | 'majority' | 'partial' | 'none';

// Feature selection interface
export interface SelectedFeature {
  category: string;
  feature: string;
  value: any;
  priority: FeaturePriority;
}

// Match result interface
export interface MatchResult {
  headsetId: string;
  score: number;
  matchType: FeatureMatch;
  mustHaveMatchCount: number;
  niceToHaveMatchCount: number;
  totalMustHave: number;
  totalNiceToHave: number;
  matchedMustHave: string[];
  matchedNiceToHave: string[];
  missingMustHave: string[];
}

// Validation functions
export function isValidFeature(category: string, feature: string, value: any): boolean {
  switch (category) {
    case 'connection_types':
      return VALID_FEATURES.CONNECTION_TYPES.includes(value);
    case 'charging_type':
      return VALID_FEATURES.CHARGING_TYPES.includes(value);
    case 'wireless_range':
      return VALID_FEATURES.WIRELESS_RANGES.includes(value);
    case 'wireless_features':
      return VALID_FEATURES.WIRELESS_FEATURES.includes(value);
    case 'platforms':
      return VALID_FEATURES.PLATFORMS.includes(value);
    case 'xbox_compatibility':
      return VALID_FEATURES.XBOX_COMPATIBILITY.includes(value);
    case 'driver_types':
      return VALID_FEATURES.DRIVER_TYPES.includes(value);
    case 'surround_sound':
      return VALID_FEATURES.SURROUND_SOUND.includes(value);
    case 'headphone_types':
      return VALID_FEATURES.HEADPHONE_TYPES.includes(value);
    case 'microphone_types':
      return VALID_FEATURES.MICROPHONE_TYPES.includes(value);
    case 'pickup_patterns':
      return VALID_FEATURES.PICKUP_PATTERNS.includes(value);
    case 'microphone_features':
      return VALID_FEATURES.MICROPHONE_FEATURES.includes(value);
    case 'ear_cup_designs':
      return VALID_FEATURES.EAR_CUP_DESIGNS.includes(value);
    case 'cushion_materials':
      return VALID_FEATURES.CUSHION_MATERIALS.includes(value);
    case 'build_materials':
      return VALID_FEATURES.BUILD_MATERIALS.includes(value);
    case 'comfort_features':
      return VALID_FEATURES.COMFORT_FEATURES.includes(value);
    case 'active_features':
      return VALID_FEATURES.ACTIVE_FEATURES.includes(value);
    case 'rgb_lighting':
      return VALID_FEATURES.RGB_LIGHTING.includes(value);
    case 'special_features':
      return VALID_FEATURES.SPECIAL_FEATURES.includes(value);
    case 'software_features':
      return VALID_FEATURES.SOFTWARE_FEATURES.includes(value);
    case 'software_apps':
      return VALID_FEATURES.SOFTWARE_APPS.includes(value);
    case 'price_categories':
      return VALID_FEATURES.PRICE_CATEGORIES.includes(value);
    default:
      return false;
  }
}

// Get all valid values for a feature
export function getValidValues(feature: string): string[] {
  switch (feature) {
    case 'connection_types':
      return [...VALID_FEATURES.CONNECTION_TYPES];
    case 'charging_type':
      return [...VALID_FEATURES.CHARGING_TYPES];
    case 'wireless_range':
      return [...VALID_FEATURES.WIRELESS_RANGES];
    case 'wireless_features':
      return [...VALID_FEATURES.WIRELESS_FEATURES];
    case 'platforms':
      return [...VALID_FEATURES.PLATFORMS];
    case 'xbox_compatibility':
      return [...VALID_FEATURES.XBOX_COMPATIBILITY];
    case 'driver_types':
      return [...VALID_FEATURES.DRIVER_TYPES];
    case 'surround_sound':
      return [...VALID_FEATURES.SURROUND_SOUND];
    case 'headphone_types':
      return [...VALID_FEATURES.HEADPHONE_TYPES];
    case 'microphone_types':
      return [...VALID_FEATURES.MICROPHONE_TYPES];
    case 'pickup_patterns':
      return [...VALID_FEATURES.PICKUP_PATTERNS];
    case 'microphone_features':
      return [...VALID_FEATURES.MICROPHONE_FEATURES];
    case 'ear_cup_designs':
      return [...VALID_FEATURES.EAR_CUP_DESIGNS];
    case 'cushion_materials':
      return [...VALID_FEATURES.CUSHION_MATERIALS];
    case 'build_materials':
      return [...VALID_FEATURES.BUILD_MATERIALS];
    case 'comfort_features':
      return [...VALID_FEATURES.COMFORT_FEATURES];
    case 'active_features':
      return [...VALID_FEATURES.ACTIVE_FEATURES];
    case 'rgb_lighting':
      return [...VALID_FEATURES.RGB_LIGHTING];
    case 'special_features':
      return [...VALID_FEATURES.SPECIAL_FEATURES];
    case 'software_features':
      return [...VALID_FEATURES.SOFTWARE_FEATURES];
    case 'software_apps':
      return [...VALID_FEATURES.SOFTWARE_APPS];
    case 'price_categories':
      return [...VALID_FEATURES.PRICE_CATEGORIES];
    default:
      return [];
  }
}

// Price category calculation function
export function calculatePriceCategory(price: number): string {
  if (price <= 50) return 'Budget';
  if (price <= 100) return 'Value';
  if (price <= 200) return 'Mid-range';
  if (price <= 350) return 'Premium';
  return 'Flagship';
}