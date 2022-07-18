// "Simple" realization
export async function promiseReduce(asyncFunctions, reduce, initialValue) {
  let res = initialValue;
  for (let asyncFunction of asyncFunctions) {
      res = reduce(res, await asyncFunction());
  }
  return res;
}

// "Reduce" realization
export async function promiseReduce2(asyncFunctions, reduce, initialValue) {
  return await asyncFunctions.reduce(async (memoPromise, asyncFunction) => {
      return reduce(await memoPromise, await asyncFunction());
  }, Promise.resolve(initialValue));
}
