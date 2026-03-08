import {
  addDays,
  addWeeks,
  endOfWeek,
  format,
  parseISO,
  startOfWeek,
} from "date-fns";

export function getWeekDays(baseDateStr?: string) {
  const baseDate = baseDateStr ? parseISO(baseDateStr) : new Date();
  const start = startOfWeek(baseDate, { weekStartsOn: 1 });

  return Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(start, i);
    return {
      label: format(date, "EEE"),
      fullLabel: format(date, "dd MMM yyyy"),
      value: format(date, "yyyy-MM-dd"),
    };
  });
}

export function formatWeekRange(baseDateStr?: string) {
  const baseDate = baseDateStr ? parseISO(baseDateStr) : new Date();
  const start = startOfWeek(baseDate, { weekStartsOn: 1 });
  const end = endOfWeek(baseDate, { weekStartsOn: 1 });

  return `${format(start, "dd MMM yyyy")} - ${format(end, "dd MMM yyyy")}`;
}

export function getTodayISODate() {
  return format(new Date(), "yyyy-MM-dd");
}

export function shiftWeek(baseDateStr: string, amount: number, today = false) {
  const base = today ? new Date() : parseISO(baseDateStr);
  return format(addWeeks(base, amount), "yyyy-MM-dd");
}