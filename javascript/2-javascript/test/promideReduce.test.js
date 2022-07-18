import { it, expect, vi, describe } from "vitest";

import { promiseReduce, promiseReduce2 } from "../src/promiseReduce";

describe("promiseReduce", () => {
  it("test1", async () => {
    const spyConsole = vi.spyOn(console, "log");

    // const testConsole = new TestConsole();

    // first async function
    const fn1 = () => {
      console.log("fn1");
      return Promise.resolve(1);
    };

    // second async function
    const fn2 = () =>
      new Promise((resolve) => {
        console.log("fn2");
        setTimeout(() => resolve(2), 1000);
      });

    console.log(
      await promiseReduce(
        [fn1, fn2],
        (memo, value) => {
          console.log("reduce");
          return memo * value;
        },
        1
      )
    );

    

    expect(spyConsole.mock.calls.map((i) => i.join(","))).toEqual([
      "fn1",
      "reduce",
      "fn2",
      "reduce",
      "2",
    ]);
  });

  it("test2", async () => {
    const spyConsole = vi.spyOn(console, "log");

    // const testConsole = new TestConsole();

    // first async function
    const fn1 = () => {
      console.log("fn1");
      return Promise.resolve(1);
    };

    // second async function
    const fn2 = () =>
      new Promise((resolve) => {
        console.log("fn2");
        setTimeout(() => resolve(2), 1000);
      });

    console.log(
      await promiseReduce(
        [fn1, fn2],
        (memo, value) => {
          console.log("reduce");
          return memo + value;
        },
        1
      )
    );

    expect(spyConsole.mock.calls.map((i) => i.join(","))).toEqual([
      "fn1",
      "reduce",
      "fn2",
      "reduce",
      "4",
    ]);
  });
});

describe("promiseReduce2", () => {
  it("test1", async () => {
    const spyConsole = vi.spyOn(console, "log");

    // first async function
    const fn1 = () => {
      console.log("fn1");
      return Promise.resolve(2);
    };

    // second async function
    const fn2 = () =>
      new Promise((resolve) => {
        console.log("fn2");
        setTimeout(() => resolve(3), 1000);
      });

    console.log(
      await promiseReduce2(
        [fn1, fn2],
        function (memo, value) {
          console.log("reduce");
          return memo * value;
        },
        1
      )
    );

    expect(spyConsole.mock.calls.map((i) => i.join(","))).toEqual([
      "fn1",
      "reduce",
      "fn2",
      "reduce",
      "6",
    ]);
  });
});
