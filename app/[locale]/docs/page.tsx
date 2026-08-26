"use client";

import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname, Link } from "@/i18n/routing";
import LandingNavbar from "@/app/components/LandingNavbar";

function CodeSnippet({ method, route, sampleResponse }: { method: string; route: string; sampleResponse?: string }) {
  const [activeTab, setActiveTab] = useState("cURL");
  
  const [baseUrl, setBaseUrl] = useState("https://api.dbmovie.com");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const fullUrl = `${baseUrl}${route}`;
  
  const snippets = {
    cURL: `curl -X ${method} "${fullUrl}" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
    PHP: `<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${fullUrl}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer YOUR_API_KEY"
]);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
?>`,
    Python: `import requests

url = "${fullUrl}"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}
response = requests.get(url, headers=headers)
print(response.json())`,
    Node: `fetch('${fullUrl}', {
  method: '${method}',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));`
  };

  const snippetsWithResponse: Record<string, string> = { ...snippets };
  if (sampleResponse) {
    snippetsWithResponse["Response"] = sampleResponse;
  }

  const tabs = Object.keys(snippetsWithResponse);

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-[#0d0d12] overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-white/5 bg-white/[0.02] px-3 py-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === tab
                ? "bg-white/10 text-white shadow-sm"
                : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-[13px] text-zinc-300 font-mono leading-relaxed">
          {snippetsWithResponse[activeTab]}
        </pre>
      </div>
    </div>
  );
}

export default function DocsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("DocsPage");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const gettingStartedDocs = [
    {
      id: "authentication",
      title: "Authentication",
      body: t("docs.auth"),
    },
    {
      id: "response-format",
      title: "Response Format",
      body: t("docs.response"),
    },
  ];

  const movieEndpoints = [
    { id: "movie-trending", title: "Trending", method: "GET", route: "/v1/movie/trending", description: t("docs.movieTrending"), sampleResponse: JSON.stringify({ data: [{ id: "cm...", movieName: "Inception", coverImageUrl: "https://...", year: 2010 }], message: "List of trending movies" }, null, 2) },
    { id: "movie-search", title: "Search", method: "GET", route: "/v1/movie/search?q=", description: t("docs.movieSearch"), sampleResponse: JSON.stringify({ data: [{ id: "cm...", movieName: "Inception", coverImageUrl: "https://...", year: 2010 }], message: "Search results for 'Inception'" }, null, 2) },
    { id: "movie-film", title: "Film", method: "GET", route: "/v1/movie/id=$input_id/", description: t("docs.movieDetail"), sampleResponse: JSON.stringify({ data: { id: "cm...", movieName: "Inception", desc: "...", coverImageUrl: "https://...", year: 2010, trailerUrl: "https://..." }, message: "Movie details retrieved successfully" }, null, 2) },
    { id: "movie-stream-url", title: "Stream URL", method: "GET", route: "/v1/movie/id=$input_id/stream", description: t("docs.movieStream"), sampleResponse: JSON.stringify({ data: { streamUrls: ["https://stream1...", "https://stream2..."] }, message: "Stream URLs retrieved successfully" }, null, 2) },
  ];

  const serialEndpoints = [
    { id: "serial-trending", title: "Trending", method: "GET", route: "/v1/serial/trending", description: t("docs.serialTrending"), sampleResponse: JSON.stringify({ data: [{ id: "cm...", serialName: "Breaking Bad", coverImageUrl: "https://...", year: 2008 }], message: "List of trending serials" }, null, 2) },
    { id: "serial-search", title: "Search", method: "GET", route: "/v1/serial/search?q=", description: t("docs.serialSearch"), sampleResponse: JSON.stringify({ data: [{ id: "cm...", serialName: "Breaking Bad", coverImageUrl: "https://...", year: 2008 }], message: "Search results for 'Breaking'" }, null, 2) },
    { id: "serial-serial", title: "Serial", method: "GET", route: "/v1/serial/id=$input_id/", description: t("docs.serialDetail"), sampleResponse: JSON.stringify({ data: { id: "cm...", serialName: "Breaking Bad", desc: "...", coverImageUrl: "https://...", year: 2008, trailerUrl: "https://...", episodes: [{ id: "ep1", title: "Pilot", episodeNumber: 1, seasonNumber: 1 }] }, message: "Serial details retrieved successfully" }, null, 2) },
    { id: "serial-stream-url", title: "Stream URL", method: "GET", route: "/v1/serial/id=$input_id/episode/:ep/stream", description: t("docs.serialStream"), sampleResponse: JSON.stringify({ data: { streamUrls: ["https://stream1...", "https://stream2..."] }, message: "Stream URLs retrieved successfully" }, null, 2) },
  ];

  const liveTvEndpoints = [
    { id: "livetv-country", title: "Country", method: "GET", route: "/v1/livetv/country", description: t("docs.liveTvCountry"), sampleResponse: JSON.stringify({ data: [{ id: "cm...", name: "Indonesia", slug: "indonesia" }], message: "List of all IPTV countries" }, null, 2) },
    { id: "livetv-category", title: "Category", method: "GET", route: "/v1/livetv/category", description: t("docs.liveTvCategory"), sampleResponse: JSON.stringify({ data: [{ id: "cm...", name: "Sports", slug: "sports" }], message: "List of all IPTV categories" }, null, 2) },
    { id: "livetv-search", title: "Search", method: "GET", route: "/v1/livetv/search?q=", description: t("docs.liveTvSearch"), sampleResponse: JSON.stringify({ data: [{ id: "cm...", name: "CNN", slug: "cnn", coverUrl: "https://...", country: { id: "...", name: "USA", slug: "usa" }, category: { id: "...", name: "News", slug: "news" } }], message: "Search results for 'CNN'" }, null, 2) },
    { id: "livetv-list", title: "Live TV", method: "GET", route: "/v1/livetv?country=&category=", description: t("docs.liveTvList"), sampleResponse: JSON.stringify({ data: { data: [{ id: "cm...", name: "CNN", slug: "cnn", coverUrl: "https://...", country: { id: "...", name: "USA", slug: "usa" }, category: { id: "...", name: "News", slug: "news" } }], meta: { total: 1, page: 1, limit: 20, totalPages: 1 } }, message: "List of Live TV streams" }, null, 2) },
    { id: "livetv-stream", title: "Stream URL", method: "GET", route: "/v1/livetv/id=$input_id/stream", description: t("docs.liveTvStream"), sampleResponse: JSON.stringify({ data: { streamUrls: ["https://stream1...", "https://stream2..."] }, message: "Stream URLs retrieved successfully" }, null, 2) },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <LandingNavbar isDocs={true} />
      <main>
        {/* Mobile Header */}
        <div className="sticky top-16 z-40 flex items-center justify-between border-b border-white/5 bg-[#0b0b0f]/80 px-4 py-4 backdrop-blur-md lg:hidden mt-16">
        <span className="font-display text-lg font-bold">{t("title")}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-[90rem] pt-16 lg:pt-20">
        {/* Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? "fixed inset-0 top-[130px] z-30 block bg-[#0b0b0f]" : "hidden"
          } w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-r border-white/5 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-64px)] lg:w-72 lg:shrink-0`}
        >
          <div className="px-6 py-8">
            <div className="hidden lg:flex items-center justify-between mb-8">
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                DB Movie API
              </h1>
              <select 
                value={locale} 
                onChange={(e) => router.replace(pathname, { locale: e.target.value })}
                className="bg-transparent text-zinc-400 text-xs font-medium border border-white/10 rounded-md px-1 py-1 outline-none focus:border-red-500 transition-colors cursor-pointer"
              >
                <option value="en" className="bg-[#050505] text-white">EN</option>
                <option value="id" className="bg-[#050505] text-white">ID</option>
                <option value="nl" className="bg-[#050505] text-white">NL</option>
                <option value="ja" className="bg-[#050505] text-white">JA</option>
                <option value="zh" className="bg-[#050505] text-white">ZH</option>
                <option value="ar" className="bg-[#050505] text-white">AR</option>
                <option value="de" className="bg-[#050505] text-white">DE</option>
                <option value="af" className="bg-[#050505] text-white">AF</option>
              </select>
            </div>
            <nav className="mt-8 space-y-8">
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                  {t("nav.gettingStarted")}
                </h3>
                <ul className="space-y-2">
                  {gettingStartedDocs.map((doc) => (
                    <li key={doc.id}>
                      <a href={`#${doc.id}`} className="block rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white">
                        {doc.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
                  {t("nav.movie")}
                </h3>
                <ul className="space-y-2">
                  {movieEndpoints.map((ep) => (
                    <li key={ep.id}>
                      <a href={`#${ep.id}`} className="block rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white">
                        {ep.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">
                  {t("nav.serial")}
                </h3>
                <ul className="space-y-2">
                  {serialEndpoints.map((ep) => (
                    <li key={ep.id}>
                      <a href={`#${ep.id}`} className="block rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white">
                        {ep.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  {t("nav.liveTv")}
                </h3>
                <ul className="space-y-2">
                  {liveTvEndpoints.map((ep) => (
                    <li key={ep.id}>
                      <a href={`#${ep.id}`} className="block rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white">
                        {ep.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-3xl">
            <header className="mb-16">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-red-400">
                <Link href="/" className="hover:text-red-300">Home</Link>
                <span>/</span>
                <span>Documentation</span>
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold text-white sm:text-5xl">
                {t("header.title")}
              </h1>
              <p className="mt-4 text-lg text-zinc-400">
                {t("header.desc")}
              </p>
            </header>

            <div className="space-y-16">
              {/* Getting Started Section */}
              <div className="space-y-12">
                {gettingStartedDocs.map((doc) => (
                  <section key={doc.id} id={doc.id} className="scroll-mt-24">
                    <h2 className="group flex items-center font-display text-2xl font-bold text-white">
                      <a href={`#${doc.id}`} className="absolute -ml-8 hidden text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100 lg:block">#</a>
                      {doc.title}
                    </h2>
                    <div className="mt-6 rounded-2xl border border-white/5 bg-[#111318] p-6 text-zinc-300 leading-relaxed shadow-lg">
                      {doc.body}
                    </div>
                  </section>
                ))}
              </div>

              <hr className="border-white/5" />

              {/* Movie Section */}
              <div className="space-y-12">
                <div className="mb-8">
                  <h2 className="font-display text-3xl font-bold text-blue-400">Movie API</h2>
                  <p className="mt-2 text-zinc-400">{t("sections.movieDesc")}</p>
                </div>
                
                {movieEndpoints.map((ep) => (
                  <section key={ep.id} id={ep.id} className="scroll-mt-24">
                    <h3 className="group flex items-center font-display text-xl font-bold text-white">
                      <a href={`#${ep.id}`} className="absolute -ml-8 hidden text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100 lg:block">#</a>
                      {ep.title}
                    </h3>
                    <div className="mt-5 rounded-2xl border border-white/5 bg-[#111318] shadow-lg overflow-hidden">
                      <div className="flex items-center gap-4 border-b border-white/5 bg-white/[0.02] p-4">
                        <span className="flex w-14 items-center justify-center rounded-md bg-blue-500/10 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                          {ep.method}
                        </span>
                        <code className="font-mono text-sm text-zinc-200 break-all">{ep.route}</code>
                      </div>
                      <div className="p-5 text-sm text-zinc-300 leading-relaxed">
                        <p className="mb-4">{ep.description}</p>
                        <CodeSnippet method={ep.method} route={ep.route} sampleResponse={ep.sampleResponse} />
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              <hr className="border-white/5" />

              {/* Serial Section */}
              <div className="space-y-12">
                <div className="mb-8">
                  <h2 className="font-display text-3xl font-bold text-purple-400">Serial API</h2>
                  <p className="mt-2 text-zinc-400">{t("sections.serialDesc")}</p>
                </div>

                {serialEndpoints.map((ep) => (
                  <section key={ep.id} id={ep.id} className="scroll-mt-24">
                    <h3 className="group flex items-center font-display text-xl font-bold text-white">
                      <a href={`#${ep.id}`} className="absolute -ml-8 hidden text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100 lg:block">#</a>
                      {ep.title}
                    </h3>
                    <div className="mt-5 rounded-2xl border border-white/5 bg-[#111318] shadow-lg overflow-hidden">
                      <div className="flex items-center gap-4 border-b border-white/5 bg-white/[0.02] p-4">
                        <span className="flex w-14 items-center justify-center rounded-md bg-purple-500/10 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-400">
                          {ep.method}
                        </span>
                        <code className="font-mono text-sm text-zinc-200 break-all">{ep.route}</code>
                      </div>
                      <div className="p-5 text-sm text-zinc-300 leading-relaxed">
                        <p className="mb-4">{ep.description}</p>
                        <CodeSnippet method={ep.method} route={ep.route} sampleResponse={ep.sampleResponse} />
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              <hr className="border-white/5" />

              {/* Live TV Section */}
              <div className="space-y-12">
                <div className="mb-8">
                  <h2 className="font-display text-3xl font-bold text-emerald-400">Live TV API</h2>
                  <p className="mt-2 text-zinc-400">{t("sections.liveTvDesc")}</p>
                </div>

                {liveTvEndpoints.map((ep) => (
                  <section key={ep.id} id={ep.id} className="scroll-mt-24">
                    <h3 className="group flex items-center font-display text-xl font-bold text-white">
                      <a href={`#${ep.id}`} className="absolute -ml-8 hidden text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100 lg:block">#</a>
                      {ep.title}
                    </h3>
                    <div className="mt-5 rounded-2xl border border-white/5 bg-[#111318] shadow-lg overflow-hidden">
                      <div className="flex items-center gap-4 border-b border-white/5 bg-white/[0.02] p-4">
                        <span className="flex w-14 items-center justify-center rounded-md bg-emerald-500/10 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          {ep.method}
                        </span>
                        <code className="font-mono text-sm text-zinc-200 break-all">{ep.route}</code>
                      </div>
                      <div className="p-5 text-sm text-zinc-300 leading-relaxed">
                        <p className="mb-4">{ep.description}</p>
                        <CodeSnippet method={ep.method} route={ep.route} sampleResponse={ep.sampleResponse} />
                      </div>
                    </div>
                  </section>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
