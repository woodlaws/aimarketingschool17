export function Hero() {
  return (
    <section className="flex min-h-[100svh] items-center bg-brand-dark px-5 py-10 text-white md:min-h-0 md:py-20">
      <div className="mx-auto w-full max-w-[680px] text-center">
        <div>
          <p className="mb-6 inline-flex rounded-full border border-blue-300/30 bg-blue-400/10 px-4 py-2 text-sm font-bold text-blue-100">제55차 · 실시간 무료특강 · 참가비 0원</p>
          <h1 className="text-[1.8rem] font-black leading-[1.22] tracking-[-.045em] sm:text-5xl md:text-[4rem]">ChatGPT 3년째 쓰는데,<br /><mark>왜 통장은 그대로일까요?</mark></h1>
          <p className="mt-6 text-lg leading-8 text-slate-300 md:text-xl">도구를 몰라서가 아닙니다.<br /><strong className="text-accent">돈이 들어오는 구조</strong>를 안 배웠기 때문입니다.</p>
          <div className="mt-7 grid gap-2 text-sm font-semibold text-slate-200 md:grid-cols-3 md:text-base">
            <p className="rounded-lg bg-white/5 px-3 py-3">📅 2026년 9월 18일(금)<br />밤 8시~10시 30분</p>
            <p className="rounded-lg bg-white/5 px-3 py-3">💻 온라인 Zoom<br />실시간</p>
            <p className="rounded-lg bg-white/5 px-3 py-3">⏺️ 녹화본<br />없음</p>
          </div>
          <a href="#apply" className="mt-5 flex w-full items-center justify-between rounded-xl bg-brand px-6 py-5 text-lg font-black text-white shadow-lg shadow-blue-950/40 transition hover:-translate-y-0.5 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300">무료로 자리 맡기 <span>→</span></a>
          <p className="mt-3 text-xs font-medium text-slate-400 md:text-sm">신청 즉시 카톡으로 참여 링크가 발송됩니다.</p>
        </div>
      </div>
    </section>
  );
}

export function TrustBar() {
  const items = ["13년 현장 강의", "누적 55차 무료특강", "마케팅 저서 7권", "16기 수료생 배출"];
  return <section className="bg-slate-950 px-5 py-6 text-white"><div className="mx-auto grid max-w-[680px] grid-cols-2 divide-x divide-y divide-white/10 border border-white/10 md:grid-cols-4 md:divide-y-0">{items.map(item => <p key={item} className="px-3 py-4 text-center text-sm font-extrabold md:text-base">{item}</p>)}</div></section>;
}
