"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { Toast, UploadForm } from "@/components/UploadForm";
import { PortfolioPreview } from "@/components/ProtfolioPreview";
import { usePortfolio } from "@/context/PortfolioContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const { savePortfolio, loadPortfolio, hasMediaChanged } = usePortfolio();
  console.log(hasMediaChanged)
  return (
    <div className={`${geistSans.className} ${geistMono.className} grid grid-rows-[20px_1fr_20px]  gap-16  font-[family-name:var(--font-geist-sans)]`}>
      <div>
        <header className="bg-white dark:bg-stone-700 shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Portfolio Builder
              </h1>

              <div className="flex gap-3">
                <button
                  disabled={!hasMediaChanged}
                  onClick={savePortfolio}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-stone-500 rounded-md hover:bg-stone-800 transition disabled:text-stone-500 disabled:bg-stone-100"
                >
                  Save
                </button>
                <button
                  onClick={loadPortfolio}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-stone-500 rounded-md hover:bg-stone-800 transition"
                >
                  Load
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <UploadForm />
        <PortfolioPreview />
      </main>
    </div >
  );
}