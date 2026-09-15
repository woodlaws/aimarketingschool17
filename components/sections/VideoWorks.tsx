"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FadeUp } from "@/components/Motion";

type VideoWork = {
  id: string;
  thumb: string;
  category: string;
  title: string;
  desc: string;
  youtubeUrl: string | null;
};

const VIDEO_WORKS: VideoWork[] = [
  {
    id: "v1",
    thumb: "/proof/videos/video-01.webp",
    category: "동물 쇼츠",
    title: "안전모 쓴 강아지 리포터",
    desc: "건설 현장 인터뷰 콘셉트. 캐릭터와 배경을 AI로 만들어 연결했습니다.",
    youtubeUrl: null,
  },
  {
    id: "v2",
    thumb: "/proof/videos/video-02.webp",
    category: "내 가게 홍보",
    title: "장성카센터 홍보 영상",
    desc: "배운 편집 기법을 그대로 본인 가게 홍보 영상에 적용했습니다.",
    youtubeUrl: null,
  },
  {
    id: "v3",
    thumb: "/proof/videos/video-03.webp",
    category: "공학 쇼츠",
    title: "복개된 옛 물길",
    desc: "도심 지하 수로를 단면도처럼 보여주는 구조 설명 영상입니다.",
    youtubeUrl: null,
  },
  {
    id: "v4",
    thumb: "/proof/videos/video-04.webp",
    category: "공학 쇼츠",
    title: "초고층 빌딩은 왜 안 쓰러질까",
    desc: "질문형 훅으로 시작해 원리를 풀어내는 지식 쇼츠입니다.",
    youtubeUrl: null,
  },
  {
    id: "v5",
    thumb: "/proof/videos/video-05.webp",
    category: "동물 쇼츠",
    title: "처서에 관한 대화",
    desc: "절기 이야기를 강아지 캐릭터 대화로 풀어낸 콘텐츠입니다.",
    youtubeUrl: null,
  },
  {
    id: "v6",
    thumb: "/proof/videos/video-06.webp",
    category: "동물 쇼츠",
    title: "한복 입은 강아지 인터뷰",
    desc: "캐릭터 일관성을 유지하며 장면을 이어 붙인 시리즈물입니다.",
    youtubeUrl: null,
  },
];

const videoAlt = (work: VideoWork) => `수강생이 AI로 만든 ${work.category} — ${work.title}`;

