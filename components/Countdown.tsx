"use client";

import { useEffect, useState } from "react";
import { SESSION } from "@/lib/constants";

type Remaining = { days: number; hours: number; minutes: number; seconds: number } | null;

export function Countdown() {
  const [remaining, setRemaining] = useState<Remaining>(null);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    // 활성 회차(SESSION)의 시작 시각. 마운트 시점에 읽어 회차가 넘어가면 다음 회차를 바라봅니다.
    const target = new Date(SESSION.startsAtISO).getTime();
    const update = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setEnded(true); setRemaining(null); return; }
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (ended) return <p className="text-center text-2xl font-extrabold md:text-4xl">특강이 곧 시작됩니다</p>;
  const units = [[remaining?.days, "일"], [remaining?.hours, "시간"], [remaining?.minutes, "분"], [remaining?.seconds, "초"]] as const;
  return (
    <div className="grid grid-cols-4 gap-2" aria-label="특강 시작까지 남은 시간">
      {units.map(([value, label]) => <div key={label} className="rounded-xl bg-white/10 p-3 text-center"><strong className="block text-2xl font-black md:text-4xl">{value == null ? "" : String(value).padStart(2, "0")}</strong><span className="text-xs text-blue-100 md:text-sm">{label}</span></div>)}
    </div>
  );
}
