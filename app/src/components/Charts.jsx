// Gráficos en SVG puro (sin dependencias), con la paleta UADE:
// azul para los datos, ámbar para resaltar atípicos. Cada marca tiene un
// <title> que funciona como tooltip al pasar el mouse.
import { limitesIQR, quantile } from "../lib/stats.js";

export const C = {
  azul: "#2F6DB5",
  azulClaro: "#D6E4F5",
  ambar: "#D98600",
  tinta: "#061B2C",
  tinta2: "#4E5B66",
  grilla: "#E3E8EE",
};

function niceTicks(min, max, n = 6) {
  const rango = max - min || 1;
  const paso0 = rango / n;
  const mag = 10 ** Math.floor(Math.log10(paso0));
  const paso = [1, 2, 5, 10].map((m) => m * mag).find((p) => rango / p <= n) ?? 10 * mag;
  const ticks = [];
  for (let t = Math.ceil(min / paso) * paso; t <= max + 1e-9; t += paso) ticks.push(+t.toFixed(10));
  return ticks;
}

const margenes = (fs) => ({ top: Math.round(fs * 1.6), right: 24, bottom: Math.round(fs * 4.2), left: Math.round(fs * 3.6) });
const tickFmt = (fmt) => (t) => (Number.isInteger(t) ? t.toLocaleString("es-AR") : fmt(t));

export function Histogram({
  values,
  mask,
  bins = 40,
  domain,
  lines = [],
  fmt = (x) => x.toLocaleString("es-AR"),
  width = 900,
  height = 340,
  fs = 15,
  xLabel,
  titulo,
}) {
  const M = margenes(fs);
  const lo = domain ? domain[0] : Math.min(...values);
  const hi = domain ? domain[1] : Math.max(...values);
  const ancho = (hi - lo) / bins || 1;
  const cuentas = Array(bins).fill(0);
  let fuera = 0;
  values.forEach((v) => {
    if (v < lo || v > hi) { fuera += 1; return; }
    const i = Math.min(bins - 1, Math.floor((v - lo) / ancho));
    cuentas[i] += 1;
  });
  const maxC = Math.max(...cuentas, 1);
  const iw = width - M.left - M.right;
  const ih = height - M.top - M.bottom;
  const x = (v) => M.left + ((v - lo) / (hi - lo || 1)) * iw;
  const y = (c) => M.top + ih - (c / maxC) * ih;
  const xt = niceTicks(lo, hi, 6);
  const yt = niceTicks(0, maxC, 4);
  const bw = iw / bins;
  const marcados = mask ? values.filter((v, i) => mask[i] && v >= lo && v <= hi) : [];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart" role="img" aria-label={titulo || "Histograma"}>
      {yt.map((t) => (
        <g key={`y${t}`}>
          <line x1={M.left} x2={width - M.right} y1={y(t)} y2={y(t)} stroke={C.grilla} />
          <text x={M.left - 8} y={y(t) + fs / 3} textAnchor="end" fontSize={fs} fill={C.tinta2}>{t}</text>
        </g>
      ))}
      {cuentas.map((c, i) =>
        c > 0 ? (
          <rect key={i} className="bar" x={M.left + i * bw + 1} y={y(c)} width={Math.max(bw - 2, 1)} height={M.top + ih - y(c)} rx={Math.min(3, bw / 4)} fill={C.azul}>
            <title>{`${fmt(lo + i * ancho)} – ${fmt(lo + (i + 1) * ancho)}: ${c} hogares`}</title>
          </rect>
        ) : null,
      )}
      {marcados.map((v, i) => (
        <circle key={`m${i}`} cx={x(v)} cy={M.top + ih + 12} r={5} fill={C.ambar} stroke="#fff" strokeWidth={1.5}>
          <title>{`Atípico: ${fmt(v)}`}</title>
        </circle>
      ))}
      {lines.map((l, i) => (
        <g key={`l${i}`}>
          <line x1={x(l.x)} x2={x(l.x)} y1={M.top} y2={M.top + ih} stroke={l.color || C.tinta} strokeWidth={2.5} strokeDasharray="7 5" />
          <text x={x(l.x) + 8} y={M.top + fs + i * (fs + 8)} fontSize={fs} fontWeight="700" fill={C.tinta}>{l.label}</text>
        </g>
      ))}
      <line x1={M.left} x2={width - M.right} y1={M.top + ih} y2={M.top + ih} stroke={C.tinta2} />
      {xt.map((t) => (
        <text key={`x${t}`} x={x(t)} y={M.top + ih + fs * 1.9} textAnchor="middle" fontSize={fs} fill={C.tinta2}>{tickFmt(fmt)(t)}</text>
      ))}
      {xLabel && <text x={M.left + iw / 2} y={height - 4} textAnchor="middle" fontSize={fs} fill={C.tinta2}>{xLabel}</text>}
      {fuera > 0 && (
        <text x={width - M.right} y={M.top + ih / 2} textAnchor="end" fontSize={fs} fontWeight="700" fill={C.ambar}>
          {fuera} fuera del gráfico →
        </text>
      )}
    </svg>
  );
}

