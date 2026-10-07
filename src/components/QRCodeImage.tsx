"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QRCodeImage({ value }: { value: string }) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, {
      width: 180,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch((err) => {
        console.error("QR Code generation error:", err);
      });

    return () => {
      active = false;
    };
  }, [value]);

  if (!dataUrl) {
    return (
      <div className="w-24 h-24 rounded-lg bg-white/10 animate-pulse flex items-center justify-center text-[10px] text-zinc-400">
        QR...
      </div>
    );
  }

  return (
    <div className="p-2 rounded-xl bg-white shadow-lg flex items-center justify-center shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt={`QR Token: ${value}`}
        className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
      />
    </div>
  );
}
