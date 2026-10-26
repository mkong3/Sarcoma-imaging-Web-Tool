import type { CaseInput, Offset, ReferenceDate, ScheduleBand } from "@/lib/types";

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parses a YYYY-MM-DD string to a UTC date; returns null for empty or impossible dates. */
export function parseIsoDate(value: string | undefined): Date | null {
  if (!value) return null;
  const match = ISO_DATE.exec(value);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  if (formatIsoDate(date) !== value) return null;
  return date;
}

export function formatIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Adds calendar months in UTC, clamping to the last day of the target month. */
export function addMonths(date: Date, months: number): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + months;
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month, Math.min(date.getUTCDate(), lastDay)));
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86_400_000);
}

export function addOffset(date: Date, offset: Offset): Date {
  let result = date;
  if (offset.months) result = addMonths(result, offset.months);
  if (offset.weeks) result = addDays(result, offset.weeks * 7);
  return result;
}

export function laterOf(a: Date, b: Date): Date {
  return a.getTime() >= b.getTime() ? a : b;
}

export function formatDisplayDate(iso: string): string {
  const date = parseIsoDate(iso);
  if (!date) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Works out the date from which schedule bands are counted, or explains why it cannot. */
export function computeReferenceDate(input: CaseInput): ReferenceDate {
  if (input.pathway === "desmoid") {
    const start = parseIsoDate(input.surveillanceStartDate);
    return start
      ? { date: formatIsoDate(start), basis: "Clinician-entered surveillance start date", clinicianEntered: true }
      : { date: null, basis: "Surveillance start date required to calculate dates", clinicianEntered: true };
  }

  if (input.recurrence === "yes") {
    const restart = parseIsoDate(input.restartReferenceDate);
    return restart
      ? {
          date: formatIsoDate(restart),
          basis: "Clinician-entered restart reference date after recurrence",
          clinicianEntered: true,
        }
      : {
          date: null,
          basis: "Restart reference date required to calculate dates after recurrence",
          clinicianEntered: true,
        };
  }
  if (input.recurrence !== "no") {
    return { date: null, basis: "Recurrence status required to calculate dates", clinicianEntered: false };
  }

  const resection = parseIsoDate(input.resectionDate);
  if (!resection) {
    return { date: null, basis: "Resection date required to calculate dates", clinicianEntered: false };
  }
  if (input.adjuvantTherapy === "no") {
    return { date: formatIsoDate(resection), basis: "Resection date (no adjuvant therapy)", clinicianEntered: false };
  }
  if (input.adjuvantTherapy === "yes") {
    const adjuvant = parseIsoDate(input.adjuvantCompletionDate);
    if (!adjuvant) {
      return {
        date: null,
        basis: "Adjuvant therapy completion date required to calculate dates",
        clinicianEntered: false,
      };
    }
    const later = laterOf(resection, adjuvant);
    return {
      date: formatIsoDate(later),
      basis:
        later === adjuvant
          ? "Completion of adjuvant therapy (later than resection)"
          : "Resection date (later than adjuvant therapy completion)",
      clinicianEntered: false,
    };
  }
  return { date: null, basis: "Adjuvant therapy status required to calculate dates", clinicianEntered: false };
}

export function bandDates(
  reference: string | null,
  band: ScheduleBand,
  today: string,
): { startDate: string | null; endDate: string | null; status: "past" | "current" | "future" | null } {
  const ref = parseIsoDate(reference ?? undefined);
  if (!ref) return { startDate: null, endDate: null, status: null };
  const start = addOffset(ref, band.start);
  const end = band.end ? addOffset(ref, band.end) : null;
  const now = parseIsoDate(today);
  let status: "past" | "current" | "future" | null = null;
  if (now) {
    if (now < start) status = "future";
    else if (end && now >= end) status = "past";
    else status = "current";
  }
  return { startDate: formatIsoDate(start), endDate: end ? formatIsoDate(end) : null, status };
}
