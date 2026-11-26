// Plan de clase para la prueba de oposición: foco en los aspectos
// metodológicos, pedagógicos y didácticos. Se puede imprimir o guardar en PDF.
import { CURSO } from "../data/curso.js";

const SECUENCIA = [
  ["00:00–01:30", "Apertura", "Presenta la clase, explicita objetivos y hoja de ruta; conecta con la Clase 9 y anticipa la Unidad 5.", "Escuchan y ubican la clase en el recorrido.", "Diapositivas 1–2"],
  ["01:30–03:00", "Disparador", "Plantea el caso del hogar #57 ($135 M) y abre la votación sin dar la respuesta.", "Votan A/B/C/D en el chat y argumentan.", "Votación en vivo"],
  ["03:00–09:00", "Detectar", "Muestra la distribución, contrasta media y mediana; modela la lectura del boxplot (IQR) y genera conflicto cognitivo con el z-score.", "Predicen resultados antes de verlos; responden preguntas de control.", "Gráficos interactivos"],
  ["09:00–12:00", "Decidir", "Presenta tres situaciones (error, extremo genuino, dudoso) y resuelve el disparador: “depende”.", "Resuelven tres casos en el chat y justifican.", "Revelado paso a paso"],
  ["12:00–17:00", "Transformar", "Live coding conceptual: log, escalado, discretización y creación de variables, con los mismos datos.", "Observan cómo cambia cada indicador al transformar.", "Diapositivas interactivas + Colab"],
  ["17:00–18:00", "Práctica", "Presenta los retos y abre el notebook; en la clase real, salas de 3 durante 15–20 min.", "Detectan, deciden y transforman en Colab.", "Notebook autocontenido"],
  ["18:00–20:00", "Cierre", "Síntesis a cargo de un estudiante, segunda votación, ticket de salida, tarea y bibliografía.", "Sintetizan, vuelven a votar, responden el ticket.", "Ticket + re-votación"],
];

const RUBRICA = [
  ["Detección", "Aplica un método sin justificar.", "Aplica IQR y z-score e interpreta el resultado.", "Compara métodos y explica el enmascaramiento."],
  ["Decisión", "Elimina atípicos sin criterio.", "Distingue error de extremo genuino.", "Decide, documenta y analiza con y sin el caso dudoso."],
  ["Transformación", "Transforma sin propósito.", "Elige log, escalado o discretización según el caso.", "Justifica la transformación por la forma de la distribución y el uso posterior."],
  ["Código y reproducibilidad", "El notebook no corre de punta a punta.", "Corre y pasa los asserts.", "Corre, pasa los asserts y documenta cada decisión en Markdown."],
];

