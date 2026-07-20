import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Safety from "@/components/home/Safety";

export const metadata: Metadata = {
  title: "Safety",
  description:
    "Toyota Safety Sense: pre-collision braking, lane tracing and adaptive cruise, standard across the Bangladesh range.",
};

export default function SafetyPage() {
  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Safety" }]} />
      <Safety />
    </>
  );
}
