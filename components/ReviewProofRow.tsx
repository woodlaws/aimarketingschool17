"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { FadeUp } from "@/components/Motion";
import { ProofLightbox } from "@/components/ProofLightbox";

type ReviewItem = {
  id: number;
  src: string;
  width: number;
  height: number;
  alt: string;
  author: string;
  label: string;
  quote: string;
  highlights: readonly string[];
};

const freeClassReviews: readonly ReviewItem[] = [
  {
    id: 1, src: "/proof/reviews/review-01.png", width: 805, height: 358,
    alt: "거상스쿨 네이버 카페 수강 후기 — AI마케팅 무료특강 후 16기 수강신청",
    author: "스피카", label: "무료특강 → 16기 수강신청",
    quote: "환갑이 지난 나이, 하고 싶은 일은 많은데 또 한 번 도전합니다.\nAI마케팅 무료 특강 듣고, 바로 AI마케팅스쿨 16기에 수강신청했습니다.",
    highlights: ["환갑이 지난 나이", "바로 AI마케팅스쿨 16기에 수강신청했습니다"]
  },
  {
    id: 2, src: "/proof/reviews/review-02.png", width: 575, height: 440,
    alt: "거상스쿨 네이버 카페 수강 후기 — 70대도 자신감을 갖게 한 무료특강",
    author: "멘토스쿨", label: "무료특강 후기",
    quote: "70대도 자신감을 갖게 한 명품 특강이었습니다.\n남들한테는 늘 AI를 반드시 익혀야 한다고 하면서 정작 저는 미루기만 하다가,\n어제 특강을 듣는 순간 진작 익히지 못한 걸 후회했습니다.",
    highlights: ["70대도 자신감을 갖게 한 명품 특강"]
  },
  {
    id: 3, src: "/proof/reviews/review-03.png", width: 603, height: 340,
    alt: "거상스쿨 네이버 카페 수강 후기 — 코딩 없이 자동화를 본 무료특강 후기",
    author: "마인드캔버스", label: "무료특강 후기",
    quote: "어제 특강을 통해 \"나도 할 수 있다\"는 강력한 자신감을 얻었습니다.\n비싼 에이전트나 복잡한 코딩 없이 클로드와 노션 연동만으로\n완벽한 자동화를 구현하는 것을 보고 매우 놀라웠습니다.",
    highlights: ["\"나도 할 수 있다\"는 강력한 자신감", "복잡한 코딩 없이"]
  },
  {
    id: 4, src: "/proof/reviews/review-04.png", width: 731, height: 449,
    alt: "거상스쿨 네이버 카페 수강 후기 — 무료특강 시연 후 수강신청",
    author: "수강생", label: "무료특강 → 수강신청",
    quote: "무료 특강에서 직접 시연해주시면서 알기 쉽게 설명해주셔서 수강 신청했습니다.\n첫 수업부터 많은 인사이트를 얻을 수 있어서 좋았습니다.",
    highlights: ["직접 시연해주시면서"]
  }
];

