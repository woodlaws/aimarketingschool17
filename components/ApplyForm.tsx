"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SESSION } from "@/lib/constants";

type Step = "form" | "questions" | "done";
type Lead = { name: string; phone: string; email: string };

const JOBS = ["직장인", "주부", "온라인 사업", "오프라인 매장 운영", "온·오프라인 모두 운영", "학생·취준생", "기타"] as const;
const PAINS = [
  "콘텐츠는 만드는데 문의로 이어지지 않는다",
  "뭘 올려야 할지 소재가 떠오르지 않는다",
  "시간이 없어서 콘텐츠를 못 만든다",
  "AI 도구는 쓰는데 매출로 연결이 안 된다",
  "홈페이지·상세페이지가 없거나 부실하다",
  "반복 업무에 시간을 다 뺏긴다",
] as const;
const WANTS = [
  "콘텐츠를 자동으로 만드는 방법",
  "콘텐츠 1개를 여러 채널로 퍼뜨리는 방법",
  "문의가 들어오는 홈페이지 만드는 방법",
  "AI에게 반복 업무 맡기는 방법",
  "전체 구조부터 이해하고 싶다",
] as const;

const SOURCE_MAP: Record<string, string> = {
  meta: "인스타그램", facebook: "인스타그램", instagram: "인스타그램",
  sms: "문자메시지", cafe: "네이버카페", blog: "네이버블로그",
  kakao: "카카오톡", threads: "스레드", youtube: "유튜브", email: "이메일",
};
const UTM_STORAGE_KEY = "aims17_utm_source";
const EVENT_OPTION = SESSION.formOption;

// 구글폼 변경 시 여기만 수정
const FORM_ENDPOINT = "https://docs.google.com/forms/d/e/1FAIpQLSeZTe5bwfGdckyQYrDqlwmcpYgH4vRW13P7nPsHk_hgkrNo-g/formResponse";

async function submitToGoogleForm(fields: Record<string, string>) {
  const body = new URLSearchParams();
  Object.entries(fields).forEach(([key, value]) => { if (value) body.append(key, value); });
  await fetch(FORM_ENDPOINT, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function getSourceFromSession() {
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY)?.toLowerCase() ?? "";
    return SOURCE_MAP[stored] ?? "기타";
  } catch { return "기타"; }
}

