import { z, defineCollection } from 'astro:content';

// Constrained feature enums
const COMPATIBILITY = z.enum(['PC', 'PS5', 'PS4', 'Xbox', 'Switch', 'Mobile']);
const CORD_TYPE = z.enum(['wired', 'wireless', 'dual']);
const MICROPHONE_TYPE = z.enum(['boom', 'retractable', 'inline', 'none']);
const NOISE_CANCELLATION = z.enum(['true', 'false', 'active', 'pass through', 'open back']);
const RGB_LIGHTING = z.enum(['true', 'false']);
const SOFTWARE_SUPPORT = z.enum(['none', 'basic', 'advanced']);
const SOFTWARE_APPS = z.enum([
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
]);

const headset = defineCollection({
  type: 'content',
  schema: z.object({
    // Basic Info
    id: z.string(),
    name: z.string(),
    brand: z.string(),
    price: z.number(),
    image: z.string().url(),

    // Technical Specs
    wireless: z.boolean(),
    wired: z.boolean(),
    connectivity: z.array(z.string()),
    battery: z.number().nullable(),
    weight: z.number(),
    driver_size: z.number(),

    // Compatibility (constrained)
    compatibility: z.array(COMPATIBILITY),
    xbox_compatible: z.boolean(),

    // Audio Specs
    surround_sound: z.string(),
    frequency_response: z.string(),
    impedance: z.number(),

    // Microphone (constrained)
    microphone_type: MICROPHONE_TYPE,
    microphone_detachable: z.boolean(),

    // Features (constrained)
    noise_cancellation: NOISE_CANCELLATION.default('false'),
    rgb_lighting: RGB_LIGHTING.default('false'),
    replaceable_earpads: z.boolean(),
    sidetone: z.boolean(),
    
    // Software Support (constrained)
    software_support: SOFTWARE_SUPPORT.default('none'),
    software_app: SOFTWARE_APPS.optional(),

    // Affiliate Links
    amazon: z.string().url().optional(),
    bestbuy: z.string().url().optional(),
    newegg: z.string().url().optional(),
    manufacturer: z.string().url(),

    // SEO
    description: z.string(),
  }),
});

export const collections = {
  headsets: headset,
};