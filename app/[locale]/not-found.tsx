import Link from "next/link";
import { SparklesIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans overflow-hidden flex flex-col">
      {/* Dynamic Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-red-900/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none" />

        {/* Navbar (Static for 404) */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-transparent py-6">
          <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <p className="font-display text-xl font-bold tracking-wide text-white">DB<span className="text-red-500">Movie</span></p>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 text-center">
          <h1 className="text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900/20 leading-none drop-shadow-2xl">
            404
          </h1>
          <h2 className="mt-8 text-3xl md:text-4xl font-bold text-white tracking-tight">
            Oops! Halaman Tidak Ditemukan
          </h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-md mx-auto">
            Maaf, halaman yang Anda cari mungkin telah dihapus, namanya diubah, atau sementara tidak tersedia.
          </p>
          
          <div className="mt-10">
            <Link 
              href="/" 
              className="inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-bold text-white bg-red-600 hover:bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] transition-all group"
            >
              Kembali ke Beranda
            </Link>
        </div>
      </div>
    </div>
  );
}
