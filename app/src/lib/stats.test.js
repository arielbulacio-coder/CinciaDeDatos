// Verifica que los cálculos en JavaScript coinciden con pandas
// (valores obtenidos con clase-10-outliers-transformaciones/src/eda_utils.py).
import { describe, expect, it } from "vitest";
import hogares from "../data/hogares.json";
import * as st from "./stats.js";

const ingreso = hogares.map((h) => h.ingreso_total);
const edad = hogares.map((h) => h.edad_jefe);
const cuenta = (mask) => mask.filter(Boolean).length;

describe("estadística descriptiva (igual a pandas)", () => {
  it("media, mediana y asimetría del ingreso", () => {
    expect(st.mean(ingreso)).toBeCloseTo(1890908, 0);
    expect(st.median(ingreso)).toBe(1351000);
    expect(st.skew(ingreso)).toBeCloseTo(20.92, 2);
  });

  it("límites de Tukey", () => {
    const { inf, sup } = st.limitesIQR(ingreso);
    expect(inf).toBeCloseTo(-597125, 0);
    expect(sup).toBeCloseTo(3445875, 0);
  });
});

describe("detección de atípicos en ingreso_total", () => {
  it("IQR detecta 26, z-score 1 (enmascaramiento), z robusto 22", () => {
    expect(cuenta(st.atipicosIQR(ingreso))).toBe(26);
    expect(cuenta(st.atipicosZ(ingreso))).toBe(1);
    expect(cuenta(st.atipicosZRobusto(ingreso))).toBe(22);
  });

  it("IQR sobre log10(ingreso) detecta 7", () => {
    expect(cuenta(st.atipicosIQR(ingreso.map(Math.log10)))).toBe(7);
  });

  it("edad_jefe: el código 999 aparece como atípico", () => {
    expect(cuenta(st.atipicosZ(edad))).toBe(2);
  });
});

describe("transformaciones", () => {
  it("min-max queda en [0, 1]", () => {
    const r = st.minmax([10, 20, 30]);
    expect(r).toEqual([0, 0.5, 1]);
  });

  it("estandarizar da media 0 y desvío 1", () => {
    const z = st.estandarizar(edad);
    expect(st.mean(z)).toBeCloseTo(0, 10);
    expect(st.std(z)).toBeCloseTo(1, 10);
  });

  it("qcut reparte en quintiles de igual tamaño", () => {
    const limpio = ingreso.filter((x) => x < 1e8);
    const q = st.contar(st.qcut(limpio, 5, ["Q1", "Q2", "Q3", "Q4", "Q5"]), ["Q1", "Q2", "Q3", "Q4", "Q5"]);
    expect(q.map((d) => d.n)).toEqual([100, 100, 99, 100, 100]);
  });

  it("cut con tramos de edad (intervalos cerrados a derecha)", () => {
    expect(st.cut([18, 29, 30, 65], [17, 29, 44, 64, 120], ["a", "b", "c", "d"])).toEqual(["a", "a", "b", "d"]);
  });
});
