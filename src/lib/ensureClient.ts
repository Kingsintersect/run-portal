export const ensureClient = (): void => {
  if (typeof window === "undefined") {
    throw new Error(
      "Window is not defined! This code should only run on the client side."
    );
  }
};
