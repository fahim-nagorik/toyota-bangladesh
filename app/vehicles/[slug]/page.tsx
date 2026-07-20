import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VEHICLES, getVehicle, getRelated } from "@/lib/data/vehicles";
import { formatBDT } from "@/lib/utils";
import VehicleDetail from "@/components/vehicle/VehicleDetail";

/** Every model in the catalogue is pre-rendered (§4). */
export function generateStaticParams() {
  return VEHICLES.map((v) => ({ slug: v.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) return { title: "Model not found" };

  return {
    title: `${vehicle.name} — from ${formatBDT(vehicle.priceFrom)}`,
    description: vehicle.description,
    openGraph: {
      title: `Toyota ${vehicle.name} | Toyota Bangladesh`,
      description: vehicle.description,
      images: [{ url: vehicle.heroImage }],
    },
  };
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();

  return <VehicleDetail vehicle={vehicle} related={getRelated(slug)} />;
}
