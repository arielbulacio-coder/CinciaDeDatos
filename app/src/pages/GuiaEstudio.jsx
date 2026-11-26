// Guía de estudio de la Clase 10: todo lo necesario para repasar,
// en una página que se puede imprimir o guardar en PDF.
import { BIBLIOGRAFIA } from "../data/curso.js";

const METODOS = [
  ["Regla de Tukey (IQR)", "Fuera de [Q1 − 1,5·IQR ; Q3 + 1,5·IQR]", "Ninguno: usa cuartiles", "Primera opción en general; mejor después de log si hay mucha asimetría", "atipicos_iqr(s)"],
  ["z-score", "|z| > 3, con z = (x − media) / desvío", "Distribución aproximadamente normal", "Variables simétricas y muestras grandes", "atipicos_zscore(s)"],
  ["z robusto (MAD)", "|0,6745·(x − mediana) / MAD| > 3,5", "Ninguno: usa mediana y MAD", "Variables asimétricas; cuando hay varios atípicos juntos", "atipicos_zscore_robusto(s)"],
];

const TRANSF = [
  ["Logaritmo", "Comprime los valores grandes", "Sí: reduce la asimetría", "Ingresos, precios, poblaciones (solo valores positivos)", "np.log10(s) · np.log1p(s)"],
  ["Min-Max", "Lleva al rango [0, 1]", "No", "Algoritmos que piden un rango fijo (redes, imágenes)", "MinMaxScaler()"],
  ["Estandarización z", "Media 0, desvío 1", "No", "Métodos con distancias o varianza: k-NN, PCA, regresión", "StandardScaler()"],
  ["Escalado robusto", "Resta la mediana y divide por el IQR", "No", "Como la estandarización, pero con atípicos", "RobustScaler()"],
  ["pd.cut", "Categorías con cortes fijos", "La reemplaza por grupos", "Cortes con sentido en el dominio (tramos de edad, IMC)", "pd.cut(s, bins=[…], labels=[…])"],
  ["pd.qcut", "Categorías por cuantiles", "La reemplaza por grupos", "Grupos del mismo tamaño (quintiles de ingreso)", "pd.qcut(s, q=5)"],
];

const GLOSARIO = [
  ["Atípico (outlier)", "Observación que se aleja mucho del resto. Puede ser un error o un dato real poco frecuente."],
  ["Asimetría (skew)", "Hacia dónde se estira la cola de la distribución. Positiva: cola larga a la derecha."],
  ["Cuartiles (Q1, Q3)", "Valores que dejan por debajo al 25 % y al 75 % de los datos."],
  ["IQR", "Rango intercuartílico: Q3 − Q1. El ancho del 50 % central."],
  ["Robusto", "Que no se deja arrastrar por valores extremos, como la mediana."],
  ["MAD", "Mediana de las desviaciones absolutas respecto de la mediana. Versión robusta del desvío."],
  ["Enmascaramiento", "Un atípico infla el desvío y esconde a los demás atípicos del z-score."],
  ["Winsorizar", "Recortar los valores extremos al límite, sin eliminar filas (s.clip)."],
  ["Flag", "Variable True/False que marca un caso para analizarlo con y sin él."],
  ["Feature engineering", "Crear variables nuevas a partir de las existentes con conocimiento del dominio."],
];

const ERRORES = [
  "Borrar todo lo que el método marca como atípico, sin preguntarse si es real.",
  "Creer que normalizar vuelve normal la distribución: el escalado no cambia la forma.",
  "Usar or / and con series de pandas: se usan | y &, con cada condición entre paréntesis.",
  "Aplicar el z-score a una variable muy asimétrica sin mirar antes el histograma.",
  "Calcular el logaritmo de una variable con ceros: da −inf. Usar np.log1p.",
  "Confundir pd.cut (cortes fijos) con pd.qcut (grupos del mismo tamaño).",
  "No documentar la decisión: nadie puede reproducir el análisis.",
];

