"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registrasi gagal.");
      }

      setMessage(data.message || "Registrasi berhasil.");
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b0b0f] px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-white/10 bg-[#111318] shadow-2xl shadow-red-950/30 lg:grid-cols-2">
        <div className="hidden items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(239,68,68,0.35),_transparent_30%),linear-gradient(135deg,#111318,#1a1d24)] p-10 lg:flex">
          <div className="max-w-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-xl font-black text-white">D</div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-red-300">DB Movie</p>
                <p className="font-display text-2xl font-bold text-white">Bergabunglah</p>
              </div>
            </div>
            <h1 className="font-display text-4xl font-black leading-tight text-white">
              Buat akun Anda dan mulai streaming sekarang.
            </h1>
            <p className="mt-4 text-base text-zinc-300">
              Akses film, drama, anime, dan banyak konten eksklusif dengan pengalaman premium.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-red-300">Create account</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white">Register</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm text-zinc-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-zinc-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-zinc-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm text-zinc-300">
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            {error ? (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-red-600 px-4 py-3 font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Mendaftarkan..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Sudah punya akun? {" "}
            <Link href="/auth/login" className="font-semibold text-red-400 hover:text-red-300">
              Login disini
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
