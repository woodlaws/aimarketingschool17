"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type MouseEvent } from "react";
import { FadeUp } from "@/components/Motion";
import { ProofLightbox } from "@/components/ProofLightbox";

const FLYWHEEL = [
  { no: 1, title: "고객·상품 설계", desc: "누구의 어떤 문제를 무엇으로 해결할지 정의합니다.", tags: ["타깃 고객", "문제", "상품", "가격"], live: false },
  { no: 2, title: "콘텐츠 기획", desc: "고객 고민·키워드·질문을 분석해 주제를 설계합니다.", tags: ["주제 선정", "훅 제목", "콘텐츠 캘린더"], live: true },
  { no: 3, title: "콘텐츠 자동 확산", desc: "블로그 1개를 쇼폼·스레드·유튜브·카드뉴스로 확장합니다.", tags: ["블로그", "인스타", "스레드", "유튜브", "카카오채널"], live: true },
  { no: 4, title: "리드 수집", desc: "무료 PDF·체크리스트·강의로 연락처를 확보합니다.", tags: ["랜딩페이지", "신청폼", "이메일/문자", "오픈채팅"], live: true },
  { no: 5, title: "신뢰 형성", desc: "후기·성공사례·뉴스레터로 관계와 신뢰를 쌓습니다.", tags: ["후기", "성공사례", "FAQ", "뉴스레터"], live: false },
  { no: 6, title: "판매 전환", desc: "상담·제안·결제로 연결해 실제 매출로 만듭니다.", tags: ["상담", "제안서", "결제", "예약"], live: false },
  { no: 7, title: "재구매·업셀", desc: "후속 상품 제안으로 고객가치를 확장합니다.", tags: ["후속 강의", "컨설팅", "멤버십", "VIP 관리"], live: false },
  { no: 8, title: "데이터 분석·개선", desc: "조회수·리드·전환율을 보고 다시 최적화합니다.", tags: ["조회수", "클릭률", "리드", "매출"], live: false },
] as const;

const AXES = ["🤖 AI와 함께 1인 나홀로 비즈니스", "⚙️ 반복 업무는 AI로 자동화", "📈 콘텐츠가 매출 흐름으로 연결"];
const FLOW = ["고객·상품", "콘텐츠", "확산", "리드 수집", "신뢰", "판매", "재구매", "개선"];
const LIVE_NUMBERS = ["②", "③", "④"];
const LIVE_STEPS = FLYWHEEL.filter((step) => step.live);
const FLYWHEEL_IMAGE = { src: "/proof/flywheel.webp", alt: "AI 수익화 콘텐츠 커머스 플라이휠 — 고객 설계부터 재구매·개선까지 8단계 순환 구조", width: 1400, height: 788 } as const;

