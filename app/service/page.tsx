import type { Metadata } from "next";
import ServiceTabs from "@/components/service/ServiceTabs";

export const metadata: Metadata = {
  title: "Service & Genuine Parts",
  description:
    "Shop Toyota Genuine Parts and engine oil, or book a service with factory-trained technicians at any Toyota dealer in Bangladesh.",
};

export default async function ServicePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  return <ServiceTabs initialTab={tab === "book" ? "book" : "shop"} />;
}
