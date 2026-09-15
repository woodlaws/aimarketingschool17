"use client";

import { useEffect, useState } from "react";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const diagnosis = document.querySelector("#diagnosis");
    const apply = document.querySelector("#apply");
    if (!diagnosis || !apply) return;
    const update = () => {
      const start = diagnosis.getBoundingClientRect().top <= window.innerHeight * .55;
      const inApply = apply.getBoundingClientRect().top < window.innerHeight && apply.getBoundingClientRect().bottom > 0;
      setVisible(start && !inApply);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div className={`fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-4 pt-3 shadow-2xl backdrop-blur transition-transform duration-300 md:hidden ${visible ? "translate-y-0" : "translate-y-full"}`} style={{ paddingBottom: "max(.75rem, env(safe-area-inset-bottom))" }}>
      <div className="mx-auto flex max-w-md items-center justify-between gap-3"><p className="text-xs font-bold leading-tight text-slate-600">9/18(금) 밤 8시<br /><span className="text-brand">참가비 무료</span></p><a href="#apply" className="rounded-lg bg-brand px-5 py-3 text-sm font-extrabold text-white">자리 맡기 →</a></div>
    </div>
  );
}
