// Laboratorio interactivo: el estudiante elige variable, método y
// transformación; ve el efecto en el gráfico, decide qué hacer con cada
// atípico y obtiene el código pandas equivalente para llevar a Colab.
import { useMemo, useState } from "react";
import { BoxPlot, Histogram } from "../components/Charts.jsx";
import { HOGARES, VARIABLES } from "../data/hogares.js";
import * as st from "../lib/stats.js";

const METODOS = {
  iqr: { nombre: "IQR (Tukey)", param: "k", min: 1, max: 3, paso: 0.5, def: 1.5 },
  z: { nombre: "z-score", param: "umbral", min: 2, max: 4, paso: 0.5, def: 3 },
  zr: { nombre: "z robusto (MAD)", param: "umbral", min: 2.5, max: 5, paso: 0.5, def: 3.5 },
};
const TRANSF = { ninguna: "Ninguna", log: "log10", minmax: "Min-Max", z: "Estandarizar (z)" };
const DECISIONES = { conservar: "Conservar", nan: "Pasar a NaN", flag: "Marcar (flag)" };

function transformar(xs, t) {
  if (t === "log") return xs.map((x) => (x > 0 ? Math.log10(x) : NaN));
  if (t === "minmax") return st.minmax(xs);
  if (t === "z") return st.estandarizar(xs);
  return xs;
}

function detectar(xs, metodo, p) {
  if (metodo === "z") return st.atipicosZ(xs, p);
  if (metodo === "zr") return st.atipicosZRobusto(xs, p);
  return st.atipicosIQR(xs, p);
}

function codigoPandas(variable, metodo, p, transf, decisiones) {
  const l = [];
  const s = transf === "ninguna" ? `df["${variable}"]` : "x";
  if (transf === "log") l.push(`x = np.log10(df["${variable}"])`);
  if (transf === "minmax") l.push(`x = (df["${variable}"] - df["${variable}"].min()) / (df["${variable}"].max() - df["${variable}"].min())`);
  if (transf === "z") l.push(`x = (df["${variable}"] - df["${variable}"].mean()) / df["${variable}"].std()`);
  if (metodo === "iqr") {
    l.push(`q1, q3 = ${s}.quantile([.25, .75])`, `iqr = q3 - q1`, `mask = (${s} < q1 - ${p} * iqr) | (${s} > q3 + ${p} * iqr)`);
  } else if (metodo === "z") {
    l.push(`z = (${s} - ${s}.mean()) / ${s}.std()`, `mask = z.abs() > ${p}`);
  } else {
    l.push(`med = ${s}.median()`, `mad = (${s} - med).abs().median()`, `mask = (0.6745 * (${s} - med) / mad).abs() > ${p}`);
  }
  l.push(`df.loc[mask, ["id_hogar", "region", "${variable}"]]`);
  const nan = Object.entries(decisiones).filter(([, d]) => d === "nan").map(([id]) => id);
  const flag = Object.entries(decisiones).filter(([, d]) => d === "flag").map(([id]) => id);
  if (nan.length) l.push("", `# Decisión documentada: errores → NaN`, `df.loc[df["id_hogar"].isin([${nan.join(", ")}]), "${variable}"] = np.nan`);
  if (flag.length) l.push("", `# Decisión documentada: casos dudosos → flag`, `df["flag_${variable}"] = df["id_hogar"].isin([${flag.join(", ")}])`);
  return l.join("\n");
}

