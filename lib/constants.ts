// 다음 특강에는 이 SESSION_LIST만 수정합니다.
// - visible: false 인 회차는 화면 노출·폼 선택지에서 제외됩니다(코드에는 미리 넣어둘 수 있음).
// - 활성 회차(SESSION) = visible이고 아직 시작하지 않은 회차 중 가장 이른 회차.
//   시작 시각이 지나면 다음 회차로 자동으로 넘어갑니다.
const SESSION_LIST = [
  { round: 56, startsAtISO: "2026-09-22T20:00:00+09:00", durationMinutes: 150, visible: true  },
  { round: 57, startsAtISO: "2026-09-29T20:00:00+09:00", durationMinutes: 150, visible: true  },
  { round: 58, startsAtISO: "2026-10-06T20:00:00+09:00", durationMinutes: 150, visible: false },
] as const;

type SessionSource = (typeof SESSION_LIST)[number];

export type SessionInfo = {
  round: number;
  visible: boolean;
  startsAtISO: string;
  /** 시작 시각(epoch ms). 이 시각이 지나면 다음 회차로 넘어갑니다. */
  startsAt: number;
  endsAt: number;
  /** "9/22(화)" */
  dateLabel: string;
  /** "밤 8시" */
  timeLabel: string;
  /** "2026년 9월 22일(화) 밤 8시~10시 30분" */
  fullLabel: string;
  /** "9월 22일(화)" */
  dateWithWeekday: string;
  /** "2026년 9월 22일(화)" */
  fullDateLabel: string;
  /** "9월 22일" */
  monthDayLabel: string;
  /** "밤 8시~10시 30분" */
  timeRangeLabel: string;
  /** "저녁 8시" */
  formTimeLabel: string;
  /** 구글폼 선택지와 글자 단위로 일치해야 하는 값. "9/22(화) 저녁 8시~10시30분" */
  formOption: string;
};

// 한국은 서머타임이 없으므로 +9시간 고정 오프셋으로 KST 달력 필드를 구합니다.
// UTC 게터만 사용하므로 서버·브라우저의 로컬 타임존과 무관하게 항상 같은 요일·시각이 나옵니다.
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

function kstFields(epochMs: number) {
  const shifted = new Date(epochMs + KST_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth() + 1,
    day: shifted.getUTCDate(),
    weekday: WEEKDAYS[shifted.getUTCDay()],
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
  };
}

function buildSession(source: SessionSource): SessionInfo {
  const startsAt = Date.parse(source.startsAtISO);
  if (Number.isNaN(startsAt)) throw new Error(`SESSION_LIST round ${source.round}: startsAtISO를 해석할 수 없습니다 (${source.startsAtISO})`);
  if (!/[+-]\d{2}:\d{2}$/.test(source.startsAtISO)) throw new Error(`SESSION_LIST round ${source.round}: startsAtISO에 +09:00 오프셋을 명시해야 합니다`);
  const endsAt = startsAt + source.durationMinutes * 60 * 1000;

  const s = kstFields(startsAt);
  const e = kstFields(endsAt);
  const hour12 = s.hour % 12 || 12;
  const endHour12 = e.hour % 12 || 12;
  const period = s.hour >= 18 ? "밤" : s.hour >= 12 ? "오후" : "오전";
  const formPeriod = s.hour >= 18 ? "저녁" : s.hour >= 12 ? "오후" : "오전";

  const dateLabel = `${s.month}/${s.day}(${s.weekday})`;
  const dateWithWeekday = `${s.month}월 ${s.day}일(${s.weekday})`;
  const timeLabel = `${period} ${hour12}시`;
  const timeRangeLabel = `${timeLabel}~${endHour12}시${e.minute ? ` ${e.minute}분` : ""}`;
  const formTimeLabel = `${formPeriod} ${hour12}시`;

  return {
    round: source.round,
    visible: source.visible,
    startsAtISO: source.startsAtISO,
    startsAt,
    endsAt,
    dateLabel,
    timeLabel,
    fullLabel: `${s.year}년 ${dateWithWeekday} ${timeRangeLabel}`,
    dateWithWeekday,
    fullDateLabel: `${s.year}년 ${dateWithWeekday}`,
    monthDayLabel: `${s.month}월 ${s.day}일`,
    timeRangeLabel,
    formTimeLabel,
    formOption: `${dateLabel} ${formTimeLabel}~${endHour12}시${e.minute ? `${e.minute}분` : ""}`,
  };
}

/** 모든 회차(비노출 포함), 시작 시각 오름차순. */
export const SESSIONS: readonly SessionInfo[] = SESSION_LIST.map(buildSession).sort((a, b) => a.startsAt - b.startsAt);

const VISIBLE_SESSIONS = SESSIONS.filter((session) => session.visible);

/** 선택 가능한 회차: visible이고 아직 시작하지 않은 회차 전부(시작 시각 오름차순). */
export function getSelectableSessions(now: number = Date.now()): readonly SessionInfo[] {
  return VISIBLE_SESSIONS.filter((session) => session.startsAt > now);
}

/**
 * 활성 회차: 선택 가능한 회차 중 가장 이른 회차.
 * 모든 visible 회차가 지났으면 마지막 visible 회차를 그대로 반환해 화면이 비지 않게 합니다(폴백).
 */
export function getActiveSession(now: number = Date.now()): SessionInfo {
  const upcoming = getSelectableSessions(now);
  if (upcoming.length > 0) return upcoming[0];
  const fallback = VISIBLE_SESSIONS[VISIBLE_SESSIONS.length - 1] ?? SESSIONS[SESSIONS.length - 1];
  if (!fallback) throw new Error("SESSION_LIST가 비어 있습니다.");
  return fallback;
}

/** 모든 visible 회차가 지나 폴백 회차를 보여주는 상태인지. */
export function isSessionFallback(now: number = Date.now()): boolean {
  return getSelectableSessions(now).length === 0;
}

/**
 * 활성 회차의 파생값. 기존 컴포넌트가 쓰던 SESSION.round, SESSION.dateLabel 등의 이름·형식을 그대로 유지합니다.
 * 각 필드는 접근 시점의 현재 시각으로 계산되는 게터입니다. 모듈 로드 시 한 번 고정하면
 * 서버 프로세스가 살아 있는 동안 회차가 넘어가지 않으므로 값을 모듈 스코프 상수에 복사하지 마세요.
 */
const SESSION_KEYS = [
  "round", "visible", "startsAtISO", "startsAt", "endsAt",
  "dateLabel", "timeLabel", "fullLabel", "dateWithWeekday", "fullDateLabel",
  "monthDayLabel", "timeRangeLabel", "formTimeLabel", "formOption",
] as const satisfies readonly (keyof SessionInfo)[];

export const SESSION: Readonly<SessionInfo> = Object.freeze(
  Object.defineProperties(
    {},
    Object.fromEntries(SESSION_KEYS.map((key) => [key, { enumerable: true, get: () => getActiveSession()[key] }])),
  ),
) as Readonly<SessionInfo>;
