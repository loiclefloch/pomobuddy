import { describe, it, expect } from "vitest";
import { formatDuration, formatFocusTime } from "./formatTime";

describe("formatDuration", () => {
  it("formats 0 seconds as 00:00", () => {
    expect(formatDuration(0)).toBe("00:00");
  });

  it("formats 60 seconds as 01:00", () => {
    expect(formatDuration(60)).toBe("01:00");
  });

  it("formats 90 seconds as 01:30", () => {
    expect(formatDuration(90)).toBe("01:30");
  });

  it("formats 300 seconds (5 min) as 05:00", () => {
    expect(formatDuration(300)).toBe("05:00");
  });

  it("formats 1500 seconds (25 min) as 25:00", () => {
    expect(formatDuration(1500)).toBe("25:00");
  });

  it("formats 272 seconds as 04:32", () => {
    expect(formatDuration(272)).toBe("04:32");
  });

  it("formats 3599 seconds as 59:59", () => {
    expect(formatDuration(3599)).toBe("59:59");
  });

  it("formats 3600 seconds (1 hour) as 60:00", () => {
    expect(formatDuration(3600)).toBe("60:00");
  });

  it("formats single digit seconds with leading zero", () => {
    expect(formatDuration(5)).toBe("00:05");
  });

  it("formats single digit minutes with leading zero", () => {
    expect(formatDuration(61)).toBe("01:01");
  });
});

describe("formatFocusTime", () => {
  it("formats 0 minutes as 0m", () => {
    expect(formatFocusTime(0)).toBe("0m");
  });

  it("formats minutes under 60 as Xm", () => {
    expect(formatFocusTime(25)).toBe("25m");
  });

  it("formats exactly 60 minutes as 1h", () => {
    expect(formatFocusTime(60)).toBe("1h");
  });

  it("formats 90 minutes as 1h 30m", () => {
    expect(formatFocusTime(90)).toBe("1h 30m");
  });

  it("formats 120 minutes as 2h", () => {
    expect(formatFocusTime(120)).toBe("2h");
  });

  it("formats 150 minutes as 2h 30m", () => {
    expect(formatFocusTime(150)).toBe("2h 30m");
  });
});
