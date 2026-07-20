import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import DealerLocator from "@/components/home/DealerLocator";

export const metadata: Metadata = {
  title: "Dealers",
  description:
    "Find a Toyota showroom, service centre or genuine parts counter across Bangladesh — from Tejgaon to Chattogram.",
};

export default function DealersPage() {
  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Dealers" }]} />
      <DealerLocator />
    </>
  );
}
