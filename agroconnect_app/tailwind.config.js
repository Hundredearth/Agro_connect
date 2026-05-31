/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
              "on-primary-fixed": "#002114",
              "surface-tint": "#3f6653",
              "tertiary-fixed-dim": "#b3cdb7",
              "secondary-fixed": "#a0f4c8",
              "secondary": "#0e6c4a",
              "secondary-container": "#a0f4c8",
              "surface-container-highest": "#e3e2e0",
              "on-secondary-fixed": "#002113",
              "on-tertiary": "#ffffff",
              "primary-container": "#1b4332",
              "on-tertiary-fixed": "#092012",
              "background": "#faf9f7",
              "tertiary-fixed": "#cee9d3",
              "surface": "#faf9f7",
              "on-secondary-fixed-variant": "#005236",
              "on-primary": "#ffffff",
              "on-surface": "#1a1c1b",
              "surface-container-lowest": "#ffffff",
              "on-primary-fixed-variant": "#274e3d",
              "on-error-container": "#93000a",
              "on-primary-container": "#86af99",
              "outline-variant": "#c1c8c2",
              "inverse-primary": "#a5d0b9",
              "error": "#ba1a1a",
              "surface-bright": "#faf9f7",
              "error-container": "#ffdad6",
              "secondary-fixed-dim": "#85d7ad",
              "on-tertiary-fixed-variant": "#354c3b",
              "surface-dim": "#dadad8",
              "inverse-surface": "#2f3130",
              "on-tertiary-container": "#93ad98",
              "on-error": "#ffffff",
              "surface-container-low": "#f4f3f1",
              "inverse-on-surface": "#f1f1ef",
              "tertiary-container": "#2a4131",
              "primary": "#012d1d",
              "on-secondary": "#ffffff",
              "primary-fixed": "#c1ecd4",
              "on-secondary-container": "#19724f",
              "surface-container": "#efeeec",
              "primary-fixed-dim": "#a5d0b9",
              "on-background": "#1a1c1b",
              "surface-container-high": "#e9e8e6",
              "on-surface-variant": "#414844",
              "tertiary": "#152b1c",
              "outline": "#717973",
              "surface-variant": "#e3e2e0"
      },
      "borderRadius": {
              "DEFAULT": "0.25rem",
              "lg": "0.5rem",
              "xl": "0.75rem",
              "full": "9999px"
      },
      "spacing": {
              "gutter": "16px",
              "margin-mobile": "24px",
              "stack-lg": "32px",
              "unit": "8px",
              "stack-sm": "8px",
              "stack-md": "16px"
      },
      "fontFamily": {
              "body-base": ["Inter"],
              "display-lg": ["Inter"],
              "headline-md": ["Inter"],
              "body-sm": ["Inter"],
              "label-uppercase": ["Inter"]
      },
      "fontSize": {
              "body-base": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
              "display-lg": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
              "headline-md": ["24px", {"lineHeight": "32px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
              "body-sm": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
              "label-uppercase": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600"}]
      }
    },
  },
  plugins: [],
}
