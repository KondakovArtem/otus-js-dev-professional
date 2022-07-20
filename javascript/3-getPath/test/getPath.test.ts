import fs from "fs/promises";
import { JSDOM } from "jsdom";
import { vi, it, assert, describe, expect } from "vitest";

import { getPath } from "../src/getPath";

function itNode(node, index, document) {
  it(`should work with testNode#${index}`, () => {
    const path = getPath(node, document);
    assert.isNotEmpty(path, `path is empty`);
    const findNode = document.querySelector(path);
    expect(findNode).toBeDefined();
    assert.isTrue(findNode === node, `Wrong element found, path - ${path}`);
  });
}

describe("getPath", async () => {
  const testHtml = await fs.readFile(__dirname + "/test.html", "utf-8");
  const { document } = new JSDOM(testHtml).window;
  const items = document.querySelectorAll("*");
  items.forEach((node, index) => itNode(node, index, document));
});

describe("getPath2", async () => {
  const testHtml = await fs.readFile(__dirname + "/test2.html", "utf-8");
  const { document } = new JSDOM(testHtml, {}).window;
  const items = document.querySelectorAll("*");
  items.forEach((node, index) => itNode(node, index, document));
  // itNode(items[1278], 1278, document);
});
