import { describe, expect, it } from "vitest";
import {
  addMonths,
  addOffset,
  bandDates,
  computeReferenceDate,
  formatIsoDate,
  parseIsoDate,
} from "@/lib/dates";

const d = (iso: string) => {
  const date = parseIsoDate(iso);
  if (!date) throw new Error(`bad test date ${iso}`);
  return date;
};

describe("parseIsoDate", () => {
  it("parses valid dates in UTC", () => {
    expect(formatIsoDate(d("2024-02-29"))).toBe("2024-02-29");
  });

  it("rejects empty, malformed and impossible dates", () => {
    expect(parseIsoDate(undefined)).toBeNull();
    expect(parseIsoDate("")).toBeNull();
    expect(parseIsoDate("2024-2-1")).toBeNull();
    expect(parseIsoDate("2023-02-29")).toBeNull();
    expect(parseIsoDate("2024-13-01")).toBeNull();
  });
});

describe("addMonths", () => {
  it("clamps to the last day of shorter months", () => {
    expect(formatIsoDate(addMonths(d("2024-01-31"), 1))).toBe("2024-02-29");
    expect(formatIsoDate(addMonths(d("2023-01-31"), 1))).toBe("2023-02-28");
    expect(formatIsoDate(addMonths(d("2024-08-31"), 3))).toBe("2024-11-30");
  });

  it("crosses year boundaries", () => {
    expect(formatIsoDate(addMonths(d("2024-11-15"), 3))).toBe("2025-02-15");
    expect(formatIsoDate(addMonths(d("2024-02-29"), 12))).toBe("2025-02-28");
  });

  it("adds weeks for week offsets", () => {
    expect(formatIsoDate(addOffset(d("2025-01-01"), { weeks: 8 }))).toBe("2025-02-26");
  });
});

describe("computeReferenceDate", () => {
  const sts = { pathway: "sts" as const, recurrence: "no" as const };

  it("uses the resection date when no adjuvant therapy was given", () => {
    const ref = computeReferenceDate({ ...sts, resectionDate: "2025-03-10", adjuvantTherapy: "no" });
    expect(ref.date).toBe("2025-03-10");
  });

  it("uses adjuvant completion when it is later than resection", () => {
    const ref = computeReferenceDate({
      ...sts,
      resectionDate: "2025-03-10",
      adjuvantTherapy: "yes",
      adjuvantCompletionDate: "2025-06-20",
    });
    expect(ref.date).toBe("2025-06-20");
    expect(ref.basis).toMatch(/adjuvant/i);
  });

  it("uses resection when it is later than the adjuvant date", () => {
    const ref = computeReferenceDate({
      ...sts,
      resectionDate: "2025-06-20",
      adjuvantTherapy: "yes",
      adjuvantCompletionDate: "2025-03-10",
    });
    expect(ref.date).toBe("2025-06-20");
  });

  it("does not calculate a date when adjuvant status is unknown or unanswered", () => {
    expect(computeReferenceDate({ ...sts, resectionDate: "2025-03-10", adjuvantTherapy: "unknown" }).date).toBeNull();
    expect(computeReferenceDate({ ...sts, resectionDate: "2025-03-10" }).date).toBeNull();
  });

  it("does not calculate a date when recurrence status is unknown", () => {
    const ref = computeReferenceDate({
      pathway: "sts",
      recurrence: "unknown",
      resectionDate: "2025-03-10",
      adjuvantTherapy: "no",
    });
    expect(ref.date).toBeNull();
  });

  it("re-anchors to the clinician-entered restart date after recurrence", () => {
    const ref = computeReferenceDate({
      pathway: "sts",
      recurrence: "yes",
      resectionDate: "2020-01-01",
      adjuvantTherapy: "no",
      restartReferenceDate: "2025-09-01",
    });
    expect(ref).toEqual({
      date: "2025-09-01",
      basis: expect.stringMatching(/restart/i),
      clinicianEntered: true,
    });
  });

  it("uses the clinician-entered surveillance start date for desmoid", () => {
    expect(computeReferenceDate({ pathway: "desmoid", surveillanceStartDate: "2025-05-05" }).date).toBe(
      "2025-05-05",
    );
  });
});

describe("bandDates", () => {
  const band = { label: "Years 1–3", start: { months: 0 }, end: { months: 36 }, intervalText: "x" };

  it("calculates calendar ranges from the reference date", () => {
    expect(bandDates("2025-01-15", band, "2025-06-01")).toEqual({
      startDate: "2025-01-15",
      endDate: "2028-01-15",
      status: "current",
    });
  });

  it("marks past and future bands", () => {
    expect(bandDates("2025-01-15", band, "2024-12-01").status).toBe("future");
    expect(bandDates("2025-01-15", band, "2028-02-01").status).toBe("past");
  });

  it("returns no dates without a reference date", () => {
    expect(bandDates(null, band, "2025-06-01")).toEqual({ startDate: null, endDate: null, status: null });
  });

  it("supports open-ended bands", () => {
    const open = { ...band, start: { months: 3 }, end: null };
    expect(bandDates("2025-01-31", open, "2025-02-01")).toEqual({
      startDate: "2025-04-30",
      endDate: null,
      status: "future",
    });
  });
});
