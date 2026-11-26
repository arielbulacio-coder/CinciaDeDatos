// Las 17 diapositivas de la Clase 10. Cada una declara:
//   min:    minuto de inicio planificado (para el cronómetro del orador)
//   notas:  guion para el docente (se ven en la ventana del orador)
//   pasos:  cantidad de clics de revelado antes de pasar a la siguiente
import { useState } from "react";
import { Bars, BoxPlot, C, Histogram } from "../components/Charts.jsx";
import { COLAB_SUBIR, NOTEBOOKS, colabUrl } from "../config.js";
import { HOGARES, LIMPIO, col } from "../data/hogares.js";
import * as st from "../lib/stats.js";
import { useTextos } from "../lib/modalidad.js";
import { Votacion } from "./Votacion.jsx";

const M = (x) => st.fmtNum(x / 1e6, x >= 1e7 ? 1 : 2);
const ING = col("ingreso_total");
const ING_L = col("ingreso_total", LIMPIO);
const EDAD_L = col("edad_jefe", LIMPIO);
const cuenta = (mask) => mask.filter(Boolean).length;

function Pie({ texto }) {
  return <div className="s-pie"><span>{texto}</span><span className="s-num" /></div>;
}

function Seg({ opciones, valor, onChange }) {
  return (
    <div className="s-seg" role="group">
      {opciones.map(([v, etiqueta]) => (
        <button key={v} aria-pressed={valor === v} onClick={() => onChange(v)}>{etiqueta}</button>
      ))}
    </div>
  );
}

/* ---------------- 1 · Portada ---------------- */
function Portada() {
  const tx = useTextos();
  return (
    <div className="s-col s-centro">
      <p className="s-eyebrow">Python para Ciencia de Datos · Unidad 4 · Clase 10</p>
      <h1 className="s-h1">¿Error o hallazgo?</h1>
      <p className="s-lead" style={{ fontSize: 44, maxWidth: 1500, color: "#E9EDF1" }}>
        Detección de valores atípicos, análisis de distribuciones y transformaciones de variables
      </p>
      <div style={{ marginTop: 48 }}>
        <p style={{ fontSize: 34, fontWeight: 600, color: "#F7A700", margin: 0 }}>Prof. Lic. Ariel Bulacio</p>
        <p style={{ fontSize: 26, color: "#BFCBD8", margin: "8px 0 0" }}>
          Licenciatura en Inteligencia Artificial y Ciencia de Datos · UADE · Facultad de Ingeniería y Ciencias Exactas
        </p>
      </div>
      <Pie texto={tx.pieClase} />
    </div>
  );
}

/* ---------------- 2 · Hoja de ruta ---------------- */
function Ruta() {
  const obj = [
    ["Detectar", "valores atípicos con IQR y z-score, y explicar por qué cada método da resultados distintos."],
    ["Decidir y justificar", "qué hacer con cada atípico: corregir, conservar o marcar."],
    ["Transformar", "variables (log, normalización, discretización) y crear otras nuevas."],
  ];
  const agenda = [["Caso disparador", 2], ["Detectar: mirar la distribución", 7], ["Decidir: tres situaciones", 3], ["Transformar y crear variables", 5], ["Práctica, cierre y tarea", 3]];
  return (
    <div className="s-col">
      <p className="s-eyebrow">Hoja de ruta</p>
      <h2 className="s-h2">Al finalizar la clase vas a poder…</h2>
      <div className="s-grid" style={{ gridTemplateColumns: "1.25fr 1fr", gap: 64 }}>
        <div className="s-col" style={{ gap: 28 }}>
          {obj.map(([b, t], i) => (
            <div key={b} className="s-fila s-rise" style={{ "--i": i + 1 }}>
              <span className="s-numgrande">{i + 1}</span>
              <p className="s-body"><b>{b}</b> {t}</p>
            </div>
          ))}
        </div>
        <div className="s-card s-rise" style={{ "--i": 4 }}>
          <h3 className="s-h3">Recorrido de hoy · 20 min</h3>
          <table className="s-tabla">
            <tbody>
              {agenda.map(([m, n]) => (
                <tr key={m}><td>{m}</td><td className="num">{n}′</td></tr>
              ))}
            </tbody>
          </table>
          <p className="s-small">Venimos de: <b>describe()</b> y <b>groupby</b> · Vamos hacia: <b>scikit-learn</b> (Unidad 5)</p>
        </div>
      </div>
      <Pie texto="UADE · Python para Ciencia de Datos · Clase 10" />
    </div>
  );
}

