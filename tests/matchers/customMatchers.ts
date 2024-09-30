export const toBeStringOrNull = (received: any) => {
  const pass = typeof received === 'string' || received === null;
  if (pass) {
    return {
      message: () => `expected ${received} not to be a string or null`,
      pass: true,
    };
  } else {
    return {
      message: () => `expected ${received} to be a string or null`,
      pass: false,
    };
  }
};