const courseReviews: readonly ReviewItem[] = [
  {
    id: 5, src: "/proof/reviews/review-05.png", width: 873, height: 442,
    alt: "거상스쿨 네이버 카페 수강 후기 — 16기 1주차",
    author: "kijun Bae119", label: "16기 1주차",
    quote: "컴퓨터에 익숙하지 않은 데다 60대 후반이라는 나이 때문에\n'내가 과연 끝까지 따라갈 수 있을까?' 하는 걱정이 많았습니다.",
    highlights: ["60대 후반이라는 나이"]
  },
  {
    id: 6, src: "/proof/reviews/review-06.png", width: 977, height: 485,
    alt: "거상스쿨 네이버 카페 수강 후기 — AI 멤버십 4회차",
    author: "김○현0808", label: "AI 멤버십 4회차",
    quote: "코딩 1도 몰라도 홈페이지가 만들어지고,\n자연어로 간단하게 말해도 홈페이지 목업 디자인을 만들어주는 순간 너무 신기했습니다.\n'홈페이지 제작'은 저와는 전혀 다른 세계의 일이라 생각했어요.",
    highlights: ["코딩 1도 몰라도 홈페이지가 만들어지고"]
  },
  {
    id: 7, src: "/proof/reviews/review-07.png", width: 1007, height: 849,
    alt: "거상스쿨 네이버 카페 수강 후기 — AI마케팅스쿨 멤버십 6주차",
    author: "김○정 부시지", label: "멤버십 6주차",
    quote: "그동안 홈페이지가 없어서, 상세페이지를 만들 수가 없어서, 글재주가 없어서…\n늘 핑계만 대고 미뤄뒀던 일들이 불가능하게 되었습니다.\n이번 수업에서 가장 크게 느낀 점은\n\"내가 그동안 미뤄두었던 일들을 이제는 시작할 수 있게 만들어 준다는 것\"입니다.",
    highlights: ["늘 핑계만 대고 미뤄뒀던 일들이 불가능하게 되었습니다"]
  },
  {
    id: 8, src: "/proof/reviews/review-08.png", width: 775, height: 400,
    alt: "거상스쿨 네이버 카페 수강 후기 — 16기 2차 교육",
    author: "정○희", label: "16기 2차 교육",
    quote: "수업을 듣는 내내 수강신청 안 했으면 어쩔 뻔했을까 하고\n속으로 몇 번이나 외쳤는지 모릅니다.\n제 사업에 꼭 필요한 핵심 내용들이 정말 가득했거든요.",
    highlights: ["수강신청 안 했으면 어쩔 뻔했을까"]
  },
  {
    id: 9, src: "/proof/reviews/review-09.png", width: 1050, height: 630,
    alt: "거상스쿨 네이버 카페 수강 후기 — 16기 6회차",
    author: "배○준 haedeun view", label: "16기 6회차",
    quote: "60대가 되어 새로운 것을 배운다는 것이 때로는 쉽지 않게 느껴집니다.\n하지만 예전 같으면 어렵다고 생각해 포기했을 일들을,\n지금은 하나씩 따라 해보고 다시 시도해 보고 있습니다.",
    highlights: ["예전 같으면 어렵다고 생각해 포기했을 일들"]
  },
  {
    id: 10, src: "/proof/reviews/review-10.png", width: 850, height: 688,
    alt: "거상스쿨 네이버 카페 수강 후기 — 16기 노션 첫 수업",
    author: "줍줍맘", label: "16기 1주차 · 노션",
    quote: "소감은, 노션! 인생 숙제 하나 해결했다! 입니다.\n3시간이 지나고 나니 어느새 노션이란 녀석을 정복해버린 느낌이 들었습니다.",
    highlights: ["인생 숙제 하나 해결했다"]
  },
  {
    id: 11, src: "/proof/reviews/review-11.png", width: 890, height: 1598,
    alt: "거상스쿨 네이버 카페 수강 후기 — 16기 9주차 홈페이지 제작",
    author: "박○나", label: "16기 9주차 · 홈페이지",
    quote: "깃허브와 버셀에 가입한 뒤 코덱스로 홈페이지를 만들기 시작했습니다.\n처음에는 정신없이 따라가면서도 \"오, 나도 홈페이지를 만들 수 있겠는데?\" 싶었습니다.",
    highlights: ["나도 홈페이지를 만들 수 있겠는데?"]
  },
  {
    id: 12, src: "/proof/reviews/review-12.png", width: 1042, height: 588,
    alt: "거상스쿨 네이버 카페 수강 후기 — AI 홈페이지 만들기 특강",
    author: "인생아 화이팅", label: "홈페이지 만들기 특강",
    quote: "평소 홈페이지를 직접 만들고 싶다는 생각은 있었지만\n코딩을 잘 모르다 보니 시작부터 어렵게 느껴졌습니다.\n전문적인 코딩 지식이 없어도 원하는 방향을 설명하면서\n홈페이지를 직접 만들어 갈 수 있다는 점이 가장 인상적이었습니다.",
    highlights: ["전문적인 코딩 지식이 없어도"]
  },
  {
    id: 13, src: "/proof/reviews/review-13.png", width: 854, height: 1182,
    alt: "거상스쿨 네이버 카페 수강 후기 — AI마케팅스쿨 15기 최종 랜딩페이지",
    author: "매트릭스", label: "15기 최종 과제",
    quote: "12주 동안 배운 내용들이 하나로 연결되는 것을 직접 경험할 수 있었습니다.\n처음에는 AI를 활용한 글쓰기 정도만 생각했지만,\n교육을 거듭할수록 AI는 단순한 대화 도구가 아니라는 걸 알게 됐습니다.",
    highlights: ["하나로 연결되는 것을 직접 경험"]
  },
  {
    id: 14, src: "/proof/reviews/review-14.png", width: 742, height: 790,
    alt: "거상스쿨 네이버 카페 수강 후기 — 16기 8주차 공학숏츠",
    author: "문○자", label: "16기 8주차 · 공학숏츠",
    quote: "이런 걸 만드는 사람들은 완전 특별한 사람들이라고 생각했는데…\n임헌수 대표님이 하라는 대로만 하니 작품이 탄생했어요.\n너무 신기하고 뿌듯하네요.",
    highlights: ["하라는 대로만 하니 작품이 탄생했어요"]
  },
  {
    id: 15, src: "/proof/reviews/review-15.png", width: 644, height: 1112,
    alt: "거상스쿨 네이버 카페 수강 후기 — 16기 1주차",
    author: "독도맘", label: "16기 1주차",
    quote: "저는 남들이 하는 것은 대충 다 따라할 수 있습니다. 툴도 다뤄는 봤습니다.\n그런데 그게 두서가 없어요. 그래서 알긴 아는데, 잘은 모릅니다.\n어찌어찌 남들을 따라갈 순 있지만, 실제로 제가 주체가 되면 허둥지둥합니다.",
    highlights: ["알긴 아는데, 잘은 모릅니다"]
  }
];

