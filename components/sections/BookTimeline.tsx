"use client";

import Image from "next/image";
import { useState } from "react";
import { FadeUp } from "@/components/Motion";

type Book = {
  src: string;
  title: string;
  date: string;
  latest?: boolean;
};

const BOOKS: Book[] = [
  { src: "/proof/books/book-01-kakaostory.webp", title: "카카오스토리 채널 마케팅", date: "2014.10" },
  { src: "/proof/books/book-02-instagram.webp", title: "인스타그램 마케팅", date: "2016.07" },
  { src: "/proof/books/book-03-smartstore.webp", title: "스마트스토어(스토어팜) 마케팅", date: "2018.04" },
  { src: "/proof/books/book-04-fb-insta.webp", title: "페이스북 인스타그램 통합 마케팅", date: "2018.11" },
  { src: "/proof/books/book-05-tiktok.webp", title: "틱톡 마케팅", date: "2021.03" },
  { src: "/proof/books/book-06-detailpage.webp", title: "상세페이지 기획과 디자인", date: "2023.07" },
  { src: "/proof/books/book-07-chatgpt.webp", title: "ChatGPT 마케팅", date: "2025.01", latest: true },
];

const SUPERVISED: Book[] = [
  { src: "/proof/books/book-s1-curation.webp", title: "큐레이션", date: "2019" },
  { src: "/proof/books/book-s2-curation-practice.webp", title: "큐레이션 실전편", date: "2021" },
];

const YEAR_BADGES = [
  "bg-blue-600",
  "bg-purple-600",
  "bg-emerald-600",
  "bg-teal-600",
  "bg-red-600",
  "bg-orange-500",
  "bg-slate-950",
];

const toMonth = (date: string) => {
  const [year, month = "01"] = date.split(".");
  return Number(year) * 12 + Number(month) - 1;
};

const timelineStart = toMonth(BOOKS[0].date);
const timelineEnd = toMonth(BOOKS[BOOKS.length - 1].date);

function BookCover({ book, index, supervised = false }: { book: Book; index: number; supervised?: boolean }) {
  const [failed, setFailed] = useState(false);
  const year = book.date.split(".")[0];
  const alt = supervised
    ? `임헌수 감수 도서 — ${book.title}, ${year}년`
    : `임헌수 저서 — ${book.title}, ${book.date.replace(".", "년 ")}월 출간`;

  return (
    <li className={`${supervised ? "w-[27vw] max-w-[105px]" : "w-[30vw] max-w-[132px]"} shrink-0 snap-start md:w-auto md:max-w-none`}>
      <article className={`group relative ${book.latest ? "lg:scale-[1.15] lg:origin-bottom" : ""} transition-transform duration-300 hover:-translate-y-1.5 motion-reduce:transform-none motion-reduce:transition-none`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-md">
          {failed ? (
            <div className="flex h-full items-center justify-center px-2 text-center text-xs font-bold text-slate-500">표지 준비 중</div>
          ) : (
            <Image src={book.src} alt={alt} fill sizes={supervised ? "105px" : "(max-width: 767px) 30vw, 132px"} className="object-cover" onError={() => setFailed(true)} />
          )}
          {book.latest ? <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-1 text-[10px] font-black text-white shadow">최신작</span> : null}
          {supervised ? <span className="absolute left-2 top-2 rounded-full bg-slate-500 px-2 py-1 text-[10px] font-black text-white shadow">감수</span> : null}
        </div>
        <div className="mt-3 text-center">
          <time dateTime={book.date.replace(".", "-")} className={`inline-flex rounded-full px-2.5 py-1 text-xs font-black text-white ${supervised ? "bg-slate-500" : YEAR_BADGES[index]}`}>
            {book.date}
          </time>
          <p className="mt-2 line-clamp-2 min-h-9 text-xs font-bold leading-[1.45] text-slate-600">{book.title}</p>
        </div>
      </article>
    </li>
  );
}

export function BookTimeline() {
  return (
    <div className="mx-auto mt-16 w-full max-w-[960px] border-t border-slate-200 pt-14 md:mt-20 md:pt-16">
      <FadeUp className="text-center">
        <h3 className="text-2xl font-black leading-tight text-ink md:text-3xl">카카오스토리부터 ChatGPT까지</h3>
        <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-600 md:text-lg">
          새로운 플랫폼이 뜰 때마다, <span className="hl">가장 먼저</span> 정리해서 책으로 냈습니다.
        </p>
      </FadeUp>

      <ul className="no-scrollbar -mx-5 mt-10 flex snap-x gap-3 overflow-x-auto px-5 pb-4 pr-[20vw] md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 md:pr-0 lg:grid-cols-7 lg:items-end">
        {BOOKS.map((book, index) => <BookCover key={book.src} book={book} index={index} />)}
      </ul>

      <FadeUp className="mt-6 md:ml-auto md:max-w-[560px]">
        <aside className="border-l-[3px] border-brand bg-gray-50 px-5 py-4 shadow-sm" aria-label="ChatGPT 마케팅 집필 배경">
          <p className="text-base font-black text-ink">
            이 책만, <span className="hl">가장 먼저 쓰지 않았습니다</span>.
          </p>
          <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">
            2023년부터 2년간 직접 써보며 정리했고, 2025년에 냈습니다.<br />
            실무에서 검증된 것만 담고 싶었습니다.
          </p>
        </aside>
      </FadeUp>

      <div className="relative mx-auto mt-10 hidden max-w-[900px] px-2 pb-8 md:block" aria-label="저서 출간 연도: 2014년부터 2025년까지 11년">
        <div className="relative h-px bg-slate-300">
          {BOOKS.map((book) => {
            const position = ((toMonth(book.date) - timelineStart) / (timelineEnd - timelineStart)) * 100;
            return <span key={book.date + book.title} className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand shadow" style={{ left: `${position}%` }} aria-hidden="true" />;
          })}
        </div>
        <span className="absolute left-2 top-4 text-xs font-black text-slate-500">2014</span>
        <span className="absolute right-2 top-4 text-xs font-black text-slate-500">2025</span>
        <span className="absolute left-1/2 top-4 -translate-x-1/2 text-xs font-bold text-slate-400">11년</span>
      </div>

      <div className="mt-10 border-t border-slate-200 pt-8 md:mt-12">
        <FadeUp>
          <h4 className="text-sm font-black text-slate-500">감수한 책</h4>
          <ul className="mt-6 flex gap-4">
            {SUPERVISED.map((book, index) => <BookCover key={book.src} book={book} index={index} supervised />)}
          </ul>
          <p className="mt-7 max-w-[480px] text-sm font-semibold leading-7 text-slate-500">
            정보가 넘칠수록, <span className="hl">골라주는 사람</span>이 필요합니다.<br />
            그 이야기를 10년 전부터 해왔습니다.
          </p>
        </FadeUp>
      </div>

      <FadeUp>
        <p className="mx-auto mt-14 max-w-[520px] text-center text-sm font-bold leading-7 text-slate-600">
          11년 동안 바뀐 건 플랫폼이었고, 바뀌지 않은 건 <mark className="font-black">구조</mark>였습니다.
        </p>
      </FadeUp>
    </div>
  );
}
