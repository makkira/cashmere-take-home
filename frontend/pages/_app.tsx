import { PortfolioProvider } from "@/context/PortfolioContext";
import { ToastProvider } from "@/context/ToastContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <PortfolioProvider>
        <Component {...pageProps} />
      </PortfolioProvider>
    </ToastProvider>);
}
