import type { Metadata } from "next";
import { HeroConstruction } from "@/components/hero/Heroes";
import ServiceBody from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Construction",
  description:
    "Staged construction delivery with project management, quality assurance, safety planning and documented progress — from empty plot to handover.",
  alternates: { canonical: "/construction" },
};

export default function ConstructionPage() {
  return (
    <>
      <HeroConstruction />
      <ServiceBody id="construction" />
    </>
  );
}
