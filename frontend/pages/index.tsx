"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { UploadForm } from "@/components/UploadForm/UploadForm";
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
  const { savePortfolio, loadPortfolio, canSave, canLoad } = usePortfolio();
  const enabledStyle = "inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-stone-500 rounded-md hover:bg-stone-800 transition";
  const disabledStyle = "inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-stone-500 rounded-md hover:bg-stone-800 transition disabled:text-stone-500 disabled:bg-stone-100";
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
                {canSave ? (
                  <button
                    onClick={savePortfolio}
                    className={enabledStyle}
                  >
                    Save
                  </button>
                ) : (
                  <div title="No media uploaded or no changes to save">
                    <button
                      disabled
                      className={disabledStyle}
                    >
                      Save
                    </button>
                  </div>
                )}
                {canLoad ? (
                  <button
                    onClick={loadPortfolio}
                    className={enabledStyle}
                  >
                    Load
                  </button>
                ) : (
                  <div title="No saved data or no changes since last save">
                    <button
                      disabled
                      className={disabledStyle}
                    >
                      Load
                    </button>
                  </div>
                )}
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