import { isTimeObject } from "../utils"

describe("time module", () => {
  test("isTimeObject", () => {
    expect(isTimeObject(null)).toBe(false);
    expect(isTimeObject(10)).toBe(false);
    expect(isTimeObject("10:00")).toBe(false);
    expect(isTimeObject({ anything: null })).toBe(false);
    expect(isTimeObject({ hh: null, mm: null })).toBe(false);
    expect(isTimeObject({ hh: 10, mm: 30 })).toBe(true);
    expect(isTimeObject({ hh: "09", mm: "30" })).toBe(true);
  })
})