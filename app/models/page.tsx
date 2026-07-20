import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import VehicleGrid from "@/components/home/VehicleGrid";

export const metadata: Metadata = {
  title: "Models",
  description:
    "The full Toyota range in Bangladesh — hybrid SUVs, sedans and pickups. Compare models, prices and body types.",
};

export default function ModelsPage() {
  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Models" }]} />
      <VehicleGrid />
    </>
  );
}
