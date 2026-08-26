"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/app/components/ConfirmModal";
import { useTranslations } from "next-intl";

interface User {
  id: string;
  username: string;
  email: string;
  status: string;
  membershipExpiredAt?: string;
  createdAt: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({ newName: "", newPassword: "" });
  const t = useTranslations("AccountPage");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/v1/user");
        const result = await response.json();
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        if (result.status) {
          setUser(result.data);
        } else {
          setError(result.error || "Failed to fetch user data");
        }
      } catch (err) {
        setError("Error loading user data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.newName.trim()) return;

    setUpdating(true);
    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: formData.newName }),
      });

      const result = await response.json();
      if (result.status && user) {
        setUser({ ...user, username: formData.newName });
        setFormData({ ...formData, newName: "" });
        alert("Name updated successfully");
      }
    } catch (err) {
      alert("Error updating name");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.newPassword.trim()) return;

    setUpdating(true);
    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: formData.newPassword }),
      });

      const result = await response.json();
      if (result.status) {
        setFormData({ ...formData, newPassword: "" });
        alert("Password updated successfully");
      }
    } catch (err) {
      alert("Error updating password");
    } finally {
      setUpdating(false);
    }
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const executeDeleteAccount = async () => {
    try {
      const response = await fetch("/api/auth/delete-account", { method: "POST" });
      const result = await response.json();
      if (result.status) {
        router.push("/auth/login");
      }
    } catch (err) {
      alert("Error deleting account");
    }
  };

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0b0b0f] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-zinc-400">{t("loading")}</p>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="min-h-screen bg-[#0b0b0f] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-red-400">{t("error")}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-red-300">{t("profile")}</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-white">{t("account")}</h1>
          </div>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            user.status === 'Active'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-red-500/30 bg-red-500/10 text-red-300'
          }`}>
            {user.status} {t("account")}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* User Info */}
          <section className="rounded-[28px] border border-white/10 bg-[#111318] p-6">
            <h2 className="font-display text-xl font-bold text-white">{t("userInfo")}</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{t("username")}</p>
                <p className="mt-2 text-lg font-bold text-white">{user.username}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{t("email")}</p>
                <p className="mt-2 text-lg font-bold text-white">{user.email}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/3 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{t("joined")}</p>
                <p className="mt-2 text-lg font-bold text-white">{new Date(user.createdAt).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          </section>

          {/* Update Password */}
          <form
            onSubmit={handleUpdatePassword}
            className="rounded-[28px] border border-white/10 bg-[#111318] p-6"
          >
            <h2 className="font-display text-xl font-bold text-white">{t("updatePassword")}</h2>
            <div className="mt-5">
              <label className="mb-2 block text-sm text-zinc-300">{t("newPassword")}</label>
              <input
                type="password"
                placeholder={t("enterNewPassword")}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={updating}
                className="mt-5 w-full rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {updating ? t("updating") : t("updatePassword")}
              </button>
            </div>
          </form>

          {/* Update Username */}
          <form
            onSubmit={handleUpdateName}
            className="rounded-[28px] border border-white/10 bg-[#111318] p-6"
          >
            <h2 className="font-display text-xl font-bold text-white">{t("updateUsername")}</h2>
            <div className="mt-5">
              <label className="mb-2 block text-sm text-zinc-300">{t("username")}</label>
              <input
                type="text"
                placeholder={t("enterNewUsername")}
                value={formData.newName}
                onChange={(e) => setFormData({ ...formData, newName: e.target.value })}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={updating}
                className="mt-5 w-full rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {updating ? t("updating") : t("updateUsername")}
              </button>
            </div>
          </form>

          {/* Danger Zone */}
          <section className="rounded-[28px] border border-red-500/20 bg-[#111318] p-6">
            <h2 className="font-display text-xl font-bold text-white">{t("dangerZone")}</h2>
            <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
              <p className="text-sm text-zinc-300">
                {t("deleteWarning")}
              </p>
              <button
                onClick={handleDeleteAccount}
                className="mt-5 w-full rounded-2xl border border-red-500/40 bg-red-600/10 px-4 py-3 font-semibold text-red-300 transition hover:bg-red-600/20"
              >
                {t("deleteAccount")}
              </button>
            </div>
          </section>
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDeleteAccount}
        title={t("deleteModalTitle")}
        message={t("deleteModalMessage")}
        confirmText={t("deleteAccount")}
        isDestructive={true}
      />
    </main>
  );
}
