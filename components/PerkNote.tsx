// 신청 버튼 아래에 붙는 참석 특전 한 줄. 선물 아이콘은 인라인 SVG(외부 라이브러리 없음).
export function GiftIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8" />
      <path d="M12 8v13" />
      <path d="M12 8c-1.5-3-5-3.5-5-1.5S10 8 12 8Zm0 0c1.5-3 5-3.5 5-1.5S14 8 12 8Z" />
    </svg>
  );
}

export function PerkNote({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const color = tone === "dark" ? "text-blue-100" : "text-slate-700";
  return (
    <p className={`perk-note flex items-center justify-center gap-2 text-center font-bold ${color} ${className}`}>
      <GiftIcon className={tone === "dark" ? "text-accent" : "text-brand"} />
      끝까지 참석하시면 리포트 3종 증정
    </p>
  );
}
