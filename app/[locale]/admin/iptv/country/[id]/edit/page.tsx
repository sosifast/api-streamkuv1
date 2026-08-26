import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CountryForm from "../../country-form";

export const metadata = {
  title: "Edit Country — DB Movie Admin",
};

export default async function EditCountryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const country = await prisma.countryIptv.findUnique({
    where: { id },
  });

  if (!country) {
    notFound();
  }

  return <CountryForm country={country} />;
}