const escapedHighlight = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function HighlightedQuote({ review, compact = false }: { review: ReviewItem; compact?: boolean }) {
  const parts = review.quote.split(new RegExp(`(${review.highlights.map(escapedHighlight).join("|")})`, "g"));
  return (
    <blockquote className={`whitespace-pre-line border-l-[3px] border-danger pl-5 font-semibold leading-[1.85] text-slate-700 ${compact ? "text-base" : "text-base md:text-lg"}`}>
      {parts.map((part, index) => review.highlights.includes(part) ? <span key={`${part}-${index}`} className="hl">{part}</span> : part)}
    </blockquote>
  );
}

function ReviewCard({ review, compact, delay, onOpen, buttonRef }: { review: ReviewItem; compact?: boolean; delay: number; onOpen: () => void; buttonRef: (node: HTMLButtonElement | null) => void }) {
  return (
    <FadeUp delay={delay}>
      <article className={`h-full rounded-2xl border border-slate-200 bg-white shadow-lg ${compact ? "p-5" : "p-7"}`}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-red-50 px-3 py-1.5 text-sm font-black text-danger">{review.label}</span>
          <span className="text-sm font-bold text-slate-500">{review.author}</span>
        </div>
        <HighlightedQuote review={review} compact={compact} />
        <button
          ref={buttonRef}
          type="button"
          onClick={onOpen}
          aria-label={`${review.alt} 원본 보기`}
          className="group mt-7 flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-2 text-left transition-colors hover:border-danger/40 hover:bg-red-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-danger/40 motion-reduce:transition-none"
        >
          <span className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
            <Image src={review.src} alt={review.alt} fill sizes="144px" className="object-cover object-left-top" />
          </span>
          <span className="text-sm font-black text-slate-600 group-hover:text-danger">🔍 원본 보기</span>
        </button>
        <p className="mt-4 text-xs font-bold text-slate-400"><span aria-hidden="true" className="mr-1 text-green-600">N</span> 네이버 카페 · 거상스쿨</p>
      </article>
    </FadeUp>
  );
}

