import Image from "next/image";
import { ApplyForm } from "@/components/ApplyForm";
import { Countdown } from "@/components/Countdown";
import { FadeUp } from "@/components/Motion";
import { BookTimeline } from "@/components/sections/BookTimeline";

export function Profile() {
  return <section className="sales-section bg-surface"><div className="mx-auto grid w-full max-w-[900px] items-center gap-10 md:grid-cols-[.8fr_1.2fr]"><FadeUp><div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl bg-slate-200"><Image src="/instructor.png" alt="임헌수 거상스쿨·거상마케팅센터 대표" fill sizes="(max-width: 767px) 90vw, 360px" className="object-cover object-top" priority={false} /></div></FadeUp><FadeUp><p className="font-extrabold text-brand">강사 프로필</p><h2 className="mt-3 text-4xl font-black">임헌수</h2><p className="mt-2 text-lg font-bold text-muted">거상스쿨 · 거상마케팅센터 대표</p><ul className="sales-body mt-7 space-y-3">{["마케팅 분야 저서 7권 집필 · 큐레이션 2권 감수 (2014~2025)","13년 현장 강의 (2013.8.17 ~ 현재)","AI마케팅스쿨 16기까지 운영","네이버 마케팅 · AEO/GEO · 정부지원사업 전문","소상공인·중소기업 온라인 마케팅 대행 운영 중"].map(item=><li key={item} className="flex gap-3"><span className="font-black text-brand">•</span>{item}</li>)}</ul><blockquote className="mt-8 border-l-4 border-accent bg-white p-6 text-xl font-black leading-relaxed shadow-sm">&quot;강의만 하는 사람이 아닙니다.<br />대행사를 직접 돌리면서, 제 돈으로 검증합니다.&quot;</blockquote></FadeUp></div><BookTimeline /></section>;
}

export function Urgency() {
  const items=["9월 18일(금) 밤 8시, 단 1회","녹화본 없음 · 다시보기 없음","실시간 Q&A는 선착순","17기는 2026년 마지막 기수 — 이 특강이 마지막 안내입니다"];
  return <section className="sales-section bg-brand text-white"><div className="sales-wrap"><FadeUp><h2 className="sales-title text-center">이 특강, 다시 없습니다.</h2></FadeUp><FadeUp className="mt-10"><Countdown /></FadeUp><div className="mt-10 space-y-3">{items.map(item=><FadeUp key={item}><p className="rounded-xl bg-white/10 p-4 font-extrabold">🔴 {item}</p></FadeUp>)}</div></div></section>;
}

export function Apply() {
  return <section id="apply" className="sales-section scroll-mt-6 bg-surface"><div className="sales-wrap"><FadeUp className="text-center"><h2 className="sales-title">0원. 2시간 30분. 자리 하나.</h2><p className="sales-body mt-4 text-muted">신청하시면 문자로 참여 링크를 보내드립니다.</p></FadeUp><FadeUp className="mt-10"><ApplyForm /></FadeUp></div></section>;
}

const faqs = [
  ["AI 완전 초보인데 따라갈 수 있나요?", "네. 코딩·디자인 경험 전혀 필요 없습니다. ChatGPT 가입만 되어 있으면 충분합니다."],
  ["녹화본을 주시나요?", "제공하지 않습니다. 실시간 참여만 가능합니다. 시연 위주라 라이브로만 의미가 있습니다."],
  ["특강 듣고 나면 유료 결제를 강요하나요?", "아니요. 특강 자체로 완결된 내용입니다. 17기 안내는 마지막 10분에만 드립니다."],
  ["제 업종에도 해당되나요?", "오프라인 매장, 온라인 쇼핑몰, 서비스업, 1인 프리랜서 모두 적용 가능한 구조로 설명드립니다."],
  ["노트북이 꼭 있어야 하나요?", "폰으로 시청만 하셔도 됩니다. 다만 함께 따라 해보시려면 PC를 권장합니다."],
  ["중간에 나가도 되나요?", "네. 다만 4번째 파트(AI 직원 세팅)가 가장 반응이 좋습니다."],
  ["17기는 언제 시작하나요?", "2026년 10월 8일(목) 개강, 12주 과정입니다. 매주 목요일 저녁 8~11시 Zoom 라이브로 진행됩니다."]
];

export function FAQ() {
  return <section className="sales-section bg-white"><div className="sales-wrap"><FadeUp><h2 className="sales-title">자주 묻는 질문</h2></FadeUp><div className="mt-10 divide-y divide-slate-200 border-y border-slate-300">{faqs.map(([q,a],i)=><details key={q} open={i===0} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-extrabold"><span>{q}</span><span className="text-brand group-open:rotate-45">＋</span></summary><p className="sales-body pt-4 text-muted">{a}</p></details>)}</div></div></section>;
}

export function FinalCTA() {
  return <><section className="sales-section bg-brand-dark text-center text-white"><div className="sales-wrap"><FadeUp><h2 className="text-3xl font-black leading-relaxed md:text-5xl">작년에도 똑같은 고민 하셨을 겁니다.<br /><br />내년에도 똑같이 하시겠습니까?</h2><a href="#apply" className="primary-cta mt-10 flex w-full items-center justify-between rounded-xl bg-brand px-6 py-5 font-black">무료특강 신청하기 <span>→</span></a><p className="mt-7 text-sm font-extrabold leading-7 text-accent">P.S. 녹화본은 없습니다.<br />9월 18일 밤 8시에 안 오시면, 이 내용은 그냥 사라집니다.</p></FadeUp></div></section><footer className="bg-slate-950 px-5 py-10 text-center text-sm leading-7 text-slate-400"><p className="font-bold text-white">거상스쿨 · 거상마케팅센터</p><p>교육 문의 : 권현임 교육팀장 <a className="text-white underline" href="tel:01057958075">010-5795-8075</a></p><p>AI마케팅스쿨 17기 : 2026년 10월 8일(목) 개강 · 12주 과정</p></footer></>;
}
