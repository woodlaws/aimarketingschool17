import { FadeUp } from "@/components/Motion";

const fears = [
  ["검색이 사라지고 있습니다", "고객은 이제 네이버에 검색하지 않고, AI에게 물어봅니다. AI가 나를 추천하지 않으면 — 내 가게는 존재하지 않는 가게입니다."],
  ["경쟁사는 하루 10개, 나는 주 1개", "AI를 쓰는 경쟁사와 안 쓰는 나의 콘텐츠 격차는 주당 10배로 벌어집니다. 1년이면 520개 vs 52개입니다."],
  ["광고비만 오릅니다", "콘텐츠로 들어오는 길을 안 만들면, 남은 건 광고비뿐입니다. 그리고 광고 단가는 매년 오릅니다."]
];

export function Fear() {
  return <section className="sales-section bg-brand-dark text-white"><div className="sales-wrap"><FadeUp><h2 className="sales-title">지금 안 바꾸면,<br />1년 뒤에도 똑같습니다.</h2></FadeUp><div className="mt-12 space-y-8">{fears.map(([title,body],i)=><FadeUp key={title} delay={i*.08}><article className="border-l-4 border-danger pl-6"><span className="font-black text-red-400">0{i+1}</span><h3 className="mt-2 text-2xl font-black">{title}</h3><p className="sales-body mt-3 text-slate-300">{body}</p></article></FadeUp>)}</div><FadeUp><p className="mt-16 text-center text-3xl font-black leading-relaxed text-red-500 md:text-5xl">정확히 똑같이,<br />1년을 더 보내실 건가요?</p></FadeUp></div></section>;
}

const curriculum = [
  { stage: "②", title: "내 업종 그대로, 콘텐츠 생산 라인 만들기", sub: "오늘 밤 바로 돌릴 수 있는 프롬프트 흐름" },
  { stage: "③", title: "글 1개 → 숏폼 3개 + 카드뉴스 10장 확장", sub: "콘텐츠 1개를 10개로 늘리는 공식" },
  { stage: "④", title: "코딩 없이, 문의가 들어오는 홈페이지 제작", sub: "실시간 제작 시연" },
  { stage: "③", title: "AI 직원 세팅 — 기획·조사·보고서 분업", sub: "내가 안 해도 되는 일 목록" },
  { stage: "②", title: "내 사업에 적용할 첫 번째 1개 정하기", sub: "특강 끝나고 실행할 액션 1개" }
];

export function Curriculum() {
  return <section className="sales-section bg-surface"><div className="sales-wrap"><FadeUp><h2 className="sales-title">2시간 30분,<br />이 5개를 화면 켜고 만들어 보여드립니다.</h2></FadeUp><div className="mt-12 divide-y divide-slate-200 border-y border-slate-300">{curriculum.map(({stage,title,sub},i)=><FadeUp key={title}><article className="grid grid-cols-[3.5rem_1fr] gap-3 py-6 md:grid-cols-[5rem_1fr]"><div><span className="text-3xl font-black text-brand md:text-4xl">{String(i+1).padStart(2,"0")}</span><span className="mt-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-black text-white" aria-label={"플라이휠 " + stage + " 단계"}>{stage}</span></div><div><h3 className="text-lg font-extrabold md:text-xl">{title}</h3><p className="mt-2 leading-7 text-muted">{sub}</p></div></article></FadeUp>)}</div><FadeUp><p className="mt-12 text-center text-2xl font-black leading-relaxed md:text-4xl">설명하지 않습니다.<br />화면 켜고, 만들어서 보여드립니다.</p></FadeUp></div></section>;
}

const comparison = [
  ["툴 사용법", "✅", "✅", "✅"],
  ["내 업종에 맞춘 적용", "❌", "△", "✅"],
  ["매출로 가는 동선 설계", "❌", "❌", "✅"],
  ["실시간 질문·답변", "❌", "△", "✅"],
  ["실제 대행사 검증 사례", "❌", "❌", "✅"],
  ["끝나고 할 일이 정해짐", "❌", "❌", "✅"],
  ["비용", "0원", "5~30만원", "0원"]
];

export function Comparison() {
  const headings = ["유튜브 무료 강의", "일반 AI 강의", "AI마케팅스쿨 무료특강"];
  return <section className="sales-section bg-white"><div className="sales-wrap"><FadeUp><h2 className="sales-title">왜 이 특강이어야 하나요?</h2></FadeUp><FadeUp className="mt-10 hidden lg:block"><table className="w-full border-collapse text-center"><thead><tr><th className="border border-slate-200 bg-slate-100 p-4 text-left">비교 항목</th>{headings.map((heading,i)=><th key={heading} className={"border p-4 " + (i===2?"border-blue-700 bg-brand text-white":"border-slate-200 bg-slate-100")}>{heading}</th>)}</tr></thead><tbody>{comparison.map(row=><tr key={row[0]}>{row.map((cell,i)=><td key={i} className={"border p-4 " + (i===0?"text-left font-bold ":"") + (i===3?"border-blue-700 bg-blue-50 font-black text-brand":"border-slate-200")}>{cell}</td>)}</tr>)}</tbody></table></FadeUp><div className="mt-10 grid gap-5 lg:hidden">{comparison.map(row=><FadeUp key={row[0]}><article className="comparison-card rounded-2xl border border-slate-200 bg-slate-50 p-5"><h3>{row[0]}</h3><dl className="mt-5 grid gap-3">{headings.map((heading,i)=><div key={heading} className={"grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl px-4 py-3 " + (i===2?"bg-blue-50 text-brand":"bg-white text-ink")}><dt>{heading}</dt><dd className="font-extrabold">{row[i+1]}</dd></div>)}</dl></article></FadeUp>)}</div></div></section>;
}
