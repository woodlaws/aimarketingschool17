// 다음 특강에는 회차와 시작 시각만 여기서 바꿉니다.
const SESSION_SOURCE = { round: 55, startsAtISO: "2026-09-18T20:00:00+09:00", durationMinutes: 150 } as const;

const KST_OFFSET = 9 * 60 * 60 * 1000;
const start = new Date(new Date(SESSION_SOURCE.startsAtISO).getTime() + KST_OFFSET);
const end = new Date(start.getTime() + SESSION_SOURCE.durationMinutes * 60 * 1000);
const year = start.getUTCFullYear();
const month = start.getUTCMonth() + 1;
const day = start.getUTCDate();
const weekday = ["일", "월", "화", "수", "목", "금", "토"][start.getUTCDay()];
const hour = start.getUTCHours();
const hour12 = hour % 12 || 12;
const endHour12 = end.getUTCHours() % 12 || 12;
const endMinute = end.getUTCMinutes();
const period = hour >= 18 ? "밤" : hour >= 12 ? "오후" : "오전";
const formPeriod = hour >= 18 ? "저녁" : hour >= 12 ? "오후" : "오전";
const dateLabel = `${month}/${day}(${weekday})`;
const dateWithWeekday = `${month}월 ${day}일(${weekday})`;
const timeLabel = `${period} ${hour12}시`;
const timeRangeLabel = `${timeLabel}~${endHour12}시${endMinute ? ` ${endMinute}분` : ""}`;
const formTimeLabel = `${formPeriod} ${hour12}시`;

export const SESSION = {
  round: SESSION_SOURCE.round,
  dateLabel,
  timeLabel,
  fullLabel: `${year}년 ${dateWithWeekday} ${timeRangeLabel}`,
  dateWithWeekday,
  fullDateLabel: `${year}년 ${dateWithWeekday}`,
  monthDayLabel: `${month}월 ${day}일`,
  timeRangeLabel,
  formTimeLabel,
  formOption: `${dateLabel} ${formTimeLabel}~${endHour12}시${endMinute ? `${endMinute}분` : ""}`,
  startsAtISO: SESSION_SOURCE.startsAtISO,
} as const;
