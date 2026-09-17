import { FadeUp } from "@/components/Motion";

const diagnosisQuestions = [
  "이번 달 AI로 만든 콘텐츠가 몇 건의 문의를 만들었나요?",
  "고객이 내 업종을 AI에게 물으면, 내 이름이 나오나요?",
  "어제 한 일 중 AI에 넘길 수 있었던 일은 몇 개였나요?",
  "지금 이 순간에도 돈이 들어오는 경로가 몇 개인가요?"
];

export function Diagnosis() {
  return (
    <section id="diagnosis" className="sales-section bg-surface"><div className="sales-wrap"><FadeUp><h2 className="sales-title">딱 4개만 답해보세요.<br />30초면 됩니다.</h2></FadeUp><div className="mt-10 space-y-4">{diagnosisQuestions.map((q,i)=><FadeUp key={q} delay={i*.08}><div className="flex items-start gap-4 rounded-2xl bg-slate-100 p-5 md:p-6"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-black text-white">{i+1}</span><p className="sales-body font-bold">{q}</p></div></FadeUp>)}</div><FadeUp><div className="inverse-quote"><p>하나라도 숫자로 답하지 못했다면,<br />AI를 쓰고 계신 게 아닙니다.</p><p className="mt-5 text-2xl text-accent md:text-4xl">AI로 바쁘기만 하신 겁니다.</p></div></FadeUp></div></section>
  );
}

const wrongUses = [
  "블로그 글 → ChatGPT에 \"써줘\" → 복붙 → 끝",
  "릴스 하나 만들고 → 조회수 확인 → 다음 날 또 백지에서 시작",
  "새 AI 나오면 → 가입 → 구독 결제 → 두 번 쓰고 방치",
  "유료 강의 완강 → 노션에 정리 → 그걸로 끝"
];

export function WrongUse() {
  return <section className="sales-section bg-white"><div className="sales-wrap"><FadeUp><h2 className="sales-title">혹시, 이렇게 AI 쓰고 계신가요?</h2></FadeUp><div className="mt-10 space-y-5">{wrongUses.map((item,i)=><FadeUp key={item} delay={i*.07}><p className="sales-body flex gap-3 border-b border-slate-200 pb-5 font-bold"><span className="text-xl text-danger">✕</span><span>{item}</span></p></FadeUp>)}</div><FadeUp><p className="mt-12 text-center text-2xl font-black md:text-3xl">이거 전부, 제가 했던 겁니다.</p></FadeUp></div></section>;
}

export function InstructorStory() {
  return (
    <section data-instructor-story className="sales-section bg-brand-dark text-white">
      <div className="sales-wrap">
        <FadeUp><h2 className="sales-title">2013년 8월 17일, 첫 강의를 했습니다.<br />그리고 13년이 지났습니다.</h2></FadeUp>
        <div className="story-body sales-body mt-10 border-l-4 border-accent pl-6 text-slate-300">
          <FadeUp className="story-paragraph"><p>그동안 플랫폼은 계속 바뀌었습니다.</p></FadeUp>
          <FadeUp className="story-paragraph"><p>블로그가 전부이던 시절이 있었고,<br />스마트스토어가 답이라던 때가 있었고,<br />인스타가 아니면 안 된다던 때가 있었습니다.</p></FadeUp>
          <FadeUp className="story-paragraph"><p>그때마다 새로운 도구가 쏟아졌습니다.<br />저는 그때마다 현장에서 확인하고,<br />책으로 정리했습니다. <strong className="story-book-accent">그렇게 7권을 썼습니다.</strong></p></FadeUp>
          <FadeUp className="story-paragraph story-ai-turn"><p>그리고 2023년, AI가 왔습니다.</p></FadeUp>
          <FadeUp className="story-paragraph"><p>이번에도 똑같은 질문을 받았습니다.<br /><span className="story-question">&quot;이거 배우면 매출이 오르나요?&quot;</span></p></FadeUp>
          <FadeUp className="story-paragraph"><p>13년 동안 지켜보며 알게 된 답은 이것입니다.</p></FadeUp>
          <FadeUp className="story-paragraph story-punch"><p>도구를 바꾼 사람은 그대로였고,<br /><span className="story-punch-conclusion">구조를 만든 사람만 남았습니다.</span></p></FadeUp>
          <FadeUp className="story-paragraph"><p>그래서 저는 가르치기만 하지 않습니다.<br /><strong className="story-agency-emphasis">2023년부터 마케팅 대행사를 직접 운영하며,</strong><br />제가 가르치는 것을 매일 현장에 적용하고 있습니다.</p></FadeUp>
        </div>
        <FadeUp className="story-closing"><p>그 구조를,<br /><strong>9월 18일</strong> 밤에 전부 보여드립니다.</p></FadeUp>
      </div>
    </section>
  );
}

export function Dissonance() {
  return <section className="sales-section bg-slate-950 text-white"><div className="sales-wrap"><FadeUp><h2 className="sales-title">AI 강의는 널렸습니다.<br />그런데 왜 AI로 돈 버는 사람은 소수일까요?</h2></FadeUp><FadeUp className="sales-body mt-9 space-y-3 text-slate-500"><p>유튜브 무료 강의 수십만 개</p><p>프롬프트 모음집 수천 개</p><p>무료 전자책, 무료 챌린지, 무료 웨비나…</p></FadeUp><FadeUp className="sales-body mt-9 font-bold text-white"><p>정보가 없어서 못 하는 시대는 끝났습니다.</p><p>그런데도 대부분 제자리입니다.</p></FadeUp><FadeUp><div className="mt-10 bg-accent p-7 text-center text-xl font-black leading-relaxed text-ink md:p-10 md:text-3xl">낱개의 도구를 배웠을 뿐,<br />한 줄로 연결된 구조를 만들지 않았기 때문입니다.</div></FadeUp></div></section>;
}
