import type { Metadata } from "next";
import { HeroArchitecture } from "@/components/hero/Heroes";
import ServiceBody from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Architecture & Community Design",
  description:
    "Masterplanning, residential and commercial architecture, and realistic visualisation — designing whole communities, not just buildings.",
  alternates: { canonical: "/architecture" },
};

export default function ArchitecturePage() {
  return (
    <>
      <HeroArchitecture />
      <ServiceBody id="architecture" />
    </>
  );
}
