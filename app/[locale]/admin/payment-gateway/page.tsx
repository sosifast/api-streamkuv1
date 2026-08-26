"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function PaymentGatewayPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    merchantId: "",
    paymentKey: "",
    isActive: false,
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const t = useTranslations("AdminSidebar"); // Fallback for simple titles

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/v1/payment-gateway/cryptomus");
        const result = await response.json();
        if (result.status && result.data) {
          setConfig({
            merchantId: result.data.merchantId || "",
            paymentKey: result.data.paymentKey || "",
            isActive: result.data.isActive || false,
          });
        }
      } catch (err) {
        console.error("Failed to load cryptomus config", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/v1/payment-gateway/cryptomus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });
      const result = await response.json();
      
      if (result.status) {
        setMessage({ text: "Configuration saved successfully!", type: "success" });
      } else {
        setMessage({ text: result.error || "Failed to save configuration", type: "error" });
      }
    } catch (err) {
      setMessage({ text: "An unexpected error occurred", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-zinc-400">Loading configuration...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-red-400">Integration</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white">Cryptomus Gateway</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Configure your Cryptomus Merchant ID and Payment Key to start accepting crypto payments.
        </p>
      </div>

      {message.text && (
        <div
          className={`rounded-xl p-4 text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 rounded-[28px] border border-white/10 bg-[#111318] p-8">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Merchant ID
            </label>
            <input
              type="text"
              value={config.merchantId}
              onChange={(e) => setConfig({ ...config, merchantId: e.target.value })}
              placeholder="e.g. 5a123bc..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-red-500 focus:bg-[#1a1d24]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Payment Key
            </label>
            <input
              type="password"
              value={config.paymentKey}
              onChange={(e) => setConfig({ ...config, paymentKey: e.target.value })}
              placeholder="••••••••••••••••••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-red-500 focus:bg-[#1a1d24]"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => setConfig({ ...config, isActive: !config.isActive })}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                config.isActive ? "bg-red-600" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                  config.isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <label className="text-sm font-medium text-zinc-300 cursor-pointer" onClick={() => setConfig({ ...config, isActive: !config.isActive })}>
              Enable Cryptomus Payment Gateway
            </label>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 disabled:opacity-50 sm:w-auto sm:px-8"
          >
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
}