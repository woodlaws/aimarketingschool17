"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { FadeUp } from "@/components/Motion";
import { ProofLightbox } from "@/components/ProofLightbox";

const driveItems = [
  {
    src: "/proof/drive-01.webp",
    width: 1000,
    height: 419,
    alt: "수강생이 정리한 구글 드라이브 폴더 구조 — 번호를 붙인 팀 공용 드라이브",
    caption: "번호를 붙여 순서가 고정된 팀 공용 드라이브"
  },
  {
    src: "/proof/drive-02.webp",
    width: 1000,
    height: 484,
    alt: "수강생이 정리한 구글 드라이브 폴더 구조 — 1인 대행사 업무 관리",
    caption: "회사운영 · 클라이언트 · 콘텐츠 · SOP로 나눈 1인 대행사 드라이브"
  },
  {
    src: "/proof/drive-03.webp",
    width: 1000,
    height: 1777,
    alt: "수강생이 정리한 구글 드라이브 폴더 구조 — 브랜드별 작업 관리",
    caption: "브랜드별 작업 · 공통자료 · 아카이브까지 설계한 폴더 구조도"
  }
] as const;

type DriveFigureProps = {
  index: number;
  aspectClass: string;
  sizes: string;
  failed: boolean;
  onFailed: () => void;
  onOpen: () => void;
  buttonRef: (node: HTMLButtonElement | null) => void;
  objectPosition: "top-center" | "top-left";
  className?: string;
};

function DriveFigure({ index, aspectClass, sizes, failed, onFailed, onOpen, buttonRef, objectPosition, className = "" }: DriveFigureProps) {
  const item = driveItems[index];
  return (
    <figure className={className}>
      <button
        data-drive-image={item.src}
        ref={buttonRef}
        type="button"
        onClick={onOpen}
        aria-label={`${item.caption} 크게 보기`}
        className={`group relative block w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-200 text-left shadow-sm focus-visible:outline focus-visible:outline-4 focus-visible:outline-danger/60 ${aspectClass}`}
      >
        {failed ? (
          <span className="flex h-full items-center justify-center px-5 text-center text-sm font-black text-slate-500">이미지를 불러오지 못했습니다.</span>
        ) : (
          <Image src={item.src} alt={item.alt} fill sizes={sizes} className={`object-cover ${objectPosition === "top-center" ? "object-top" : "object-left-top"}`} onError={onFailed} />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
          <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-ink shadow-lg">🔍 크게 보기</span>
        </span>
      </button>
      <figcaption className="mt-2 text-xs font-bold leading-5 text-slate-500">{item.caption}</figcaption>
    </figure>
  );
}

export function DriveStrip() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<number[]>([]);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeLightbox = useCallback(() => setActiveIndex(null), []);
  const markFailed = (index: number) => setFailedImages((current) => current.includes(index) ? current : [...current, index]);
  const propsFor = (index: number) => ({
    index,
    failed: failedImages.includes(index),
    onFailed: () => markFailed(index),
    onOpen: () => setActiveIndex(index),
    buttonRef: (node: HTMLButtonElement | null) => { triggerRefs.current[index] = node; }
  });

  return (
    <div data-drive-strip className="mx-auto mt-14 w-full max-w-[920px] px-5 md:mt-16 md:px-8 lg:px-0">
      <div className="flex items-center gap-4 py-12" aria-hidden="true">
        <span className="h-px flex-1 bg-slate-300" />
        <span className="text-sm font-black text-slate-500">그리고, 파일까지</span>
        <span className="h-px flex-1 bg-slate-300" />
      </div>

      <FadeUp className="text-center">
        <h3 className="text-2xl font-black leading-snug text-ink md:text-3xl">화면만 정리되는 게 아닙니다.</h3>
        <p className="mx-auto mt-4 max-w-2xl whitespace-pre-line text-[15px] font-semibold leading-7 text-slate-500 md:text-base">
          같은 수업에서 구글 드라이브도 함께 정리합니다.{"\n"}어디에 뒀는지 찾아 헤매던 파일이 번호가 붙은 구조로 들어갑니다.
        </p>
      </FadeUp>

      <FadeUp className="mt-9 grid gap-5 lg:grid-cols-[38fr_62fr]">
        <DriveFigure {...propsFor(2)} aspectClass="aspect-[9/16]" objectPosition="top-center" sizes="(max-width: 768px) 270px, 34vw" className="mx-auto w-full max-w-[270px] lg:max-w-none" />
        <div className="grid content-start gap-5">
          <DriveFigure {...propsFor(0)} aspectClass="aspect-[16/7]" objectPosition="top-left" sizes="(max-width: 768px) 90vw, 56vw" />
          <DriveFigure {...propsFor(1)} aspectClass="aspect-[16/7]" objectPosition="top-left" sizes="(max-width: 768px) 90vw, 56vw" />
        </div>
      </FadeUp>

      <FadeUp>
        <p className="mx-auto mt-9 max-w-[560px] text-center text-base font-semibold leading-8 text-slate-500 md:text-lg">
          폴더 이름 앞에 번호 하나 붙였을 뿐인데, <span className="hl">파일 찾는 시간이 사라집니다</span>.
        </p>
      </FadeUp>

      {activeIndex !== null ? <ProofLightbox key={driveItems[activeIndex].src} image={driveItems[activeIndex]} onClose={closeLightbox} returnFocus={triggerRefs.current[activeIndex]} wide={activeIndex !== 2} /> : null}
    </div>
  );
}
