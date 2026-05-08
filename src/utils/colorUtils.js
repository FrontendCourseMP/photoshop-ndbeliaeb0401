export const rgbToLab = (r, g, b) => {
  let var_R = r / 255;
  let var_G = g / 255;
  let var_B = b / 255;

  const gammaCorrect = (c) => {
    return c > 0.04045 ? Math.pow((c + 0.055) / 1.055, 2.4) : c / 12.92;
  };
  var_R = gammaCorrect(var_R);
  var_G = gammaCorrect(var_G);
  var_B = gammaCorrect(var_B);

  let X = var_R * 0.4124564 + var_G * 0.3575761 + var_B * 0.1804375;
  let Y = var_R * 0.2126729 + var_G * 0.7151522 + var_B * 0.0721750;
  let Z = var_R * 0.0193339 + var_G * 0.1191920 + var_B * 0.9503041;

  const epsilon = 0.008856;
  const kappa = 903.3;
  const xr = 0.95047;
  const yr = 1.0;
  const zr = 1.08883;

  const f = (t) => {
    return t > epsilon ? Math.pow(t, 1/3) : (kappa * t + 16) / 116;
  };

  const fx = f(X / xr);
  const fy = f(Y / yr);
  const fz = f(Z / zr);

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b_lab = 200 * (fy - fz);

  return { L: Math.round(L * 100) / 100, a: Math.round(a * 100) / 100, b: Math.round(b_lab * 100) / 100 };
};