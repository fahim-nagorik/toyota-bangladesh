import type { Metadata } from "next";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Offers from "@/components/home/Offers";

export const metadata: Metadata = {
  title: "Offers",
  description:
    "Current Toyota Bangladesh offers on new models, servicing and genuine parts.",
};

export default function OffersPage() {
  return (
    <>
      <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Offers" }]} />
      <Offers />
    </>
  );
}
