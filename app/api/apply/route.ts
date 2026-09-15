import { NextResponse } from "next/server";

type ApplyPayload = { name?: string; phone?: string; email?: string; privacy?: boolean };

export async function POST(request: Request) {
  let body: ApplyPayload;
  try {
    body = (await request.json()) as ApplyPayload;
  } catch {
    return NextResponse.json({ message: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  if (!body.name?.trim() || !/^010-\d{3,4}-\d{4}$/.test(body.phone ?? "") || !body.privacy) {
    return NextResponse.json({ message: "필수 항목을 확인해 주세요." }, { status: 400 });
  }

  const webhookUrl = process.env.SHEET_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ message: "현재 온라인 접수 연결을 준비하고 있습니다. 교육팀으로 문의해 주세요." }, { status: 503 });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, submittedAt: new Date().toISOString(), source: "aimarketingschool17" }),
      cache: "no-store"
    });
    if (!response.ok) throw new Error("Webhook rejected request");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." }, { status: 502 });
  }
}
