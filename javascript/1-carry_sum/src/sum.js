export const sum = (arg) => {
  let res = arg;
  const callback = (arg) => {
    if (typeof arg === 'number') {
      res += arg;
      return callback;
    }
    return res;
  };
  return callback;
};
