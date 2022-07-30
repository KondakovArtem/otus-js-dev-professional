import { describe, it } from "vitest";
import { resolve } from "path";

import {
  generateFile,
  ESizes,
  getNumberFromRange,
} from "../src/merge-sorting-file";

describe("fileSort", () => {
  it("generateFile should work", async () => {
    const path = resolve(
      __dirname,
      `gen/file${getNumberFromRange(0, 100)}.txt`
    );
    await generateFile({ path, size: ESizes.size_10Mb });
    // const { heapTotal, heapUsed } = process.memoryUsage();
  }, 60000);
});
