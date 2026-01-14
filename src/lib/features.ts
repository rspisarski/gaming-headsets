// Constrained feature definitions to prevent uncontrolled additions
export const VALID_FEATURES = {
  COMPATIBILITY: ['PC', 'PS5', 'PS4', 'Xbox', 'Switch', 'Mobile'],
  CORD_TYPE: ['wired', 'wireless', 'dual'],
  MICROPHONE_TYPE: ['boom', 'retractable', 'inline', 'none'],
  NOISE_CANCELLATION: ['true', 'false', 'active', 'pass through', 'open back'],
  RGB_LIGHTING: ['true', 'false'],
  SOFTWARE_SUPPORT: ['none', 'basic', 'advanced'],
  SOFTWARE_APPS: [
    'SteelSeries GG',
    'Razer Synapse',
    'Logitech G Hub',
    'HyperX NGENUITY',
    'Corsair iCUE',
    'ASTRO Command Center',
    'Turtle Beach Audio Hub',
    'Beyerdynamic MOSAYC',
    'Bose Music',
    'JBL QuantumENGINE'
  ]
} as const;

// Feature categories for organization
export const FEATURE_CATEGORIES = {
  CONNECTIVITY: ['cord_type', 'microphone_type'],
  PLATFORM: ['compatibility'],
  AUDIO_FEATURES: ['noise_cancellation', 'surround_sound'],
  CUSTOMIZATION: ['rgb_lighting', 'replaceable_earpads'],
  SOFTWARE: ['software_support', 'software_app']
} as const;

// Feature type definitions
export type Compatibility = typeof VALID_FEATURES.COMPATIBILITY[number];
export type CordType = typeof VALID_FEATURES.CORD_TYPE[number];
export type MicrophoneType = typeof VALID_FEATURES.MICROPHONE_TYPE[number];
export type NoiseCancellation = typeof VALID_FEATURES.NOISE_CANCELLATION[number];
export type RgbLighting = typeof VALID_FEATURES.RGB_LIGHTING[number];
export type SoftwareSupport = typeof VALID_FEATURES.SOFTWARE_SUPPORT[number];
export type SoftwareApp = typeof VALID_FEATURES.SOFTWARE_APPS[number];

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
    case 'compatibility':
      return VALID_FEATURES.COMPATIBILITY.includes(value);
    case 'cord_type':
      return VALID_FEATURES.CORD_TYPE.includes(value);
    case 'microphone_type':
      return VALID_FEATURES.MICROPHONE_TYPE.includes(value);
    case 'noise_cancellation':
      return VALID_FEATURES.NOISE_CANCELLATION.includes(value);
    case 'rgb_lighting':
      return VALID_FEATURES.RGB_LIGHTING.includes(value);
    case 'software_support':
      return VALID_FEATURES.SOFTWARE_SUPPORT.includes(value);
    case 'software_app':
      return VALID_FEATURES.SOFTWARE_APPS.includes(value);
    default:
      return false;
  }
}

// Get all valid values for a feature
export function getValidValues(feature: string): string[] {
  switch (feature) {
    case 'compatibility':
      return [...VALID_FEATURES.COMPATIBILITY];
    case 'cord_type':
      return [...VALID_FEATURES.CORD_TYPE];
    case 'microphone_type':
      return [...VALID_FEATURES.MICROPHONE_TYPE];
    case 'noise_cancellation':
      return [...VALID_FEATURES.NOISE_CANCELLATION];
    case 'rgb_lighting':
      return [...VALID_FEATURES.RGB_LIGHTING];
    case 'software_support':
      return [...VALID_FEATURES.SOFTWARE_SUPPORT];
    case 'software_app':
      return [...VALID_FEATURES.SOFTWARE_APPS];
    default:
      return [];
  }
}