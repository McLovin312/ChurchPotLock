/**
 * lib/config.ts - Site-wide configuration
 *
 * Update these values directly, or set the NEXT_PUBLIC_* environment variables
 * in your Vercel project dashboard (Settings → Environment Variables).
 */

export const SITE_CONFIG = {
  /** Your name shown in the Contact section */
  contactName:   process.env.NEXT_PUBLIC_CONTACT_NAME  ?? "Thomas Lovin",

  /** Your phone number (shown as a tel: link) */
  contactPhone:  process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "(770) 549-2116",

  /** Your email address */
  contactEmail:  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "thomasrlovin@gmail.com",

  /** External link for the "Visit Lakeside Church" button */
  churchUrl:     "https://lakesidechurch.com/",

  /** Admin password - set ADMIN_PASSWORD in Vercel env vars for production */
  adminPassword: process.env.ADMIN_PASSWORD ?? "lakeside2026",
} as const;