export default function PlanDocente() {
  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="acciones no-print" style={{ marginTop: 0 }}>
        <button className="btn" onClick={() => window.print()}>Imprimir o guardar en PDF</button>
      </div>

      <div className="card acento">
        <span className="eyebrow">Plan de clase · Prueba de oposición</span>
        <h2 style={{ fontSize: 24 }}>Clase 10 · Atípicos, distribuciones y transformaciones</h2>
        <div className="grid g2" style={{ gap: 8 }}>
          <p style={{ margin: 0 }}><b>Asignatura:</b> {CURSO.nombre} ({CURSO.codigo})</p>
          <p style={{ margin: 0 }}><b>Carrera:</b> {CURSO.carrera}</p>
          <p style={{ margin: 0 }}><b>Unidad:</b> 4 · Análisis exploratorio de datos</p>
          <p style={{ margin: 0 }}><b>Docente:</b> {CURSO.docente}</p>
          <p style={{ margin: 0 }}><b>Duración:</b> 20 minutos (simulación) · 80 minutos (clase real)</p>
          <p style={{ margin: 0 }}><b>Modalidad:</b> virtual sincrónica + Google Colab</p>
        </div>
      </div>

      <div className="grid g2">
        <div className="card">
          <h3>Objetivos de la clase</h3>
          <ul>
            <li><b>Detectar</b> valores atípicos con IQR y z-score, y explicar por qué difieren.</li>
            <li><b>Decidir y justificar</b> el tratamiento de cada atípico: corregir, conservar o marcar.</li>
            <li><b>Transformar</b> variables (log, normalización, discretización) y <b>crear</b> nuevas.</li>
          </ul>
          <p style={{ fontSize: 14, color: "var(--tinta-suave)", marginTop: 10 }}>
            Se alinean con los objetivos 2, 3 y 5 del programa: librerías científicas, limpieza y EDA, e integración de estadística.
          </p>
        </div>
        <div className="card">
          <h3>Saberes previos y articulación</h3>
          <ul>
            <li>Clase 9: describe(), medidas de tendencia central y dispersión, groupby.</li>
            <li>Unidad 3: histogramas y boxplots con Matplotlib y Seaborn.</li>
            <li>Anticipa la Unidad 5 (escalado para k-NN) y la Unidad 6 (asserts, pytest, reproducibilidad).</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h3>Secuencia didáctica</h3>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Tiempo</th><th>Momento</th><th>Actividad docente</th><th>Actividad estudiante</th><th>Recurso</th></tr></thead>
            <tbody>{SECUENCIA.map((f) => <tr key={f[0]}>{f.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>

      <div className="grid g2">
        <div className="card">
          <h3>Estrategias de enseñanza (sección III del programa)</h3>
          <ul>
            <li><b>Basado en problemas:</b> el caso del hogar #57 estructura toda la clase.</li>
            <li><b>Por descubrimiento:</b> los estudiantes predicen y luego verifican (z-score, log).</li>
            <li><b>Por imitación:</b> el docente modela la lectura de gráficos y el código.</li>
            <li><b>Estudio de casos:</b> tres situaciones de decisión con datos concretos.</li>
            <li><b>Colaborativo:</b> retos en salas de 3 con roles rotativos.</li>
            <li><b>Aula invertida:</b> la tarea con microdatos reales de la EPH prepara la Clase 11.</li>
          </ul>
        </div>
        <div className="card">
          <h3>Recursos para la virtualidad</h3>
          <ul>
            <li>Esta app (PWA): diapositivas con gráficos en vivo, laboratorio, autoevaluación. Funciona sin conexión.</li>
            <li>Ventana del orador sincronizada: se comparte solo la presentación.</li>
            <li>Google Colab: notebooks autocontenidos (versión estudiante y docente).</li>
            <li>Chat y votación en vivo para la participación de todo el grupo.</li>
            <li>Aula virtual: entrega del notebook y ticket de salida.</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h3>Evaluación formativa · rúbrica del producto (notebook)</h3>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Criterio</th><th>Inicial</th><th>Satisfactorio</th><th>Destacado</th></tr></thead>
            <tbody>{RUBRICA.map((f) => <tr key={f[0]}>{f.map((c, i) => <td key={i}>{i === 0 ? <b>{c}</b> : c}</td>)}</tr>)}</tbody>
          </table>
        </div>
        <p style={{ fontSize: 14, color: "var(--tinta-suave)", marginTop: 10 }}>
          Evidencias: votación diagnóstica y final, respuestas en el chat, autoevaluación de la app, ticket de salida y notebook entregado.
        </p>
      </div>

      <div className="grid g2">
        <div className="card ambar">
          <h3>Plan de contingencia</h3>
          <ul>
            <li>Sin internet: la app instalada funciona offline; también hay una versión de un solo archivo en el pendrive.</li>
            <li>Colab no disponible: el notebook corre en Jupyter local o se muestra el Laboratorio de la app.</li>
            <li>Poca participación en el chat: preguntas dirigidas por nombre y votación con reacciones.</li>
            <li>Falta de tiempo: las diapositivas 11–13 se condensan; la práctica pasa a la tarea.</li>
          </ul>
        </div>
        <div className="card">
          <h3>Fundamentación</h3>
          <p style={{ margin: 0 }}>
            Un único dataset de punta a punta reduce la carga cognitiva y centra la atención en las <b>decisiones</b> del analista,
            que es lo que distingue a un profesional. El conflicto cognitivo (el z-score encuentra un solo atípico) hace necesaria
            la idea de robustez antes de nombrarla. La evaluación es continua y está alineada con los tres objetivos, y la tarea con
            datos reales de la EPH asegura la transferencia a un contexto auténtico de la economía argentina.
          </p>
        </div>
      </div>
    </div>
  );
}
