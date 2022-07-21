import { describe, it, expect } from "vitest";
import {
  // getGroupItemFreq,
  maxItemAssociation,
  // orderingGroupItems,
} from "../src/maxItemAssociation";

const prepareGroups = (str: string): string[][] => {
  return str
    .replace(/ /gi, "")
    .split("\n")
    .map((i) => i.split(""))
    .filter((i) => i.length);
};

describe("maxItemAssociation", () => {
  it("test1", () => {
    const groups = prepareGroups(`
    facdgimp
    abcflmo
    bfhjo
    bcksp
    afcelpmn
  `);
    const res = maxItemAssociation(groups);
    expect(res).toStrictEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "s",
    ]);
  });

  it("test2", () => {
    const groups = prepareGroups(`
      ab
      ac
      de
    `);

    const res = maxItemAssociation(groups);
    expect(res).toStrictEqual(["a", "b", "c"]);
  });

  it("test3", () => {
    const groups = prepareGroups(`
      qwa
      ab
      ac
      qe
      qr
    `);

    const res = maxItemAssociation(groups);
    expect(res).toStrictEqual(["a", "b", "c", "e", "q", "r", "w"]);
  });

  it("test4", () => {
    const groups = prepareGroups(`
            BAT
            AC
            AS
            BAC
            BS
            AS
            BS
            BAST
            BAS
          `);
    const res = maxItemAssociation(groups);
    expect(res).toStrictEqual(["A", "B", "C", "S", "T"]);
  });

  it("test4", () => {
    const groups = [
      [1, 2],
      [3, 4],
      [2, 1],
      [4, 5],
      [2, 7],
      [8, 9],
      [45, 57, 8],
    ];
    const res = maxItemAssociation(groups);
    expect(res).toStrictEqual([8, 9, 45, 57]);
  });
});
