import { FadeUp } from "@/components/Motion";
import { PerkNote } from "@/components/PerkNote";

// 참석 특전: 라이브 끝까지 참석한 분께 드리는 리서치 리포트 3종.
// 리포트 설명은 리서치 정리 자료 기준 문구만 사용합니다.
const REPORTS = [
  {
    no: "01",
    title: "2026 하반기 5대 SNS 알고리즘 리서치 리포트",
    sub: "유튜브 · 인스타그램 · 틱톡 · 스레드 · 네이버 블로그",
    desc: "채널마다 흩어진 최신 알고리즘 정보를 리서치해 한 권으로 정리했습니다.",
  },
  {
    no: "02",
    title: "소액 예산 메타 광고 전략 리포트",
    sub: "최신 공개 자료 · 리서치 정리본",
    desc: "적은 예산으로 광고를 시작할 때 알아야 할 세팅 원칙과 전략을 모았습니다.",
  },
  {
    no: "03",
    title: "AI 브라우저 Aside 실무 활용 리포트",
    sub: "활용 사례 리서치 정리본",
    desc: "사람들이 Aside로 가장 많이 하는 업무를 리서치해 정리했습니다.",
  },
] as const;

// 표지 3권(이미지 없이 CSS로 표현). 가운데가 REPORT 01, 좌우는 뒤에 살짝 기울여 겹칩니다.
const COVERS = [
  { no: "02", position: "left", lines: ["소액 예산", "메타 광고", "전략 리포트"] },
  { no: "01", position: "center", lines: ["2026 하반기", "5대 SNS", "알고리즘", "리서치"] },
  { no: "03", position: "right", lines: ["AI 브라우저", "Aside", "실무 활용"] },
] as const;

function WarningIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-amber-600">
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function Perks() {
  return (
    <section id="perks" className="sales-section bg-surface">
      <div className="sales-wrap">
        <FadeUp className="text-center">
          <p className="section-eyebrow inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-2 font-bold text-brand">참석 특전 · 라이브 한정</p>
          <h2 className="sales-title mt-5">끝까지 참석하신 분께만<br />드립니다</h2>
          <p className="perk-subtitle mt-3 font-black text-brand">리포트 3종</p>
        </FadeUp>

        <FadeUp className="mt-10">
          <div className="perk-covers" role="img" aria-label="리포트 3종 표지: 2026 하반기 5대 SNS 알고리즘 리서치, 소액 예산 메타 광고 전략 리포트, AI 브라우저 Aside 실무 활용">
            {COVERS.map((cover) => (
              <div key={cover.no} className={`perk-cover perk-cover-${cover.position}`} aria-hidden="true">
                <span className="perk-cover-label">REPORT {cover.no}</span>
                <span className="perk-cover-title">{cover.lines.map((line) => <span key={line} className="block">{line}</span>)}</span>
                <span className="perk-cover-rule" />
              </div>
            ))}
          </div>
        </FadeUp>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {REPORTS.map((report, i) => (
            <FadeUp key={report.no} delay={i * 0.08}>
              <article className="h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="perk-card-no inline-flex size-11 items-center justify-center rounded-full bg-brand font-black text-white">{report.no}</span>
                <h3 className="perk-card-title mt-4 font-black text-ink">{report.title}</h3>
                <p className="perk-card-sub mt-2 font-bold text-brand">{report.sub}</p>
                <p className="sales-body mt-3 text-slate-600">{report.desc}</p>
              </article>
            </FadeUp>
          ))}
        </div>

        <FadeUp className="mt-8">
          <div className="flex gap-3 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50 p-5">
            <WarningIcon />
            <div className="sales-body text-ink">
              <p className="font-black">라이브 참석자 한정 · 녹화본 없음</p>
              <p className="mt-1 text-slate-700">특강 마지막에 다운로드 링크를 드립니다.</p>
            </div>
          </div>
          <a href="#apply" className="primary-cta mt-8 flex w-full min-h-16 items-center justify-between rounded-xl bg-brand px-6 py-5 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 motion-reduce:transition-none">무료로 자리 맡기 <span>→</span></a>
          <PerkNote className="mt-4" />
        </FadeUp>
      </div>
    </section>
  );
}
