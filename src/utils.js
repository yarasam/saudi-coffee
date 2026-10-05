export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smooth = (t) => t * t * (3 - 2 * t);
