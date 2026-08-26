import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "DocsPage" });
  
  return {
    title: t("title") + " - DB Movie API",
    description: t("header.desc"),
    alternates: {
      canonical: `/${locale}/docs`
    }
  };
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
