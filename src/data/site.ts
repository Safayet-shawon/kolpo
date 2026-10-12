// Single source of truth for brand facts. Nothing here is invented: unverified fields are null/empty
// and the UI renders an honest fallback for them. Fill these in (or set the env vars) once confirmed.

export type Office = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  hours: string | null;
  mapUrl: string | null;
  verified: boolean;
};

export const site = {
  name: "KOLPO",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kolpo.vercel.app",
  description:
    "KOLPO is a design and build practice connecting architecture and community planning, interior design, and construction in one continuous process.",
  // Set NEXT_PUBLIC_CONTACT_EMAIL once the studio confirms its public address.
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null,
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? null,
  social: [] as { label: string; href: string }[],
};

// No office has been verified yet. Replace this placeholder with real, confirmed details.
export const offices: Office[] = [
  {
    id: "studio",
    name: "KOLPO Studio",
    address: null,
    phone: site.phone,
    email: site.contactEmail,
    hours: null,
    mapUrl: null,
    verified: false,
  },
];

export const nav = [
  { href: "/architecture", label: "Architecture" },
  { href: "/interior-design", label: "Interior Design" },
  { href: "/construction", label: "Construction" },
  { href: "/projects", label: "Our Work" },
  { href: "/about", label: "About" },
] as const;
