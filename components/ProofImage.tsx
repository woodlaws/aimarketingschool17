"use client";

import Image from "next/image";
import { useState } from "react";

export function ProofImage({ src, caption, tall = false }: { src: string; caption: string; tall?: boolean }) {
  const [missing, setMissing] = useState(false);
  return (
    <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className={`relative flex items-center justify-center bg-slate-200 ${tall ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
        {missing ? <span className="px-4 text-center font-mono text-xs text-slate-500">{src.replace("/proof/", "")}</span> : <Image src={src} alt={caption} fill sizes={tall ? "(max-width: 767px) 100vw, 680px" : "(max-width: 767px) 100vw, 220px"} className="object-cover" onError={() => setMissing(true)} />}
      </div>
      <figcaption className="p-3 text-sm font-semibold text-slate-700">{caption}</figcaption>
    </figure>
  );
}
