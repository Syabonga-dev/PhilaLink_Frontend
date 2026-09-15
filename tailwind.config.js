/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  darkMode: "class",

  theme: {
    extend: {
      colors: {
        /*
         * =====================================================
         * EXISTING PHILALINK THEME
         * =====================================================
         */

        tertiary: "#954920",

        "surface-container-highest":
          "#dee4e3",

        background: "#f5faf9",

        "outline-variant":
          "#bcc9c8",

        "on-tertiary-fixed-variant":
          "#77320a",

        "on-primary-fixed":
          "#002020",

        "secondary-fixed":
          "#9bf1f0",

        "secondary-container":
          "#9bf1f0",

        "primary-fixed":
          "#81f5f4",

        "on-error":
          "#ffffff",

        "on-background":
          "#171d1c",

        primary:
          "#006a6a",

        "tertiary-container":
          "#d97e51",

        "surface-container":
          "#eaefee",

        "on-tertiary-container":
          "#531e00",

        "tertiary-fixed-dim":
          "#ffb694",

        "surface-variant":
          "#dee4e3",

        error:
          "#ba1a1a",

        "on-surface":
          "#171d1c",

        "secondary-fixed-dim":
          "#7fd5d4",

        "tertiary-fixed":
          "#ffdbcc",

        "surface-container-low":
          "#eff5f4",

        "on-surface-variant":
          "#3d4949",

        secondary:
          "#006a6a",

        "surface-bright":
          "#f5faf9",

        "primary-container":
          "#1fa6a6",

        "error-container":
          "#ffdad6",

        "on-primary":
          "#ffffff",

        "inverse-on-surface":
          "#edf2f1",

        "on-primary-fixed-variant":
          "#004f50",

        "on-secondary-container":
          "#007070",

        "on-tertiary-fixed":
          "#351000",

        "surface-tint":
          "#006a6a",

        outline:
          "#6d7a79",

        "surface-dim":
          "#d6dbda",

        "surface-container-lowest":
          "#ffffff",

        "on-primary-container":
          "#003435",

        "on-tertiary":
          "#ffffff",

        "on-secondary-fixed-variant":
          "#004f50",

        "inverse-primary":
          "#63d8d8",

        "inverse-surface":
          "#2c3131",

        "on-secondary":
          "#ffffff",

        success:
          "#2e7d32",

        "success-container":
          "#dcefdd",

        warning:
          "#a15c00",

        "warning-container":
          "#ffe9cc",

        /*
         * =====================================================
         * PATIENT FIGMA THEME
         * =====================================================
         */

        "brand-primary":
          "var(--brand-primary)",

        "brand-hover":
          "var(--brand-hover)",

        "brand-dark":
          "var(--brand-dark)",

        "brand-secondary":
          "var(--brand-secondary)",

        "brand-tertiary":
          "var(--brand-tertiary)",

        "brand-muted":
          "var(--brand-muted)",

        "on-brand":
          "var(--on-brand)",

        accent:
          "var(--accent)",

        "accent-light":
          "var(--accent-light)",

        "surface-bg":
          "var(--surface-bg)",

        "surface-secondary-bg":
          "var(--surface-secondary-bg)",

        "surface-hover":
          "var(--surface-hover)",

        "surface-dark":
          "var(--surface-dark)",

        "input-bg":
          "var(--input-bg)",

        "bg-faint":
          "var(--bg-faint)",

        "bg-subtle":
          "var(--bg-subtle)",

        "bg-hover":
          "var(--bg-hover)",

        "modal-scrim":
          "var(--modal-scrim)",

        "text-primary":
          "var(--text-primary)",

        "text-secondary":
          "var(--text-secondary)",

        "text-tertiary":
          "var(--text-tertiary)",

        "text-disabled":
          "var(--text-disabled)",

        "text-on-dark":
          "var(--text-on-dark)",

        "text-on-dark-secondary":
          "var(--text-on-dark-secondary)",

        "border-primary":
          "var(--border-primary)",

        "border-secondary":
          "var(--border-secondary)",

        "border-selected":
          "var(--border-selected)",

        "border-focus":
          "var(--border-focus)",

        "border-danger":
          "var(--border-danger)",

        danger:
          "var(--danger)",

        info:
          "var(--info)",
      },

      spacing: {
        xs:
          "var(--space-xs)",

        sm:
          "var(--space-sm)",

        md:
          "var(--space-md)",

        lg:
          "var(--space-lg)",

        xl:
          "var(--space-xl)",

        "2xl":
          "var(--space-2xl)",

        "3xl":
          "var(--space-3xl)",

        "4xl":
          "var(--space-4xl)",

        "5xl":
          "var(--space-5xl)",
      },

      borderRadius: {
        /*
         * Existing aliases
         */
        sm:
          "0.25rem",

        DEFAULT:
          "0.5rem",

        md:
          "0.75rem",

        lg:
          "1rem",

        xl:
          "1.5rem",

        /*
         * Patient theme aliases
         */
        "corner-sm":
          "var(--corner-sm)",

        "corner-md":
          "var(--corner-md)",

        "corner-lg":
          "var(--corner-lg)",

        "corner-xl":
          "var(--corner-xl)",

        "corner-2xl":
          "var(--corner-2xl)",

        "corner-full":
          "var(--corner-full)",
      },

      boxShadow: {
        /*
         * Existing aliases
         */
        card:
          "0 2px 12px 0 rgba(0, 106, 106, 0.08)",

        elevated:
          "0 8px 24px -4px rgba(0, 106, 106, 0.18)",

        /*
         * Patient theme aliases
         */
        "patient-sm":
          "var(--shadow-sm)",

        "patient-md":
          "var(--shadow-md)",

        "patient-lg":
          "var(--shadow-lg)",

        "patient-xl":
          "var(--shadow-xl)",
      },

      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },

      fontSize: {
        /*
         * Patient dashboard text tokens.
         */

        "video-title": [
          "0.75rem",
          {
            lineHeight: "1.35",
          },
        ],

        "label-sm": [
          "0.8125rem",
          {
            lineHeight: "1.4",
          },
        ],

        label: [
          "0.9375rem",
          {
            lineHeight: "1.45",
          },
        ],

        title: [
          "1.75rem",
          {
            lineHeight: "1.2",
            fontWeight: "700",
          },
        ],

        "title-lg": [
          "2rem",
          {
            lineHeight: "1.15",
            fontWeight: "700",
          },
        ],
      },
    },
  },

  plugins: [],
};