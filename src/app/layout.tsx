import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { offices, site } from "@/data/site";

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "KOLPO — Architecture, Interior Design & Construction",
    template: "%s — KOLPO",
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: "KOLPO",
    title: "KOLPO — Architecture, Interior Design & Construction",
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Aerial concept visualisation of a planned residential community" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#fff8ef",
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint: enables progressive-enhancement styles and skips the loader on repeat loads.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('kolpo:loaded')==='1')d.setAttribute('data-seen','1')}catch(e){}})();`;

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "KOLPO",
  url: site.url,
  description: site.description,
  ...(site.contactEmail ? { email: site.contactEmail } : {}),
  telephone: site.phones[0],
  address: { "@type": "PostalAddress", streetAddress: offices[0].address, addressLocality: "Dhaka", postalCode: "1206", addressCountry: "BD" },
  sameAs: [site.existingSite],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body>
        <Loader />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
