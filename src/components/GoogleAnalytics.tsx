"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AGE_STORAGE_KEY, AGE_STORAGE_VALUE } from "@/lib/legal";

const GA_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "G-F6EQP3QM1C";

function canTrack(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return true;
  try {
    return window.localStorage.getItem(AGE_STORAGE_KEY) === AGE_STORAGE_VALUE;
  } catch {
    return false;
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setEnabled(canTrack(pathname));
    sync();
    window.addEventListener("pe-age-confirmed", sync);
    return () => window.removeEventListener("pe-age-confirmed", sync);
  }, [pathname]);

  if (!GA_ID || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
