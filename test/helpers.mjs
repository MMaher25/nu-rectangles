export const it = (desc, fn) => {
  try {
    fn();
    console.log("\x1b[32m%s\x1b[0m", "  \u2714 " + desc);
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "  \u2718 " + desc);
    console.error(error);
  }
};

export const assert = (isTrue) => {
  if (!isTrue) {
    throw new Error();
  }
};

export const describe = (desc) => {
  console.log("\x1b[96m%s\x1b[0m", "\u2192 " + desc);
};
