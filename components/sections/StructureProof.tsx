import { FadeUp } from "@/components/Motion";
import { ProofRow } from "@/components/ProofRow";
import { SiteProofRow } from "@/components/SiteProofRow";
import { ReviewProofRow } from "@/components/ReviewProofRow";
import { NotionProofRow } from "@/components/NotionProofRow";
import { VideoWorks } from "@/components/sections/VideoWorks";

const steps = [
  { no: "01", title: "만들기", description: "고객의 질문에서 콘텐츠 소재를 뽑아 AI로 생산", result: "매일 나오는 콘텐츠" },
  { no: "02", title: "퍼뜨리기", description: "글 1개를 숏폼·카드뉴스·스레드로 확장", result: "5개 채널 동시 노출" },
  { no: "03", title: "담기", description: "관심을 문의·신청으로 받는 홈페이지 동선", result: "새는 트래픽 차단" },
  { no: "04", title: "맡기기", description: "반복 업무를 AI 직원에게 분업", result: "내 시간 회수" }
];

export function FourStepStructure() {
  return <section className="sales-section bg-brand text-white"><div className="mx-auto w-full max-w-6xl"><FadeUp className="mx-auto max-w-[680px] text-center"><h2 className="sales-title">AI로 돈이 들어오는 구조는<br />딱 4개로 되어 있습니다.</h2></FadeUp><div className="mt-12 grid gap-7 md:grid-cols-4 md:gap-4">{steps.map((step,i)=><FadeUp key={step.no} delay={i*.1} className="relative"><article className="h-full rounded-2xl border border-white/25 bg-white p-6 text-ink shadow-sales"><span className="text-sm font-black text-brand">{step.no}</span><h3 className="mt-3 text-2xl font-black">{step.title}</h3><p className="mt-4 text-base leading-7 text-slate-600">{step.description}</p><p className="mt-6 border-t border-slate-200 pt-4 font-extrabold text-brand">{step.result}</p></article>{i<steps.length-1?<><span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-2xl font-black md:hidden">↓</span><span className="absolute -right-4 top-1/2 hidden translate-x-1/2 -translate-y-1/2 text-2xl font-black md:block">→</span></>:null}</FadeUp>)}</div><FadeUp className="mx-auto mt-16 max-w-[680px] text-center"><p className="text-2xl font-black leading-relaxed md:text-4xl">이 4개가 한 줄로 연결되는 순간,<br /><br />내가 자는 동안에도 문의가 들어옵니다.</p><a href="#apply" className="mt-9 inline-flex w-full items-center justify-between rounded-xl bg-brand-dark px-6 py-5 text-lg font-black text-white">무료특강 신청하기 <span>→</span></a></FadeUp></div></section>;
}

export function Proof() {
  return <section id="proof" className="bg-surface"><NotionProofRow /><ProofRow /><VideoWorks /><SiteProofRow /><ReviewProofRow /></section>;
}
