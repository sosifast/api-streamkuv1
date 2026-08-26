import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import StreamForm from "../../stream-form";

export const metadata = {
  title: "Edit Stream — DB Movie Admin",
};

export default async function EditStreamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const [stream, countries, categories] = await Promise.all([
    prisma.iptv.findUnique({
      where: { id },
    }),
    prisma.countryIptv.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.categoryIptv.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (!stream) {
    notFound();
  }

  return <StreamForm stream={stream} countries={countries} categories={categories} />;
}
