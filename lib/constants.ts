// ─────────────────────────────────────────────────────────────────────────────
// 특강 일시는 여기 CURRENT_SEMINAR 한 곳에서만 관리합니다. 다음 특강 때 이 블록만 고치면 됩니다.
// 히어로·카운트다운·긴급 섹션·하단 고정 바·신청 폼·완료 문구·메타 설명이 모두 여기서 파생됩니다.
// ─────────────────────────────────────────────────────────────────────────────
const CURRENT_SEMINAR = {
  // [확인 필요: 59차] 신뢰 바 "N차 누적 무료특강"에 표시되는 누적 회차
  round: 59,
  startsAtISO: "2026-10-13T20:00:00+09:00",
  endsAtISO: "2026-10-13T22:30:00+09:00",
  // 구글폼 9번 문항(entry.1471197970, 수업 날짜)으로 전송되는 값.
  // 구글폼 선택지와 글자 단위로 같아야 합니다(다르면 구글폼이 응답 전체를 400으로 거부).
  formOption: "10/13(화) 저녁8시~10시30분",
} as const;

// 회차 목록. 현재는 CURRENT_SEMINAR 하나이며, 여러 회차를 동시에 모집할 때는 항목을 추가합니다.
// - visible: false 인 회차는 화면 노출·폼 선택지에서 제외됩니다.
// - 활성 회차(SESSION) = visible이고 아직 끝나지 않은(endsAt > 현재) 회차 중 가장 이른 회차.
//   endsAt이 지나면 다음 회차로 넘어가고, 남은 회차가 없으면 마지막 회차를 폴백으로 보여주며 폼은 "다음 회차 안내" 상태가 됩니다.
const SESSION_LIST = [
  { ...CURRENT_SEMINAR, visible: true },
] as const;

type SessionSource = (typeof SESSION_LIST)[number];

export type SessionInfo = {
  round: number;
  visible: boolean;
  startsAtISO: string;
  endsAtISO: string;
  /** 시작 시각(epoch ms). 카운트다운 목표 */
  startsAt: number;
  /** 종료 시각(epoch ms). 이 시각이 지나면 다음 회차로 넘어갑니다. */
  endsAt: number;
  /** "10월" */
  monthLabel: string;
  /** "10/13(화)" */
  dateLabel: string;
  /** "밤 8시" */
  timeLabel: string;
  /** "2026년 10월 13일(화) 밤 8시~10시 30분" */
  fullLabel: string;
  /** "10월 13일(화)" */
  dateWithWeekday: string;
  /** "2026년 10월 13일(화)" */
  fullDateLabel: string;
  /** "10월 13일" */
  monthDayLabel: string;
  /** "밤 8시~10시 30분" */
  timeRangeLabel: string;
  /** "저녁 8시" */
  formTimeLabel: string;
  /** 폼 라디오에 보여주는 회차 라벨. "10/13(화) 저녁 8시~10시30분" */
  pickerLabel: string;
  /** 구글폼으로 전송되는 값(CURRENT_SEMINAR.formOption). */
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

function parseKstISO(iso: string, label: string, round: number): number {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) throw new Error(`SESSION_LIST round ${round}: ${label}를 해석할 수 없습니다 (${iso})`);
  if (!/[+-]\d{2}:\d{2}$/.test(iso)) throw new Error(`SESSION_LIST round ${round}: ${label}에 +09:00 오프셋을 명시해야 합니다`);
  return ms;
}

function buildSession(source: SessionSource): SessionInfo {
  const startsAt = parseKstISO(source.startsAtISO, "startsAtISO", source.round);
  const endsAt = parseKstISO(source.endsAtISO, "endsAtISO", source.round);
  if (endsAt <= startsAt) throw new Error(`SESSION_LIST round ${source.round}: endsAtISO가 startsAtISO보다 빠릅니다`);

  const s = kstFields(startsAt);
  const e = kstFields(endsAt);
  const hour12 = s.hour % 12 || 12;
  const endHour12 = e.hour % 12 || 12;
  const period = s.hour >= 18 ? "밤" : s.hour >= 12 ? "오후" : "오전";
  const formPeriod = s.hour >= 18 ? "저녁" : s.hour >= 12 ? "오후" : "오전";

  const monthLabel = `${s.month}월`;
  const dateLabel = `${s.month}/${s.day}(${s.weekday})`;
  const dateWithWeekday = `${s.month}월 ${s.day}일(${s.weekday})`;
  const timeLabel = `${period} ${hour12}시`;
  const timeRangeLabel = `${timeLabel}~${endHour12}시${e.minute ? ` ${e.minute}분` : ""}`;
  const formTimeLabel = `${formPeriod} ${hour12}시`;
  const pickerLabel = `${dateLabel} ${formTimeLabel}~${endHour12}시${e.minute ? `${e.minute}분` : ""}`;

  return {
    round: source.round,
    visible: source.visible,
    startsAtISO: source.startsAtISO,
    endsAtISO: source.endsAtISO,
    startsAt,
    endsAt,
    monthLabel,
    dateLabel,
    timeLabel,
    fullLabel: `${s.year}년 ${dateWithWeekday} ${timeRangeLabel}`,
    dateWithWeekday,
    fullDateLabel: `${s.year}년 ${dateWithWeekday}`,
    monthDayLabel: `${s.month}월 ${s.day}일`,
    timeRangeLabel,
    formTimeLabel,
    pickerLabel,
    formOption: source.formOption,
  };
}

