"use client";

import { FormEvent, useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0,3)}-${digits.slice(3)}`;
  return `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`;
}

export function ApplyForm() {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setState("submitting");
    setError("");
    const data = new FormData(form);
    try {
      const response = await fetch("/api/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: data.get("name"), phone: data.get("phone"), email: data.get("email"), privacy: data.get("privacy") === "on" }) });
      const result = await response.json() as { message?: string };
      if (!response.ok) throw new Error(result.message || "신청을 처리하지 못했습니다.");
      setState("success");
      const trackedWindow = window as typeof window & { fbq?: (...args: unknown[]) => void };
      trackedWindow.fbq?.("track", "Lead");
    } catch (caught) {
      setState("error");
      setError(caught instanceof Error ? caught.message : "잠시 후 다시 시도해 주세요.");
    }
  }

  if (state === "success") return <div className="rounded-2xl bg-blue-50 p-8 text-center"><div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand text-2xl text-white">✓</div><h3 className="mt-5 text-2xl font-black">신청이 완료되었습니다.</h3><p className="mt-3 leading-7 text-slate-600">카톡으로 참여 링크를 보내드립니다.</p></div>;

  return <form onSubmit={submit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sales md:p-9"><label className="block font-bold">이름 <span className="text-danger">*</span><input name="name" required autoComplete="name" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" placeholder="이름을 입력해 주세요" /></label><label className="block font-bold">휴대전화 <span className="text-danger">*</span><input name="phone" value={phone} onChange={e=>setPhone(formatPhone(e.target.value))} required inputMode="tel" autoComplete="tel" pattern="010-\d{3,4}-\d{4}" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" placeholder="010-1234-5678" /></label><label className="block font-bold">이메일 <span className="font-normal text-muted">(선택)</span><input name="email" type="email" autoComplete="email" className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-4 text-base outline-none focus:border-brand focus:ring-2 focus:ring-blue-100" placeholder="example@email.com" /></label><label className="flex items-start gap-3 text-sm leading-6 text-slate-600"><input name="privacy" type="checkbox" required className="mt-1 size-5 accent-brand" /><span>개인정보 수집·이용에 동의합니다. 신청 안내를 위해 이름과 연락처를 수집합니다.</span></label>{state==="error"?<p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-bold text-danger">{error}</p>:null}<button type="submit" disabled={state==="submitting"} className="flex w-full items-center justify-center gap-3 rounded-xl bg-brand px-6 py-5 text-lg font-black text-white transition hover:bg-blue-600 disabled:cursor-wait disabled:opacity-70">{state==="submitting"?<><span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />제출 중</>:<>무료특강 자리 맡기 <span>→</span></>}</button><p className="text-center text-xs leading-6 text-muted">결제 정보를 요구하지 않습니다. 광고성 문자는 언제든 수신거부 가능합니다.</p></form>;
}