export function BoxPlot({ values, k = 1.5, domain, fmt = (x) => x.toLocaleString("es-AR"), width = 900, height = 220, fs = 15, xLabel }) {
  const M = margenes(fs);
  const { q1, q3, inf, sup } = limitesIQR(values, k);
  const med = quantile(values, 0.5);
  const lo = domain ? domain[0] : Math.min(...values);
  const hi = domain ? domain[1] : Math.max(...values);
  const iw = width - M.left - M.right;
  const x = (v) => M.left + ((Math.min(Math.max(v, lo), hi) - lo) / (hi - lo)) * iw;
  const cy = 92;
  const dentro = values.filter((v) => v >= inf && v <= sup);
  const bigInf = Math.min(...dentro);
  const bigSup = Math.max(...dentro);
  const atip = values.filter((v) => v < inf || v > sup);
  const visibles = atip.filter((v) => v >= lo && v <= hi);
  const xt = niceTicks(lo, hi, 6);
  const base = height - fs * 3.6;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart" role="img" aria-label="Diagrama de caja con regla de Tukey">
      {sup <= hi && (
        <g>
          <line x1={x(sup)} x2={x(sup)} y1={28} y2={base - 6} stroke={C.ambar} strokeWidth={2} strokeDasharray="6 5" />
          <text x={x(sup) + 6} y={30} fontSize={fs} fill={C.tinta}>{`Q3 + ${k.toString().replace(".", ",")}·IQR = ${fmt(sup)}`}</text>
        </g>
      )}
      {inf >= lo && <line x1={x(inf)} x2={x(inf)} y1={28} y2={base - 6} stroke={C.ambar} strokeWidth={2} strokeDasharray="6 5" />}
      <line x1={x(bigInf)} x2={x(q1)} y1={cy} y2={cy} stroke={C.azul} strokeWidth={2.5} />
      <line x1={x(q3)} x2={x(bigSup)} y1={cy} y2={cy} stroke={C.azul} strokeWidth={2.5} />
      <rect x={x(q1)} y={cy - 30} width={x(q3) - x(q1)} height={60} fill={C.azulClaro} stroke={C.azul} strokeWidth={2.5} rx={4}>
        <title>{`Q1 = ${fmt(q1)} · Q3 = ${fmt(q3)}`}</title>
      </rect>
      <line x1={x(med)} x2={x(med)} y1={cy - 30} y2={cy + 30} stroke={C.tinta} strokeWidth={4}>
        <title>{`Mediana = ${fmt(med)}`}</title>
      </line>
      {visibles.map((v, i) => (
        <circle key={i} cx={x(v)} cy={cy} r={6.5} fill={C.ambar} stroke="#fff" strokeWidth={1.5}>
          <title>{`Atípico: ${fmt(v)}`}</title>
        </circle>
      ))}
      <line x1={M.left} x2={width - M.right} y1={base} y2={base} stroke={C.tinta2} />
      {xt.map((t) => (
        <text key={t} x={x(t)} y={base + fs * 1.5} textAnchor="middle" fontSize={fs} fill={C.tinta2}>{tickFmt(fmt)(t)}</text>
      ))}
      {xLabel && <text x={M.left + iw / 2} y={height - 2} textAnchor="middle" fontSize={fs} fill={C.tinta2}>{xLabel}</text>}
      {atip.length > visibles.length && (
        <text x={width - M.right} y={cy - 40} textAnchor="end" fontSize={fs} fontWeight="700" fill={C.ambar}>
          +{atip.length - visibles.length} fuera →
        </text>
      )}
    </svg>
  );
}

export function Bars({ data, width = 700, height = 340, fs = 16, xLabel }) {
  const M = margenes(fs);
  const maxN = Math.max(...data.map((d) => d.n), 1) * 1.15;
  const iw = width - M.left - M.right;
  const ih = height - M.top - M.bottom;
  const bw = iw / data.length;
  const y = (n) => M.top + ih - (n / maxN) * ih;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="chart" role="img" aria-label="Gráfico de barras">
      {niceTicks(0, maxN, 4).map((t) => (
        <g key={t}>
          <line x1={M.left} x2={width - M.right} y1={y(t)} y2={y(t)} stroke={C.grilla} />
          <text x={M.left - 8} y={y(t) + fs / 3} textAnchor="end" fontSize={fs} fill={C.tinta2}>{t}</text>
        </g>
      ))}
      {data.map((d, i) => (
        <g key={d.label}>
          <rect className="bar" x={M.left + i * bw + bw * 0.18} y={y(d.n)} width={bw * 0.64} height={M.top + ih - y(d.n)} rx={4} fill={C.azul}>
            <title>{`${d.label}: ${d.n} hogares`}</title>
          </rect>
          <text x={M.left + i * bw + bw / 2} y={y(d.n) - 8} textAnchor="middle" fontSize={fs} fontWeight="600" fill={C.tinta}>{d.n}</text>
          <text x={M.left + i * bw + bw / 2} y={M.top + ih + fs * 1.5} textAnchor="middle" fontSize={fs} fill={C.tinta2}>{d.label}</text>
        </g>
      ))}
      <line x1={M.left} x2={width - M.right} y1={M.top + ih} y2={M.top + ih} stroke={C.tinta2} />
      {xLabel && <text x={M.left + iw / 2} y={height - 4} textAnchor="middle" fontSize={fs} fill={C.tinta2}>{xLabel}</text>}
    </svg>
  );
}
