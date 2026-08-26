"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/app/components/ConfirmModal";
import { useTranslations } from "next-intl";

interface ApiKeyResponse {
  apiKey: string | null;
  status: boolean;
  error?: string;
  data?: {
    apiKey: string;
  };
}

export default function ApiKeysPage() {
  const router = useRouter();
  const t = useTranslations("ApiKeysPage");
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch("/api/v1/api-keys");
        const result: ApiKeyResponse = await response.json();
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (result.status) {
          setApiKey(result.data?.apiKey || null);
        } else {
          setError(result.error || "Failed to fetch API key");
        }
      } catch (err) {
        setError("Error loading API key");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchApiKey();
  }, [router]);

  const executeGenerateKey = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/v1/api-keys", { method: "POST" });
      const result: ApiKeyResponse = await response.json();
      if (result.status) {
        setApiKey(result.data?.apiKey || null);
        setCopied(false);
        setIsGenerateModalOpen(false);
      } else {
        setError(result.error || "Failed to generate API key");
      }
    } catch (err) {
      setError("Error generating API key");
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateKey = () => {
    if (apiKey) {
      setIsGenerateModalOpen(true);
    } else {
      executeGenerateKey();
    }
  };

  const handleCopyKey = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0f] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-center text-zinc-400">{t("loading") || "Loading API key..."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-red-300">Developer</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-white">{t("title")}</h1>
          </div>
          <button
            onClick={handleGenerateKey}
            disabled={generating}
            className="rounded-full bg-red-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-500 disabled:opacity-50"
          >
            {generating ? (t("generating") || "Generating...") : (t("generateNew") || "Generate Key")}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-[28px] border border-white/10 bg-[#111318] p-6">
            <h2 className="font-display text-xl font-bold text-white">
              {apiKey ? (t("activeKey") || "Active API Key") : "No API Key"}
            </h2>
            {apiKey ? (
              <>
                <div className="mt-5 flex gap-2">
                  <div className="flex-1 rounded-2xl border border-white/10 bg-[#0d0d12] p-4 font-mono text-sm text-red-300 break-all">
                    {apiKey}
                  </div>
                  <button
                    onClick={handleCopyKey}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    {copied ? "✓" : (t("copy") || "Copy")}
                  </button>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Usage Limit</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Based on your current plan
                  </p>
                </div>
              </>
            ) : (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/3 p-8 text-center">
                <p className="text-zinc-400">No API key generated yet</p>
                <button
                  onClick={handleGenerateKey}
                  className="mt-4 rounded-full bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-500"
                >
                  Create Your First Key
                </button>
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-red-500/20 bg-[#111318] p-6">
            <h2 className="font-display text-xl font-bold text-white">Security Tips</h2>
            <div className="mt-5 space-y-3 text-sm text-zinc-300">
              <div className="rounded-2xl border border-white/10 bg-white/3 p-3">
                Rotate key every 90 days
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/3 p-3">
                Use HTTPS for requests
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/3 p-3">
                Do not share key to public clients
              </div>
            </div>
          </section>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-600/10 p-4">
            <p className="text-red-300">{error}</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onConfirm={executeGenerateKey}
        title={t("generateModalTitle")}
        message={t("generateModalMessage")}
        confirmText={t("generateNew")}
        isDestructive={false}
      />
    </main>
  );
}
