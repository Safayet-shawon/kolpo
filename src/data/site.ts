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

// Verified against the studio's current website (https://kolpodhaka.com) on 2026-10-13.
export const site = {
  name: "KOLPO",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kolpo-tau.vercel.app",
  existingSite: "https://kolpodhaka.com",
  tagline: "Thoughtful Architecture and Craftsmanship",
  description:
    "Architecture, interior design and construction in Dhaka.",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "kolpo.dhaka@gmail.com",
  phones: ["01741119969", "01701777913"],
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "01741119969",
  social: [] as { label: string; href: string }[],
};

export const offices: Office[] = [
  {
    id: "head-office",
    name: "Head office",
    address: "477, Road-32, Mohakhali DOHS, Dhaka-1206",
    phone: site.phones.join(" / "),
    email: site.contactEmail,
    hours: null, // not published; do not guess
    mapUrl: "https://www.openstreetmap.org/search?query=477%20Road%2032%20Mohakhali%20DOHS%20Dhaka",
    verified: true,
  },
  {
    id: "second-address",
    name: "Second address",
    address: "273/3, West Manikdi, ECB Chattor to Mirpur DOHS Link Road, Dhaka-1206",
    phone: null,
    email: null,
    hours: null,
    mapUrl: "https://www.openstreetmap.org/search?query=West%20Manikdi%20ECB%20Chattor%20Dhaka",
    verified: true,
  },
];

// Completed projects listed on the studio's own site. Full details and photography live there.
export const realProjects = [
  { title: "Fedrigoni", slug: "fedrigoni" },
  { title: "Sipn' Dip", slug: "sipn-dip" },
  { title: "Dearly", slug: "dearly" },
  { title: "Selina & Nixon's Apartment", slug: "selina-and-nixons-apartment" },
  { title: "Banasree Apartment", slug: "banasree-apartment" },
  { title: "Kanon Rahman's Apartment (KOLI)", slug: "kanon-rahmans-apartment-koli" },
  { title: "Col. Azim Apartment Building", slug: "col-azim-apartment-building" },
  { title: "BURO Bangladesh, Kaliakoir Branch Office", slug: "buro-bangladesh-kaliakoir-branch-office" },
  { title: "BURO Bangladesh, Rajshahi Training Center", slug: "buro-bangladesh-rajshahi-training-center" },
  { title: "Tanveer Residence", slug: "tanveer-residence" },
] as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/architecture", label: "Architecture" },
  { href: "/interior-design", label: "Interior" },
  { href: "/construction", label: "Construction" },
  { href: "/#work", label: "Our Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

// Add the studio's real licences / registrations here (name + optional number). Nothing is shown as a licence until listed.
export const licenses: { name: string; detail?: string }[] = [];
