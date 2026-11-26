
import { setModalidad, useModalidad } from "../lib/modalidad.js";
import { Escenario } from "../presentacion/Presentador.jsx";
import { SLIDES } from "../presentacion/slides.jsx";
import Laboratorio from "./Laboratorio.jsx";
import PlanDocente from "./PlanDocente.jsx";
import Practica from "./Practica.jsx";

const PESTANAS = [
  ["presentacion", "Presentación"],
  ["laboratorio", "Laboratorio"],
  ["practica", "Práctica y Colab"],
  ["plan", "Plan docente"],
];

function Presentacion() {
  const modalidad = useModalidad();
  return (
    <>
      <div className="card ambar" style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 360px" }}>
          <h3 style={{ marginBottom: 6 }}>Clase de 20 minutos · 17 diapositivas interactivas</h3>
          <p style={{ margin: 0, color: "var(--tinta-suave)" }}>
            Pantalla completa con <b>F</b>, avanzar con <b>→</b> o el puntero, notas del orador en otra ventana con <b>O</b>,
            cronómetro con <b>T</b>. En modalidad virtual, compartí en la videollamada solo la ventana de la presentación.
          </p>
          {import.meta.env.MODE !== "pendrive" && (
            <p style={{ margin: "8px 0 0", fontSize: 14 }}>
              <a href="./clase10-pendrive.zip" download>Descargar versión pendrive (.zip)</a>: un solo archivo que abre sin internet.
            </p>
          )}
        </div>
        <div className="seg" role="group" aria-label="Modalidad de la clase">
          {[["presencial", "Presencial"], ["virtual", "Virtual"]].map(([v, t]) => (
            <button key={v} aria-pressed={modalidad === v} onClick={() => setModalidad(v)}>{t}</button>
          ))}
        </div>
        <a className="btn ambar" href="#/presentar/1">▶ Presentar</a>
      </div>
      <div className="grid g3" style={{ marginTop: 20 }}>
        {SLIDES.map((s, i) => (
          <a key={s.id} href={`#/presentar/${i + 1}`} className="miniatura" aria-label={`Diapositiva ${i + 1}: ${s.titulo}`}>
            <div className="miniatura-lienzo" aria-hidden="true">
              <Escenario indice={i} paso={s.pasos || 0} />
            </div>
            <span><b>{i + 1}.</b> {s.titulo} <small>· min {Math.floor(s.min)}</small></span>
          </a>
        ))}
      </div>
    </>
  );
}

export default function Clase10({ pestana }) {
  const Contenido = { presentacion: Presentacion, laboratorio: Laboratorio, practica: Practica, plan: PlanDocente }[pestana] || Presentacion;
  return (
    <>
      <span className="eyebrow">Unidad 4 · Análisis exploratorio de datos · Clase 10</span>
      <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>¿Error o hallazgo? Atípicos, distribuciones y transformaciones</h1>
      <p style={{ color: "var(--tinta-suave)", maxWidth: 820 }}>
        Detección de valores atípicos y análisis de distribuciones. Transformaciones: normalización, discretización
        y creación de nuevas variables. Caso aplicado: 500 hogares simulados con la estructura de la EPH (INDEC).
      </p>
      <nav className="tabs" aria-label="Secciones de la clase">
        {PESTANAS.map(([id, txt]) => (
          <a key={id} href={`#/clase/10/${id}`} className={pestana === id ? "activo" : ""} aria-current={pestana === id ? "page" : undefined}>{txt}</a>
        ))}
      </nav>
      <Contenido />
    </>
  );
}

