/** Small OKLab / OKLCH toolkit: colour mixing that stays perceptually even, plus WCAG contrast helpers. */

export type RGB = [number, number, number]; // 0..255
export type OKLCH = [number, number, number]; // L 0..1, C, h in radians

export function hexToRgb(hex: string): RGB {
  const value = hex.replace("#", "");
  return [parseInt(value.slice(0, 2), 16), parseInt(value.slice(2, 4), 16), parseInt(value.slice(4, 6), 16)];
}

const toLinear = (channel: number) => {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const fromLinear = (linear: number) => {
  const c = linear <= 0.0031308 ? 12.92 * linear : 1.055 * linear ** (1 / 2.4) - 0.055;
  return Math.min(255, Math.max(0, c * 255));
};

export function rgbToOklch(rgb: RGB): OKLCH {
  const r = toLinear(rgb[0]);
  const g = toLinear(rgb[1]);
  const b = toLinear(rgb[2]);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(a, bb), Math.atan2(bb, a)];
}

export function oklchToRgb([L, C, h]: OKLCH): RGB {
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

/** Mix two colours in OKLCH; hue travels the short way round the wheel. */
export function mixOklch(from: RGB, to: RGB, t: number): RGB {
  const a = rgbToOklch(from);
  const b = rgbToOklch(to);
  let dh = b[2] - a[2];
  if (dh > Math.PI) dh -= Math.PI * 2;
  if (dh < -Math.PI) dh += Math.PI * 2;
  return oklchToRgb([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + dh * t]);
}

export function luminance(rgb: RGB): number {
  return 0.2126 * toLinear(rgb[0]) + 0.7152 * toLinear(rgb[1]) + 0.0722 * toLinear(rgb[2]);
}

export function contrast(fg: RGB, bg: RGB): number {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/**
 * Smallest lightening of `rgb` (same hue) that reaches `ratio` contrast on `bg`. Lightness rises while
 * chroma fades toward white, so even saturated hues stay inside sRGB and always reach the ratio.
 */
export function toneForContrast(rgb: RGB, bg: RGB, ratio: number): RGB {
  if (contrast(rgb, bg) >= ratio) return rgb;
  const [L0, C, h] = rgbToOklch(rgb);
  const at = (t: number) => oklchToRgb([L0 + (1 - L0) * t, C * (1 - t), h]);
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 16; i += 1) {
    const mid = (lo + hi) / 2;
    if (contrast(at(mid), bg) >= ratio) hi = mid;
    else lo = mid;
  }
  return at(hi);
}

export const rgbCss = (rgb: RGB, alpha = 1) =>
  alpha === 1 ? `rgb(${Math.round(rgb[0])} ${Math.round(rgb[1])} ${Math.round(rgb[2])})` : `rgb(${Math.round(rgb[0])} ${Math.round(rgb[1])} ${Math.round(rgb[2])} / ${alpha})`;
