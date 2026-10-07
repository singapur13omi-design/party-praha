import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PARTY PRAHA — Nightlife Operating System",
  description:
    "ČO SA DEJE DNES VEČER V MOJOM OKOLÍ? Najrýchlejšie nočné objavovanie v Prahe. Živá mapa, kluby, rave, techno, house, DnB a akcie v Prahe.",
  openGraph: {
    title: "PARTY PRAHA — Nightlife Discovery Marketplace",
    description: "ČO SA DEJE DNES VEČER V MOJOM OKOLÍ? Live nightlife radar pre Prahu.",
    siteName: "PARTY PRAHA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" className="dark h-full antialiased bg-[#06070b]">
      <body className="min-h-full flex flex-col bg-[#06070b] text-slate-100 selection:bg-pink-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
