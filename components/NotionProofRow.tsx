"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { FadeUp } from "@/components/Motion";
import { ProofLightbox } from "@/components/ProofLightbox";
import { DriveStrip } from "@/components/DriveStrip";

const notionItems = [
  {
    src: "/proof/notion-01.webp",
    width: 1200,
    height: 842,
    alt: "수강생이 만든 노션 업무 대시보드 — 반려견 굿즈 브랜드",
    tag: "반려견 굿즈 브랜드",
    name: "멍멍앤코 대시보드",
    description: "스티커 제작부터 상세페이지 기획, 블로그 스케줄까지\n진행 중인 프로젝트를 한 화면에서 관리합니다.",
    chips: ["프로젝트 관리", "블로그 스케줄표", "레퍼런스 아카이브"]
  },
  {
    src: "/proof/notion-02.webp",
    width: 1200,
    height: 713,
    alt: "수강생이 만든 노션 업무 대시보드 — 부동산 분양",
    tag: "부동산 분양",
    name: "알아차림 업무 허브",
    description: "자주 쓰는 사이트와 AI 도구를 상단에 모으고,\n마케팅 캘린더로 한 달 콘텐츠 일정을 관리합니다.",
    chips: ["마케팅 캘린더", "링크 허브", "콘텐츠 아카이브"]
  },
  {
    src: "/proof/notion-03.webp",
    width: 1200,
    height: 702,
    alt: "수강생이 만든 노션 업무 대시보드 — 웰니스 센터",
    tag: "웰니스 센터",
    name: "리애토 웰니스 하우스",
    description: "고객 연락, 상담 준비, 콘텐츠 발행까지\n기한·중요도·진행상태로 하루 업무를 한눈에 봅니다.",
    chips: ["업무 실행 관리 DB", "고객 관리", "진행상태 트래킹"]
  }
] as const;

export function NotionProofRow() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<number[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  const markFailed = (index: number) => {
    setFailedImages((current) => current.includes(index) ? current : [...current, index]);
  };

  const updateCarouselIndex = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const cards = Array.from(carousel.querySelectorAll<HTMLElement>("[data-notion-card]"));
    const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;
    const nearest = cards.reduce((best, card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - carouselCenter);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Number.POSITIVE_INFINITY });
    setCarouselIndex(nearest.index);
  };

  return (
    <div data-notion-proof className="bg-[#F5F1E7] pt-16 md:pt-24">
      <div className="mx-auto w-full max-w-[1140px]">
        <FadeUp className="px-5 text-center md:px-8">
          <span className="inline-flex rounded-full bg-brand-dark px-4 py-2 text-sm font-black text-white">1주차 수업 결과물</span>
          <h2 className="mt-6 text-[clamp(2.3rem,5vw,4rem)] font-black leading-[1.12] tracking-[-0.04em] text-ink">
            수업 <span className="hl">딱 한 번</span> 듣고,<br />
            이걸 만들었습니다.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl whitespace-pre-line text-lg font-semibold leading-8 text-slate-600 md:text-xl">
            흩어져 있던 일과 자료를 한 화면에 모으는 업무 대시보드입니다.{"\n"}AI마케팅스쿨 1주차에 다루는 내용이고, 만족도가 가장 높은 수업입니다.
          </p>
        </FadeUp>

        <div
          ref={carouselRef}
          onScroll={updateCarouselIndex}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-8 lg:grid-cols-3 lg:gap-6 lg:px-0"
        >
          {notionItems.map((item, index) => (
            <FadeUp
              key={item.src}
              delay={index * 0.08}
              className="w-[88vw] max-w-[390px] shrink-0 snap-center md:w-auto md:max-w-none md:last:col-span-2 md:last:mx-auto md:last:w-[calc(50%-0.5rem)] lg:last:col-span-1 lg:last:mx-0 lg:last:w-auto"
            >
              <article data-notion-card className="group h-full overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-sales motion-reduce:transform-none motion-reduce:transition-none">
                <button
                  ref={(node) => { triggerRefs.current[index] = node; }}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`${item.name} 크게 보기`}
                  className="relative block aspect-[16/10] w-full overflow-hidden bg-slate-200 text-left focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-danger/60"
                >
                  {failedImages.includes(index) ? (
                    <span className="flex h-full items-center justify-center px-6 text-center text-sm font-black text-slate-500">이미지를 불러오지 못했습니다.</span>
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 88vw, 33vw"
                      className="object-cover object-top"
                      onError={() => markFailed(index)}
                    />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none">
                    <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-ink shadow-lg">🔍 크게 보기</span>
                  </span>
                </button>

                <div className="p-6">
                  <p className="text-sm font-black text-brand">{item.tag}</p>
                  <h3 className="mt-2 text-2xl font-black leading-snug text-ink">{item.name}</h3>
                  <p className="mt-4 whitespace-pre-line text-[15px] font-semibold leading-7 text-slate-600">{item.description}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {item.chips.map((chip) => <span key={chip} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">{chip}</span>)}
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>

        <div className="flex justify-center gap-2 md:hidden" aria-label={`노션 대시보드 ${carouselIndex + 1} / 3`}>
          {notionItems.map((item, index) => (
            <span key={item.src} aria-hidden="true" className={`h-2.5 rounded-full transition-all ${carouselIndex === index ? "w-7 bg-brand-dark" : "w-2.5 bg-slate-300"}`} />
          ))}
        </div>

        <DriveStrip />

        <div className="mt-12 bg-brand-dark px-5 py-12 text-center text-white md:mt-16 md:px-8 md:py-16">
          <FadeUp><p className="text-xl font-bold leading-snug md:text-3xl">화면도, 파일도, 1주차에 끝냅니다.</p></FadeUp>
          <FadeUp delay={0.4}><p className="mt-7 text-2xl font-black leading-snug text-accent md:text-[38px]">12주차 결과물이 아니라, 첫 수업 결과물입니다.</p></FadeUp>
        </div>
        <FadeUp className="px-5">
          <p className="mx-auto mt-9 max-w-[520px] text-center text-lg font-semibold leading-8 text-slate-500">도구가 어려운 게 아니라, 어디부터 손댈지를 몰랐던 겁니다.</p>
        </FadeUp>

        <div className="flex items-center gap-4 px-5 py-12 md:px-8 lg:px-0" aria-hidden="true">
          <span className="h-px flex-1 bg-slate-300" />
          <span className="text-sm font-black text-slate-500">그리고, 이런 것들도 만듭니다</span>
          <span className="h-px flex-1 bg-slate-300" />
        </div>
      </div>

      {activeIndex !== null ? <ProofLightbox key={notionItems[activeIndex].src} image={notionItems[activeIndex]} onClose={closeLightbox} returnFocus={triggerRefs.current[activeIndex]} wide /> : null}
    </div>
  );
}
