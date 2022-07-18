import { describe, it, expect } from "vitest";
import { sum } from "../src/sum";

describe("sum", () => {
  it("sum(undefined)() // undefined", () => {
    const res = sum(undefined)();
    expect(res).toBe(undefined);
  });
  it("sum(1)() // 1", () => {
    const res = sum(1)();
    expect(res).toBe(1);
  });
  it("sum(1)(2)(3)(4)()  // 10", () => {
    const res = sum(1)(2)(3)(4)();
    expect(res).toBe(10);
  });
  it("sum(0)(5)(3)(8)(-2)() // 14", () => {
    const res = sum(0)(5)(3)(8)(-2)();
    expect(res).toBe(14);
  });
  it("sum(1)(1)(1)(1)(1)(1)(1)() // 7", () => {
    const res = sum(1)(1)(1)(1)(1)(1)(1)();
    expect(res).toBe(7);
  });
});
