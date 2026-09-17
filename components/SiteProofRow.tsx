"use client";

import Image from "next/image";
import { useState } from "react";
import { FadeUp } from "@/components/Motion";

const siteProofItems = [
  {
    src: "/proof/site-01-anjeontim.webp",
    alt: "안전팀 공식 홈페이지 — 수강생이 직접 제작한 산업안전 장비 사이트",
    tag: "산업안전 장비",
    name: "안전팀",
    description: "\"지게차 충돌\", \"출입금지\" 같은 위험 상황별로 제품을 찾아주는 구조.\n제품 소개부터 설치사례, 상담 문의까지 한 동선으로 연결됩니다.",
    domain: "anjeontim.vercel.app",
    url: "https://anjeontim.vercel.app/"
  },
  {
    src: "/proof/site-02-giunchan.webp",
    alt: "기운찬 공식 홈페이지 — 수강생이 직접 제작한 천연물 바이오소재 기업 사이트",
    tag: "천연물 바이오소재",
    name: "기운찬",
    description: "브랜드 소개와 제품 안내를 한 페이지에 담은 공식 홈페이지.\n방문자가 제품을 이해하고 문의까지 이어지도록 설계했습니다.",
    domain: "giunchan-website.vercel.app",
    url: "https://giunchan-website.vercel.app/"
  },
  {
    src: "/proof/site-03-seasonal.webp",
    alt: "제철라이프 홈페이지 — 수강생이 직접 제작한 가족 식단 콘텐츠 사이트",
    tag: "식단 콘텐츠",
    name: "제철라이프",
    description: "\"한 번 장보고, 다섯 식구의 일주일을 건강하게.\"\n주간 식단·장보기 목록·레시피·양념사전까지 들어간 콘텐츠형 사이트입니다.",
    domain: "seasonal-family-table-gcv6.vercel.app",
    url: "https://seasonal-family-table-gcv6.vercel.app/"
  },
  {
    src: "/proof/site-04-dmdnp.webp",
    alt: "대명DnP 공식 홈페이지 — 수강생이 직접 제작한 사인·간판 제작 사이트",
    tag: "사인·간판 제작",
    name: "대명DnP",
    description: "나무현판·아크릴 안내판·LED 전광판까지 6개 제품군을 한 페이지에 정리한 공식 홈페이지.\n회사 연혁과 제작사례로 신뢰를 쌓고 견적 문의로 이어지도록 설계했습니다.",
    domain: "dmdnp0909-khaki.vercel.app",
    url: "https://dmdnp0909-khaki.vercel.app/"
  }
] as const;

export function SiteProofRow() {
  const [failedImages, setFailedImages] = useState<number[]>([]);

  const markFailed = (index: number) => {
    setFailedImages((current) => current.includes(index) ? current : [...current, index]);
  };

  return (
    <div className="bg-[#F5F1E7] pb-16 md:pb-24">
      <div className="mx-auto w-full max-w-[1100px]">
        <div className="flex items-center gap-4 px-5 py-12 md:px-8 lg:px-0" aria-hidden="true">
          <span className="h-px flex-1 bg-slate-300" />
          <span className="text-sm font-black text-slate-500">그리고, 홈페이지까지</span>
          <span className="h-px flex-1 bg-slate-300" />
        </div>

        <FadeUp className="px-5 text-center md:px-8">
          <span className="inline-flex rounded-full bg-brand-dark px-4 py-2 text-sm font-black text-white">수강생이 만든 진짜 홈페이지</span>
          <h2 className="mt-6 text-[clamp(2.3rem,5vw,4rem)] font-black leading-[1.12] tracking-[-0.04em] text-ink">
            이 사이트들, 지금 눌러보세요.<br />
            <span className="bg-accent px-1">진짜로 열립니다.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-600 md:text-xl">
            캡쳐가 아니라 실제로 운영 중인 사이트입니다. 전부 수강생이 직접 만들었습니다.
          </p>
        </FadeUp>

        <div
          className="mt-12 grid grid-cols-1 items-stretch gap-6 px-5 pb-6 md:grid-cols-2 md:px-8 lg:px-0"
        >
          {siteProofItems.map((item, index) => (
            <article
              key={item.url}
              data-site-proof-card
              className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-sales motion-reduce:transform-none motion-reduce:transition-none"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.name} 홈페이지 새 탭에서 열기`}
                className="relative block aspect-[3/4] overflow-hidden bg-slate-200 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-accent"
              >
                {failedImages.includes(index) ? (
                  <span className="flex h-full items-center justify-center px-6 text-center text-sm font-black text-slate-500">캡쳐 준비 중</span>
                ) : (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 88px) / 2), 550px"
                    className="object-cover object-top"
                    onError={() => markFailed(index)}
                  />
                )}
                <span className="absolute inset-x-0 top-0 z-10 flex h-7 items-center border-b border-slate-300 bg-slate-100/95 px-3 shadow-sm" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="ml-1.5 h-2 w-2 rounded-full bg-yellow-400" />
                  <span className="ml-1.5 h-2 w-2 rounded-full bg-green-400" />
                  <span className="pointer-events-none absolute inset-x-14 truncate text-center text-[12px] font-bold text-slate-500">{item.domain}</span>
                </span>
                <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none">
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-ink shadow-lg">사이트 열어보기 ↗</span>
                </span>
              </a>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm font-black text-brand">{item.tag}</p>
                <h3 className="mt-2 text-2xl font-black leading-snug text-ink">{item.name}</h3>
                <p className="mt-4 whitespace-pre-line break-keep pb-6 text-[15px] font-semibold leading-7 text-slate-600">{item.description}</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex w-full items-center justify-between rounded-full bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 transition-colors hover:bg-brand hover:text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
                  aria-label={`${item.domain} 새 탭에서 열기`}
                >
                  <span className="flex min-w-0 items-center gap-2"><span aria-hidden="true">🌐</span><span className="truncate">{item.domain}</span></span>
                  <span className="ml-2" aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 bg-brand-dark px-5 py-12 text-center text-white md:mt-16 md:px-8 md:py-16">
          <FadeUp><p className="text-xl font-bold leading-snug md:text-3xl">네 개 다, 개발자 없이 만들었습니다.</p></FadeUp>
          <FadeUp delay={0.4}><p className="mt-7 text-2xl font-black leading-snug text-accent md:text-4xl">코딩을 배운 게 아니라, 만드는 순서를 배웠습니다.</p></FadeUp>
        </div>
      </div>
    </div>
  );
}
