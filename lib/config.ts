/**
 * lib/config.ts - Site-wide configuration
 *
 * All values come from environment variables. Set them in .env.local for local
 * development, and in your Vercel project dashboard (Settings - Environment
 * Variables) for production.
 */

export const SITE_CONFIG = {
  /** Your name shown in the Contact section */
  contactName:   process.env.NEXT_PUBLIC_CONTACT_NAME  ?? "",

  /** Your phone number (shown as a tel: link) */
  contactPhone:  process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",

  /** Your email address */
  contactEmail:  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",

  /** External link for the "Visit Lakeside Church" button */
  churchUrl:     "https://lakesidechurch.com/",

  /** Admin password - set ADMIN_PASSWORD in Vercel env vars for production */
  adminPassword: process.env.ADMIN_PASSWORD ?? "",
} as const;