function RadioCards({ legend, name, options, value, onChange }: {
  legend: string; name: string; options: readonly string[]; value: string; onChange: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 font-black text-slate-900">{legend}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const id = `${name}-${option}`;
          return (
            <div key={option} className="relative">
              <input id={id} name={name} type="radio" value={option} checked={value === option} onChange={() => onChange(option)} className="peer sr-only" />
              <label htmlFor={id} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 transition hover:border-blue-300 peer-checked:border-2 peer-checked:border-brand peer-checked:bg-blue-50 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand motion-reduce:transition-none">
                <span aria-hidden="true" className={`flex size-5 shrink-0 items-center justify-center rounded-full border text-xs font-black ${value === option ? "border-brand bg-brand text-white" : "border-slate-300 text-transparent"}`}>✓</span>
                <span>{option}</span>
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ApplyForm() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState<Step>("form");
  const [lead, setLead] = useState<Lead>({ name: "", phone: "", email: "" });
  const [agree, setAgree] = useState(false);
  const [job, setJob] = useState("");
  const [pain, setPain] = useState("");
  const [want, setWant] = useState("");
  const [insta, setInsta] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isSubmittingRef = useRef(false);
  const leadEventIdRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      const querySource = new URLSearchParams(window.location.search).get("utm_source");
      if (querySource) sessionStorage.setItem(UTM_STORAGE_KEY, querySource.toLowerCase());
    } catch { /* 저장소 차단 시에도 직접 접속(기타)으로 제출합니다. */ }
  }, []);

  function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const trimmedLead = { ...lead, name: lead.name.trim(), email: lead.email.trim() };
    if (!trimmedLead.name) { setError("성함을 입력해 주세요."); return; }
    setError("");
    setLead(trimmedLead);
    setStep("questions");
  }

  async function submitFinal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingRef.current) return;
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    const skipQuestions = submitter?.dataset.skipQuestions === "true";
    if (!skipQuestions && !job && !pain && !want) return;
    isSubmittingRef.current = true;
    setSubmitting(true); setError("");
    const fields: Record<string, string> = {
      "entry.694594280": lead.name,
      "entry.357585861": lead.phone,
      "entry.541062845": lead.email,
      "entry.683816447": "동의합니다",
      "entry.1471197970": EVENT_OPTION,
      "entry.21398181": getSourceFromSession(),
    };
    if (!skipQuestions) {
      fields["entry.733759544"] = job;
      fields["entry.846365700"] = pain;
      fields["entry.549374384"] = want;
      fields["entry.1241076136"] = insta.trim();
    }
    try {
      await submitToGoogleForm(fields);
    } catch {
      // 네트워크 예외에서도 요청이 서버에 도착했을 수 있으므로 재전송하지 않습니다.
    }
    // no-cors 응답은 확인할 수 없으며, 완료 처리와 Lead 이벤트는 한 지점에서만 실행합니다.
    const trackedWindow = window as typeof window & { fbq?: (...args: unknown[]) => void };
    leadEventIdRef.current ??= typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try {
      if (typeof trackedWindow.fbq === "function") {
        trackedWindow.fbq("track", "Lead", {}, { eventID: leadEventIdRef.current });
      }
    } catch { /* 픽셀 오류가 신청 완료 화면을 막지 않도록 합니다. */ }
    setStep("done");
    setSubmitting(false);
  }

  const hasExtraAnswer = Boolean(job || pain || want);
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.25 };

  return (
    <div className="form-panel mx-auto w-full max-w-3xl overflow-hidden rounded-2xl bg-white p-6 shadow-sales md:p-9">
      <p className="sr-only" aria-live="polite">
        {submitting ? "전송 중입니다." : step === "questions" ? "추가 질문 단계입니다. 아직 신청이 전송되지 않았습니다." : step === "done" ? "신청이 완료되었습니다." : error}
      </p>
      <AnimatePresence mode="wait" initial={false}>
        {step === "form" ? (
          <motion.form key="form" onSubmit={submitLead} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduceMotion ? undefined : { opacity: 0 }} transition={transition} className="space-y-5">
            <label className="block font-bold">성함 <span className="text-danger">*</span>
              <input name="name" value={lead.name} onChange={(event) => setLead((current) => ({ ...current, name: event.target.value }))} required autoComplete="name" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" placeholder="성함을 입력해 주세요" />
            </label>
            <label className="block font-bold">휴대폰 번호 <span className="text-danger">*</span>
              <input name="phone" value={lead.phone} onChange={(event) => setLead((current) => ({ ...current, phone: formatPhone(event.target.value) }))} required inputMode="tel" autoComplete="tel" pattern="010-\d{4}-\d{4}" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" placeholder="010-1234-5678" />
            </label>
            <label className="block font-bold">이메일 <span className="text-danger">*</span>
              <input name="email" value={lead.email} onChange={(event) => setLead((current) => ({ ...current, email: event.target.value }))} type="email" required autoComplete="email" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" placeholder="example@email.com" />
            </label>
            <div className="text-sm leading-6 text-slate-600">
              <div className="flex items-start gap-3">
                <input id="agree" name="agree" type="checkbox" checked={agree} onChange={(event) => setAgree(event.target.checked)} required className="mt-1 size-5 shrink-0 accent-brand" />
                <label htmlFor="agree" className="flex-1">개인정보 수집·이용 및 특강 안내 문자 수신에 동의합니다 (필수)</label>
              </div>
              <details className="ml-8 mt-1 rounded-lg bg-slate-50 px-3 py-2">
                <summary className="cursor-pointer font-bold text-slate-500">약관 보기</summary>
                <p className="mt-2 text-xs leading-5 text-slate-500">신청 접수와 특강 안내를 위해 성함·휴대폰 번호·이메일을 수집하며, 특강 운영 및 안내 종료 후 관련 법령에 따른 기간 동안 보관 후 파기합니다. 동의를 거부할 수 있으나 신청은 제한됩니다. 광고성 문자는 언제든 수신거부할 수 있습니다.</p>
              </details>
            </div>
            {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-bold text-danger">{error}</p> : null}
            <button type="submit" className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand px-6 py-5 text-lg font-black text-white transition hover:bg-blue-600 motion-reduce:transition-none">
              추가 질문으로 <span aria-hidden="true">→</span>
            </button>
            <p className="text-center text-xs leading-6 text-muted">결제 정보를 요구하지 않습니다. 광고성 문자는 언제든 수신거부 가능합니다.</p>
          </motion.form>
        ) : step === "questions" ? (
          <motion.div key="questions" initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={reduceMotion ? undefined : { opacity: 0 }} transition={transition}>
            <div className="text-center">
              <h3 className="mt-5 text-2xl font-black text-brand">마지막 단계입니다.</h3>
              <p className="mt-3 leading-7 text-slate-600">추가 질문을 보내거나 건너뛰면 신청이 완료됩니다.</p>
            </div>
            <div className="my-8 border-t border-slate-200" />
            <div className="mb-7 text-center"><h4 className="text-lg font-black text-slate-900">30초만 더 주시면, 특강 내용을 맞춰서 준비하겠습니다.</h4><p className="mt-2 text-sm text-muted">추가 질문은 선택입니다. 어느 버튼을 눌러도 신청 정보가 한 번만 전송됩니다.</p></div>
            <form onSubmit={submitFinal} className="space-y-7">
              <RadioCards legend="Q1. 하시는 일은?" name="job" options={JOBS} value={job} onChange={setJob} />
              <RadioCards legend="Q2. 지금 가장 어려운 것은?" name="pain" options={PAINS} value={pain} onChange={setPain} />
              <RadioCards legend="Q3. 특강에서 가장 듣고 싶은 것은?" name="want" options={WANTS} value={want} onChange={setWant} />
              <AnimatePresence initial={false}>{hasExtraAnswer ? (
                <motion.label initial={reduceMotion ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={reduceMotion ? undefined : { opacity: 0, height: 0 }} transition={transition} className="block overflow-hidden font-bold">
                  Q4. 인스타그램 계정 <span className="font-normal text-muted">(선택)</span>
                  <input name="instagram" value={insta} onChange={(event) => setInsta(event.target.value)} autoComplete="off" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" placeholder="@아이디" />
                </motion.label>
              ) : null}</AnimatePresence>
              {error ? <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-bold text-danger">{error}</p> : null}
              <button type="submit" disabled={submitting || !hasExtraAnswer} className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand px-6 py-4 font-black text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none">
                {submitting ? <><span aria-hidden="true" className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" />전송 중</> : "보내고 신청 완료하기"}
              </button>
              <button type="submit" data-skip-questions="true" disabled={submitting} className="mx-auto block min-h-12 px-4 text-sm text-muted underline underline-offset-4 disabled:opacity-50">건너뛰고 신청 완료하기</button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="done" initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={transition} className="py-8 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand text-2xl text-white">✓</div>
            <h3 className="mt-5 text-2xl font-black text-brand">신청이 완료되었습니다.</h3>
            <p className="mt-3 leading-7 text-slate-600">{SESSION.dateWithWeekday} {SESSION.formTimeLabel}, 문자로 줌 링크를 보내드립니다.</p>
            <p className="mt-5 font-bold">감사합니다. {SESSION.monthDayLabel}에 뵙겠습니다.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
