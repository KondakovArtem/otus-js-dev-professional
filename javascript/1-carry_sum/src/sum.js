export const sum = (arg) => {
  let res = arg;
  const callback = (arg) => {
    if (arg) {
      res += arg;
      return callback;
    }
    return res;
  };
  return callback;
};
