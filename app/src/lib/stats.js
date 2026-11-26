// Estadística descriptiva y transformaciones.
// Replica el comportamiento de pandas (cuantil lineal, desvío con ddof=1,
// asimetría ajustada de Fisher-Pearson) para que los números coincidan
// con los del notebook de Colab.

export const sorted = (xs) => [...xs].sort((a, b) => a - b);

export function mean(xs) {
  return xs.reduce((s, x) => s + x, 0) / xs.length;
}

export function std(xs) {
  const m = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1));
}

export function quantile(xs, q) {
  const a = sorted(xs);
  const pos = (a.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return a[lo] + (a[hi] - a[lo]) * (pos - lo);
}

export const median = (xs) => quantile(xs, 0.5);

export function skew(xs) {
  const n = xs.length;
  const m = mean(xs);
  const s = std(xs);
  const sum = xs.reduce((acc, x) => acc + ((x - m) / s) ** 3, 0);
  return (n / ((n - 1) * (n - 2))) * sum;
}

export function limitesIQR(xs, k = 1.5) {
  const q1 = quantile(xs, 0.25);
  const q3 = quantile(xs, 0.75);
  const iqr = q3 - q1;
  return { q1, q3, iqr, inf: q1 - k * iqr, sup: q3 + k * iqr };
}

export function atipicosIQR(xs, k = 1.5) {
  const { inf, sup } = limitesIQR(xs, k);
  return xs.map((x) => x < inf || x > sup);
}

export function atipicosZ(xs, umbral = 3) {
  const m = mean(xs);
  const s = std(xs);
  return xs.map((x) => Math.abs((x - m) / s) > umbral);
}

export function mad(xs) {
  const med = median(xs);
  return median(xs.map((x) => Math.abs(x - med)));
}

export function atipicosZRobusto(xs, umbral = 3.5) {
  const med = median(xs);
  const m = mad(xs);
  if (m === 0) return xs.map(() => false);
  return xs.map((x) => Math.abs((0.6745 * (x - med)) / m) > umbral);
}

export function minmax(xs) {
  const lo = Math.min(...xs);
  const hi = Math.max(...xs);
  return hi === lo ? xs.map(() => 0) : xs.map((x) => (x - lo) / (hi - lo));
}

export function estandarizar(xs) {
  const m = mean(xs);
  const s = std(xs);
  return xs.map((x) => (x - m) / s);
}

export function robustScale(xs) {
  const { q1, q3 } = limitesIQR(xs);
  const med = median(xs);
  return xs.map((x) => (x - med) / (q3 - q1));
}

/** Equivalente a pd.cut con intervalos cerrados a derecha (a, b]. */
export function cut(xs, bins, labels) {
  return xs.map((x) => {
    for (let i = 0; i < bins.length - 1; i++) {
      if (x > bins[i] && x <= bins[i + 1]) return labels[i];
    }
    return null;
  });
}

/** Equivalente a pd.qcut: cortes en cuantiles, el primero incluye el mínimo. */
export function qcut(xs, q, labels) {
  const bins = Array.from({ length: q + 1 }, (_, i) => quantile(xs, i / q));
  return xs.map((x) => {
    if (x === bins[0]) return labels[0];
    for (let i = 0; i < q; i++) {
      if (x > bins[i] && x <= bins[i + 1]) return labels[i];
    }
    return null;
  });
}

export function contar(etiquetas, orden) {
  const c = Object.fromEntries(orden.map((l) => [l, 0]));
  etiquetas.forEach((l) => { if (l in c) c[l] += 1; });
  return orden.map((l) => ({ label: l, n: c[l] }));
}

export const fmtNum = (x, dec = 2) =>
  x.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

export const fmtPesos = (x) =>
  "$" + Math.round(x).toLocaleString("es-AR");

export const fmtM = (x, dec = 2) => "$" + fmtNum(x / 1e6, dec) + " M";
