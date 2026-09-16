"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { FadeUp } from "@/components/Motion";
import { ProofLightbox } from "@/components/ProofLightbox";

const proofItems = [
  {
    src: "/proof/result-01.png",
    width: 1324,
    height: 1533,
    alt: "누룩 수업 교육자료 — 수강생이 직접 제작한 발효음식 인포그래픽",
    tag: "발효식품 교육",
    title: "누룩 수업 교육자료",
    quote: "\"수업 자료 만드는 게 제일 큰 스트레스였어요.\n이젠 그 시간이 확 줄었습니다.\"",
    maker: "60대 초반 · 여성 대표님"
  },
  {
    src: "/proof/result-02.png",
    width: 1055,
    height: 1491,
    alt: "패션쇼 참가자 모집 포스터 — 수강생이 직접 제작한 업사이클링 패션쇼 홍보물",
    tag: "패션 디자인",
    title: "패션쇼 참가자 모집 포스터",
    quote: "\"홍보물을 맡길 곳을 찾아다녔는데,\n이제는 제가 만듭니다.\"",
    maker: "60대 · 여성 대표님"
  },
  {
    src: "/proof/result-03.png",
    width: 1254,
    height: 1254,
    alt: "일본 판매 상세페이지 — 수강생이 직접 제작한 Qoo10 화장품 판매 디자인",
    tag: "일본 Qoo10 셀러",
    title: "일본 판매 상세페이지",
    quote: "\"일본어 상세페이지까지\n직접 뽑아내고 있습니다.\"",
    maker: "해외 이커머스 운영 대표님"
  }
] as const;

export function ProofRow() {
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
    const cards = Array.from(carousel.querySelectorAll<HTMLElement>("[data-proof-card]"));
    const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;
    const nearest = cards.reduce((best, card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      return Math.abs(cardCenter - carouselCenter) < best.distance
        ? { index, distance: Math.abs(cardCenter - carouselCenter) }
        : best;
    }, { index: 0, distance: Number.POSITIVE_INFINITY });
    setCarouselIndex(nearest.index);
  };

  return (
    <div className="bg-[#F5F1E7] py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <FadeUp className="px-5 text-center md:px-8">
          <span className="inline-flex rounded-full bg-brand-dark px-4 py-2 text-sm font-black text-white">실제 수강생 결과물</span>
          <h2 className="mt-6 text-[clamp(2.3rem,5vw,4rem)] font-black leading-[1.12] tracking-[-0.04em] text-ink">
            이 세 개, 전부<br />
            수강생이 <span className="bg-accent px-1">직접</span> 만든 겁니다.
          </h2>
          <p className="mt-5 text-lg font-semibold leading-8 text-slate-600 md:text-xl">외주도, 디자이너도 없이. 수업에서 배운 그대로요.</p>
        </FadeUp>

        <div
          ref={carouselRef}
          onScroll={updateCarouselIndex}
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-8 lg:px-0"
        >
          {proofItems.map((item, index) => (
            <button
              key={item.src}
              ref={(node) => { triggerRefs.current[index] = node; }}
              data-proof-card
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${item.title} 크게 보기`}
              className="group w-[82vw] max-w-[350px] shrink-0 snap-center overflow-hidden rounded-2xl bg-white text-left shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-sales focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transform-none motion-reduce:transition-none md:w-auto md:max-w-none"
            >
              <span className="relative block aspect-[3/4] overflow-hidden bg-slate-200">
                {failedImages.includes(index) ? (
                  <span className="flex h-full items-center justify-center px-6 text-center text-sm font-bold text-slate-500">이미지를 불러오지 못했습니다.</span>
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top"
                    onError={() => markFailed(index)}
                  />
                )}
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white" />
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-sm font-black text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">🔍 크게 보기</span>
              </span>
              <span className="block p-6">
                <span className="text-sm font-black text-brand">{item.tag}</span>
                <span className="proof-card-title mt-2 block font-black text-ink">{item.title}</span>
                <span className="proof-card-quote mt-5 block whitespace-pre-line border-l-4 border-accent pl-4 font-semibold text-slate-700">{item.quote}</span>
                <span className="proof-card-maker mt-5 block border-t border-slate-200 pt-4 font-bold text-slate-500">{item.maker}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-2 md:hidden" aria-label={`결과물 ${carouselIndex + 1} / 3`}>
          {proofItems.map((item, index) => (
            <span key={item.src} aria-hidden="true" className={`h-2.5 rounded-full transition-all ${carouselIndex === index ? "w-7 bg-brand-dark" : "w-2.5 bg-slate-300"}`} />
          ))}
        </div>

        <div className="mt-12 bg-brand-dark px-5 py-12 text-center text-white md:mt-16 md:px-8 md:py-16">
          <FadeUp><p className="text-xl font-bold leading-snug md:text-3xl">세 분 다 디자이너가 아닙니다.</p></FadeUp>
          <FadeUp delay={0.4}><p className="mt-7 text-[26px] font-black leading-snug text-accent md:text-[40px]">그리고 두 분은, 60대입니다.</p></FadeUp>
        </div>
        <FadeUp className="px-5">
          <p className="mx-auto mt-9 max-w-[520px] text-center text-lg font-semibold leading-8 text-slate-500">
            도구를 잘 다뤄서가 아닙니다.<br />
            만드는 순서를 배웠기 때문입니다.
          </p>
        </FadeUp>
      </div>

      {activeIndex !== null ? <ProofLightbox key={proofItems[activeIndex].src} image={proofItems[activeIndex]} onClose={closeLightbox} returnFocus={triggerRefs.current[activeIndex]} /> : null}
    </div>
  );
}
