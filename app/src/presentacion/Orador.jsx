// Ventana del orador: se abre aparte (tecla O) para compartir en la
// videollamada solo la ventana de la presentación y ver las notas acá.
import { useEffect, useRef, useState } from "react";
import { CANAL, DURACION, Escenario, fmtReloj } from "./Presentador.jsx";
import { SLIDES } from "./slides.jsx";
import "./presentacion.css";

export default function Orador() {
  const [estado, setEstado] = useState({ indice: 0, paso: 0, comienzo: null });
  const [ahora, setAhora] = useState(Date.now());
  const canal = useRef(null);

  useEffect(() => {
    if (!("BroadcastChannel" in window)) return undefined;
    const bc = new BroadcastChannel(CANAL);
    canal.current = bc;
    bc.onmessage = (e) => { if (e.data.tipo === "estado") setEstado(e.data); };
    bc.postMessage({ tipo: "hola" });
    const t = setInterval(() => setAhora(Date.now()), 500);
    return () => { bc.close(); clearInterval(t); };
  }, []);

  const mandar = (m) => canal.current?.postMessage(m);
  const { indice, paso, comienzo } = estado;
  const s = SLIDES[indice];
  const prox = SLIDES[indice + 1];
  const transcurrido = comienzo ? (ahora - comienzo) / 1000 : 0;
  const desfase = comienzo ? transcurrido / 60 - s.min : 0;

  if (!("BroadcastChannel" in window)) {
    return <p style={{ padding: 24 }}>Este navegador no permite sincronizar ventanas. Usá Chrome, Edge o Firefox.</p>;
  }

  return (
    <div className="orador">
      <div className="orador-cab">
        <div>
          <span className="eyebrow">Diapositiva {indice + 1} de {SLIDES.length}{s.pasos ? ` · paso ${paso}/${s.pasos}` : ""}</span>
          <h2>{s.titulo}</h2>
        </div>
        <div className="orador-reloj">
          <b className={DURACION - transcurrido < 0 ? "pasado" : ""}>{comienzo ? fmtReloj(DURACION - transcurrido) : "20:00"}</b>
          <span>
            {comienzo
              ? Math.abs(desfase) < 0.75 ? "En tiempo" : desfase > 0 ? `Atrasado ${fmtReloj(desfase * 60)}` : `Adelantado ${fmtReloj(-desfase * 60)}`
              : "Cronómetro detenido"}
            {" · "}plan: min {fmtReloj(s.min * 60)}
          </span>
        </div>
      </div>
      <div className="orador-cuerpo">
        <div className="orador-notas">{s.notas}</div>
        <div className="orador-lateral">
          <div className="orador-mini"><Escenario indice={indice} paso={paso} /></div>
          <p className="orador-prox">{prox ? `Sigue: ${prox.titulo}` : "Última diapositiva"}</p>
          <div className="orador-botones">
            <button onClick={() => mandar({ tipo: "anterior" })}>‹ Anterior</button>
            <button className="principal" onClick={() => mandar({ tipo: "siguiente" })}>Siguiente ›</button>
          </div>
          <div className="orador-botones">
            <button onClick={() => mandar({ tipo: "reloj" })}>{comienzo ? "Reiniciar reloj" : "Iniciar reloj"}</button>
            <button onClick={() => mandar({ tipo: "reloj", reiniciar: true })}>Detener</button>
          </div>
          <select value={indice} onChange={(e) => mandar({ tipo: "ir", indice: Number(e.target.value) })}>
            {SLIDES.map((x, i) => <option key={x.id} value={i}>{i + 1}. {x.titulo}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
