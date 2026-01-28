# Headset Markdown Generation Prompt

Use this prompt to generate a new gaming headset markdown file for the **Goop Finder** database. 

---

### **Prompt Instructions for AI:**

"You are a technical product researcher. Generate a comprehensive markdown file for a gaming headset based on the specification below. 

**CRITICAL RULES:**
1. **NO NULLS**: Do not include a field if the value is unknown or it doesn't apply (e.g., don't include `battery_life` for a wired headset). Never set a field to `null`.
2. **ENUMS ONLY**: For fields marked as 'Enum', you MUST use one of the allowed values listed in the schema.
3. **BLOCK STYLE ARRAYS**: List arrays using dashes on new lines (Standard YAML Block Style). No square brackets.
4. **DATES**: The `release_date` must be written as `YYYY-MM-DD` without quotes.
5. **SLUG**: The slug must be the URL-friendly version of the product name (all lowercase, hyphens instead of spaces).

---

### **THE OUTPUT STRUCTURE:**

```markdown
---
# BASIC INFO
name: "Exact Product Name"
brand: "Brand Name"
model: "Model Name" # Optional
price: 199.99 # Number only
image: "direct_image_url.jpg"
image_thumbnail_contain: true # true for cutouts, false for lifestyle
release_date: YYYY-MM-DD
discontinued: false
amazon_product_id: "ASIN_CODE"

# CONNECTIVITY & WIRELESS
connection_types:
    - 2.4GHz Wireless
    - Bluetooth # Enums: 3.5mm, USB-A, USB-C, 2.4GHz Wireless, Bluetooth
battery_life: 40 # Hours (number)
charging_type: "USB-C" # Enums: USB-C, USB-A, Micro-USB, Wireless Charging, Swappable Batteries
wireless_range: 30 # Feet
wireless_latency: 20 # ms

# PLATFORM COMPATIBILITY
platforms:
    - PC
    - PlayStation 5 # Enums: PC, PlayStation 5, PlayStation 4, Xbox Series X|S, Xbox One, Nintendo Switch, Mobile, Steam Deck, VR Headsets
xbox_wireless_native: false

# AUDIO SPECIFICATIONS
driver_size: 40 # mm
driver_type: "Dynamic" # Enums: Dynamic, Planar Magnetic, Electrostatic, Hybrid, Graphene
frequency_response: "20Hz - 22kHz"
impedance: 32 # Ohms
sensitivity: 100 # dB
surround_sound: "Stereo" # Enums: Stereo, Virtual 5.1, Virtual 7.1, True 7.1, Dolby Atmos, DTS:X, Windows Sonic, THX Spatial Audio, Tempest 3D Audio, Proprietary Spatial
headphone_type: "Closed-back" # Enums: Closed-back, Open-back, Semi-open

# MICROPHONE
microphone_type: "Boom Mic" # Enums: Boom Mic, Retractable Mic, Detachable Mic, Inline Mic, Dual Microphone Array, No Microphone
mic_detachable: true
mic_frequency_response: "100Hz - 10kHz"
mic_features:
    - Noise Cancellation # Enums: Noise Cancellation, AI Noise Cancellation, Pop Filter, Sidetone, Mute Button, Auto-mute, LED Mute Indicator, Broadcast Quality, Beamforming
mic_monitoring: true

# COMFORT & BUILD
ear_cup_design: "Over-ear" # Enums: Over-ear, On-ear
cushion_materials:
    - Memory Foam # Enums: Memory Foam, Gel-infused, Velour, Leatherette, Genuine Leather, Microfiber, Breathable Fabric
build_material: "Plastic" # Enums: Plastic, Steel, Aluminum, PVD-coated Steel, Carbon Fiber
weight: 320 # Grams
comfort_features:
    - Lightweight # Enums: Adjustable Headband, Ski-goggle Suspension, Replaceable Ear Pads, Glasses-friendly, Foldable, Rotating Ear Cups, Lightweight, Reinforced Chassis, Durable Frame

# CONTROLS & FEATURES
onboard_controls:
    - Volume Wheel
    - Mute Button
active_features:
    - Active Noise Cancellation # Enums: Active Noise Cancellation, Transparency Mode, Ambient Sound Mode, Wear Detection, Auto Play/Pause
rgb_lighting: "No Lighting" # Enums: Customizable RGB, Static RGB, Reactive Lighting, No Lighting
special_features:
    - Quick Charge # Enums: Haptic Feedback, Head Tracking, Voice Assistant, Multi-point Connection, Low Latency Mode, Game/Chat Mix, Swappable Batteries, Quick Charge

# SOFTWARE
has_software: true
software_name: "Software Name"
software_features:
    - Custom EQ # Enums: Custom EQ, EQ Presets, Mic Enhancement, Button Remapping, Firmware Updates, Cloud Sync

# CERTIFICATIONS & WARRANTY
certifications:
    - Discord Certified # Enums: Hi-Res Audio, Discord Certified, TeamSpeak Certified, Microsoft Teams Certified, Works with PlayStation, Designed for Xbox, Made for iPhone, Nintendo Licensed
warranty_years: 1
water_resistant: false
ip_rating: "IPX4"

# PACKAGING & ACCESSORIES
included_accessories:
    - USB Dongle
    - Extra Pads
cable_length: 6 # Feet
cable_features:
    - Detachable Cable # Enums: Detachable Cable, Braided Cable, Inline Controls, Y-splitter

# AFFILIATE LINKS
manufacturer_url: "url"

# SEO & METADATA
description: "A 160-character marketing description."
slug: "product-slug-here"
featured: false
best_for:
    - Competitive FPS
    - Console Gaming
fmContentType: headsets
---

## Overview

[Provide a 2-paragraph high-level overview of the headset.]

## Key Features

[Detail 3-5 major selling points.]

## Audio Quality

[Describe the sound signature and technical performance.]

## Comfort & Build

[Describe materials and long-term wearing experience.]

## Verdict

[Final summary and recommendation.]
```"

