import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CategoryForm from "../../category-form";

export const metadata = {
  title: "Edit Category — DB Movie Admin",
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const category = await prisma.categoryIptv.findUnique({
    where: { id },
  });

  if (!category) {
    notFound();
  }

  return <CategoryForm category={category} />;
}
