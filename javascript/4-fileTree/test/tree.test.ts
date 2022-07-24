import { describe, it, expect } from "vitest";
import { resolve } from "path";
import { tree } from "../src/tree";

describe("tree", () => {
  it("test1", async () => {
    const path = resolve(__dirname, "structure");
    const res = await tree(path);
    expect(res).toStrictEqual({
      files: [
        "foo/f1.txt",
        "foo/f2.txt",
        "foo/bar/bar1.txt",
        "foo/bar/bar2.txt",
      ],
      dirs: ["foo", "foo/bar", "foo/bar/baz"],
    });
  });
});
