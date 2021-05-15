import moment, { Moment } from "moment";
import { isMomentObject, isNumericTimeObject, isNumericValue, isPaddedTimeObject, isTimeObject, padInteger, padTimeString, parseTime, parseTimeStringToMomentObject, parseTimeStringToTimeObject, stringifyMomentObject, stringifyTime, stringifyTimeObject, minutesFromMidnight, minutesFromMidnightToTime } from "../utils"


describe("time module", () => {
  test("isTimeObject", () => {
    expect(isTimeObject(null)).toBe(false);
    expect(isTimeObject(10)).toBe(false);
    expect(isTimeObject("10:00")).toBe(false);
    expect(isTimeObject({ anything: null })).toBe(false);
    expect(isTimeObject({ hh: null, mm: null })).toBe(false);
    expect(isPaddedTimeObject({ hh: "8", mm: "25" })).toBe(false);
    expect(isTimeObject({ hh: 10, mm: 30 })).toBe(true);
    expect(isTimeObject({ hh: "09", mm: "30" })).toBe(true);
    expect(isPaddedTimeObject({ hh: "08", mm: "25" })).toBe(true);
    expect(isNumericTimeObject({ hh: 8, mm: 25 })).toBe(true);
  });
  test("isMomentObject", () => {
    expect(isMomentObject({ time: "" })).toBe(false);
    expect(isMomentObject(moment(moment.now()))).toBe(true);
  });
  test("isNumericValue", () => {
    expect(isNumericValue("some string")).toBe(false);
    expect(isNumericValue("10.4.4")).toBe(false);
    expect(isNumericValue({ hh: 0, mm: 0 })).toBe(false);
    expect(isNumericValue("10")).toBe(10);
    expect(isNumericValue("10.4")).toBe(10.4);
    expect(isNumericValue(10)).toBe(10);
    expect(isNumericValue(10.4)).toBe(10.4);
  });
  test("padTimeString", () => {
    expect(padInteger(null)).toEqual("00");
    expect(padInteger(0)).toEqual("00");
    expect(padInteger("00")).toEqual("00");

    expect(padInteger(9)).toEqual("09");
    expect(padInteger("9")).toEqual("09");
    expect(padInteger("09")).toEqual("09");

    expect(padTimeString("8:5")).toEqual("08:05");
    expect(padTimeString("8:25")).toEqual("08:25");
    expect(padTimeString("08:5")).toEqual("08:05");
  })
  test("stringifyTime", () => {
    expect(stringifyTimeObject({ hh: 8, mm: 25 })).toEqual("08:25");
    expect(stringifyMomentObject(moment("8:25", "hh:mm"))).toEqual("08:25");
  });
  test("parseTimeStringToTimeObject", () => {
    expect(parseTimeStringToTimeObject("08:25", true)).toEqual({
      hh: 8,
      mm: 25
    });
    expect(parseTimeStringToTimeObject("8:25", false)).toEqual({
      hh: "08",
      mm: "25"
    });
    expect(parseTimeStringToMomentObject("8:25")).toBeMomentObject("08", "25");
  });
  test("parseTime", () => {
    // parse all formats into default expected return format object:padded
    expect(parseTime("08:25")).toEqual({ hh: "08", mm: "25" });
    expect(parseTime(moment("8:25", "hh:mm"))).toEqual({ hh: "08", mm: "25" });
    expect(parseTime({ hh: 8, mm: 25 })).toEqual({ hh: "08", mm: "25" });
    expect(parseTime({ hh: "8", mm: "25" })).toEqual({ hh: "08", mm: "25" });
    // parse string format into all formats
    expect(parseTime("8:25", "string")).toEqual("08:25");
    expect(parseTime("8:25", "moment")).toBeMomentObject("08", "25");
    expect(parseTime("8:25", "object:padded")).toEqual({ hh: "08", mm: "25" });
    expect(parseTime("8:25", "object:numeric")).toEqual({ hh: 8, mm: 25 });
    // parse object:padded format into all formats
    expect(parseTime({ hh: "8", mm: "25" }, "string")).toEqual("08:25");
    expect(parseTime({ hh: "8", mm: "25" }, "moment")).toBeMomentObject("08", "25");
    expect(parseTime({ hh: "8", mm: "25" }, "object:padded")).toEqual({ hh: "08", mm: "25" });
    expect(parseTime({ hh: "8", mm: "25" }, "object:numeric")).toEqual({ hh: 8, mm: 25 });
    // parse object:numeric format into all formats
    expect(parseTime({ hh: 8, mm: 25 }, "string")).toEqual("08:25");
    expect(parseTime({ hh: 8, mm: 25 }, "moment")).toBeMomentObject("08", "25");
    expect(parseTime({ hh: 8, mm: 25 }, "object:padded")).toEqual({ hh: "08", mm: "25" });
    expect(parseTime({ hh: 8, mm: 25 }, "object:numeric")).toEqual({ hh: 8, mm: 25 });
    // parse moment format into all formats
    expect(parseTime(moment("8:25", "hh:mm"), "string")).toEqual("08:25");
    expect(parseTime(moment("8:25", "hh:mm"), "moment")).toBeMomentObject("08", "25");
    expect(parseTime(moment("8:25", "hh:mm"), "object:padded")).toEqual({ hh: "08", mm: "25" });
    expect(parseTime(moment("8:25", "hh:mm"), "object:numeric")).toEqual({ hh: 8, mm: 25 });
  });
  test("minutesFromMidnight", () => {
    expect(minutesFromMidnight("08:25")).toBe(505);
    expect(minutesFromMidnight({ hh: 8, mm: 25 })).toBe(505);
    expect(minutesFromMidnight({ hh: "08", mm: "25" })).toBe(505);
    expect(minutesFromMidnight(moment("08:25", "hh:mm"))).toBe(505);
  });
  test("minutesFromMidnightToTime", () => {
    expect(minutesFromMidnightToTime(505)).toEqual({ hh: "08", mm: "25" });
    expect(minutesFromMidnightToTime(505,  "object:padded")).toEqual({ hh: "08", mm: "25" });
    expect(minutesFromMidnightToTime(505, "object:numeric")).toEqual({ hh: 8, mm: 25 });
    expect(minutesFromMidnightToTime(505, "string")).toEqual("08:25");
    expect(minutesFromMidnightToTime(505, "moment")).toBeMomentObject("08", "25");
  });
})