/** 모든 회차(비노출 포함), 시작 시각 오름차순. */
export const SESSIONS: readonly SessionInfo[] = SESSION_LIST.map(buildSession).sort((a, b) => a.startsAt - b.startsAt);

const VISIBLE_SESSIONS = SESSIONS.filter((session) => session.visible);

// 현재 설정된 특강의 정적 상수(시각과 무관). 메타 설명 등 빌드 시 고정되는 곳에서 사용합니다.
const CURRENT = buildSession({ ...CURRENT_SEMINAR, visible: true });
/** 누적 무료특강 회차. [확인 필요: 59차] */
export const SEMINAR_ROUND = CURRENT.round;
/** "10월 13일(화)" */
export const SEMINAR_DATE_LABEL = CURRENT.dateWithWeekday;
/** "밤 8시~10시 30분" */
export const SEMINAR_TIME_LABEL = CURRENT.timeRangeLabel;
/** "밤 8시" */
export const SEMINAR_START_TIME_LABEL = CURRENT.timeLabel;
/** "2026-10-13T20:00:00+09:00" */
export const SEMINAR_START_ISO = CURRENT.startsAtISO;
/** "2026-10-13T22:30:00+09:00" */
export const SEMINAR_END_ISO = CURRENT.endsAtISO;

/** 선택 가능한 회차: visible이고 아직 끝나지 않은 회차 전부(시작 시각 오름차순). */
export function getSelectableSessions(now: number = Date.now()): readonly SessionInfo[] {
  return VISIBLE_SESSIONS.filter((session) => session.endsAt > now);
}

/**
 * 선택 가능한 회차 목록(배열처럼 사용). 접근할 때마다 현재 시각으로 다시 계산되는 읽기 전용 뷰입니다.
 * 모듈 로드 시 한 번 고정된 배열이면 서버 프로세스가 살아 있는 동안 회차가 넘어가지 않기 때문에
 * 모든 읽기(length, 인덱스, map/filter/slice, 전개)를 getSelectableSessions()의 새 결과로 위임합니다.
 */
function liveList<T>(compute: () => readonly T[]): readonly T[] {
  return new Proxy([] as T[], {
    get(_target, prop) {
      const list = compute();
      const value = Reflect.get(list, prop);
      return typeof value === "function" ? value.bind(list) : value;
    },
    has: (_target, prop) => Reflect.has(compute(), prop),
    ownKeys: () => Reflect.ownKeys(compute()),
    getOwnPropertyDescriptor(_target, prop) {
      const descriptor = Reflect.getOwnPropertyDescriptor(compute(), prop);
      if (descriptor && prop !== "length") descriptor.configurable = true;
      return descriptor;
    },
    set: () => false,
    deleteProperty: () => false,
    defineProperty: () => false,
  });
}

export const SELECTABLE_SESSIONS: readonly SessionInfo[] = liveList(() => getSelectableSessions());

/**
 * 활성 회차: 선택 가능한 회차 중 가장 이른 회차.
 * 모든 visible 회차가 끝났으면 마지막 visible 회차를 그대로 반환해 화면이 비지 않게 합니다(폴백).
 */
export function getActiveSession(now: number = Date.now()): SessionInfo {
  const upcoming = getSelectableSessions(now);
  if (upcoming.length > 0) return upcoming[0];
  const fallback = VISIBLE_SESSIONS[VISIBLE_SESSIONS.length - 1] ?? SESSIONS[SESSIONS.length - 1];
  if (!fallback) throw new Error("SESSION_LIST가 비어 있습니다.");
  return fallback;
}

/** 모든 visible 회차가 끝나 폴백 회차를 보여주는 상태인지(신청 폼은 "다음 회차 안내"로 전환). */
export function isSessionFallback(now: number = Date.now()): boolean {
  return getSelectableSessions(now).length === 0;
}

/**
 * 활성 회차의 파생값. 컴포넌트는 SESSION.dateWithWeekday 처럼 이 객체를 통해 읽습니다.
 * 각 필드는 접근 시점의 현재 시각으로 계산되는 게터입니다. 모듈 로드 시 한 번 고정하면
 * 서버 프로세스가 살아 있는 동안 회차가 넘어가지 않으므로 값을 모듈 스코프 상수에 복사하지 마세요.
 */
const SESSION_KEYS = [
  "round", "visible", "startsAtISO", "endsAtISO", "startsAt", "endsAt",
  "monthLabel", "dateLabel", "timeLabel", "fullLabel", "dateWithWeekday", "fullDateLabel",
  "monthDayLabel", "timeRangeLabel", "formTimeLabel", "pickerLabel", "formOption",
] as const satisfies readonly (keyof SessionInfo)[];

export const SESSION: Readonly<SessionInfo> = Object.freeze(
  Object.defineProperties(
    {},
    Object.fromEntries(SESSION_KEYS.map((key) => [key, { enumerable: true, get: () => getActiveSession()[key] }])),
  ),
) as Readonly<SessionInfo>;