function Tabla({ cabecera, filas }) {
  return (
    <div className="tabla-scroll">
      <table className="tabla">
        <thead><tr>{cabecera.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f[0]}>{f.map((c, i) => <td key={i}>{i === 0 ? <b>{c}</b> : i === f.length - 1 && c.includes("(") ? <code>{c}</code> : c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function GuiaEstudio() {
  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="acciones no-print" style={{ marginTop: 0 }}>
        <button className="btn" onClick={() => window.print()}>Imprimir o guardar en PDF</button>
      </div>

      <div className="card acento">
        <span className="eyebrow">Guía de estudio · Clase 10</span>
        <h2 style={{ fontSize: 24 }}>Atípicos, distribuciones y transformaciones en una página</h2>
        <p style={{ margin: 0 }}>
          Un valor atípico puede ser un <b>error</b> o un <b>hallazgo</b>. La estadística detecta candidatos; la decisión la toma
          quien analiza, con conocimiento del dominio, y la deja documentada.
        </p>
      </div>

      <section>
        <span className="eyebrow">Paso 1</span>
        <h2 style={{ fontSize: 22 }}>Mirar la distribución antes de calcular</h2>
        <div className="grid g2">
          <div className="card">
            <h3>Media o mediana</h3>
            <p style={{ margin: 0 }}>
              La media usa la magnitud de cada valor: un solo valor enorme la arrastra. La mediana solo usa el orden: es robusta.
              En el caso de la clase, quitar un hogar baja la media de $1,89 M a $1,62 M y la mediana casi no cambia ($1,35 M).
            </p>
          </div>
          <div className="card">
            <h3>Asimetría</h3>
            <p style={{ margin: 0 }}>
              <code>s.skew()</code> cerca de 0: simétrica. Mayor que 1: muy asimétrica a la derecha (ingresos, precios, tiempos).
              Con asimetría, la media queda a la derecha de la mediana y el z-score pierde sentido.
            </p>
          </div>
        </div>
      </section>

      <section>
        <span className="eyebrow">Paso 2</span>
        <h2 style={{ fontSize: 22 }}>Detectar: tres métodos</h2>
        <Tabla cabecera={["Método", "Marca como atípico", "Supone", "Cuándo usarlo", "Función"]} filas={METODOS} />
        <div className="aviso" style={{ marginTop: 12 }}>
          <b>Efecto enmascaramiento.</b> En el ingreso, el z-score encuentra un solo atípico: el hogar de $135 M infla el desvío
          de $1,29 M a $6,1 M y esconde a los demás. Sin ese hogar encuentra 5. El IQR encuentra 26 y el z robusto, 22.
        </div>
        <pre className="codigo" style={{ marginTop: 12 }}>{`q1, q3 = s.quantile([.25, .75])
iqr = q3 - q1
mascara = (s < q1 - 1.5 * iqr) | (s > q3 + 1.5 * iqr)
df.loc[mascara, ["id_hogar", "ingreso_total"]]`}</pre>
      </section>

      <section>
        <span className="eyebrow">Paso 3</span>
        <h2 style={{ fontSize: 22 }}>Decidir qué hacer con cada atípico</h2>
        <div className="grid g3">
          <div className="card ambar">
            <h3>¿Es imposible o un código?</h3>
            <p>Edad 999, 400 horas por semana, unidades equivocadas.</p>
            <p style={{ margin: 0 }}><b>→ Corregir con la fuente o pasar a NaN.</b></p>
          </div>
          <div className="card acento">
            <h3>¿Es real y verificable?</h3>
            <p>Un hogar con $15,2 M de ingreso: raro, pero existe.</p>
            <p style={{ margin: 0 }}><b>→ Conservar y usar métodos robustos: mediana, log, winsorizar.</b></p>
          </div>
          <div className="card">
            <h3>¿No se puede saber?</h3>
            <p>Un ingreso de $135 M sin forma de verificarlo.</p>
            <p style={{ margin: 0 }}><b>→ Marcar con una flag y comparar el análisis con y sin él.</b></p>
          </div>
        </div>
        <p style={{ marginTop: 12, color: "var(--tinta-suave)" }}>Siempre: escribir la decisión en una celda Markdown del notebook.</p>
      </section>

      <section>
        <span className="eyebrow">Paso 4</span>
        <h2 style={{ fontSize: 22 }}>Transformar y discretizar</h2>
        <Tabla cabecera={["Transformación", "Qué hace", "¿Cambia la forma?", "Cuándo usarla", "Código"]} filas={TRANSF} />
        <div className="aviso" style={{ marginTop: 12 }}>
          <b>Normalizar no es volver normal.</b> Min-Max y la estandarización cambian los números del eje, no la silueta del
          histograma. Para corregir la asimetría se usa el logaritmo: en el ingreso baja la asimetría de 4,88 a 0,28.
        </div>
      </section>

      <section>
        <span className="eyebrow">Paso 5</span>
        <h2 style={{ fontSize: 22 }}>Crear variables nuevas</h2>
        <pre className="codigo">{`df["ingreso_pc"] = df["ingreso_total"] / df["miembros"]          # razón
df["flag_atipico"] = atipicos_iqr(np.log10(df["ingreso_total"]))  # indicador
df["quintil"] = pd.qcut(df["ingreso_total"], q=5,                 # categoría
                        labels=["Q1", "Q2", "Q3", "Q4", "Q5"])
df.groupby("quintil", observed=True)["ingreso_pc"].median()`}</pre>
      </section>

      <div className="grid g2" style={{ alignItems: "start" }}>
        <div className="card">
          <h3>Errores frecuentes</h3>
          <ul>{ERRORES.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
        <div className="card">
          <h3>Glosario</h3>
          <dl style={{ margin: 0, fontSize: 15 }}>
            {GLOSARIO.map(([t, d]) => (
              <div key={t} style={{ marginBottom: 8 }}><dt style={{ fontWeight: 600 }}>{t}</dt><dd style={{ margin: 0, color: "var(--tinta-suave)" }}>{d}</dd></div>
            ))}
          </dl>
        </div>
      </div>

      <div className="card acento">
        <h3>Para seguir estudiando</h3>
        <ul>
          <li>{BIBLIOGRAFIA.obligatoria} Capítulo 1: estimadores robustos, percentiles y boxplots.</li>
          <li>Microdatos reales de la Encuesta Permanente de Hogares en el{" "}
            <a href="https://www.indec.gob.ar/indec/web/Institucional-Indec-BasesDeDatos" target="_blank" rel="noreferrer">sitio del INDEC</a>.
            Tarea: repetir el flujo de la clase con el ingreso total familiar (ITF).</li>
          <li>Próxima clase: scikit-learn. StandardScaler, MinMaxScaler y RobustScaler dentro de un flujo de train/test.</li>
        </ul>
      </div>
    </div>
  );
}
