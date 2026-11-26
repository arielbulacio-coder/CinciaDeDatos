import { useState } from "react";
import { COLAB, COLAB_SUBIR, NOTEBOOKS, colabUrl } from "../config.js";

const leer = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const guardar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } };

function TarjetaColab({ titulo, archivo, descripcion, acento }) {
  const url = colabUrl(archivo);
  return (
    <div className={`card ${acento}`}>
      <span className="eyebrow">Google Colab</span>
      <h3>{titulo}</h3>
      <p style={{ color: "var(--tinta-suave)" }}>{descripcion}</p>
      <div className="acciones">
        {url
          ? <a className="btn ambar" href={url} target="_blank" rel="noreferrer">Abrir en Colab</a>
          : <a className="btn ambar" href={COLAB_SUBIR} target="_blank" rel="noreferrer">Abrir Colab y subir</a>}
        <a className="btn sec" href={`./notebooks/${archivo}`} download>Descargar .ipynb</a>
      </div>
    </div>
  );
}

const RETOS = [
  {
    t: "Reto 1 · Detectar",
    d: "Encontrá los atípicos de horas_trabajo con IQR y con z robusto. ¿Coinciden los dos métodos?",
    pista: "Usá atipicos_iqr(h) y atipicos_zscore_robusto(h) sobre h = df[\"horas_trabajo\"] y mostrá h[mascara].",
  },
  {
    t: "Reto 2 · Decidir",
    d: "Para cada atípico de horas_trabajo, decidí si lo corregís, lo conservás o lo marcás, y justificalo en una celda Markdown.",
    pista: "Una semana tiene 168 horas. ¿Es posible trabajar 3 horas por semana? ¿Y 400?",
  },
  {
    t: "Reto 3 · Transformar",
    d: "Creá ingreso_pc = ingreso_total / miembros y calculá la mediana por región. ¿Cambia el ranking respecto del ingreso total?",
    pista: "limpio.groupby(\"region\")[[\"ingreso_total\", \"ingreso_pc\"]].median().rank(ascending=False)",
  },
];

const QUIZ = [
  {
    p: "El ingreso tiene asimetría 20,9, media $1,89 M y mediana $1,35 M. ¿Qué medida describe mejor al hogar típico?",
    o: ["La media", "La mediana", "El máximo", "El desvío estándar"],
    c: 1,
    e: "Con una distribución asimétrica y valores extremos, la mediana es robusta: no la arrastra la cola.",
  },
  {
    p: "¿Por qué el z-score encontró un solo atípico en ingreso_total?",
    o: ["Porque casi no hay atípicos", "Porque el valor de $135 M infla el desvío y esconde a los demás", "Porque el z-score solo sirve para variables categóricas", "Porque el umbral de 3 es demasiado bajo"],
    c: 1,
    e: "Es el efecto enmascaramiento: media y desvío se calculan con el atípico adentro. Sin el hogar #57, el z-score encuentra 5.",
  },
  {
    p: "Un registro tiene edad_jefe = 999. ¿Qué hacés?",
    o: ["Lo conservo: es un valor extremo genuino", "Lo paso a NaN: es el código de “no responde”", "Lo reemplazo por 99", "Borro toda la columna"],
    c: 1,
    e: "Es un error evidente (código de no respuesta). Se pasa a faltante y se documenta la decisión.",
  },
  {
    p: "Después de aplicar Min-Max a una variable asimétrica, su distribución…",
    o: ["queda normal", "queda simétrica", "mantiene la misma forma, con otra escala", "pierde los atípicos"],
    c: 2,
    e: "Escalar cambia las unidades, no la forma. Para corregir la asimetría se usa, por ejemplo, el logaritmo.",
  },
  {
    p: "Querés dividir los ingresos en grupos con la misma cantidad de hogares. ¿Qué función usás?",
    o: ["pd.cut", "pd.qcut", "np.log10", "df.groupby"],
    c: 1,
    e: "pd.qcut corta en cuantiles: cada grupo tiene aproximadamente la misma frecuencia (por ejemplo, quintiles).",
  },
  {
    p: "Con IQR sobre el ingreso original se marcan 25 hogares; sobre log10(ingreso), solo 6. ¿Por qué?",
    o: ["El logaritmo borra datos", "Muchos “atípicos” eran la cola natural de una distribución asimétrica", "IQR no funciona con números grandes", "Es un error de redondeo"],
    c: 1,
    e: "El logaritmo comprime la cola derecha. En la escala adecuada, solo quedan marcados los casos realmente inusuales.",
  },
];