/* ---------------- 3 · Disparador ---------------- */
function Disparador() {
  const tx = useTextos();
  return (
    <div className="s-col">
      <p className="s-eyebrow">Caso disparador · Encuesta de hogares</p>
      <h2 className="s-h2" style={{ fontSize: 72, maxWidth: 1600 }}>
        El hogar #57 declaró un ingreso mensual de <span style={{ color: "#F7A700" }}>$135.000.000</span>.
      </h2>
      <p className="s-lead">La mediana de los otros 499 hogares es de $1.350.000. ¿Qué hacés con ese dato?</p>
      <Votacion clave="inicio" />
      <p className="s-statement">{tx.votar}</p>
      <Pie texto="Dataset didáctico simulado con la estructura de la EPH (INDEC)" />
    </div>
  );
}

/* ---------------- 4 · Media vs mediana ---------------- */
function MediaMediana() {
  const [con57, setCon57] = useState(true);
  const datos = con57 ? ING : ING.filter((x) => x < 1e8);
  const media = st.mean(datos);
  const mediana = st.median(datos);
  return (
    <div className="s-col">
      <p className="s-eyebrow">1 · Detectar</p>
      <div className="s-fila" style={{ justifyContent: "space-between" }}>
        <h2 className="s-h2">Antes de calcular, mirá la distribución</h2>
        <Seg valor={con57} onChange={setCon57} opciones={[[true, "Con el hogar #57"], [false, "Sin el hogar #57"]]} />
      </div>
      <div className="s-grid" style={{ gridTemplateColumns: "1fr 330px", gap: 40, alignItems: "center" }}>
        <Histogram
          values={datos.map((x) => x / 1e6)}
          domain={[0, 17]}
          bins={42}
          width={1240}
          height={560}
          fs={22}
          fmt={(x) => st.fmtNum(x, 0)}
          xLabel="Ingreso total mensual del hogar (millones de $)"
          lines={[
            { x: mediana / 1e6, label: `Mediana $${M(mediana)} M`, color: C.tinta },
            { x: media / 1e6, label: `Media $${M(media)} M`, color: C.ambar },
          ]}
        />
        <div className="s-col" style={{ gap: 20 }}>
          <div className="s-kpi"><span>Media</span><b style={{ color: "#8A5300" }}>${M(media)} M</b></div>
          <div className="s-kpi"><span>Mediana</span><b>${M(mediana)} M</b></div>
          <div className="s-kpi"><span>Asimetría</span><b>{st.fmtNum(st.skew(datos))}</b></div>
        </div>
      </div>
      <Pie texto='df["ingreso_total"].describe() · .skew()' />
    </div>
  );
}

/* ---------------- 5 · Atípico ≠ error ---------------- */
function AtipicoError() {
  return (
    <div className="s-col">
      <p className="s-eyebrow">1 · Detectar</p>
      <h2 className="s-h2">Un atípico no siempre es un error</h2>
      <div className="s-grid s-g2">
        <div className="s-card ambar s-rise" style={{ "--i": 1 }}>
          <h3 className="s-h3">Error de medición o de carga</h3>
          <p className="s-txt">Imposible o incoherente con la realidad.</p>
          <p className="s-ej">edad_jefe = 999 · horas_trabajo = 400 por semana · un cero de más</p>
          <p className="s-accion">→ Se corrige con la fuente o se pasa a faltante (NaN).</p>
        </div>
        <div className="s-card s-rise" style={{ "--i": 2 }}>
          <h3 className="s-h3">Valor extremo genuino</h3>
          <p className="s-txt">Real, pero poco frecuente: está en la cola de la distribución.</p>
          <p className="s-ej">Un hogar con $15.200.000 de ingreso mensual</p>
          <p className="s-accion">→ Se conserva. A veces es lo más interesante del análisis.</p>
        </div>
      </div>
      <p className="s-statement">La estadística detecta candidatos; la decisión la tomás vos, con conocimiento del dominio.</p>
      <Pie texto="En fraude bancario o en salud, el atípico suele ser justamente lo que buscamos" />
    </div>
  );
}