function VideoCard({ work, index, failed, onError }: { work: VideoWork; index: number; failed: boolean; onError: () => void }) {
  const isReady = work.youtubeUrl !== null;
  const content = (
    <>
      <div className="relative aspect-[9/16] overflow-hidden bg-slate-200">
        {failed ? (
          <span className="flex h-full items-center justify-center px-4 text-center text-xs font-bold text-slate-500">이미지를 불러오지 못했습니다.</span>
        ) : (
          <Image src={work.thumb} alt={videoAlt(work)} fill priority={index < 2} sizes="(max-width: 768px) 60vw, 25vw" className="object-cover" onError={onError} />
        )}
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-b from-transparent to-black/75" />
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-black text-ink backdrop-blur-sm">{work.category}</span>
        {isReady ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-ink shadow-lg">영상 보기 ↗</span>
          </span>
        ) : (
          <>
            <span aria-hidden="true" className="absolute inset-0 bg-white/10" />
            <span className="absolute right-3 top-3 rounded-full bg-slate-400/90 px-3 py-1.5 text-xs font-black text-white backdrop-blur-sm">영상 준비 중</span>
          </>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-bold leading-6 text-ink">{work.title}</h3>
        <p className="mt-2 text-xs font-medium leading-5 text-slate-500">{work.desc}</p>
      </div>
    </>
  );

  const cardClass = "group block h-full overflow-hidden rounded-xl bg-white text-left shadow-lg transition duration-300 motion-reduce:transform-none motion-reduce:transition-none";
  return isReady ? (
    <a data-video-card={work.id} data-video-ready="true" href={work.youtubeUrl!} target="_blank" rel="noopener noreferrer" className={`${cardClass} hover:-translate-y-1 hover:shadow-sales focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-danger/60`}>
      {content}
    </a>
  ) : (
    <article data-video-card={work.id} data-video-ready="false" className={`${cardClass} cursor-default`}>
      {content}
    </article>
  );
}

export function VideoWorks() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  const updateCarouselIndex = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const cards = Array.from(carousel.querySelectorAll<HTMLElement>("[data-video-card]"));
    const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;
    const nearest = cards.reduce((best, card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - carouselCenter);
      return distance < best.distance ? { index, distance } : best;
    }, { index: 0, distance: Number.POSITIVE_INFINITY });
    setCarouselIndex(nearest.index);
  };

  const markFailed = (id: string) => setFailedImages((current) => current.includes(id) ? current : [...current, id]);

  return (
    <div data-video-works className="bg-[#F5F1E7]">
      <div className="mx-auto w-full max-w-[1000px]">
        <div className="flex items-center gap-4 px-5 py-10 md:px-8 lg:px-0" aria-hidden="true">
          <span className="h-px flex-1 bg-slate-300" />
          <span className="text-sm font-black text-slate-500">그리고, 영상까지</span>
          <span className="h-px flex-1 bg-slate-300" />
        </div>

        <FadeUp className="px-5 text-center md:px-8 lg:px-0">
          <span className="inline-flex rounded-full bg-brand-dark px-4 py-2 text-sm font-black text-white">AI 동영상 마스터 수업 결과물</span>
          <h2 className="mt-6 text-[clamp(2.2rem,4.7vw,3.25rem)] font-black leading-[1.14] tracking-[-0.04em] text-ink">
            <span className="hl">촬영도, 편집 프로그램도 없이</span><br />만든 영상입니다.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-600 md:text-xl">
            요즘 많이 물어보시는 공학 쇼츠와 동물 쇼츠, 수업에서 직접 만들어 봅니다.
          </p>
        </FadeUp>

        <div ref={carouselRef} onScroll={updateCarouselIndex} className="no-scrollbar mx-auto mt-10 flex w-full max-w-[920px] snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-8 lg:gap-5 lg:px-0">
          {VIDEO_WORKS.map((work, index) => (
            <FadeUp key={work.id} delay={(index % 3) * 0.06} className="w-[60vw] max-w-[310px] shrink-0 snap-center md:w-auto md:max-w-none">
              <VideoCard work={work} index={index} failed={failedImages.includes(work.id)} onError={() => markFailed(work.id)} />
            </FadeUp>
          ))}
        </div>

        <div className="flex justify-center gap-2 md:hidden" aria-label={`영상 결과물 ${carouselIndex + 1} / 6`}>
          {VIDEO_WORKS.map((work, index) => <span key={work.id} aria-hidden="true" className={`h-2.5 rounded-full transition-all ${carouselIndex === index ? "w-7 bg-brand-dark" : "w-2.5 bg-slate-300"}`} />)}
        </div>

        <div className="mt-12 bg-brand-dark px-5 py-12 text-center text-white md:mt-14 md:px-8">
          <FadeUp><p className="text-xl font-bold leading-snug md:text-3xl">처음엔 재미로 만들었습니다.</p></FadeUp>
          <FadeUp delay={0.4}><p className="mt-7 text-2xl font-black leading-snug text-accent md:text-[38px]">그런데 지금은, 자기 가게 홍보에 쓰고 있습니다.</p></FadeUp>
        </div>
        <FadeUp className="px-5">
          <p className="mx-auto mt-9 max-w-[520px] text-center text-lg font-semibold leading-8 text-slate-500">만들어 본 사람만 응용할 수 있습니다.</p>
        </FadeUp>
      </div>
    </div>
  );
}