function StepCard({ step, compact = false }: { step: (typeof FLYWHEEL)[number]; compact?: boolean }) {
  return (
    <li data-flywheel-step={step.no} className={`flywheel-card flex min-w-0 flex-col rounded-2xl bg-white ${step.live ? "border-2 border-brand shadow-lg" : "border border-slate-200 opacity-90"} ${compact ? "p-5" : "p-6"}`}>
      {step.live ? <div className="mb-3 flex justify-end"><span className="flywheel-pill rounded-full bg-brand px-3 py-1.5 font-black text-white">오늘 밤 공개</span></div> : null}
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flywheel-num flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-black ${step.live ? "bg-brand text-white" : "bg-slate-100 text-slate-600"}`}>{String(step.no).padStart(2, "0")}</span>
        <h3 className="flywheel-title min-w-0 flex-1 font-black text-ink">{step.title}</h3>
      </div>
      <p className="flywheel-desc mt-4 text-slate-600">{step.desc}</p>
      <div className="flywheel-tags mt-auto flex flex-wrap gap-2 pt-4">{step.tags.map((tag) => <span key={tag} className="flywheel-tag rounded-full bg-slate-100 px-3 py-2 font-bold text-slate-600">{tag}</span>)}</div>
    </li>
  );
}

export function FlywheelSection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const openLightbox = (event: MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = event.currentTarget;
    setLightboxOpen(true);
  };

  return (
    <section data-flywheel-section className="bg-[#F5F1E7] py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1100px] px-5 md:px-8 lg:px-0">
        <FadeUp className="text-center">
          <span className="inline-flex rounded-full bg-brand-dark px-4 py-2 text-sm font-black text-white">AI 수익화 엔진</span>
          <h2 className="mt-6 text-[clamp(2.15rem,5vw,4rem)] font-black leading-[1.12] tracking-[-0.04em] text-ink"><span className="md:hidden">AI로 돈이 들어오는<br />구조는</span><span className="hidden md:inline">AI로 돈이 들어오는 구조는</span><br /><mark>이미 정해져 있습니다.</mark></h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-600 md:text-xl">1인기업·소상공인이 매출을 만드는 8단계 순환 구조입니다.</p>
        </FadeUp>

        <FadeUp className="mt-10 grid gap-3 md:grid-cols-3">{AXES.map((axis) => <div key={axis} className="rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-center text-sm font-bold text-slate-600">{axis}</div>)}</FadeUp>

        <div data-desktop-flywheel className="mt-10 hidden lg:block">
          <FadeUp>
            <button data-flywheel-image-button type="button" onClick={openLightbox} aria-label="AI 수익화 플라이휠 구조도 크게 보기" className="group relative block aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sales focus-visible:outline focus-visible:outline-4 focus-visible:outline-danger/60">
              {imageFailed ? <span className="flex h-full items-center justify-center font-bold text-slate-500">이미지를 불러오지 못했습니다.</span> : <Image src={FLYWHEEL_IMAGE.src} alt={FLYWHEEL_IMAGE.alt} fill sizes="1100px" className="object-cover" onError={() => setImageFailed(true)} />}
              <span className="absolute bottom-4 right-4 rounded-full bg-black/75 px-4 py-2 text-sm font-black text-white transition-transform group-hover:-translate-y-1 motion-reduce:transform-none motion-reduce:transition-none">🔍 크게 보기</span>
            </button>
          </FadeUp>
          <ol className="mt-8 grid grid-cols-3 gap-5">{LIVE_STEPS.map((step) => <StepCard key={step.no} step={step} compact />)}</ol>
        </div>

        <div data-mobile-flywheel className="mt-10 lg:hidden">
          <ol className="grid gap-4 md:grid-cols-2">{FLYWHEEL.map((step) => <StepCard key={step.no} step={step} />)}</ol>
          <button data-flywheel-image-button type="button" onClick={openLightbox} className="mt-7 inline-flex w-full items-center justify-center rounded-xl border-2 border-brand bg-white px-5 py-4 text-base font-black text-brand focus-visible:outline focus-visible:outline-4 focus-visible:outline-danger/60">전체 구조도 크게 보기 →</button>
        </div>

        <FadeUp className="mt-10 border-l-4 border-brand bg-blue-50 px-5 py-6 md:px-7">
          <p className="text-lg font-semibold text-slate-700">전체 구조는 위와 같습니다.</p>
          <p className="mt-4 text-lg font-black leading-9 text-ink">오늘 밤에는, 이 중 {LIVE_NUMBERS.map((number) => <span key={number} className="mx-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm text-white">{number}</span>)} 를 화면 켜고 직접 만들어 보여드립니다.</p>
        </FadeUp>
      </div>

      <div className="mx-auto mt-12 max-w-[1100px] bg-brand-dark px-5 py-12 text-center text-white md:mt-16 md:px-8 md:py-16">
        <FadeUp><p className="text-[22px] font-black leading-snug md:text-[34px]">AI는 단순히 일을 빨리 하게 해주는 <span className="text-accent">도구가 아닙니다</span>.</p></FadeUp>
        <FadeUp delay={0.4}><p className="mt-6 text-[17px] font-bold leading-relaxed text-slate-200 md:text-2xl">고객 설계부터 콘텐츠, 리드 수집, 판매, 재구매까지<br className="hidden md:block" /> 이어주는 <span className="font-black text-accent">수익화 시스템</span>입니다.</p></FadeUp>
      </div>

      <div className="mx-auto mt-8 w-full max-w-[1100px] px-5 md:px-8 lg:px-0">
        <div data-flywheel-flow className="no-scrollbar overflow-x-auto pb-3"><div className="mx-auto flex min-w-max items-center justify-center gap-2 text-sm font-bold text-slate-500">{FLOW.map((label, index) => <div key={label} className="flex items-center gap-2"><span className={index >= 1 && index <= 3 ? "text-brand" : ""}>{label}</span>{index < FLOW.length - 1 ? <span aria-hidden="true" className="text-slate-300">→</span> : null}</div>)}</div></div>
        <FadeUp className="mt-9 text-center">
          <p className="text-xl font-black text-ink md:text-2xl">이 구조, 9월 18일 밤에 직접 보여드립니다</p>
          <a href="#apply" className="primary-cta mt-6 inline-flex w-full max-w-[520px] items-center justify-between rounded-xl bg-brand px-6 py-5 font-black text-white shadow-lg transition hover:bg-blue-700 motion-reduce:transition-none">무료특강 신청하기 <span>→</span></a>
        </FadeUp>
      </div>

      {lightboxOpen ? <ProofLightbox image={FLYWHEEL_IMAGE} onClose={closeLightbox} returnFocus={triggerRef.current} wide /> : null}
    </section>
  );
}
