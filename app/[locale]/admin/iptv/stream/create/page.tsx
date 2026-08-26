import StreamForm from "../stream-form";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Add Stream — DB Movie Admin",
};

export default async function CreateStreamPage() {
  const [countries, categories] = await Promise.all([
    prisma.countryIptv.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.categoryIptv.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return <StreamForm countries={countries} categories={categories} />;
}