export function ReviewProofRow() {
  const [activeReview, setActiveReview] = useState<ReviewItem | null>(null);
  const [expanded, setExpanded] = useState(false);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const closeLightbox = useCallback(() => setActiveReview(null), []);
  const visibleCourseReviews = expanded ? courseReviews : courseReviews.slice(0, 6);

  return (
    <div className="bg-white py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1100px] px-5 md:px-8 lg:px-0">
        <div className="flex items-center gap-4 pb-12" aria-hidden="true">
          <span className="h-px flex-1 bg-slate-300" />
          <span className="text-sm font-black text-slate-500">직접 쓴 후기입니다</span>
          <span className="h-px flex-1 bg-slate-300" />
        </div>
        <FadeUp className="text-center">
          <span className="inline-flex rounded-full bg-brand-dark px-4 py-2 text-sm font-black text-white">네이버 카페 실제 후기</span>
          <h2 className="mt-6 text-[clamp(2.3rem,5vw,4rem)] font-black leading-[1.12] tracking-[-0.04em] text-ink">
            수업 끝나고, <span className="hl">직접 쓴 글</span>입니다.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-600 md:text-xl">저희가 요청해서 받은 후기가 아니라, 수강생이 카페에 올린 후기 글을 그대로 가져왔습니다.</p>
          <a href="https://cafe.naver.com/shopmanagement" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex text-sm font-bold text-slate-400 underline underline-offset-4 hover:text-brand">거상스쿨 네이버 카페에서 보기 ↗</a>
        </FadeUp>

        <div className="mt-16">
          <FadeUp>
            <p className="text-sm font-black text-danger">① 무료특강, 딱 한 번 듣고 나서</p>
            <h3 className="mt-2 text-2xl font-black text-ink md:text-3xl">유료 수업을 듣기 전, 무료특강만 듣고 쓴 글입니다.</h3>
          </FadeUp>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {freeClassReviews.map((review, index) => <ReviewCard key={review.id} review={review} delay={index * 0.08} onOpen={() => setActiveReview(review)} buttonRef={(node) => { triggerRefs.current[review.id] = node; }} />)}
          </div>
        </div>

        <div className="mt-14 bg-brand-dark px-5 py-12 text-center text-white md:mt-20 md:px-8 md:py-16">
          <FadeUp><p className="text-xl font-bold leading-snug md:text-3xl">무료특강 하나 듣고,</p></FadeUp>
          <FadeUp delay={0.4}><p className="mt-7 text-[26px] font-black leading-snug text-accent md:text-[40px]">70대도 &quot;할 수 있다&quot;고 썼습니다.</p></FadeUp>
        </div>

        <div className="mt-16 md:mt-24">
          <FadeUp>
            <p className="text-sm font-black text-danger">② 그리고, 실제로 수업을 들은 분들</p>
          </FadeUp>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {visibleCourseReviews.map((review, index) => <ReviewCard key={review.id} review={review} compact delay={index * 0.08} onOpen={() => setActiveReview(review)} buttonRef={(node) => { triggerRefs.current[review.id] = node; }} />)}
          </div>
          <div className="mt-8 text-center">
            <button type="button" onClick={() => setExpanded((current) => !current)} className="rounded-full border-2 border-brand-dark px-6 py-3 text-base font-black text-brand-dark transition-colors hover:bg-brand-dark hover:text-white focus-visible:outline focus-visible:outline-4 focus-visible:outline-accent motion-reduce:transition-none" aria-expanded={expanded}>
              {expanded ? "후기 접기 ▴" : "후기 5개 더 보기 ▾"}
            </button>
          </div>
        </div>

        <div className="mt-14 bg-brand-dark px-5 py-12 text-center text-white md:mt-20 md:px-8 md:py-16">
          <FadeUp><p className="text-xl font-bold leading-snug md:text-3xl">후기를 만들어 드린 게 아닙니다.</p></FadeUp>
          <FadeUp delay={0.4}><p className="mt-7 text-2xl font-black leading-snug text-accent md:text-4xl">카페에 가면, 지금도 계속 올라오고 있습니다.</p></FadeUp>
          <a href="https://cafe.naver.com/shopmanagement" target="_blank" rel="noopener noreferrer" className="mt-9 inline-flex rounded-full bg-white px-6 py-3 text-base font-black text-brand-dark hover:bg-accent">거상스쿨 카페에서 직접 보기 ↗</a>
        </div>
      </div>

      {activeReview ? <ProofLightbox key={activeReview.src} image={activeReview} onClose={closeLightbox} returnFocus={triggerRefs.current[activeReview.id]} /> : null}
    </div>
  );
}