/* ---------------- 6 · Tukey ---------------- */
function Tukey() {
  const [k, setK] = useState(1.5);
  const { q1, q3, iqr, sup } = st.limitesIQR(ING, k);
  const n = cuenta(st.atipicosIQR(ING, k));
  return (
    <div className="s-col">
      <p className="s-eyebrow">1 · Detectar · Método 1</p>
      <div className="s-fila" style={{ justifyContent: "space-between" }}>
        <h2 className="s-h2">Regla de Tukey: el rango intercuartílico</h2>
        <Seg valor={k} onChange={setK} opciones={[[1.5, "k = 1,5 · atípico"], [3, "k = 3 · extremo"]]} />
      </div>
      <BoxPlot values={ING.map((x) => x / 1e6)} k={k} domain={[0, 17]} width={1664} height={330} fs={24}
        fmt={(x) => st.fmtNum(x, x < 10 ? 2 : 0)} xLabel="Ingreso total mensual (millones de $)" />
      <div className="s-grid" style={{ gridTemplateColumns: "auto 1fr", gap: 48, alignItems: "center" }}>
        <pre className="s-code">
          q1, q3 = s.<span className="fn">quantile</span>([.25, .75]){"\n"}
          iqr = q3 - q1{"\n"}
          lim_sup = q3 + <span className="fn">{String(k)}</span> * iqr{"\n"}
          atip = s[(s {"<"} lim_inf) | (s {">"} lim_sup)]
        </pre>
        <div className="s-col" style={{ gap: 12 }}>
          <p className="s-body">Q1 = ${M(q1)} M · Q3 = ${M(q3)} M · IQR = ${M(iqr)} M · Límite = ${M(sup)} M</p>
          <p className="s-statement" style={{ margin: 0 }}><b style={{ color: "#8A5300" }}>{n} hogares</b> marcados como atípicos. ¿Son todos errores?</p>
        </div>
      </div>
      <Pie texto="Usa cuartiles, no la media: no se deja arrastrar por los extremos ni supone normalidad" />
    </div>
  );
}

