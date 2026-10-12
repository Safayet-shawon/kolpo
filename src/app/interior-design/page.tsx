import type { Metadata } from "next";
import { HeroInterior } from "@/components/hero/Heroes";
import ServiceBody from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Interior Design",
  description:
    "Residential and commercial interiors: space planning, materials, lighting and joinery — from an empty room to a finished, lived-in space.",
  alternates: { canonical: "/interior-design" },
};

export default function InteriorPage() {
  return (
    <>
      <HeroInterior />
      <ServiceBody id="interior" />
    </>
  );
}