function Quiz() {
  const [resp, setResp] = useState(() => leer("quiz-clase10", {}));
  const elegir = (i, j) => {
    if (resp[i] !== undefined) return;
    const nuevo = { ...resp, [i]: j };
    setResp(nuevo);
    guardar("quiz-clase10", nuevo);
  };
  const respondidas = Object.keys(resp).length;
  const correctas = Object.entries(resp).filter(([i, j]) => QUIZ[i].c === j).length;
  return (
    <div className="card acento">
      <span className="eyebrow">Autoevaluación</span>
      <h3>¿Qué aprendiste? · {correctas}/{QUIZ.length} correctas{respondidas < QUIZ.length ? ` · ${respondidas} respondidas` : ""}</h3>
      {QUIZ.map((q, i) => (
        <div key={q.p} className="pregunta">
          <p style={{ fontWeight: 600, margin: 0 }}>{i + 1}. {q.p}</p>
          <div className="opciones">
            {q.o.map((op, j) => {
              const r = resp[i];
              const cls = r === undefined ? "" : j === q.c ? "correcta" : j === r ? "incorrecta" : "";
              return (
                <button key={op} className={`opcion ${cls}`} onClick={() => elegir(i, j)} disabled={r !== undefined && cls === ""}>
                  {op}{cls === "correcta" ? " ✓ correcta" : cls === "incorrecta" ? " ✗ tu respuesta" : ""}
                </button>
              );
            })}
          </div>
          {resp[i] !== undefined && <div className="feedback">{q.e}</div>}
        </div>
      ))}
      <button className="btn sec" onClick={() => { setResp({}); guardar("quiz-clase10", {}); }}>Reiniciar autoevaluación</button>
    </div>
  );
}

function Ticket() {
  const [texto, setTexto] = useState(() => leer("ticket-clase10", ""));
  const [copiado, setCopiado] = useState(false);
  return (
    <div className="card ambar">
      <span className="eyebrow">Ticket de salida</span>
      <h3>En una frase: ¿por qué el z-score encontró un solo atípico en los ingresos?</h3>
      <label className="ctrl">Tu respuesta (se guarda en este dispositivo)
        <textarea value={texto} onChange={(e) => { setTexto(e.target.value); guardar("ticket-clase10", e.target.value); }} />
      </label>
      <div className="acciones">
        <button className="btn" onClick={async () => {
          try { await navigator.clipboard.writeText(texto); setCopiado(true); setTimeout(() => setCopiado(false), 1500); } catch { /* sin portapapeles */ }
        }}>{copiado ? "¡Copiado!" : "Copiar para el aula virtual"}</button>
      </div>
    </div>
  );
}

export default function Practica() {
  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="grid g2">
        <TarjetaColab acento="ambar" titulo="Notebook del estudiante" archivo={NOTEBOOKS.estudiante}
          descripcion="Recorrido completo de la clase con los tres retos para completar. Genera el dataset por sí solo: no hace falta subir archivos." />
        <TarjetaColab acento="acento" titulo="Notebook docente (con soluciones)" archivo={NOTEBOOKS.docente}
          descripcion="Misma estructura con las soluciones de los retos y los asserts de autoevaluación resueltos." />
      </div>
      {!COLAB.REPO && (
        <div className="aviso">
          <b>Cómo abrirlo en Colab:</b> descargá el .ipynb, entrá a Colab y elegí <i>Archivo → Subir notebook</i>.
          Cuando el repositorio esté en GitHub, completá <code>COLAB.REPO</code> en <code>src/config.js</code> y el botón abrirá el
          notebook directamente. También podés <a href="./notebooks/hogares_simulado.csv" download>descargar el CSV</a>.
        </div>
      )}

      <section>
        <span className="eyebrow">Manos al código · salas de 3 · 15 minutos</span>
        <h2 style={{ fontSize: 24 }}>Retos</h2>
        <div className="grid g3">
          {RETOS.map((r) => (
            <div key={r.t} className="card acento">
              <h3>{r.t}</h3>
              <p>{r.d}</p>
              <details className="pista"><summary>Ver pista</summary><p style={{ marginTop: 8 }}><code>{r.pista}</code></p></details>
            </div>
          ))}
        </div>
      </section>

      <Quiz />
      <Ticket />
    </div>
  );
}