export default function Laboratorio() {
  const [variable, setVariable] = useState("ingreso_total");
  const [metodo, setMetodo] = useState("iqr");
  const [param, setParam] = useState(1.5);
  const [transf, setTransf] = useState("ninguna");
  const [decisiones, setDecisiones] = useState({});
  const [copiado, setCopiado] = useState(false);

  const info = VARIABLES[variable];
  const crudos = HOGARES.map((h) => h[variable]);
  const xs = useMemo(() => transformar(crudos, transf), [variable, transf]); // eslint-disable-line react-hooks/exhaustive-deps
  const mask = useMemo(() => detectar(xs, metodo, param), [xs, metodo, param]);
  const marcados = HOGARES.filter((_, i) => mask[i]).sort((a, b) => b[variable] - a[variable]);

  const esc = transf === "ninguna" ? info.escala : 1;
  const vis = xs.map((x) => x / esc);
  const fmt = (x) => st.fmtNum(x, Math.abs(x) < 100 ? 2 : 0);
  // dominio: percentil 99,5 para que un valor absurdo no aplaste el gráfico
  const p995 = st.quantile(vis, 0.995);
  const dominio = [Math.min(...vis), Math.max(p995 * 1.15, st.quantile(vis, 0.75))];

  // Impacto de las decisiones sobre la variable original
  const tratados = HOGARES.filter((h) => decisiones[h.id_hogar] !== "nan" && decisiones[h.id_hogar] !== "flag").map((h) => h[variable]);
  const fmtV = (x) => (info.escala > 1 ? st.fmtM(x) : st.fmtNum(x, 1));

  const cambiarMetodo = (m) => { setMetodo(m); setParam(METODOS[m].def); };
  const cambiarVariable = (v) => { setVariable(v); setDecisiones({}); };
  const codigo = codigoPandas(variable, metodo, param, transf, decisiones);
  const copiar = async () => {
    try { await navigator.clipboard.writeText(codigo); setCopiado(true); setTimeout(() => setCopiado(false), 1500); } catch { /* sin portapapeles */ }
  };

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="card">
        <div className="grid g3" style={{ alignItems: "end" }}>
          <label className="ctrl">Variable
            <select value={variable} onChange={(e) => cambiarVariable(e.target.value)}>
              {Object.entries(VARIABLES).map(([k, v]) => <option key={k} value={k}>{v.nombre}</option>)}
            </select>
          </label>
          <label className="ctrl">Transformación
            <select value={transf} onChange={(e) => setTransf(e.target.value)}>
              {Object.entries(TRANSF).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className="ctrl">Método de detección
            <select value={metodo} onChange={(e) => cambiarMetodo(e.target.value)}>
              {Object.entries(METODOS).map(([k, v]) => <option key={k} value={k}>{v.nombre}</option>)}
            </select>
          </label>
        </div>
        <label className="ctrl" style={{ marginTop: 16 }}>
          {METODOS[metodo].param} = {String(param).replace(".", ",")}
          <input type="range" min={METODOS[metodo].min} max={METODOS[metodo].max} step={METODOS[metodo].paso}
            value={param} onChange={(e) => setParam(Number(e.target.value))} />
        </label>
      </div>

      <div className="stats">
        <div className="stat"><span>Media</span><b>{fmt(st.mean(vis))}</b></div>
        <div className="stat"><span>Mediana</span><b>{fmt(st.median(vis))}</b></div>
        <div className="stat"><span>Desvío</span><b>{fmt(st.std(vis))}</b></div>
        <div className="stat"><span>Asimetría</span><b>{st.fmtNum(st.skew(xs))}</b></div>
        <div className="stat alerta"><span>Atípicos</span><b>{marcados.length}</b></div>
      </div>

      <div className="card">
        <h3>Distribución {transf !== "ninguna" ? `(${TRANSF[transf]})` : ""}</h3>
        <Histogram values={vis} mask={mask} domain={dominio} bins={40} fmt={fmt}
          xLabel={transf === "ninguna" ? `${info.nombre} (${info.escala > 1 ? "millones de $" : info.unidad})` : TRANSF[transf]} />
        {metodo === "iqr" && (
          <BoxPlot values={vis} k={param} domain={dominio} fmt={fmt} height={200} />
        )}
        <p style={{ fontSize: 14, color: "var(--tinta-suave)", margin: "8px 0 0" }}>
          Los puntos ámbar son los valores marcados como atípicos. Pasá el mouse sobre las barras para ver los conteos.
        </p>
      </div>

      <div className="grid g2" style={{ alignItems: "start" }}>
        <div className="card ambar">
          <h3>Decidí qué hacer con cada atípico ({marcados.length})</h3>
          {marcados.length === 0 ? <p>No hay valores marcados con este criterio.</p> : (
            <div className="tabla-scroll" style={{ maxHeight: 380, overflowY: "auto" }}>
              <table className="tabla">
                <thead><tr><th className="num">Hogar</th><th>Región</th><th className="num">Valor</th><th>Decisión</th></tr></thead>
                <tbody>
                  {marcados.map((h) => (
                    <tr key={h.id_hogar}>
                      <td className="num">#{h.id_hogar}</td>
                      <td>{h.region}</td>
                      <td className="num">{info.escala > 1 ? st.fmtPesos(h[variable]) : h[variable]}</td>
                      <td>
                        <select aria-label={`Decisión para el hogar ${h.id_hogar}`} value={decisiones[h.id_hogar] || "conservar"}
                          onChange={(e) => setDecisiones({ ...decisiones, [h.id_hogar]: e.target.value })}>
                          {Object.entries(DECISIONES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="stats" style={{ marginTop: 14 }}>
            <div className="stat"><span>Media antes</span><b>{fmtV(st.mean(crudos))}</b></div>
            <div className="stat"><span>Media después</span><b>{fmtV(st.mean(tratados))}</b></div>
            <div className="stat"><span>Mediana después</span><b>{fmtV(st.median(tratados))}</b></div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <h3 style={{ margin: 0 }}>Código equivalente en pandas</h3>
            <button className="btn sec" onClick={copiar}>{copiado ? "¡Copiado!" : "Copiar"}</button>
          </div>
          <pre className="codigo" style={{ marginTop: 12 }}>{codigo}</pre>
          <p style={{ fontSize: 14, color: "var(--tinta-suave)", marginTop: 10 }}>
            Pegalo en el notebook de Colab: se actualiza con cada cambio que hacés acá, incluidas tus decisiones.
          </p>
        </div>
      </div>
    </div>
  );
}