/* ---------------- 7 · z-score ---------------- */
function ZScore() {
  const [sin57, setSin57] = useState(false);
  const datos = sin57 ? ING.filter((x) => x < 1e8) : ING;
  const filas = [
    ["z-score (|z| > 3)", cuenta(st.atipicosZ(datos))],
    ["z robusto (mediana y MAD)", cuenta(st.atipicosZRobusto(datos))],
    ["IQR de Tukey (k = 1,5)", cuenta(st.atipicosIQR(datos))],
    ["IQR sobre log(ingreso)", cuenta(st.atipicosIQR(datos.map(Math.log10)))],
  ];
  return (
    <div className="s-col">
      <p className="s-eyebrow">1 · Detectar · Método 2</p>
      <h2 className="s-h2">z-score: rápido, pero se deja engañar</h2>
      <div className="s-grid s-g2" style={{ gap: 56 }}>
        <div className="s-col" style={{ gap: 26 }}>
          <pre className="s-code" style={{ fontSize: 30 }}>z = (x − media) / desvío{"\n"}<span className="com"># atípico si |z| {">"} 3</span></pre>
          <p className="s-body">Supone una distribución <b>aproximadamente normal</b>.</p>
          <p className="s-body">La media y el desvío se calculan <b>con el atípico adentro</b>: el valor extremo infla el desvío y esconde a los demás. Es el <b>efecto enmascaramiento</b>.</p>
        </div>
        <div className="s-card">
          <div className="s-fila" style={{ justifyContent: "space-between" }}>
            <h3 className="s-h3" style={{ margin: 0 }}>Atípicos en ingreso_total</h3>
            <Seg valor={sin57} onChange={setSin57} opciones={[[false, "Todos"], [true, "Sin #57"]]} />
          </div>
          <table className="s-tabla" style={{ fontSize: 30 }}>
            <tbody>
              {filas.map(([m, n], i) => (
                <tr key={m} className={i === 0 ? "s-resaltada" : ""}><td>{m}</td><td className="num"><b>{n}</b></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="s-statement">Mismo dato, cuatro respuestas: elegir el método también es una decisión analítica.</p>
      <Pie texto="z robusto = 0,6745·(x − mediana) / MAD · Iglewicz y Hoaglin (1993)" />
    </div>
  );
}

/* ---------------- 8 · Decidir ---------------- */
function Decidir() {
  const casos = [
    ["ambar", "Error evidente", "Valor imposible, código de “no responde”, unidad equivocada.", "Corregir con la fuente o pasar a NaN", "edad_jefe = 999"],
    ["", "Extremo genuino", "Plausible y verificable: pertenece a la población.", "Conservar y usar métodos robustos: mediana, log, winsorizar", "ingreso = $15.200.000"],
    ["gris", "Dudoso", "No se puede confirmar ni descartar con la información disponible.", "Marcar con una variable flag y comparar con y sin él", "ingreso = $135.000.000"],
  ];
  return (
    <div className="s-col">
      <p className="s-eyebrow">2 · Decidir</p>
      <h2 className="s-h2">Tres situaciones, tres decisiones</h2>
      <div className="s-grid s-g3">
        {casos.map(([cls, t, d, a, e], i) => (
          <div key={t} className={`s-card ${cls} s-rise`} style={{ "--i": i + 1 }}>
            <h3 className="s-h3">{t}</h3>
            <p className="s-txt">{d}</p>
            <p className="s-accion">{a}</p>
            <p className="s-ej">{e}</p>
          </div>
        ))}
      </div>
      <p className="s-statement">Siempre: documentar la decisión en el notebook. Otra persona tiene que poder reproducirla (Unidad 6).</p>
      <Pie texto="Winsorizar = recortar al límite (s.clip) sin eliminar la fila" />
    </div>
  );
}

/* ---------------- 9 · Tu turno ---------------- */
function TuTurno({ paso }) {
  const tx = useTextos();
  const casos = [
    ["1 · edad_jefe = 999", "A · Es el código de “no responde” → NaN"],
    ["2 · horas_trabajo = 400 por semana", "A · Imposible: una semana tiene 168 h → NaN"],
    ["3 · ingreso = $12.500.000 (Patagonia)", "B · Plausible y real → conservar y usar log"],
  ];
  return (
    <div className="s-col">
      <p className="s-eyebrow">Práctica guiada · 1 minuto</p>
      <h2 className="s-h2">Tu turno: ¿qué decisión tomás?</h2>
      <p className="s-lead">{tx.responder} <b style={{ color: "#F7A700" }}>1-A, 2-B, 3-C</b> · A = corregir o NaN · B = conservar · C = marcar y analizar</p>
      <div className="s-col" style={{ gap: 26, marginTop: 8 }}>
        {casos.map(([c, r], i) => (
          <div key={c} className="s-grid s-g2" style={{ alignItems: "center", gap: 40 }}>
            <p className="s-pill">{c}</p>
            <p className={`s-respuesta ${paso > i ? "visible" : ""}`}>{r}</p>
          </div>
        ))}
      </div>
      <Pie texto="Evaluación formativa: cada respuesta se revela con un clic (→)" />
    </div>
  );
}

/* ---------------- 10 · Log ---------------- */
function Log() {
  const [modo, setModo] = useState("original");
  const esLog = modo === "log";
  const datos = esLog ? ING_L.map(Math.log10) : ING_L.map((x) => x / 1e6);
  const n = cuenta(st.atipicosIQR(datos));
  return (
    <div className="s-col">
      <p className="s-eyebrow">3 · Transformar</p>
      <div className="s-fila" style={{ justifyContent: "space-between" }}>
        <h2 className="s-h2">Logaritmo: domar la asimetría</h2>
        <Seg valor={modo} onChange={setModo} opciones={[["original", "Original"], ["log", "log10(ingreso)"]]} />
      </div>
      <div className="s-grid" style={{ gridTemplateColumns: "1fr 330px", gap: 40, alignItems: "center" }}>
        <Histogram values={datos} mask={st.atipicosIQR(datos)} bins={40} width={1240} height={520} fs={22}
          fmt={(x) => st.fmtNum(x, esLog ? 1 : 0)} xLabel={esLog ? "log10(ingreso)" : "Ingreso (millones de $)"} />
        <div className="s-col" style={{ gap: 20 }}>
          <div className="s-kpi"><span>Asimetría</span><b>{st.fmtNum(st.skew(datos))}</b></div>
          <div className="s-kpi"><span>Atípicos IQR</span><b style={{ color: "#8A5300" }}>{n}</b></div>
        </div>
      </div>
      <pre className="s-code">df[<span className="fn">"log_ingreso"</span>] = np.<span className="fn">log10</span>(df[<span className="fn">"ingreso_total"</span>])   <span className="com"># si hay ceros: np.log1p</span></pre>
      <Pie texto="Ya sin los errores de carga · Muchos “atípicos” eran solo la cola larga" />
    </div>
  );
}

/* ---------------- 11 · Escalado ---------------- */
function Escalado() {
  const [modo, setModo] = useState("original");
  const tr = { original: EDAD_L, minmax: st.minmax(EDAD_L), z: st.estandarizar(EDAD_L), robust: st.robustScale(EDAD_L) }[modo];
  return (
    <div className="s-col">
      <p className="s-eyebrow">3 · Transformar</p>
      <div className="s-fila" style={{ justifyContent: "space-between" }}>
        <h2 className="s-h2">Normalizar o estandarizar</h2>
        <Seg valor={modo} onChange={setModo} opciones={[["original", "Años"], ["minmax", "Min-Max"], ["z", "z"], ["robust", "Robust"]]} />
      </div>
      <div className="s-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
        <div>
          <Histogram values={tr} bins={25} width={800} height={380} fs={20} fmt={(x) => st.fmtNum(x, modo === "original" ? 0 : 1)} xLabel="Edad del jefe de hogar" />
          <p className="s-small" style={{ textAlign: "center" }}>Rango: [{st.fmtNum(Math.min(...tr))} ; {st.fmtNum(Math.max(...tr))}] · media {st.fmtNum(st.mean(tr))} · desvío {st.fmtNum(st.std(tr))}</p>
        </div>
        <table className="s-tabla">
          <thead><tr><th></th><th>Min-Max</th><th>Estandarización z</th></tr></thead>
          <tbody>
            <tr><td>Fórmula</td><td>(x − mín) / (máx − mín)</td><td>(x − media) / desvío</td></tr>
            <tr><td>Resultado</td><td>rango [0, 1]</td><td>media 0, desvío 1</td></tr>
            <tr><td>Cuándo</td><td>Imágenes, redes neuronales</td><td>k-NN, regresión, PCA</td></tr>
            <tr><td>Atípicos</td><td>Muy sensible</td><td>Menos; o RobustScaler</td></tr>
          </tbody>
        </table>
      </div>
      <p className="s-statement">El escalado cambia las unidades, no la forma: la silueta del histograma no se mueve.</p>
      <Pie texto="En la Unidad 5: MinMaxScaler, StandardScaler y RobustScaler de scikit-learn" />
    </div>
  );
}

/* ---------------- 12 · Discretizar ---------------- */
function Discretizar() {
  const [modo, setModo] = useState("cut");
  const datos = modo === "cut"
    ? st.contar(st.cut(EDAD_L, [17, 29, 44, 64, 120], ["18–29", "30–44", "45–64", "65+"]), ["18–29", "30–44", "45–64", "65+"])
    : st.contar(st.qcut(ING_L, 5, ["Q1", "Q2", "Q3", "Q4", "Q5"]), ["Q1", "Q2", "Q3", "Q4", "Q5"]);
  return (
    <div className="s-col">
      <p className="s-eyebrow">3 · Transformar</p>
      <div className="s-fila" style={{ justifyContent: "space-between" }}>
        <h2 className="s-h2">Discretizar: de números a categorías</h2>
        <Seg valor={modo} onChange={setModo} opciones={[["cut", "pd.cut · edad"], ["qcut", "pd.qcut · ingreso"]]} />
      </div>
      <div className="s-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
        <Bars data={datos} width={820} height={440} fs={22} xLabel={modo === "cut" ? "Tramo de edad del jefe de hogar" : "Quintil de ingreso"} />
        <div className="s-col" style={{ gap: 24 }}>
          {modo === "cut" ? (
            <>
              <pre className="s-code" style={{ fontSize: 24 }}>pd.<span className="fn">cut</span>(df.edad_jefe,{"\n"}       bins=[17, 29, 44, 64, 120],{"\n"}       labels=[<span className="fn">"18–29"</span>, <span className="fn">"30–44"</span>, …])</pre>
              <p className="s-body">Cortes <b>fijos</b>, definidos por el dominio (tramos etarios, categorías de IMC). Grupos de distinto tamaño.</p>
            </>
          ) : (
            <>
              <pre className="s-code" style={{ fontSize: 24 }}>pd.<span className="fn">qcut</span>(df.ingreso_total,{"\n"}        q=5,{"\n"}        labels=[<span className="fn">"Q1"</span>, …, <span className="fn">"Q5"</span>])</pre>
              <p className="s-body">Cortes en <b>cuantiles</b>: misma cantidad de hogares por grupo. Los quintiles miden desigualdad.</p>
            </>
          )}
        </div>
      </div>
      <Pie texto="cut: el criterio lo define el dominio · qcut: lo define la distribución" />
    </div>
  );
}

/* ---------------- 13 · Nuevas variables ---------------- */
function NuevasVars() {
  const etiquetas = ["Q1", "Q2", "Q3", "Q4", "Q5"];
  const q = st.qcut(ING_L, 5, etiquetas);
  const pc = LIMPIO.map((h) => h.ingreso_total / h.miembros);
  const tabla = etiquetas.map((e) => [e, st.median(pc.filter((_, i) => q[i] === e))]);
  return (
    <div className="s-col">
      <p className="s-eyebrow">3 · Crear variables</p>
      <h2 className="s-h2">Crear variables: el conocimiento del dominio, hecho columna</h2>
      <div className="s-grid" style={{ gridTemplateColumns: "1.35fr 1fr", gap: 48 }}>
        <div className="s-col" style={{ gap: 24 }}>
          <div className="s-grid s-g3" style={{ gap: 20 }}>
            <div className="s-card"><h3 className="s-h3">Razón</h3><p className="s-txt">ingreso por persona</p></div>
            <div className="s-card ambar"><h3 className="s-h3">Flag</h3><p className="s-txt">guarda la decisión</p></div>
            <div className="s-card"><h3 className="s-h3">Categoría</h3><p className="s-txt">habilita groupby</p></div>
          </div>
          <pre className="s-code" style={{ fontSize: 24 }}>
            df[<span className="fn">"ingreso_pc"</span>] = df.ingreso_total / df.miembros{"\n"}
            df[<span className="fn">"flag_atipico"</span>] = <span className="fn">atipicos_iqr</span>(df.log_ingreso){"\n"}
            df[<span className="fn">"quintil"</span>] = pd.<span className="fn">qcut</span>(df.ingreso_total, 5){"\n"}
            df.<span className="fn">groupby</span>(<span className="fn">"quintil"</span>).ingreso_pc.<span className="fn">median</span>()
          </pre>
        </div>
        <div className="s-card">
          <h3 className="s-h3">Resultado (en vivo)</h3>
          <table className="s-tabla">
            <thead><tr><th>Quintil</th><th className="num">Mediana ingreso_pc</th></tr></thead>
            <tbody>{tabla.map(([e, v]) => <tr key={e}><td>{e}</td><td className="num">{st.fmtPesos(v)}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
      <Pie texto="Feature engineering: suele mejorar un modelo más que cambiar de algoritmo" />
    </div>
  );
}

/* ---------------- 14 · Manos al código ---------------- */
function ManosCodigo() {
  const tx = useTextos();
  const url = colabUrl(NOTEBOOKS.estudiante);
  const retos = [
    ["01", "Detectar", "Encontrá los atípicos de horas_trabajo con IQR y con z robusto. ¿Coinciden?"],
    ["02", "Decidir", "Tratá cada caso y justificá tu decisión en una celda Markdown."],
    ["03", "Transformar", "Creá ingreso_pc y compará el ranking de regiones."],
  ];
  return (
    <div className="s-col">
      <p className="s-eyebrow">{tx.grupos}</p>
      <h2 className="s-h2">Tres retos con el notebook de la clase</h2>
      <div className="s-grid s-g3">
        {retos.map(([n, t, d], i) => (
          <div key={n} className="s-reto s-rise" style={{ "--i": i + 1 }}>
            <span className="s-numgrande">{n}</span>
            <h3 className="s-h3" style={{ color: "#F5F7FA" }}>{t}</h3>
            <p className="s-lead" style={{ fontSize: 28 }}>{d}</p>
          </div>
        ))}
      </div>
      <div className="s-fila" style={{ gap: 24, marginTop: 16 }}>
        <a className="s-boton" href={url || COLAB_SUBIR} target="_blank" rel="noreferrer">Abrir en Google Colab</a>
        <a className="s-boton sec" href={`./notebooks/${NOTEBOOKS.estudiante}`} download>Descargar .ipynb</a>
        <p className="s-small" style={{ color: "#BFCBD8", margin: 0 }}>Entrega en el aula virtual · autoevaluación con asserts al final del notebook</p>
      </div>
      <Pie texto={`notebooks/${NOTEBOOKS.estudiante}`} />
    </div>
  );
}

/* ---------------- 15 · Cierre ---------------- */
function Cierre() {
  const ideas = [
    ["Mirar antes de borrar.", "Un atípico puede ser un error o el hallazgo más valioso."],
    ["El método depende de la distribución.", "IQR y z robusto resisten; el z-score se enmascara."],
    ["Transformar no es maquillar.", "Log para la asimetría, escalar para comparar, discretizar para interpretar."],
  ];
  return (
    <div className="s-col">
      <p className="s-eyebrow">Cierre</p>
      <h2 className="s-h2">Tres ideas para llevarse</h2>
      <div className="s-grid" style={{ gridTemplateColumns: "1.3fr 1fr", gap: 48 }}>
        <div className="s-col" style={{ gap: 24 }}>
          {ideas.map(([b, t], i) => (
            <div key={b} className="s-fila s-rise" style={{ "--i": i + 1 }}>
              <span className="s-numgrande">{i + 1}</span>
              <p className="s-body" style={{ color: "#1E2A36" }}><b>{b}</b> {t}</p>
            </div>
          ))}
          <div className="s-card ambar">
            <p className="s-accion" style={{ margin: 0 }}>Ticket de salida: en una frase, ¿por qué el z-score encontró un solo atípico en los ingresos?</p>
          </div>
        </div>
        <div className="s-card">
          <h3 className="s-h3">Volvemos a votar: el hogar #57</h3>
          <Votacion clave="cierre" comparar="inicio" compacto />
        </div>
      </div>
      <Pie texto="El cambio entre la primera y la segunda votación es evidencia visible de aprendizaje" />
    </div>
  );
}

/* ---------------- 16 · Próxima ---------------- */
function Proxima() {
  return (
    <div className="s-col">
      <p className="s-eyebrow">Antes de la próxima clase</p>
      <h2 className="s-h2">Tarea, lectura y lo que viene</h2>
      <div className="s-grid s-g3">
        <div className="s-card ambar"><h3 className="s-h3">Aula invertida</h3><p className="s-txt">Descargá los microdatos reales de la <b>EPH (INDEC)</b> y repetí el flujo de hoy con el ingreso total familiar (ITF).</p></div>
        <div className="s-card"><h3 className="s-h3">Lectura</h3><p className="s-txt">Bruce, Bruce y Gedeck (2022). <i>Estadística práctica para ciencia de datos con R y Python</i>. Cap. 1: estimadores robustos y boxplots.</p></div>
        <div className="s-card"><h3 className="s-h3">Clase 11 · Unidad 5</h3><p className="s-txt">Scikit-learn: StandardScaler, MinMaxScaler y RobustScaler dentro de un flujo de train/test.</p></div>
      </div>
      <p className="s-statement">Lo que hoy hicimos a mano, la próxima clase lo automatiza un Pipeline.</p>
      <Pie texto="Consultas: foro de la materia en el aula virtual" />
    </div>
  );
}

/* ---------------- 17 · Anexo ---------------- */
function Anexo() {
  const tx = useTextos();
  const filas = [
    ["Disparador", "Aprendizaje basado en problemas", tx.encuesta, "Diagnóstica"],
    ["Detectar", "Exposición dialogada, descubrimiento", "Gráficos interactivos", "Preguntas de control"],
    ["Decidir", "Estudio de casos", "Votación con revelado", "Formativa inmediata"],
    ["Transformar", "Por imitación (live coding)", "Google Colab", "Preguntas de control"],
    ["Práctica", "Colaborativo, por proyectos", "Grupos de 3, notebook", "Producto + asserts"],
    ["Cierre", "Metacognición", "Ticket de salida, re-votación", "Formativa"],
    ["Tarea", "Aula invertida, vivencial", "Microdatos EPH (INDEC)", "Insumo para la Clase 11"],
  ];
  return (
    <div className="s-col">
      <p className="s-eyebrow">Anexo · Para el tribunal</p>
      <h2 className="s-h2">Decisiones didácticas de la clase</h2>
      <table className="s-tabla" style={{ fontSize: 26 }}>
        <thead><tr><th>Momento</th><th>Estrategia (programa)</th><th>{tx.recurso}</th><th>Evaluación</th></tr></thead>
        <tbody>{filas.map((f) => <tr key={f[0]}>{f.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
      </table>
      <p className="s-small">Unidad 4 del programa 3.4.258 (CF FAIN Nº 534) · Un mismo dataset de punta a punta para bajar la carga cognitiva y centrarse en las decisiones</p>
      <Pie texto="UADE · Python para Ciencia de Datos · Clase 10" />
    </div>
  );
}

export const SLIDES = [
  { id: "portada", titulo: "Portada", oscura: true, min: 0, Comp: Portada,
    notas: "Bienvenida (20 s). Me presento y ubico la clase: Unidad 4, EDA, segunda clase de la unidad. Ya vimos describe(), groupby y tablas dinámicas. Hoy damos el paso que separa a quien “mira” los datos de quien decide qué hacer con ellos. Pido cámaras encendidas si es posible y el chat abierto." },
  { id: "ruta", titulo: "Hoja de ruta", min: 0.4, Comp: Ruta,
    notas: "Objetivos con verbos observables: detectar, decidir, transformar. La hoja de ruta permite saber dónde estamos en todo momento. Conexión con lo previo (describe() puede mentir si hay atípicos) y con lo que viene (k-NN necesita datos escalados)." },
  { id: "disparador", titulo: "Caso disparador", oscura: true, min: 1.5, Comp: Disparador,
    notas: "Aprendizaje basado en problemas. Lanzo la votación (botones o chat) y leo 2 o 3 respuestas. NO doy la respuesta: anuncio que al final volvemos a votar. Lo esperable es que muchos elijan A. Seguimiento: “¿Y si fuera un hogar real de altos ingresos? ¿Qué perdemos si lo borramos?”. Dato para mí: son $1.350.000 con dos ceros de más." },
  { id: "media-mediana", titulo: "Media vs. mediana", min: 3, Comp: MediaMediana,
    notas: "Pregunto: “¿Qué número usarían para contar cuánto gana un hogar típico?”. Clic en “Sin el hogar #57”: la media baja sola y la mediana casi no se mueve. Vocabulario: asimetría positiva, cola larga (ingresos, precios, tiempos). describe() muestra la media primero: sin mirar la forma, describe() engaña." },
  { id: "atipico-error", titulo: "Atípico ≠ error", min: 4.5, Comp: AtipicoError,
    notas: "Distinción conceptual clave. Transferencia a otros dominios: en salud, 300 mmHg de presión es error; un colesterol muy alto es real. En fraude, el atípico ES lo que buscamos. Pregunta rápida: “¿Un caso en su trabajo o carrera donde el atípico sea lo importante?”." },
  { id: "tukey", titulo: "Regla de Tukey", min: 5.5, Comp: Tukey,
    notas: "Modelado: leo el boxplot de izquierda a derecha. La caja es el 50 % central. Todo lo que supera Q3 + 1,5·IQR se marca: 26 hogares. Cambio a k = 3 en vivo: quedan los extremos. Pregunta de control: “¿26 de 500 son todos errores?”. No: muchos son la cola natural. Queda abierto hasta el log." },
  { id: "zscore", titulo: "z-score y enmascaramiento", min: 7, Comp: ZScore,
    notas: "Conflicto cognitivo. Antes de mostrar: “¿Cuántos encuentra el z-score?”. Encuentra UNO. Clic en “Sin #57”: aparecen 5. El 135 M inflaba el desvío y escondía a los demás. Versión robusta: mediana y MAD (Bruce et al., cap. 1). Conclusión: con asimetría, IQR o z robusto." },
  { id: "decidir", titulo: "Tres decisiones", oscura: false, alt: true, min: 9, Comp: Decidir,
    notas: "Volvemos al disparador: la respuesta era D, “depende”. Si verificamos con la fuente y son dos ceros de más, lo corregimos; si no, lo marcamos y reportamos con y sin él. Borrar en automático sesga la muestra. Hilo ético: la decisión se documenta, no se esconde." },
  { id: "tu-turno", titulo: "Práctica guiada", oscura: true, min: 10.5, pasos: 3, Comp: TuTurno,
    notas: "Evaluación formativa. 45 segundos, leo el chat. Revelo cada respuesta con → y pido a quien eligió distinto que argumente: el error es insumo. Caso 3: Patagonia tiene ingresos más altos; C también es defendible si se justifica. Importa el argumento, no la letra." },
  { id: "log", titulo: "Transformación logarítmica", min: 12, Comp: Log,
    notas: "Retomo la pregunta de Tukey. Clic en log10: la asimetría baja de 4,88 a 0,28 y los atípicos de 25 a 6. Transformar es elegir la escala en la que el fenómeno se ve: en ingresos importan las proporciones. Cuidado: log(0) no existe → np.log1p." },
  { id: "escalado", titulo: "Normalizar y estandarizar", min: 13.5, Comp: Escalado,
    notas: "Pregunta: “Si comparo edad (18–86) e ingreso (millones), ¿cuál domina una distancia?”. Por eso k-NN necesita escalar (Unidad 5). Recorro los cuatro botones: la silueta NO cambia, solo el eje. Error frecuente: creer que normalizar vuelve normal la distribución." },
  { id: "discretizar", titulo: "Discretizar", min: 15, Comp: Discretizar,
    notas: "cut: cortes del dominio (tramos INDEC, IMC). qcut: cuantiles, igual cantidad por grupo; los quintiles son la forma estándar de medir desigualdad. Ventaja: interpretabilidad y robustez ante atípicos (el #57 queda en Q5 como cualquier otro). Costo: se pierde detalle." },
  { id: "nuevas-vars", titulo: "Crear variables", min: 16, Comp: NuevasVars,
    notas: "Integración en cuatro líneas. Pregunta: “¿Es más rico un hogar de 1 persona con $1,5 M o uno de 6 con $2,5 M?”. El per cápita responde mejor. La flag es la forma profesional de tratar el caso dudoso. Estas variables viajan a scikit-learn en la Unidad 5." },
  { id: "manos-codigo", titulo: "Manos al código", oscura: true, min: 17, Comp: ManosCodigo,
    notas: "En la clase real: 15–20 min en salas de 3 con roles (escribe, explica, controla el tiempo). En la simulación: abro el notebook en Colab y ejecuto el Reto 1 en vivo (dos celdas). El notebook es autocontenido: genera los datos solo. Al final tiene asserts de autoevaluación." },
  { id: "cierre", titulo: "Cierre", min: 18, Comp: Cierre,
    notas: "Síntesis primero a cargo de un estudiante (metacognición). Segunda votación del caso #57: espero un corrimiento de A hacia D, evidencia visible de aprendizaje. Ticket de salida: exige explicar el enmascaramiento, no recordar una fórmula. Lo uso para planificar la Clase 11." },
  { id: "proxima", titulo: "Tarea y próxima clase", alt: true, min: 19.2, Comp: Proxima,
    notas: "Transferencia a datos reales de la EPH: aparecen códigos como -9 o 999 y extremos verdaderos. La lectura es la bibliografía obligatoria. Anticipo: los scalers de scikit-learn se ajustan SOLO con el set de entrenamiento (data leakage). Agradezco y abro preguntas." },
  { id: "anexo", titulo: "Anexo didáctico", min: 20, Comp: Anexo,
    notas: "Respaldo para preguntas del tribunal. Todas las estrategias vienen de la sección III del programa. Ideas: (1) un dataset de punta a punta baja la carga cognitiva; (2) el conflicto cognitivo motiva los métodos robustos; (3) evaluación formativa continua alineada a los objetivos; (4) transferencia a datos reales; (5) asserts y pytest integran la Unidad 6." },
];
