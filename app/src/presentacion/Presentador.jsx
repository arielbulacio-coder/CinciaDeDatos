import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { setModalidad, useModalidad } from "../lib/modalidad.js";
import { SLIDES } from "./slides.jsx";
import "./presentacion.css";

const CANAL = "clase10-presentacion";
const DURACION = 20 * 60; // segundos

export const fmtReloj = (s) => {
  const a = Math.abs(Math.round(s));
  return `${s < 0 ? "−" : ""}${String(Math.floor(a / 60)).padStart(2, "0")}:${String(a % 60).padStart(2, "0")}`;
};

function useEscala(ref) {
  const [escala, setEscala] = useState(1);
  useLayoutEffect(() => {
    const medir = () => {
      const el = ref.current;
      if (!el) return;
      setEscala(Math.min(el.clientWidth / 1920, el.clientHeight / 1080));
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [ref]);
  return escala;
}

/** Una diapositiva a 1920×1080, escalada para entrar en su contenedor. */
export function Escenario({ indice, paso, escalaFija }) {
  const ref = useRef(null);
  const escala = useEscala(ref);
  const s = SLIDES[indice];
  const { Comp } = s;
  return (
    <div className="escenario" ref={ref}>
      <div
        className={`slide ${s.oscura ? "oscura" : ""} ${s.alt ? "alt" : ""}`}
        style={{ transform: `scale(${escalaFija ?? escala})`, "--n": `"${indice + 1}"` }}
        key={s.id}
      >
        <div className="s-franja" />
        <Comp paso={paso} />
      </div>
    </div>
  );
}

export default function Presentador({ inicio = 0 }) {
  const [indice, setIndice] = useState(inicio);
  const [paso, setPaso] = useState(0);
  const [comienzo, setComienzo] = useState(null);
  const [ahora, setAhora] = useState(Date.now());
  const [ayuda, setAyuda] = useState(false);
  const modalidad = useModalidad();
  const alternarModalidad = () => setModalidad(modalidad === "presencial" ? "virtual" : "presencial");
  const canal = useRef(null);
  const raiz = useRef(null);

  const total = SLIDES.length;
  const pasos = SLIDES[indice].pasos || 0;

  const siguiente = useCallback(() => {
    if (!comienzo) setComienzo(Date.now());
    if (paso < pasos) { setPaso((p) => p + 1); return; }
    if (indice < total - 1) { setIndice((i) => i + 1); setPaso(0); }
  }, [paso, pasos, indice, total, comienzo]);

  const anterior = useCallback(() => {
    if (paso > 0) { setPaso((p) => p - 1); return; }
    if (indice > 0) { setIndice((i) => i - 1); setPaso(0); }
  }, [paso, indice]);

  const ir = useCallback((i) => { setIndice(Math.max(0, Math.min(total - 1, i))); setPaso(0); }, [total]);

  const pantallaCompleta = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else raiz.current?.requestFullscreen?.();
  };

  const abrirOrador = () => {
    window.open(`${location.pathname}#/orador`, "orador", "width=1100,height=760");
  };

  // Sincronización con la ventana del orador
  useEffect(() => {
    if (!("BroadcastChannel" in window)) return undefined;
    const bc = new BroadcastChannel(CANAL);
    canal.current = bc;
    bc.onmessage = (e) => {
      const m = e.data;
      if (m.tipo === "siguiente") siguienteRef.current();
      if (m.tipo === "anterior") anteriorRef.current();
      if (m.tipo === "ir") ir(m.indice);
      if (m.tipo === "reloj") setComienzo(m.reiniciar ? null : Date.now());
      if (m.tipo === "hola") enviarRef.current();
    };
    return () => bc.close();
  }, [ir]);

  const siguienteRef = useRef(siguiente);
  const anteriorRef = useRef(anterior);
  siguienteRef.current = siguiente;
  anteriorRef.current = anterior;

  const enviar = useCallback(() => {
    canal.current?.postMessage({ tipo: "estado", indice, paso, comienzo });
  }, [indice, paso, comienzo]);
  const enviarRef = useRef(enviar);
  enviarRef.current = enviar;
  useEffect(() => { enviar(); }, [enviar]);

  useEffect(() => {
    const t = setInterval(() => setAhora(Date.now()), 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const tecla = (e) => {
      if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); siguiente(); }
      else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); anterior(); }
      else if (e.key === "Home") ir(0);
      else if (e.key === "End") ir(total - 1);
      else if (e.key === "f" || e.key === "F") pantallaCompleta();
      else if (e.key === "o" || e.key === "O") abrirOrador();
      else if (e.key === "t" || e.key === "T") setComienzo((c) => (c ? null : Date.now()));
      else if (e.key === "?" || e.key === "h") setAyuda((a) => !a);
      else if (e.key === "m" || e.key === "M") alternarModalidad();
      else if (e.key === "Escape" && !document.fullscreenElement) location.hash = "#/clase/10/presentacion";
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [siguiente, anterior, ir, total, modalidad]); // eslint-disable-line react-hooks/exhaustive-deps

  const transcurrido = comienzo ? (ahora - comienzo) / 1000 : 0;
  const restante = DURACION - transcurrido;
  const desfase = comienzo ? transcurrido / 60 - SLIDES[indice].min : 0;

  return (
    <div className="presentador" ref={raiz}>
      <Escenario indice={indice} paso={paso} />
      <div className="progreso" style={{ width: `${((indice + 1) / total) * 100}%` }} />
      <div className="controles">
        <button onClick={() => (location.hash = "#/clase/10/presentacion")} title="Salir (Esc)">✕</button>
        <button onClick={anterior} title="Anterior (←)">‹</button>
        <span className="pos">{indice + 1} / {total}{pasos ? ` · paso ${paso}/${pasos}` : ""}</span>
        <button onClick={siguiente} title="Siguiente (→)">›</button>
        <button className={`reloj ${restante < 0 ? "pasado" : desfase > 1 ? "atrasado" : ""}`}
          onClick={() => setComienzo((c) => (c ? null : Date.now()))} title="Iniciar / reiniciar cronómetro (T)">
          {comienzo ? fmtReloj(restante) : "▶ 20:00"}
        </button>
        <button onClick={abrirOrador} title="Ventana del orador con notas (O)">Notas</button>
        <button onClick={alternarModalidad} title="Cambiar modalidad (M)">{modalidad === "presencial" ? "Presencial" : "Virtual"}</button>
        <button onClick={pantallaCompleta} title="Pantalla completa (F)">⛶</button>
        <button onClick={() => setAyuda((a) => !a)} title="Atajos (?)">?</button>
      </div>
      {ayuda && (
        <div className="ayuda" onClick={() => setAyuda(false)}>
          <h3>Atajos de teclado</h3>
          <p><b>→ / espacio / PageDown</b> siguiente (también el puntero de presentación)</p>
          <p><b>← / PageUp</b> anterior · <b>Inicio / Fin</b> primera / última</p>
          <p><b>F</b> pantalla completa · <b>O</b> ventana del orador · <b>T</b> cronómetro · <b>M</b> presencial / virtual</p>
          <p><b>Esc</b> salir · Los gráficos y botones de cada diapositiva se usan con el mouse.</p>
        </div>
      )}
    </div>
  );
}

export { CANAL, DURACION };
