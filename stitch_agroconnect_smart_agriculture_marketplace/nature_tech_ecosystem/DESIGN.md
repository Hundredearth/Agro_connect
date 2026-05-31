---
name: Nature-Tech Ecosystem
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeec'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#414844'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3f6653'
  primary: '#012d1d'
  on-primary: '#ffffff'
  primary-container: '#1b4332'
  on-primary-container: '#86af99'
  inverse-primary: '#a5d0b9'
  secondary: '#0e6c4a'
  on-secondary: '#ffffff'
  secondary-container: '#a0f4c8'
  on-secondary-container: '#19724f'
  tertiary: '#152b1c'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a4131'
  on-tertiary-container: '#93ad98'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecd4'
  primary-fixed-dim: '#a5d0b9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#274e3d'
  secondary-fixed: '#a0f4c8'
  secondary-fixed-dim: '#85d7ad'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#cee9d3'
  tertiary-fixed-dim: '#b3cdb7'
  on-tertiary-fixed: '#092012'
  on-tertiary-fixed-variant: '#354c3b'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-uppercase:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  margin-mobile: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is built on the "Nature-Tech" philosophy—a harmonious blend of organic growth and digital precision. It is designed to empower a diverse user base, from rural farmers to urban logistics providers, by offering a UI that feels both grounded in the earth and technologically advanced. 

The aesthetic is rooted in **Minimalism** and **Glassmorphism**. By using high-transparency layers and soft blurs, the interface feels lightweight and premium, avoiding the "heavy" industrial feel of traditional enterprise software. The experience should evoke trust, clarity, and vitality, ensuring that complex agricultural data is presented in an approachable, human-centric manner.

## Colors

This design system utilizes a palette inspired by the lifecycle of a crop. The **Deep Forest Green** (#1B4332) serves as the primary anchor, used for high-authority elements and typography to ensure professional rigor. The **Vibrant Sprout Green** (#74C69D) acts as the secondary accent, reserved for primary actions, success states, and growth indicators.

Soft earthy neutrals (#F9F8F6) provide a warm, organic alternative to clinical grays, making the interface feel more inviting in natural lighting conditions. Surface colors should leverage low-opacity whites (e.g., `rgba(255, 255, 255, 0.7)`) to facilitate the glassmorphism effect against these earthy backgrounds.

## Typography

The design system utilizes **Inter** for all levels of the hierarchy to maximize legibility across various mobile screen qualities and lighting environments. 

Headlines use a tighter letter-spacing and heavier weights to command attention, while body text maintains a generous line height (1.5x) to prevent eye fatigue during long sessions of inventory management or data entry. Labels for data points and metadata utilize a semi-bold weight and subtle uppercase styling to differentiate technical information from narrative content.

## Layout & Spacing

This design system follows a **fluid grid** model optimized for mobile-native interactions. It employs an 8px base unit to ensure consistent vertical rhythm. 

On mobile devices, a 4-column layout is standard, featuring generous 24px side margins to accommodate one-handed use and prevent accidental edge-taps. Content blocks and cards are separated by 16px gutters. Spacing between related elements (like an icon and its label) should use the 8px "stack-sm" unit, while distinct sections should be separated by 32px to maintain the clean, minimalist aesthetic.

## Elevation & Depth

Depth is primarily established through **Glassmorphism** and soft, ambient shadows. Rather than using traditional solid-color elevation levels, this design system uses translucent surfaces with a `backdrop-filter: blur(20px)`.

- **Tier 1 (Base):** The earthy neutral background.
- **Tier 2 (Cards/Containers):** White background at 70% opacity with a 1px solid white border at 20% opacity. This creates a "frosted glass" edge.
- **Tier 3 (Overlays/Modals):** Increased backdrop blur (40px) and a soft, diffused shadow (`0px 10px 30px rgba(27, 67, 50, 0.08)`) to lift the component above the main interface.

Shadows must always carry a slight tint of the primary Forest Green to ensure they feel integrated into the natural palette rather than looking like gray "dirt."

## Shapes

The shape language is defined by **Soft Roundedness**, signaling approachability and modern tech. The base radius is 8px (`rounded`), but the primary container style—the glass card—utilizes a 16px (`rounded-lg`) or 24px (`rounded-xl`) corner radius. 

Interactive elements like buttons and input fields should consistently use a 16px radius. This high degree of rounding removes any visual "sharpness," making the tool feel safe and intuitive for all user demographics.

## Components

### Buttons
Primary buttons utilize the Deep Forest Green background with white text. They should have a subtle inner glow (1px top border) to enhance the premium feel. Secondary buttons use the Sprout Green at 15% opacity with Forest Green text.

### Glass Cards
The signature component of this design system. Used for weather updates, crop health stats, and marketplace listings. They feature a 16px corner radius, a semi-transparent white background, and a 20px backdrop blur.

### Input Fields
Inputs are styled with an earthy neutral background (slightly darker than the page base) and a 16px corner radius. On focus, the border transitions to a 1.5px solid Sprout Green.

### Chips & Badges
Small, pill-shaped indicators (32px radius) used for status (e.g., "In Stock," "Harvesting"). Use high-contrast color pairings, such as Deep Forest Green text on a Sprout Green background.

### Navigation
The bottom navigation bar should be a docked glassmorphic element with a high blur, allowing the content to scroll beautifully behind it. Icons should be "duotone" style, using the primary and secondary greens to indicate active states.